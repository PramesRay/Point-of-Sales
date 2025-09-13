<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

import { formatRupiahInput, formatRupiahInputR } from '@/utils/helpers/currency'
import { useUserStore } from '@/stores/authUser'
import { useShift } from '@/composables/useShift'

import type { EndShiftCashierPayload, UpdateShiftCashierPayload } from '@/types/shift'

const { mdAndUp } = useDisplay()
const userStore = useUserStore()
const { endCashier, loading } = useShift()

const props = defineProps<{
  payload: UpdateShiftCashierPayload
  close: () => void
}>()

const emit = defineEmits(['close'])

const payload = ref<EndShiftCashierPayload>({
  id: props.payload.id,
  actual_cash: 0,
})

const formRef = ref()
const isFormValid = ref(false)
const cashRaw = ref('')

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi'],
  positive: [(v: any) => v !== 0 || 'Harus lebih dari 0'],
}


function clearPayload() {
  payload.value = {
    id: props.payload.id,
    actual_cash: 0,
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
    await endCashier(payload.value)
    props.close()
    clearPayload()
    emit('close')
  } catch (error) {
    console.log(error)
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
        @click="emit('close')"
      >
        ×
      </div>

      <h4 class="text-h4 mt-1 mb-1">Akhiri Shift Kasir</h4>

      <v-divider class="my-4"></v-divider>

      <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="cashRaw"
              :rules="[...rules.required, ...rules.positive]"
              prepend-icon="mdi-cash"
              prefix="Rp"
              label="Kas Akhir"
              variant="underlined"
              @input="
                cashRaw = formatRupiahInput(cashRaw),
                payload.actual_cash = formatRupiahInputR(cashRaw)
              "
            />
          </v-col>

          <v-col cols="12" class="text-right">
            <v-btn class="mr-2" variant="plain" @click="emit('close')">
              Batal
            </v-btn>
            <v-btn
              :loading="loading"
              :disabled="!isFormValid"
              color="error"
              type="submit"
            >
              Akhiri
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>