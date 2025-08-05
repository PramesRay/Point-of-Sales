<script setup lang="ts">
import { ref, computed, watch, reactive, watchEffect, onMounted } from 'vue'
import { useDisplay } from 'vuetify'

import { formatRupiah, formatRupiahInput, formatRupiahInputR } from '@/utils/helpers/currency'
import { useShift } from '@/composables/useShift'
import { useOverlayManager } from '@/composables/non-services/useOverlayManager'

import type { ShiftKitchen, UpdateShiftKitchenPayload } from '@/types/shift'

import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import { cloneDeep } from 'lodash'
import { useMenuItems } from '@/composables/useMenuItems'
import Blank from '@/components/shared/Blank.vue'

const { mdAndUp } = useDisplay()
const { openOverlay } = useOverlayManager()

const { updateKitchen, endKitchen, loading: loadingShift } = useShift()
const { loadItemSales, dataItemSales, loading: loadingMenu } = useMenuItems()

onMounted(() => {
  loadItemSales()
})

const props = defineProps<{
  data: ShiftKitchen
  confirmBeforeClose: boolean
  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
}>()

const emit = defineEmits(['close'])

const currentData = cloneDeep(props.data)

// const initial_menu = ref(cloneDeep(props.data.initial_menu))
const quantity_menu = ref(
  props.data.end ? [] : cloneDeep(props.data.quantity_menu)
)
const notes = ref<string | null>(null)

const formRef = ref()
const isFormValid = ref(false)
const isShowMenu = ref(false)

const isChanged = computed(() => {
  const finalChanged = quantity_menu.value.some((item, index) => 
    item.final !== props.data.quantity_menu?.[index]?.final
  )

  const notesChanged = notes.value !== null &&
    String(notes.value) !== String(props.data.notes)

  return finalChanged || notesChanged
})


watchEffect(() => {
  const val = isChanged.value
  console.log('[DEBUG] isChanged:', val)
  if (typeof props.onIsChangedUpdate === 'function' && !loadingShift.value) {
    props.onIsChangedUpdate(!!val)
  }
})

function clearPayload() {
  // initial_menu.value = currentData.initial_menu
  quantity_menu.value = cloneDeep(currentData.quantity_menu)
  notes.value = null
  formRef.value?.resetValidation()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processSubmit()
  })
}

async function processSubmit() {
  try {
    await updateKitchen({
      id: currentData.id,
      final_menu: quantity_menu.value.map((item) => ({ id: item.id, quantity: item.final })),
      notes: notes.value
    })
    clearPayload()
  } catch (error) {
    if (typeof props.onIsChangedUpdate === 'function') {
      props.onIsChangedUpdate(false)
    }
    emit('close')
  }
}

async function handleEndShift() {
  openOverlay({
    component: Blank,
    props: {
      confirmToContinue: true,
      confirmMessage: 'Pastikan Stok Akhir sudah dimasukkan dengan benar. Apakah anda yakin ingin mengakhiri shift?',
      onConfirm: async () => {
        try {
          await endKitchen({
            id: currentData.id,
            final_menu: quantity_menu.value.map((item) => ({ id: item.id, quantity: item.final })),
            notes: notes.value
          })
          console.log('end shift kitchen')
          clearPayload()
        } catch (error) {
          console.log('end shift kitchen failed')
          if (typeof props.onIsChangedUpdate === 'function') {
            props.onIsChangedUpdate(false)
          }
          emit('close')
        }
      }
    }
  })
}
</script>

<template>
  <v-card 
    class="rounded-lg pa-0 height-screen"
    :style="mdAndUp ? 'width: clamp(0px, 90dvw, 500px)' : 'width: clamp(0px, 90dvw, 320px)'"
    style="overflow-y: auto; max-height: 90vh;"
  >
    <v-card-text>
      <div
        style="position: absolute; top: 8px; right: 12px; font-size: 20px; cursor: pointer;"
        @click="
          clearPayload(),
          emit('close')
        "
      >
        <v-icon>mdi-close</v-icon>
      </div>

      <h4 class="text-h4 mt-1 mb-1">Detail Shift Dapur</h4>
      <div class="text-subtitle-2 text-disabled">{{ currentData.branch?.name }}</div>

      <v-divider class="my-4"></v-divider>

      <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
        <ScrollContainer :maxHeight="'60dvh'" style="overflow-x: hidden;">
          <v-list class="ma-0 pa-0" style="overflow-x: hidden;">
            <div class="d-flex align-center justify-space-between font-weight-bold">
              <v-list-subheader class="text-subtitle-1 font-weight-bold">
                Pesanan
              </v-list-subheader>
              {{ currentData.total_order }}
            </div>
            <v-list-item class="px-0 mx-2">
              <v-expansion-panels multiple variant="accordion" elevation="0">  
                <v-expansion-panel>
                  <v-expansion-panel-title class="px-2">
                    <div class="text-caption text-disabled">
                      Pesanan Selesai
                    </div>
                    <template v-slot:actions>
                      <div class="text-caption text-medium-emphasis font-weight-bold text-success">
                        {{ currentData.completed_order }}
                      </div>
                    </template>
                  </v-expansion-panel-title>
                </v-expansion-panel>
    
                <v-expansion-panel>
                  <v-expansion-panel-title class="px-2">
                    <div class="text-caption text-disabled">
                      Pesanan Dibatalkan
                    </div>
                    <template v-slot:actions>
                      <div class="text-caption text-medium-emphasis font-weight-bold text-error">
                        {{ currentData.canceled_order }}
                      </div>
                    </template>
                  </v-expansion-panel-title>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-list-item>
            
            <div class="d-flex align-center justify-space-between font-weight-bold" @click="isShowMenu = !isShowMenu">
              <v-list-subheader class="text-subtitle-1 font-weight-bold">
                Manajemen Menu
              </v-list-subheader>
              <v-icon>{{ isShowMenu ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </div>
            <v-expand-transition v-show="isShowMenu">
              <div class="text-center my-4" v-if="loadingMenu">
                <v-progress-circular indeterminate color="warning" height="1"/>
              </div>
              <v-table :items="dataItemSales" style="overflow-x: hidden;" v-else>
                <thead>
                  <tr>
                    <th style="max-width: 30dvw;">Nama Menu</th>
                    <th class="text-center">Stok Awal</th>
                    <th class="text-center">Stok Terkini</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dataItemSales" :key="index" >
                    <td style="max-width: 30dvw; overflow: hidden; text-overflow: ellipsis;">
                      <h4 class="text-h5 font-weight-medium">
                        {{ item.name }}
                      </h4>
                    </td>
                    <td class="text-center text-disabled">
                      {{ currentData.quantity_menu[index].initial || '-' }}
                    </td>
                    <td class="text-center d-flex justify-center pa-2" align="center">
                      <v-number-input
                        v-model="quantity_menu[index].final"
                        control-variant="hidden"
                        variant="outlined"
                        class="text-error"
                        style="max-width: 4rem;"
                        density="compact"
                        hide-details
                        single-line
                        inset
                        :min="0"
                        :max="currentData.quantity_menu[index].final"
                        color="error"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
  
              <div v-if="!loadingMenu && dataItemSales.length === 0" class="text-center text-subtitle-2 text-disabled my-4">
                Data Menu Sales tidak ditemukan
              </div>
            </v-expand-transition>
          </v-list>
          
          <v-row class="mt-4">
            <v-col cols="12">
              <v-textarea
                v-model="notes"
                prepend-icon="mdi-text-long"
                label="Catatan"
                rows="3"
                auto-grow
                counter
                variant="underlined"
                clearable
              />
            </v-col>
          </v-row>
        </ScrollContainer>

        <v-divider class="my-4"></v-divider>
        
        <v-row>
          <!-- button end shift -->
          <v-col cols="12" class="d-flex justify-space-between align-center">
            <v-btn
              :loading="loadingShift"
              prepend-icon="mdi-door-closed"
              color="error"
              variant="text"
              @click="handleEndShift"
            >
              Tutup Cabang
            </v-btn>
            <v-btn
              :loading="loadingShift"
              :disabled="!isFormValid || !isChanged"
              color="warning"
              type="submit"
            >
              Simpan
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>