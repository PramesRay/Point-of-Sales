<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'

import { formatRupiahInput, formatRupiahInputR } from '@/utils/helpers/currency'
import { useUserStore } from '@/stores/authUser'
import { useShift } from '@/composables/useShift'

import type { StartShiftCashierPayload } from '@/types/shift'

const { mdAndUp } = useDisplay()
const userStore = useUserStore()
const { startCashier, loading } = useShift()

const props = defineProps<{
  confirmBeforeClose: boolean
  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
}>()

const emit = defineEmits(['close'])

const payload = ref<{[K in keyof StartShiftCashierPayload]: StartShiftCashierPayload[K] | null}>({
  branch_id: userStore.me?.activity?.branch?.id || null,
  cash: null,
})

const formRef = ref()
const isFormValid = ref(false)
const cashRaw = ref('')

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi'],
  positive: [(v: any) => v !== 0 || 'Harus lebih dari 0'],
}

const isChanged = computed(() => {
  return (
    payload.value.branch_id !== userStore.me?.activity?.branch?.id ||
    payload.value.cash !== null
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
    branch_id: null,
    cash: null,
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
    await startCashier({
      branch_id: payload.value.branch_id!,
      cash: payload.value.cash!
    })
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
        @click="emit('close')"
      >
        ×
      </div>

      <h4 class="text-h4 mt-1 mb-1">Mulai Shift Kasir</h4>

      <v-divider class="my-4"></v-divider>

      <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
        <v-row>
          <!-- selector branch berdasarkan assigned branch -->
          <v-col cols="12">
            <v-select
              v-model="payload.branch_id"
              :items="userStore.me?.assigned_branch!"
              disabled
              prepend-icon="mdi-home"
              item-title="name"
              item-value="id"
              label="Cabang"
              variant="underlined"
              :rules="[...rules.required]"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="cashRaw"
              :rules="[...rules.required, ...rules.positive]"
              prepend-icon="mdi-cash"
              prefix="Rp"
              label="Kas Awal"
              variant="underlined"
              @input="
                cashRaw = formatRupiahInput(cashRaw),
                payload.cash = formatRupiahInputR(cashRaw)
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
              color="primary"
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