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
import BlankLayout from '@/layouts/blank/BlankLayout.vue'
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

const initial_menu = ref(cloneDeep(props.data.initial_menu))
const final_menu = ref(
  !props.data.end
    ? cloneDeep(props.data.final_menu)
    : props.data.final_menu.map((item) => ({ ...item, quantity: 10 }))
)
const notes = ref<string | null>(null)

const formRef = ref()
const isFormValid = ref(false)

const isChanged = computed(() => {
  const initialChanged = initial_menu.value.some((item, index) => 
    item.quantity !== props.data.initial_menu[index]?.quantity
  )

  const finalChanged = final_menu.value.some((item, index) => 
    item.quantity !== props.data.final_menu[index]?.quantity
  )

  const notesChanged = notes.value !== null &&
    String(notes.value) !== String(props.data.notes)

  return initialChanged || finalChanged || notesChanged
})


watchEffect(() => {
  const val = isChanged.value
  console.log('[DEBUG] isChanged:', val)
  if (typeof props.onIsChangedUpdate === 'function' && !loadingShift.value) {
    props.onIsChangedUpdate(!!val)
  }
})

function clearPayload() {
  initial_menu.value = currentData.initial_menu
  final_menu.value = !currentData.end ? currentData.final_menu : currentData.final_menu.map((item) =>  ({ ...item, quantity: 0 })),
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
      initial_menu: initial_menu.value,
      final_menu: final_menu.value,
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
          await endKitchen(currentData.id)
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
        ×
      </div>

      <h4 class="text-h4 mt-1 mb-1">Detail Shift Dapur</h4>
      <div class="text-subtitle-2 text-disabled">{{ currentData.branch.name }}</div>

      <v-divider class="my-4"></v-divider>

      <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
        <!-- <v-row class="mb-2 justify-center align-center">
          <v-col cols="12" class="text-center">
            <v-btn-toggle
              v-model="initial"
              variant="outlined"
              mandatory
              color="primary"
            >
              <v-btn color="success" :value=true >
                Stok Awal
              </v-btn>
              <v-btn color="error" :value=false >
                Stok Akhir
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row> -->

        <div class="text-center my-4" v-if="loadingMenu">
          <v-progress-circular indeterminate color="warning" height="1"/>
        </div>

        <ScrollContainer :maxHeight="mdAndUp ? '25rem' : '20rem'" v-else>
          <v-table :items="dataItemSales">
            <thead>
              <tr>
                <th>Nama Menu</th>
                <th class="text-center">Stok Awal</th>
                <th class="text-center">Stok Terkini</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dataItemSales" :key="index" >
                <td>
                  <h4 class="text-h5 font-weight-medium" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    {{ item.name }}
                  </h4>
                </td>
                <td class="text-center text-disabled">
                  {{ currentData.initial_menu.find((i) => i.id === item.id)?.quantity || '-' }}
                </td>
                <td class="text-center d-flex justify-center pa-2" align="center">
                  <v-number-input
                    v-model="final_menu[index].quantity"
                    control-variant="hidden"
                    variant="outlined"
                    class="text-error"
                    style="max-width: 4rem;"
                    density="compact"
                    hide-details
                    single-line
                    inset
                    :min="0"
                    :max="final_menu[index].quantity"
                    color="error"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>

          <div v-if="!loadingMenu && dataItemSales.length === 0" class="text-center text-subtitle-2 text-disabled my-4">
            Data Menu Sales tidak ditemukan
          </div>
        </ScrollContainer>

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