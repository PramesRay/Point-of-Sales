<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'

import { formatRupiah } from '@/utils/helpers/currency'
import { useShift } from '@/composables/useShift'
import { useOverlayManager } from '@/composables/non-services/useOverlayManager'

import type { ShiftCashier, UpdateShiftCashierPayload } from '@/types/shift'

import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import InputCashFlow from './sub-components/InputCashFlow.vue'
import { cloneDeep } from 'lodash'
import EndShift from './sub-components/EndShift.vue'

const { mdAndUp } = useDisplay()
const { openOverlay } = useOverlayManager()
const { updateCashier, endCashier, loading } = useShift()

const props = defineProps<{
  data: ShiftCashier
  confirmBeforeClose: boolean
  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
  refresh: () => void
}>()

const emit = defineEmits(['close'])

const currentData = ref(cloneDeep(props.data))

const payload = ref<UpdateShiftCashierPayload>({
  id: currentData.value.id,
  cash: currentData.value.initial_cash,
  cash_in: [],
  delete_cash_in: [],
  cash_out: [],
  delete_cash_out: [],
  notes: currentData.value.notes,
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
    payload.value.cash_out.length !== 0 ||
    payload.value.delete_cash_out.length !== 0 ||
    payload.value.cash_in.length !== 0 ||
    payload.value.delete_cash_in.length !== 0 ||
    (currentData.value.notes === null ? !(payload.value.notes === null || payload.value.notes === '') : payload.value.notes !== currentData.value.notes)
  )
})

const amountCashIn = computed(() => {
  return currentData.value.cash_in.reduce((acc, curr) => acc + curr.amount, 0) + payload.value.cash_in.reduce((acc, curr) => acc + curr.amount, 0);
});

const amountCashOut = computed(() => {
  return currentData.value.cash_out.reduce((acc, curr) => acc + curr.unit_price * curr.quantity, 0) + payload.value.cash_out.reduce((acc, curr) =>  acc + curr.unit_price * curr.quantity, 0);
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
    cash_in: [],
    delete_cash_in: [],
    cash_out: [],
    delete_cash_out: [],
    notes: null,
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
      delete_cash_in: payload.value.delete_cash_in,
      cash_out: payload.value.cash_out,
      delete_cash_out: payload.value.delete_cash_out,
      notes: payload.value.notes,
    })
    if (typeof props.onIsChangedUpdate === 'function') {
      props.onIsChangedUpdate(false)
    }
    props.refresh()
    clearPayload()
    emit('close')
  } catch (error) {
    console.log(error)
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
        <v-icon>mdi-close</v-icon>
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
      >
        <div class="text-center my-4" v-if="loading">
          <v-progress-circular indeterminate color="warning" height="1"/>
        </div>

        <ScrollContainer style="max-height: 50dvh; overflow-x: hidden" v-else>
          <v-list class="ma-0 pa-0">
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
            
            <div class="d-flex align-center justify-space-between font-weight-bold">
              <v-list-subheader class="text-subtitle-1 font-weight-bold">
                Arus Kas
              </v-list-subheader>
              {{ formatRupiah(amountCash) }}
            </div>

            <v-list-item class="pa-0 mx-2">
              <v-expansion-panels multiple variant="accordion" elevation="0">
                <!-- Kas awal -->
                <v-expansion-panel>
                  <v-expansion-panel-title class="px-2">
                    <div class="d-flex align-center text-caption text-disabled">
                      Kas Awal
                    </div>
                    <template v-slot:actions>
                      <div class="text-caption text-disabled">
                        {{ formatRupiah(currentData.initial_cash) }}
                      </div>
                    </template>
                  </v-expansion-panel-title>
                </v-expansion-panel>
                <!-- Kas Masuk Expansion Panel -->
                <v-expansion-panel>
                  <v-expansion-panel-title class="px-2">
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
                      <v-list>
                        <v-list-item v-for="(item, index) in currentData.cash_in" :key="index">
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
                                    payload.delete_cash_in.push(item.id),
                                    currentData.cash_in.splice(index, 1)
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
                        <div v-if="!currentData.cash_in.length" class="text-center text-subtitle-2 text-disabled my-4">Belum ada Kas Masuk</div>
                      </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
      
                <!-- Kas Keluar Expansion Panel -->
                <v-expansion-panel>
                  <v-expansion-panel-title class="px-2">
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
                      <v-list>
                        <v-list-item v-for="(item, index) in currentData.cash_out" :key="index">
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
                                    payload.delete_cash_out.push(item.id),
                                    currentData.cash_out.splice(index, 1)
                                    // amountCashOut -= item.quantity * item.unit_price
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
                  </v-expansion-panel-text>
                </v-expansion-panel>
                
                <v-expansion-panel>
                  <v-expansion-panel-title class="px-2">
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
                  <v-expansion-panel-title class="px-2">
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
            <v-list-item class="pa-0 mx-2">
              <v-expansion-panels multiple variant="accordion" elevation="0">
                <v-expansion-panel>
                  <v-expansion-panel-title class="px-2">
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
                  <v-expansion-panel-title class="px-2">
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

            <div class="d-flex align-center justify-space-between text-caption text-meidum-emphasis mt-4 ms-2">
              Total Pengeluaran
              <span class="font-weight-medium">
                {{ formatRupiah(currentData.total_expense) }}
              </span>
            </div>

            <div class="d-flex align-center justify-space-between text-caption text-meidum-emphasis mt-1 ms-2">
              Total Pendapatan Bersih
              <span class="font-weight-medium">
                {{ formatRupiah(currentData.net_income) }}
              </span>
            </div>
            
            <div class="d-flex align-center justify-space-between font-weight-bold text-h4 mt-2 ms-2">
              Total Diharapkan
              <span>
                {{ formatRupiah(currentData.net_income + currentData.initial_cash) }}
              </span>
            </div>
          </v-list>
        </ScrollContainer>

        <v-row class="mt-2">
          <v-col cols="12">
            <v-textarea
              v-model="payload.notes"
              
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
              :disabled="loading || isChanged"
              prepend-icon="mdi-door-closed"
              color="error"
              variant="text"
              @click="
              openOverlay({
                component: EndShift,
                props: {
                  payload: payload,
                  close: () => {
                    props.refresh()
                    emit('close')
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