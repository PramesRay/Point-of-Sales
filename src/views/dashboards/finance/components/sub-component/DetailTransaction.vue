<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
const { mdAndUp } = useDisplay()

import type { Transaction, CreateTransactionPayload, UpdateTransactionPayload } from '@/types/finance'

import { formatRupiahInput, formatRupiahInputR } from '@/utils/helpers/currency'
import { formatDate } from '@/utils/helpers/format-date'

import { useTransactions } from '@/composables/useTransactionList'

import { useUserStore } from '@/stores/authUser'
const userStore = useUserStore()

const props = defineProps<{
  data?: Transaction
  is_create: boolean
  confirmBeforeClose: Boolean,
}>()

const emit = defineEmits(['close', 'update:isChanged'])

const { create, update, loading } = useTransactions()

const payload = ref<{[K in keyof CreateTransactionPayload]: CreateTransactionPayload[K] | null}>({
  subject: props.is_create ? null : props.data?.subject ?? null,
  notes: props.is_create ? null : props.data?.notes ?? null,
  amount: props.is_create ? null : props.data?.amount ?? null,
  is_income: props.is_create ? null : props.data?.is_income ?? null,
  date: props.is_create ? new Date() : props.data?.date ?? null,
  branch_id: props.is_create ? (userStore.me?.activity?.branch?.id || null) : props.data?.branch.id ?? null,
})
const formRef = ref()
const isFormValid = ref(false)

const dateMenu = ref(false)
const amountRaw = ref(payload.value.amount ? formatRupiahInput(payload.value.amount) : '')

const rules = {
  required: [(v: string) => !!v || 'Data tidak boleh kosing'],
  amount: [(v: number) => v != 0 || 'Jumlah tidak boleh kurang dari 0'],
  notes: [(v: string) => v.length <= 100 || 'Maksimal 100 karakter'],
}

const formattedDateText = computed(() => {
  if (!payload.value.date) return ''
  return formatDate(payload.value.date).split('pukul')[0]
})

const isChanged = computed(() => {
  if (!props.data) return false

  if (props.is_create) {
    return (
      payload.value.subject !== null ||
      payload.value.notes !== null ||
      payload.value.amount !== null ||
      payload.value.is_income !== null ||
      payload.value.branch_id !== null
    )
  } else {
    return (
      payload.value.subject !== props.data?.subject ||
      payload.value.notes !== props.data?.notes ||
      payload.value.amount !== props.data?.amount ||
      payload.value.is_income !== props.data?.is_income ||
      payload.value.branch_id !== props.data?.branch.id ||
      payload.value.date !== props.data?.date
    )
  }
})

function onDatePicked(val: Date | null) {
  if (!val) return

  const time = payload.value.date || new Date()

  payload.value.date = new Date(
    val.getFullYear(),
    val.getMonth(),
    val.getDate(),
    time.getHours(),
    time.getMinutes(),
    0
  )
  dateMenu.value = false
}

function clearPayload() {
  if (props.is_create) {
    payload.value = {
      subject: null,
      notes: null,
      amount: null,
      is_income: null,
      date: null,
      branch_id: null,
    }
  } else {
    payload.value = {
      subject: props.data?.subject ?? null,
      notes: props.data?.notes ?? null,
      amount: props.data?.amount ?? null,
      is_income: props.data?.is_income ?? null,
      date: props.data?.date ?? null,
      branch_id: props.data?.branch.id ?? null,
    }
  }
  
  formRef.value?.resetValidation()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processSubmit()
    clearPayload()
  })
}

async function processSubmit() {
  if (props.is_create) {
    await create(payload.value as CreateTransactionPayload)
  } else {
    const updatePayload: UpdateTransactionPayload = {
      id: props.data?.id as string,
      ...payload.value as CreateTransactionPayload
    }
    await update(updatePayload)
  }
}

watch(isChanged, (val) => {
  emit('update:isChanged', val)
  console.log('isChanged', val)
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
        ×
      </div>
      <div class="d-flex align-center">
        <h4 class="text-h4 mt-1">Detil Transaksi</h4>
      </div>
      <div>
        <i class="text-subtitle-2 text-disabled">{{ props.data?.id }}</i>
      </div>

      <v-divider class="my-4"></v-divider>

      <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm" >
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="payload.subject"
              :rules="rules.required"
              prepend-icon="mdi-label-outline"
              label="Subjek"
              variant="underlined"
              clearable
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formattedDateText"
              :rules="rules.required"
              prepend-icon="mdi-calendar"
              label="Tanggal"
              variant="underlined"
              clearable
            />
            <v-dialog
              v-model="dateMenu"
              :close-on-content-click="false"
              activator="parent"
              transition="scale-transition"
              offset-y
              max-width="290"
              min-width="290"
            >
              <v-date-picker
                v-model="payload.date"
                @update:model-value="onDatePicked"
                :min="props.is_create ? new Date().toLocaleDateString() : null"
                no-title
                scrollable
              />
            </v-dialog>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="payload.branch_id"
              :rules="rules.required"
              prepend-icon="mdi-home"
              :items="userStore.me?.assigned_branch"
              item-title="name"
              item-value="id"
              label="Cabang"
              variant="underlined"
            />
          </v-col>
          <v-col cols="5">
            <v-switch
              style="justify-self: end;"
              v-model="payload.is_income"
              :color="payload.is_income ? 'success' : 'error'"
              :base-color="payload.is_income ? 'success' : 'error'"
              :append-icon="payload.is_income ? 'mdi-cash-plus' : 'mdi-cash-minus'"
              :icon-color="payload.is_income ? 'success' : 'error'"
              inset
            />
          </v-col>
          <v-col cols="7">
            <v-text-field
              v-model="amountRaw"
              :rules="[...rules.required, ...rules.amount]"
              prefix="Rp"
              :label="payload.is_income ? 'Jumlah Pemasukan' : 'Jumlah Pengeluaran'"
              variant="underlined"
              @input="
                amountRaw = formatRupiahInput(amountRaw),
                payload.amount = formatRupiahInputR(amountRaw)
              "
            />
          </v-col>
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
          
          <v-col cols="12" class="text-right">
            <v-btn
              class="mr-2"
              variant="plain"
              @click="emit('close')"
            >
              Batal
            </v-btn>
            
            <v-btn
              :loading="loading"
              :disabled="props.is_create ? !isFormValid : !isChanged"
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