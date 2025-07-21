<script setup lang="ts">
import type { UpdateShiftCashierPayload } from '@/types/shift';
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
const { mdAndUp } = useDisplay()

import { formatRupiah, formatRupiahInput, formatRupiahInputR } from '@/utils/helpers/currency'

const emit = defineEmits(['close', 'update:isChanged'])

const props = defineProps<{
  isCashIn: boolean
  onSubmit: (data: any) => void
}>()

const payloadCashIn = ref({
  cash_in: {
    subject: null as string | null,
    amount: null as number | null,
  }
})

const payloadCashOut = ref({
  cash_out: {
    subject: null as string | null,
    quantity: 0,
    unit: null as string | null,
    unit_price: null as number | null,
  }
})

const amountRaw = ref('')

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi'],
  positive: [(v: any) => v != 0 || 'Harus lebih dari 0'],
}

const isChanged = computed(() => {
  if (props.isCashIn) {
    return payloadCashIn.value.cash_in.amount !== null
  } else {
    return payloadCashOut.value.cash_out.quantity !== null
  }
})

watch(isChanged, (val) => {
  emit('update:isChanged', val)
})

function clearPayload() {
  if (props.isCashIn) {
    payloadCashIn.value = {
      cash_in: {
        subject: null,
        amount: null,
      }
    }
  } else {
    payloadCashOut.value = {
      cash_out: {
        subject: null,
        quantity: 0,
        unit: null,
        unit_price: null,
      }
    }
  }

  amountRaw.value = ''
}

function handleSubmit() {
  if (props.isCashIn) {
    props.onSubmit(payloadCashIn.value.cash_in)
  } else {
    props.onSubmit(payloadCashOut.value.cash_out)
  }
  emit('close')
  clearPayload()
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
        @click="emit('close')"
      >
        ×
      </div>

      <h4 class="text-h4 mt-1 mb-1">{{ props.isCashIn ? 'Tambah Kas Masuk' : 'Tambah Kas Keluar' }}</h4>

      <v-divider class="my-4"></v-divider>

      <v-form @submit.prevent="handleSubmit">
        <v-row v-if="props.isCashIn">
          <v-col cols="12">
            <v-text-field
              v-model="payloadCashIn.cash_in.subject"
              :rules="rules.required"
              prepend-icon="mdi-label-outline"
              label="Subject"
              variant="underlined"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="amountRaw"
              :rules="[...rules.required, ...rules.positive]"
              label="Jumlah"
              hide-details
              prepend-icon="mdi-cash-multiple"
              prefix="Rp"
              variant="underlined"
              @input="
                amountRaw = formatRupiahInput(amountRaw),
                payloadCashIn.cash_in.amount = formatRupiahInputR(amountRaw)
              "
            />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-text-field
              v-model="payloadCashOut.cash_out.subject"
              :rules="rules.required"
              prepend-icon="mdi-label-outline"
              label="Subject"
              variant="underlined"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-number-input
              v-model="payloadCashOut.cash_out.quantity"
              :rules="rules.positive"
              label="Jumlah"
              control-variant="split"
              :min="0"
              variant="plain"
              inset
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="payloadCashOut.cash_out.unit"
              :rules="rules.required"
              prepend-icon="mdi-format-list-bulleted-type"
              variant="underlined"
              label="Satuan"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="amountRaw"
              :rules="[...rules.required, ...rules.positive]"
              prepend-icon="mdi-cash-multiple"
              label="Harga Satuan"
              hide-details
              prefix="Rp"
              variant="underlined"
              @input="
                amountRaw = formatRupiahInput(amountRaw),
                payloadCashOut.cash_out.unit_price = formatRupiahInputR(amountRaw)
              "
            />
          </v-col>
        </v-row>
        <v-divider class="mb-4 mt-8"></v-divider>
        <v-row class="text-right">
          <v-col cols="12">
            <v-btn class="mr-2" variant="plain" @click="emit('close')">
              Batal
            </v-btn>
            <v-btn
              :color="props.isCashIn ? 'success' : 'error'"
              type="submit"
            >
              Tambah
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>