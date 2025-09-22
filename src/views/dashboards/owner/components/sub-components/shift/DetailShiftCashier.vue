<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'

import { formatRupiah } from '@/utils/helpers/currency'

import type { ShiftCashier } from '@/types/shift'

import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import { cloneDeep } from 'lodash'

const { mdAndUp } = useDisplay()

const props = defineProps<{
  data: ShiftCashier
}>()

const emit = defineEmits(['close'])

const currentData = ref(cloneDeep(props.data))

const amountCashIn = computed(() => {
  return currentData.value.cash_in.reduce((acc, curr) => {
    if (curr && typeof curr.amount === 'number') {
      return acc + curr.amount;
    }
    return acc;
  }, 0);
});

const amountCashOut = computed(() => {
  return currentData.value.cash_out.reduce((acc, curr) => {
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
        @click="emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </div>

      <div>
        <h4 class="text-h4 mt-1 mb-1">Detail Shift Kasir</h4>
        <div class="text-subtitle-2 text-disabled">
          {{ currentData.id }}
        </div>
      </div>

      <v-divider class="my-4"></v-divider>

      <ScrollContainer style="max-height: 70dvh; overflow-x: hidden">
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
              Arus Kas Tunai
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
                  <v-list>
                    <v-list-item v-for="(item, index) in currentData.cash_in" :key="index" class="px-0">
                      <v-divider v-if="index > 0"></v-divider>
                      <v-row no-gutters class="py-2 align-center">
                        <v-col cols="7">
                          <div class="text-subtitle-2 font-weight-bold text-medium-emphasis">
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
                  <v-list>
                    <v-list-item v-for="(item, index) in currentData.cash_out" :key="index" class="px-0">
                      <v-row no-gutters class="py-2 align-center">
                        <v-col cols="7">
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
                    <div v-if="!currentData.cash_out.length" class="text-center text-subtitle-2 text-disabled py-4">Belum ada Kas Keluar</div>
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
              Arus Kas Digital
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

        <div class="text-medium-emphasis my-4 mx-2">
          <div class="font-weight-bold my-2">Catatan: </div>
          <div class="text-subtitle-2 text-disabled">
            {{ currentData.notes || '-' }}
          </div>
        </div>
      </ScrollContainer>
    </v-card-text>
  </v-card>
</template>