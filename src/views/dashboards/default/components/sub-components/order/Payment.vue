<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { CreateOrderPayload, Order, OrderItem } from '@/types/order';
import { getSuggestedTotalCash } from '@/utils/helpers/payment'
import { formatRupiah, formatRupiahInput } from '@/utils/helpers/currency';
import { useCurrentOrders } from '@/composables/useCurrentOrder';

const { createDirectPaymentOrder, updatePayment, loading: lo } = useCurrentOrders()

const emit = defineEmits(['close'])

const props = defineProps<{
  payload?: CreateOrderPayload
  data?: Order
  is_direct_payment?: boolean
  paymentSucceded: () => void
}>()

const formRef = ref()
const isFormValid = ref(false)

const paymentMethod = ref('')
const cashInput = ref('')
const cashNumber = ref(0)

const amtRules = [
  (v: string) => !!v || 'Jumlah tidak boleh kosong',
  (v: string) => {
    const numeric = Number(v.replace(/\D/g, ''))
    return numeric >= 0 || 'Jumlah tidak boleh kurang dari 0'
  }
]

const totalPrice = computed(() => {
  if (props.is_direct_payment && props.payload) {
    return props.payload?.amount
  } else {
   return props.data?.amount
  }
})

const canPay = computed(() => {
  if (lo.value) return false
  if (paymentMethod.value === 'qris') return true
  
  return isFormValid.value && (totalPrice.value ? cashNumber.value >= totalPrice.value : false)
})


async function processPayment() {
  try {
      if (props.is_direct_payment && props.payload) {
        await createDirectPaymentOrder({
          ...props.payload,
          payment_method: paymentMethod.value
        })
      } else {
        await updatePayment({
          id: props.data?.id!,
          payment_method: paymentMethod.value,
          amount: totalPrice.value!
        })
      }

      props.paymentSucceded()
      emit('close')
    } catch (error) {
      console.log(error)
    }
}

function handleSubmit() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processPayment()
  })
}

watch(() => cashInput.value, (val) => {
  const numeric = val.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  cashNumber.value = numeric ? Number(numeric) : 0
})
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
        <div class="text-subtitle-2 text-medium-emphasis"> Total Pembayaran</div>
        <h1 class="text-h1">{{ formatRupiah(totalPrice ?? 0) }}</h1>
      </div>
      
      <div class="text-subtitle-2 text-medium-emphasis mb-2">Pilih Metode Pembayaran: </div>
      <v-row>
        <v-col cols="6">
          <v-btn
            block
            prepend-icon="mdi-cash"
            @click="paymentMethod = 'cash'"
            :variant="paymentMethod === 'cash' ? 'tonal' : 'elevated'"
          >
            Cash  
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            block
            prepend-icon="mdi-qrcode-scan"
            @click="paymentMethod = 'qris'"
            :variant="paymentMethod === 'qris' ? 'tonal' : 'elevated'"
          >
            QRIS
          </v-btn>
        </v-col>
      </v-row>
  
      <div v-if="paymentMethod === 'cash'">
        <v-row class="mt-2">
          <v-col cols="12">
            <v-text-field 
              v-if="paymentMethod === 'cash'"
              v-model="cashInput" 
              control-variant="hidden"
              variant="underlined"
              :min="0"
              :rules="amtRules"
              prepend-icon="mdi-cash-multiple"
              label="Jumlah Uang Tunai"
              prefix="Rp"
              @input="cashInput = formatRupiahInput(cashInput)"
            ></v-text-field>
          </v-col>
        </v-row>
  
        <v-row  class="justify-center">
          <v-col
            v-for="amount in getSuggestedTotalCash(totalPrice || 0)"
            :key="amount"
            cols="4"
          >
            <v-btn
              block
              color="primary"
              @click="cashInput = formatRupiahInput(amount.toString())"
              :variant="amount === cashNumber ? 'tonal' : 'outlined'"
            >
              {{ formatRupiah(amount) }}
            </v-btn>
          </v-col>
        </v-row>
        <div 
          v-if="paymentMethod === 'cash' && totalPrice && cashNumber !== 0 && cashNumber >= totalPrice"
          class="text-subtitle-2 text-medium-emphasis mt-6 text-center"
        >
          Total Kembalian: 
          <div class="text-h4">{{ formatRupiah(cashNumber - totalPrice) }}</div>
        </div>
      </div>
  
      <div 
        v-else
        class="text-subtitle-1 text-disabled mt-6 text-center"
      >
        Pastikan pembayaran QRIS sudah berhasil, yaa!
      </div>
  
      <v-divider class="my-4"></v-divider>
  
      <v-row>
        <v-col cols="12">
          <v-btn 
            color="success"
            block
            type="submit"
            :disabled="!canPay"
            :variant="lo ? 'outlined' : 'elevated'"
            :loading="lo"
          >
            Bayar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>