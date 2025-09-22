<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import Blank from '@/components/shared/Blank.vue';
import type { IdName } from '@/types/common';
import { formatDate } from '@/utils/helpers/format-date';
import type { Customer } from '@/types/customer';
import { useReservation } from '@/composables/useReservation';
import type { CreateReservationPayload, Reservation, UpdateReservationPayload } from '@/types/reservation';
import type { Branch } from '@/types/branch';

const {create, update, remove, loading} = useReservation()

const { openOverlay } = useOverlayManager()
const emit = defineEmits(['close'])

const props = defineProps<{
  data?: Reservation;
  branches: Branch[]
  is_create: boolean

  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
  refresh: () => void
}>()

const payload = ref<{
  branch_id: string | null;
  customer: Customer;
  time: Date | null;
  notes: string;
  people: number
}>({
  branch_id: !props.is_create ? props.data?.branch.id! : null,
  customer: !props.is_create ? props.data?.customer! : { name: '', phone: '' },
  time: !props.is_create ? new Date(props.data?.time!) : null,
  notes: !props.is_create ? props.data?.notes! : '',
  people: !props.is_create ? props.data?.people! : 0
})

const formRef = ref()
const isFormValid = ref(false)

const dateMenu = ref(false)
const dateModel = ref<Date | null>(null);
const timeMenu = ref(false)
const timeModel = ref<string>('');
const isUpdatingTime = ref(false)

const minTime = computed(() => {
  const now = new Date()
  const branch = props.branches.find(branch => branch.id === payload.value.branch_id)
  if (branch && payload.value.time?.getDate() === now.getDate()) {
    const openingTime = branch.operational.open_time.split(':').map(Number);
    const openingDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), openingTime[0], openingTime[1]);
    if (now < openingDateTime) {
      const openingHour = branch.operational.open_time.split(':').map(Number)[0];
      if (now.getHours() <= openingHour - 3) {
        // Return opening time if user is still 3 hours or more before opening
        return `${branch.operational.open_time}`;
      }
    }
    else {
      // Return 2 hours from now otherwise
      return `${String(now.getHours() + 2).padStart(2, '0')}:00`;
    }
  }
  return `${branch?.operational.open_time}`;
})

// max is 2 hours before closing
const maxTime = computed(() => {
  const now = new Date()
  const branch = props.branches.find(branch => branch.id === payload.value.branch_id)
  if (!branch) return ''
  const closingTime = branch.operational.close_time.split(':').map(Number);
  // If closing time is 00:00, set maxTime to 22:00
  if (closingTime[0] === 0 && closingTime[1] === 0) {
    return '22:00'
  }
  const closingDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), closingTime[0], closingTime[1]);
  return `${(closingDateTime.getHours()) - 2}:00`
})

const formatedDateTime = computed(() => {
  if (!payload.value.time) return ''
  return formatDate(payload.value.time).slice(0, -12)
})
const formatedClockTime = computed(() => {
  if (!payload.value.time) return ''
  return formatDate(payload.value.time).slice(-5)
})

const rules = {
  required: [(v: string) => !!v || 'Data tidak boleh kosong'],
  phone: [(v: string) => v.length <= 15 || 'Nomor telepon maksimal 15 digit'],
  positive: [(v: any) => v > 0 || 'Harus lebih dari 0'],
  notes: [(v: string) => v.length <= 100 || 'Catatan maksimal 100 karakter'],
}

const isChanged = computed(() => {
  if (props.is_create) {
    return (
      payload.value.branch_id !== null ||
      payload.value.customer.name !== '' ||
      payload.value.customer.phone !== '' ||
      payload.value.time !== null ||
      payload.value.notes !== '' ||
      payload.value.people !== null
    )
  } else {
    return (
      payload.value.branch_id !== props.data?.branch.id ||
      payload.value.customer.name !== props.data?.customer.name ||
      payload.value.customer.phone !== props.data?.customer.phone ||
      payload.value.time !== props.data?.time ||
      payload.value.notes !== props.data?.notes ||
      payload.value.people !== props.data?.people
    )
  }
})

watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})

function onDatePicked(val: Date | null) {
  if (!val) return;

  if (!payload.value.time) payload.value.time = new Date()

  const time = payload.value.time

  payload.value.time = new Date(
    val.getFullYear(),
    val.getMonth(),
    val.getDate(),
    time.getHours(),
    time.getMinutes() 
  )
  dateMenu.value = false
  setTimeout(() => {
    timeMenu.value = true
    isUpdatingTime.value = true
  } , 100)
}


function onTimePicked(val: string) {
  isUpdatingTime.value = true
  if (!payload.value.time) {
    payload.value.time = new Date()
  }

  const oldDate = payload.value.time
  const [hours, minutes] = val.split(':').map(Number) 
  payload.value.time = new Date(
    oldDate.getFullYear(),
    oldDate.getMonth(),
    oldDate.getDate(),
    hours,
    minutes
  )
  
  timeModel.value = ''
  timeMenu.value = false
}

function handleClose() {
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(false)
  }
  emit('close')
}

async function processDelete() {
  try {
    await remove(props.data!.id)
    props.refresh()
    handleClose()
  } catch (error) {
    console.log(error)
  }
}

function handleSubmit() {
  formRef.value?.validate().then(async (res: boolean) => {
    if (!res) return
    const createPayload: CreateReservationPayload = {
      branch_id: payload.value.branch_id!,
      customer: payload.value.customer,
      time: payload.value.time!,
      notes: payload.value.notes,
      people: payload.value.people!
    }
    if (props.is_create) {
      try {
        await create(createPayload)
        props.refresh()
        handleClose()
      } catch (error) {
        console.log(error)
      }
    } else {
      const updatePayload: UpdateReservationPayload = {
        id: props.data!.id,
        ...createPayload
      }
      try {
        await update(updatePayload)
        props.refresh()
        handleClose()
      } catch (error) {
        console.log(error)
      } 
    }
  })
}

watch(() => payload.value.customer.phone, (val) => {
  if (val === null) return;
  // Remove non-digit characters
  let digits = String(val).replace(/\D/g, '');
  // Remove leading zeros
  digits = digits.replace(/^0+/, '');
  // Limit to 13 digits
  if (digits.length > 15) digits = digits.slice(0, 13);
  payload.value.customer.phone = digits;
});
</script>

<template>
  <v-card 
    class="rounded-lg pa-6 mt-8 bg-white" 
    style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;"
  >
    <v-btn
      icon
      class="position-absolute"
      variant="text"
      style="top: 8px; right: 12px;" 
      :disabled="loading"
      @click="handleClose()"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <div class="d-flex align-center">
      <h4 class="text-h4 mt-1"> {{ is_create ? 'Buat Reservasi' : 'Ubah Reservasi' }} </h4>
    </div>
    <i class="text-subtitle-2 text-disabled"> {{ is_create ? '' : props.data?.id }} </i>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="handleSubmit">
      <v-row no-gutters justify="center">
        <v-col cols="6">
          <v-text-field
            v-if="payload.customer"
            v-model="payload.customer.name"
            label="Nama"
            variant="underlined"
            prepend-icon="mdi-account-group"
            :rules="rules.required"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-if="payload.customer"
            v-model="payload.customer.phone"
            label="Nomor Telepon"
            variant="underlined"
            prepend-icon="mdi-phone"
            prefix="+62"
            :rules="[...rules.required, ...rules.phone]"
          />
        </v-col>
        <v-col cols="7">
          <v-autocomplete
            v-model="payload.branch_id"
            label="Cabang"
            :items="props.branches"
            item-title="name"
            item-value="id"
            variant="underlined"
            prepend-icon="mdi-home"
            :rules="rules.required"
            @update:model-value="payload.time = null"
          />
        </v-col>
        <v-col cols="5">
          <v-number-input 
            control-variant="split"
            v-model="payload.people"
            label="Jumlah Orang"
            variant="plain"
            max-width="14rem"
            :rules="rules.positive"
            :min="0"
            :max="20"
            inset
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formatedDateTime"
            label="Tanggal Reservasi"
            prepend-icon="mdi-calendar"
            readonly
            :active="dateMenu"
            :focused="dateMenu"
            :disabled="!payload.branch_id"
            variant="underlined"
            :rules="rules.required"
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
                v-model="dateModel"
                @update:model-value="onDatePicked"
                :min="props.is_create ? new Date().toLocaleDateString() : null"
                no-title
                scrollable
              />
          </v-dialog>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formatedClockTime"
            label="Waktu Reservasi"
            prepend-icon="mdi-clock-outline"
            readonly
            :active="timeMenu"
            :focused="timeMenu"
            :disabled="!payload.branch_id"
            variant="underlined"
            :rules="rules.required"
          >
            <v-dialog
              v-model="timeMenu"
              activator="parent"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290"
              min-width="290"
            >
            <!-- two digit hour in :min -->
              <v-time-picker
                v-model="timeModel"
                format="24hr"
                :max="maxTime"
                :min="minTime"
                @update:model-value="onTimePicked"
              />
            </v-dialog>
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="payload.notes"
            placeholder="Catatan"
            rows="3"
            auto-grow
            prepend-inner-icon="mdi-text-long"
            clear-icon="mdi-close"
            :rules="rules.notes"
            clearable
            counter
          />
        </v-col>
      </v-row>

      <v-divider class="my-3" />
      
      <div>
        <div 
          class="d-flex align-center justify-end mt-1"
          :class="is_create ? 'justify-end' : 'justify-space-between'"
        >
          <!-- delete button -->
          <v-btn
            v-if="!is_create"
            variant="plain"
            class="mr-1 text-error"
            density="compact"
            :loading="loading"
            prepend-icon="mdi-delete"
            @click="
              openOverlay({
                component: Blank,
                props: {
                  confirmToContinue: true,
                  confirmMessage: 'Apakah anda yakin ingin menghapus reservasi ini?',
                  onConfirm: () => {
                    processDelete()
                  }
                }
              })
            "
          >
            Hapus
          </v-btn>

          <span>
            <v-btn
              class="ms-2"
              :color="is_create ? 'success' : 'primary'"
              :loading="loading"
              :disabled="!isFormValid || !isChanged || loading"
              type="submit"
            >
              {{ is_create ? 'Buat' : 'Simpan' }}
            </v-btn>
          </span>
        </div>
      </div>      
    </v-form>
  </v-card>
</template>