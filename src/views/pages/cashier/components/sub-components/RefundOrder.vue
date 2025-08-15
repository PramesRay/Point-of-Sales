<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { Order, OrderItem, UpdateOrderItemStatusPayload } from '@/types/order';
import { getSuggestedTotalCash } from '@/utils/helpers/payment'
import { formatRupiah, formatRupiahInput } from '@/utils/helpers/currency';
import { useCurrentOrders } from '@/composables/useCurrentOrder';

const { refundOrderItem, loading: lo } = useCurrentOrders()

const emit = defineEmits(['close'])

const props = defineProps<{
  payload?: UpdateOrderItemStatusPayload & { amount_refund: number}
  refresh: () => void
}>()

const formRef = ref()
const isFormValid = ref(false)

const refund_method = ref<'Cash' | 'Digital'>()
const reason = ref('')

const amtRules = [
  (v: string) => !!v || 'Jumlah tidak boleh kosong',
  (v: string) => {
    const numeric = Number(v.replace(/\D/g, ''))
    return numeric >= 0 || 'Jumlah tidak boleh kurang dari 0'
  }
]

async function processPayment() {
  try {
      await refundOrderItem({
        id: props.payload?.id!,
        items: props.payload?.items?.map((item) => ({
          id: item.id,
          status: 'Refund'
        })) ?? [],
        amount: props.payload?.amount_refund ?? 0,
        reason: reason.value ?? '',
        method: refund_method.value ?? 'Cash'
      })

      props.refresh()
      emit('close')
    } catch (error) {
      props.refresh()
      console.log(error)
    }
}

function handleSubmit() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processPayment()
  })
}
</script>

<template>
  <v-card
    class="rounded-lg pa-6 mt-8 bg-white height-screen"
    style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 95dvh; scrollbar-width: none;"
  >
    <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="handleSubmit()">
      <!-- Close button -->
      <v-btn
        icon
        variant="text"
        style="position:absolute; top:8px; right:12px;" 
        @click="emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
  
      <h4 class="text-h4">Pembayaran</h4>
      <v-divider class="my-2"></v-divider>
  
      <div class="text-center mb-4">
        <div class="text-subtitle-2 text-medium-emphasis"> Total Refund</div>
        <h1 class="text-h1 text-error">{{ formatRupiah(props.payload?.amount_refund ?? 0) }}</h1>
      </div>
      
      <div class="text-subtitle-2 text-medium-emphasis mb-2">Pilih Metode Refund: </div>
      <v-row>
        <v-col cols="6">
          <v-btn
            block
            prepend-icon="mdi-cash"
            @click="refund_method = 'Cash'"
            :variant="refund_method === 'Cash' ? 'tonal' : 'elevated'"
          >
            Cash  
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            block
            prepend-icon="mdi-qrcode-scan"
            @click="refund_method = 'Digital'"
            :variant="refund_method === 'Digital' ? 'tonal' : 'elevated'"
          >
            Digital
          </v-btn>
        </v-col>
      </v-row>
  
      <v-text-field
        v-model="reason"
        label="Alasan Refund"
        variant="underlined"
        class="mt-4"
        :rules="[v => !!v || 'Alasan tidak boleh kosong']"
      ></v-text-field>
  
      <v-divider class="my-4"></v-divider>
  
      <v-row>
        <v-col cols="12">
          <v-btn 
            color="error"
            block
            type="submit"
            :disabled="!isFormValid || lo"
            :variant="lo ? 'outlined' : 'elevated'"
            :loading="lo"
          >
            Refund
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>