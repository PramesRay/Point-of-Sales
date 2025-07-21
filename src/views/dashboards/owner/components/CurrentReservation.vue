<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
const { mdAndUp } = useDisplay()

import type { IdName } from '@/types/common';
import type { CreateReservationPayload, Reservation, UpdateReservationPayload } from '@/types/reservation';

import { formatDate } from '@/utils/helpers/format-date'
import type { Customer } from '@/types/customer';
import { cloneDeep } from 'lodash';
import { watch } from 'vue';
import type { Branch } from '@/types/branch';

const emit = defineEmits<{
  (e: 'create-reservation', payload: CreateReservationPayload): Reservation
  (e: 'update-reservation', payload: UpdateReservationPayload): Reservation
}>();

const props = defineProps<{
  data: Reservation[];
  branch: IdName | undefined;
  branch_option: IdName[]
  loading: boolean;
}>();

// branch option tanpa semua cabang
const branchOptions = computed(() => {
  return props.branch_option.filter(branch => branch.id !== '')
})

// Data yang digunakan untuk tampilan
const currentData = computed(() => {
  if (!props.branch || props.branch.id === '') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx.branch.id === props.branch?.id
  );
})
const latestReservation = computed(() => currentData.value[0])
const listReservation = computed(() => currentData.value.slice(1))

const selectedReservation = ref<Reservation | null>(null)
const isNewReservation = ref(false)
const dateMenu = ref(false)
const dateModel = ref<Date | null>(null);
const timeMenu = ref(false)
const timeModel = ref<string>('');
const isUpdatingTime = ref(false)

const formRef = ref()
const isFormValid = ref(false)

const showOverlay = ref(false)
const pendingOverlayClose = ref(false) // tandai kalau user sedang coba tutup overlay
const showConfirmDialog = ref(false)

// payload
const reservationPayload = ref<{
  branch_id: string | null;
  customer: Customer;
  time: Date | null;
  status: string | null;
  notes: string;
  people: number | null
}>({
  branch_id: null,
  customer: {
    name: '',
    phone: ''
  },
  time: null,
  status: null,
  notes: '',
  people: null
})
function clearPayload() {
  reservationPayload.value = {
    branch_id: null,
    customer: {
      name: '',
      phone: ''
    },
    time: null,
    status: null,
    notes: '',
    people: null
  }
  dateModel.value = null
  timeModel.value = ''
}

// form rules
const rules = {
  required: [(v: string) => !!v || 'Data tidak boleh kosong'],
  phone: [(v: string) => v.length <= 15 || 'Nomor telepon maksimal 15 digit'],
  people: [(v: number) => v >= 4 || 'Jumlah minimal 4 orang', (v: number) => v <= 20 || 'Jumlah maksimal 20 orang'],
  notes: [(v: string) => v.length <= 100 || 'Catatan maksimal 100 karakter'],
}

function openAddNew() {
  isNewReservation.value = true
  showOverlay.value = true

  clearPayload()
}

function openDetail(reservation: Reservation) {
  selectedReservation.value = cloneDeep(reservation)
  isNewReservation.value = false
  showOverlay.value = true
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false

  if (selectedReservation.value) {
    reservationPayload.value = {
      ...selectedReservation.value,
      branch_id: selectedReservation.value.branch.id,
      customer: selectedReservation.value.customer,
      time: new Date(selectedReservation.value.time),
      status: selectedReservation.value.status,
      notes: selectedReservation.value.notes,
      people: selectedReservation.value.people
    }
  }

  if (isNewReservation.value) {
    clearPayload()
  }
}

function processReservation() {
  if (!reservationPayload.value) return

  const paylaod: CreateReservationPayload = {
    branch_id: reservationPayload.value.branch_id ?? '',
    customer: reservationPayload.value.customer ?? { name: '', phone: '' },
    time: new Date(reservationPayload.value.time ?? ''),
    notes: reservationPayload.value.notes ?? '',
    people: reservationPayload.value.people ?? 0, 
  }

  if (isNewReservation.value) {
    emit('create-reservation', paylaod)
    console.log('create-reservation', paylaod) 
  } else {
    const updatePayload: UpdateReservationPayload = {
      id: selectedReservation.value?.id ?? '',
      status: selectedReservation.value?.status ?? 'Pending',
      ...paylaod
    }
    emit('update-reservation', updatePayload)
    console.log('update-reservation', updatePayload)
  }

  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processReservation()
  })
}

const isChanged = computed(() => {
  if (!reservationPayload.value) return false

  if (isNewReservation.value) {
    return (
      reservationPayload.value.branch_id !== null ||
      reservationPayload.value.customer.name !== '' ||
      reservationPayload.value.customer.phone !== '' ||
      reservationPayload.value.time !== null ||
      reservationPayload.value.status !== null ||
      reservationPayload.value.notes !== '' ||
      reservationPayload.value.people !== null
    )
  } else {
    return (
      reservationPayload.value.branch_id !== selectedReservation.value?.branch.id ||
      reservationPayload.value.customer !== selectedReservation.value?.customer ||
      reservationPayload.value.time?.getTime() !== selectedReservation.value?.time.getTime() ||
      reservationPayload.value.status !== selectedReservation.value?.status ||
      reservationPayload.value.notes !== selectedReservation.value?.notes ||
      reservationPayload.value.people !== selectedReservation.value?.people
    )
  }
})

// Format untuk tampilan tanggal di input (format Indonesia)
const formattedDateText = computed(() => {
  if (!dateModel.value) return ''
  return formatDate(dateModel.value).slice(0, -11)
})

// Handler saat pilih tanggal
function onDatePicked(val: Date | null) {
  if (!val) return;

  if (!reservationPayload.value.time) reservationPayload.value.time = new Date()

  const time = reservationPayload.value.time

  reservationPayload.value.time = new Date(
    val.getFullYear(),
    val.getMonth(),
    val.getDate(),
    time.getHours(),
    time.getMinutes(),
    0
  )

  dateMenu.value = false
  setTimeout(() => {
    timeMenu.value = true
    isUpdatingTime.value = true
  } , 100)
}


function onTimePicked(val: string) {
  isUpdatingTime.value = true
  if (!reservationPayload.value.time) {
    reservationPayload.value.time = new Date()
  }

  const oldDate = reservationPayload.value.time
  const [hours, minutes] = val.split(':').map(Number) 
  reservationPayload.value.time = new Date(
    oldDate.getFullYear(),
    oldDate.getMonth(),
    oldDate.getDate(),
    hours,
    minutes,
    0
  )

  console.log('minutes', minutes)
  console.log('timeModel', timeModel.value)
  console.log('val', val)
  console.log('reservationPayload', reservationPayload.value.time)
  if (isNewReservation.value && val.slice(3, 5) !== String(oldDate.getMinutes()).padStart(2, '0')){
    timeMenu.value = false
    isUpdatingTime.value = false 
  } else if (!isNewReservation && (isUpdatingTime.value && val.slice(3, 5) !== String(selectedReservation.value?.time.getMinutes()).padStart(2, '0'))){
    timeMenu.value = false
    isUpdatingTime.value = false
    if (selectedReservation.value) {
      selectedReservation.value.time = reservationPayload.value.time 
    }
    console.log('isUpdatingTime function', isUpdatingTime.value)
  }
}

const minTime = computed(() => {
  const now = new Date()
  if(reservationPayload.value.time?.getDate() === now.getDate()) {
    if(now.getHours() < 17) {
      return '17:00'
    } else {
      return (now.getHours()+2) + ':00'
    }
  } else {
    return '17:00'
  }
})

watch(() => reservationPayload.value.time, (newTime, oldTime) => {
  if (!newTime) {
    timeModel.value = ''
    dateModel.value = null
    return
  }

  dateModel.value = newTime
  const hours = newTime.getHours().toString().padStart(2, '0')
  const minutes = newTime.getMinutes().toString().padStart(2, '0')
  timeModel.value = `${hours}:${minutes}`

  if (!isUpdatingTime.value) return

  if (newTime.getMinutes() !== oldTime?.getMinutes()){
    isUpdatingTime.value = true
    onTimePicked(timeModel.value)
    console.log('isUpdatingTime watcher', isUpdatingTime.value)
  }
   
}, { immediate: true })

watch(selectedReservation, (val) => {
  if (val) {
    reservationPayload.value = {
      ...val,
      branch_id: val.branch.id,
      customer: val.customer,
      time: new Date(val.time),
      status: val.status,
      notes: val.notes,
      people: val.people
    }
    dateModel.value = new Date(val.time.getDate())
    timeModel.value = `${val.time.getHours()}:${val.time.getMinutes()}`
  }
}, { immediate: true })



watch(showOverlay, (isOpen, wasOpen) => {
  // Ketika overlay akan ditutup (false) dari keadaan terbuka (true)
  if (!isOpen && wasOpen) {
    if (pendingOverlayClose.value) {
      pendingOverlayClose.value = false
      return // tidak tampilkan confirm dialog
    }
    if (isChanged.value) {
      showOverlay.value = true
      pendingOverlayClose.value = true
      showConfirmDialog.value = true
      console.log('showConfirmDialog', showConfirmDialog.value)
    }
  }
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="7">
            <div>
              <h4 class="text-h4 mt-1">Daftar Reservasi</h4>
            </div>
            <div class="text-subtitle-2 text-medium-emphasis"
              v-if="props.branch?.id !== 'all'"
              >{{ props.branch?.name }}
            </div>
          </v-col>
          <v-col cols="5" class="mt-auto text-right">
            <v-btn
              v-if="!props.loading"
              color="primary"
              @click="openAddNew"
            >
              Tambah
            </v-btn>
          </v-col>
        </v-row>

        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-if="props.loading">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>

        <v-card v-if="!props.loading" class="bg-lightsecondary mt-5" @click="openDetail(latestReservation)">
          <div class="pa-5">
            <div class="d-inline-flex align-center justify-space-between w-100">
              <div>
                <span class="text-subtitle-2 text-medium-emphasis">{{ formatDate(latestReservation?.time).slice(0, -12) }}: {{ formatDate(latestReservation?.time).slice(-6) }}</span>
                <h6 class="text-secondary text-h4 font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ latestReservation?.customer.name }}</h6>
                <span class="text-subtitle-2 text-medium-emphasis">{{ latestReservation?.customer.phone }}</span>
              </div>
              <div>
                <div class="d-flex justify-end">  
                  <span v-if="latestReservation?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ latestReservation?.status }}</span>
                  <span v-else-if="latestReservation?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ latestReservation?.status }}</span>
                  <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ latestReservation?.status }}</span>
                </div>
                <h4 class="text-h4">{{ latestReservation?.people }} Orang</h4>
              </div>
            </div>
          </div>
        </v-card>
        <div v-if="!props.loading" class="mt-4">
          <perfect-scrollbar :style="{ maxHeight: '15rem'}">
            <v-list lines="two" class="py-0">
              <v-list-item 
                v-for="(listReservation, i) in listReservation" 
                :key="i" 
                :value="listReservation" 
                color="secondary" 
                rounded="sm" 
                @click="openDetail(listReservation)"
              >
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ formatDate(listReservation?.time).slice(0, -12) }}: {{ formatDate(listReservation?.time).slice(-6) }}</span>
                    <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                      {{ listReservation?.customer.name }}
                    </h6>
                    <span class="text-subtitle-2 text-medium-emphasis">{{ listReservation?.customer.phone }}</span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">
                      <span v-if="listReservation?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ listReservation?.status }}</span>
                      <span v-else-if="listReservation?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ listReservation?.status }}</span>
                      <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ listReservation?.status }}</span>
                    </div>
                    <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ listReservation?.people }} Orang</div>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>

          <div class="text-center mt-3">
            <v-btn color="primary" variant="text" href="/reservations"
              >View All
              <template v-slot:append>
                <ChevronRightIcon stroke-width="1.5" width="20" />
              </template>
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-card>

  <v-overlay
    v-model="showOverlay"
    fullscreen
    scroll-strategy="none"
    class="d-flex justify-center align-center"
  >
    <v-card
      :class=" selectedReservation?.id == latestReservation.id ? 'bg-lightsecondary' : 'bg-white' "
      class="pa-5 rounded-lg"
      style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;"
    >
    <v-form ref="formRef" v-model="isFormValid">
    <v-card-title class="text-h4">{{ isNewReservation ? 'Buat Reservasi' : 'Detail Reservasi'}}</v-card-title>
      
      <v-divider class="my-3"></v-divider>

      <v-card-text class="pa-0">  
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="reservationPayload.branch_id"
                label="Cabang"
                :items="branchOptions"
                item-title="name"
                item-value="id"
                variant="underlined"
                prepend-icon="mdi-home"
                :rules="rules.required"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-number-input 
                control-variant="split"
                v-model="reservationPayload.people"
                label="Jumlah Orang"
                variant="plain"
                max-width="14rem"
                prepend-icon="mdi-account-group"
                :rules="rules.people"
                :min="4"
                :max="20"
                inset
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-if="reservationPayload.customer"
                v-model="reservationPayload.customer.name"
                label="Nama"
                variant="underlined"
                prepend-icon="mdi-account"
                :rules="rules.required"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                type="number"
                hide-spin-buttons
                v-if="reservationPayload.customer"
                v-model="reservationPayload.customer.phone"
                label="Nomor Telepon"
                variant="underlined"
                prepend-icon="mdi-phone"
                :rules="rules.required || rules.phone"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formattedDateText"
                label="Tanggal Reservasi"
                prepend-icon="mdi-calendar"
                readonly
                :active="dateMenu"
                :focused="dateMenu"
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
                    :min="isNewReservation ? new Date().toLocaleDateString() : null"
                    no-title
                    scrollable
                  />
              </v-dialog>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="timeModel"
                label="Waktu Reservasi"
                prepend-icon="mdi-clock-outline"
                readonly
                :active="timeMenu"
                :focused="timeMenu"
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
                    max="22:59"
                    :min="minTime"
                    @update:model-value="onTimePicked"
                  />
                </v-dialog>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="reservationPayload.notes"
                label="Catatan"
                rows="3"
                class="small-font"
                auto-grow
                prepend-inner-icon="mdi-text-long"
                clear-icon="mdi-close"
                :rules="rules.notes"
                clearable
                counter
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider class="my-3"></v-divider>
        
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showOverlay = false">Batal</v-btn>
          <v-btn 
            :class="{
              'bg-success': isNewReservation,
              'bg-primary': !isNewReservation
            }"
            @click="submitForm"
            :disabled="isNewReservation? !isFormValid : !isChanged"
          >{{isNewReservation ? 'Buat' : 'Simpan'}}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-overlay>

  <!-- confirm dialog -->
  <v-dialog v-model="showConfirmDialog" persistent max-width="400">
    <v-card class="pa-3">
      <v-card-title class="text-h3">Batalkan Perubahan?</v-card-title>
      <v-card-text class="text-subtitle-1 text-medium-emphasis">
        Perubahan belum disimpan. Apakah Anda yakin ingin menutup tanpa menyimpan?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="showConfirmDialog = false, pendingOverlayClose = false">Kembali</v-btn>
        <v-btn variant="elevated" color="error" @click="confirmCancel">Ya, Tutup</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.small-font .v-field__input {
  font-size: 0.8rem !important;
}
</style>