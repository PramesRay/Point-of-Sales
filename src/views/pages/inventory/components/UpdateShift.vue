<script setup lang="ts">
import { ref, computed, watch, reactive, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'

import { useShift } from '@/composables/useShift'
import { useOverlayManager } from '@/composables/non-services/useOverlayManager'

import type { ShiftWarehouse, UpdateShiftWarehousePayload } from '@/types/shift'

import Blank from '@/components/shared/Blank.vue'
import { cloneDeep } from 'lodash'

const { mdAndUp } = useDisplay()
const { openOverlay } = useOverlayManager()
const { updateWarehouse, endWarehouse, loading } = useShift()

const props = defineProps<{
  data: ShiftWarehouse
  confirmBeforeClose: boolean
  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
}>()

const emit = defineEmits(['close'])

const currentData = ref(cloneDeep(props.data))

const payload = ref<UpdateShiftWarehousePayload>({
  id: currentData.value.id,
  notes: null,
})

const formRef = ref()
const isFormValid = ref(false)

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi.'],
  positive: [(v: any) => v > 0 || 'Harus lebih dari 0'],
  notes: [(v: string) => (v?.length ?? 0) <= 100 || 'Maks. 100 karakter'],
}

const isChanged = computed(() => {
  return (payload.value.notes !== null && currentData.value.notes !== null && payload.value.notes as string !== currentData.value.notes as string)
})

watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})


function clearPayload() {
  payload.value = {
    id: currentData.value.id,
    notes: null,
  }
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
    await updateWarehouse({
      id: payload.value.id,
      notes: payload.value.notes
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
  try {
    await endWarehouse(payload.value.id)
    clearPayload()
  } catch (error) {
    if (typeof props.onIsChangedUpdate === 'function') {
      props.onIsChangedUpdate(false)
    }
    emit('close')
  }
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

      <div>
        <h4 class="text-h4 mt-1 mb-1">Detail Shift Gudang</h4>
        <div class="text-subtitle-2 text-disabled">
          {{ currentData.id }}
        </div>
      </div>

      <v-divider class="my-4"></v-divider>

      <v-form
        ref="formRef"
        v-model="isFormValid"
        lazy-validation
        @submit.prevent="submitForm"
        style="max-height: 60dvh; overflow-y: auto; scrollbar-width: none;"
      >

        <div class="text-center my-4" v-if="loading">
          <v-progress-circular indeterminate color="warning" height="1"/>
        </div>

        <v-list class="ma-0 pa-0" v-else>
          <div class="d-flex align-center justify-space-between font-weight-bold">
            <v-list-subheader class="text-subtitle-1 font-weight-bold">
              Permintaan Stok
            </v-list-subheader>
            {{ currentData.total_restock_request }}
          </div>
          <v-list-item class="px-0 mx-2">
            <v-expansion-panels multiple variant="accordion" elevation="0">  
              <v-expansion-panel>
                <v-expansion-panel-title class="px-2">
                  <div class="text-caption text-disabled">
                    Permintaan Stok Disetujui
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-medium-emphasis font-weight-bold text-success">
                      {{ currentData.request_approved }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>
  
              <v-expansion-panel>
                <v-expansion-panel-title class="px-2">
                  <div class="text-caption text-disabled">
                    Permintaan Stok Ditolak
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-medium-emphasis font-weight-bold text-error">
                      {{ currentData.request_rejected }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item>
          
          <div class="d-flex align-center justify-space-between font-weight-bold mt-4">
            <v-list-subheader class="text-subtitle-1 font-weight-bold">
              Perpindahan Stok
            </v-list-subheader>
            {{ currentData.total_stock_movement }}
          </div>
          <v-list-item class="px-0 mx-2">
            <v-expansion-panels multiple variant="accordion" elevation="0">
              <v-expansion-panel>
                <v-expansion-panel-title class="px-2">
                  <div class="text-caption text-disabled">
                    Stock Movement Masuk
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-medium-emphasis font-weight-bold text-success">
                      {{ currentData.stock_movement_in }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>
  
              <v-expansion-panel>
                <v-expansion-panel-title class="px-2">
                  <div class="text-caption text-disabled">
                    Stock Movement Keluar
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-medium-emphasis font-weight-bold text-error">
                      {{ currentData.stock_movement_out }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item>
        </v-list>

        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="payload.notes"
              :rules="rules.notes"
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
          <v-col class="d-flex justify-space-between align-center">
            <v-btn
              :loading="loading"
              prepend-icon="mdi-door-closed"
              color="error"
              variant="text"
              @click="
              openOverlay({
                component: Blank,
                props: {
                  confirmToContinue: true,
                  confirmMessage: 'Apakah anda yakin ingin mengakhiri shift gudang?',
                  loading,
                  onConfirm: () => {
                    handleEndShift()
                  }
                }
              })
            "
            >
              Akhiri Shift
            </v-btn>
            <div class="d-flex align-center">
              <v-btn
                class="mr-1"
                variant="plain"
                @click="emit('close')"
              >
                Batal
              </v-btn>
              <v-btn
                :loading="loading"
                :disabled="!isFormValid || !isChanged"
                color="warning"
                type="submit"
              >
                Simpan
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>