<script setup lang="ts">
import { ref, computed, watch, reactive, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'

import { formatRupiah, formatRupiahInput, formatRupiahInputR } from '@/utils/helpers/currency'
import { useShift } from '@/composables/useShift'
import { useOverlayManager } from '@/composables/non-services/useOverlayManager'

import type { ShiftCashier, UpdateShiftCashierPayload } from '@/types/shift'

import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import InputCashFlow from './sub-components/InputCashFlow.vue'
import Blank from '@/components/shared/Blank.vue'
import { cloneDeep } from 'lodash'

const { mdAndUp } = useDisplay()
const { openOverlay } = useOverlayManager()
const { updateCashier, endCashier, loading } = useShift()

const props = defineProps<{
  data: ShiftCashier
  confirmBeforeClose: boolean
  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
}>()

const emit = defineEmits(['close'])

const currentData = ref(cloneDeep(props.data))

const payload = ref<UpdateShiftCashierPayload>({
  id: currentData.value.id,
  cash: currentData.value.initial_cash ?? 0,
  cash_in: [...currentData.value.cash_in],
  cash_out: [...currentData.value.cash_out],
  notes: null,
  actual_cash: currentData.value.actual_cash
})

const formRef = ref()
const isFormValid = ref(false)
const isCashIn = ref(true)
const cashRaw = ref('')

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi.'],
  positive: [(v: any) => v > 0 || 'Harus lebih dari 0'],
  notes: [(v: string) => (v?.length ?? 0) <= 100 || 'Maks. 100 karakter'],
}

const isChanged = computed(() => {
  return (
    payload.value.cash_out.length != currentData.value.cash_out.length ||
    payload.value.cash_in.length != currentData.value.cash_in.length ||
    (payload.value.notes !== null && currentData.value.notes !== null && payload.value.notes as string !== currentData.value.notes as string)
  )
})

const amountCashIn = computed(() => {
  return payload.value.cash_in.reduce((acc, curr) => {
    if (curr && typeof curr.amount === 'number') {
      return acc + curr.amount;
    }
    return acc;
  }, 0);
});

const amountCashOut = computed(() => {
  return payload.value.cash_out.reduce((acc, curr) => {
    if (curr && typeof curr.unit_price === 'number' && typeof curr.quantity === 'number') {
      return acc + curr.unit_price * curr.quantity;
    }
    return acc;
  }, 0);
});

const amountCash = computed(() => {
  return (
    currentData.value.cash_payment 
    + currentData.value.initial_cash 
    + amountCashIn.value 
    - amountCashOut.value
    - currentData.value.cash_payment_refund
  )
})

const amountDigital = computed(() => {
  return (
    currentData.value.digital_payment 
    - currentData.value.digital_payment_refund
  )
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
    cash: currentData.value.initial_cash ?? 0,
    cash_in: [...currentData.value.cash_in],
    cash_out: [...currentData.value.cash_out],
    notes: null,
    actual_cash: currentData.value.actual_cash
  }
  cashRaw.value = ''
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
    await updateCashier({
      id: payload.value.id,
      cash: payload.value.cash,
      cash_in: payload.value.cash_in,
      cash_out: payload.value.cash_out,
      notes: payload.value.notes,
      actual_cash: payload.value.actual_cash
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
    await endCashier(payload.value.id)
    clearPayload()
  } catch (error) {
    if (typeof props.onIsChangedUpdate === 'function') {
      props.onIsChangedUpdate(false)
    }
    emit('close')
  }
}

function openInputOverlay(isCashIn: boolean) {
  openOverlay({
    component: InputCashFlow,
    props: {
      isCashIn: isCashIn,
      onSubmit: (data: any) => {
        if (isCashIn) {
          payload.value.cash_in.push(data)
        } else {
          payload.value.cash_out.push(data)
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

      <div>
        <h4 class="text-h4 mt-1 mb-1">Detail Shift</h4>
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
        <v-list class="ma-0 pa-0">
          <div class="d-flex align-center justify-space-between font-weight-bold">
            <v-list-subheader class="text-subtitle-1 font-weight-bold">
              Arus Kas
            </v-list-subheader>
            {{ formatRupiah(amountCash) }}
          </div>

          <v-list-item class="pa-0">
            <v-expansion-panels multiple variant="accordion" elevation="0">
              <!-- Kas awal -->
              <v-expansion-panel>
                <v-expansion-panel-title class="pe-0">
                  <div class="d-flex align-center text-caption text-disabled">
                    Kas Awal
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-disabled">
                      {{ formatRupiah(payload.cash) }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>
              <!-- Kas Masuk Expansion Panel -->
              <v-expansion-panel>
                <v-expansion-panel-title class="pe-0">
                  <div class="d-flex align-center text-caption text-disabled">
                    Kas Masuk
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-disabled text-success">
                      {{ formatRupiah(amountCashIn) }}
                    </div>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="text-right">
                    <v-btn
                      block
                      color="success"
                      @click="openInputOverlay(true)" 
                    >
                      Tambah
                    </v-btn>
                  </div>
                  <ScrollContainer :maxHeight="mdAndUp ? '15rem' : '12rem'">
                    <v-list>
                      <v-list-item v-for="(item, index) in payload.cash_in" :key="index">
                        <v-divider v-if="index > 0"></v-divider>
                        <v-row no-gutters class="py-2 align-center">
                          <v-col cols="7">
                            <div class="text-subtitle-2 font-weight-bold text-medium-emphasis">
                              <v-btn
                                icon="mdi-delete"
                                color="error"
                                size="small"
                                density="compact"
                                variant="text"
                                class="mb-1"
                                @click="
                                  payload.cash_in.splice(index, 1)
                                "
                              ></v-btn>
                              {{ item.subject }}
                            </div>
                          </v-col>
                          <v-col cols="5">
                            <div class="text-subtitle-2 font-weight-medium text-right">
                              {{ formatRupiah(item.amount) }}
                            </div>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <div v-if="!payload.cash_in.length" class="text-center text-subtitle-2 text-disabled my-4">Belum ada Kas Masuk</div>
                    </v-list>
                  </ScrollContainer>
                </v-expansion-panel-text>
              </v-expansion-panel>
    
              <!-- Kas Keluar Expansion Panel -->
              <v-expansion-panel>
                <v-expansion-panel-title class="pe-0">
                  <div class="d-flex align-center text-caption text-disabled">
                    Kas Keluar
                  </div>
                  <!-- <v-spacer></v-spacer>
                  <div class="text-caption text-disabled text-error">
                    {{ formatRupiah(amountCashOut) }}
                  </div> -->
                  <template v-slot:actions>
                    <div class="text-caption text-disabled text-error">
                      {{ formatRupiah(amountCashOut) }}
                    </div>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="text-right">
                    <v-btn
                      block
                      color="error"
                      @click="openInputOverlay(false)"
                    >
                      Tambah
                    </v-btn>
                  </div>
                  <ScrollContainer :maxHeight="mdAndUp ? '15rem' : '12rem'">
                    <v-list>
                      <v-list-item v-for="(item, index) in payload.cash_out" :key="index">
                        <v-row no-gutters class="py-2 align-center">
                          <v-col cols="7">
                            <div class="text-subtitle-2 font-weight-bold text-medium-emphasis">
                              <v-btn
                                icon="mdi-delete"
                                color="error"
                                size="small"
                                density="compact"
                                variant="text"
                                class="mb-1"
                                @click="
                                  payload.cash_out.splice(index, 1),
                                  amountCashOut -= item.quantity * item.unit_price
                                "
                              ></v-btn>
                              {{ item.subject }}
                            </div>
                            <div class="text-subtitle-2 text-disabled">
                              {{ item.quantity }} {{ item.unit + ' | @' + formatRupiah(item.unit_price) }}
                            </div>
                          </v-col>
                          <v-col cols="5">
                            <div class="text-subtitle-2 font-weight-medium text-right">
                              {{ formatRupiah(item.quantity * item.unit_price) }}
                            </div>
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <div v-if="!payload.cash_out.length" class="text-center text-subtitle-2 text-disabled py-4">Belum ada Kas Keluar</div>
                    </v-list>
                  </ScrollContainer>
                </v-expansion-panel-text>
              </v-expansion-panel>
              
              <v-expansion-panel>
                <v-expansion-panel-title class="pe-0">
                  <div class="d-flex align-center text-caption text-disabled">
                    Pembayaran Tunai
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-disabled">
                      {{ formatRupiah(currentData.cash_payment) }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-title class="pe-0">
                  <div class="d-flex align-center text-caption text-disabled">
                    Refund Tunai
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-disabled">
                      {{ formatRupiah(currentData.cash_payment_refund) }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item>
          
          <div class="d-flex align-center justify-space-between font-weight-bold">
            <v-list-subheader class="text-subtitle-1 font-weight-bold">
              Arus Digital
            </v-list-subheader>
            {{ formatRupiah(amountDigital) }}
          </div>
          <v-list-item class="pa-0">
            <v-expansion-panels multiple variant="accordion" elevation="0">
              <v-expansion-panel>
                <v-expansion-panel-title class="pe-0">
                  <div class="d-flex align-center text-caption text-disabled">
                    Pembayaran Digital
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-disabled">
                      {{ formatRupiah(currentData.digital_payment) }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>
    
              <v-expansion-panel>
                <v-expansion-panel-title class="pe-0">
                  <div class="d-flex align-center text-caption text-disabled">
                    Refund Digital
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-disabled">
                      {{ formatRupiah(currentData.digital_payment_refund) }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>

            </v-expansion-panels>
          </v-list-item>

          <div 
            class="d-flex align-center justify-space-between font-weight-bold text-medium-emphasis mt-4 ms-2"
          >
            Total Diharapkan
            <span>
              {{ formatRupiah(amountDigital) }}
            </span>
          </div>
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
                  confirmMessage: 'Apakah anda yakin ingin mengakhiri shift?',
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