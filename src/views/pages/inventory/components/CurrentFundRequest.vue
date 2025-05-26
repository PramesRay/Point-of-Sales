<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import type { CreateFundRequest, FundRequest, UpdateFundRequest } from '@/types/finance';

import { formatRupiah, formatRupiahInput } from '@/utils/helpers/currency'
import { formatDate } from "@/utils/helpers/format-date";
import type { Employee } from '@/types/employee';
import { cloneDeep } from 'lodash';

const emit = defineEmits<{
  (e: 'create-fr', payload: CreateFundRequest): FundRequest
  (e: 'update-fr', payload: UpdateFundRequest): FundRequest
}>();

const props = defineProps<{
  user: Employee;
  data: FundRequest[];
  branch: string;
  loading?: boolean;
}>();

// Computed untuk filter transaksi berdasarkan branch
const filteredData = computed(() => {
  if (props.branch === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx.branch.id === props.branch
  );
});

// Ambil transaksi terbaru
const latestRequest = computed(() => filteredData.value[0]);

// Sisanya untuk list biasa
const listRequest = computed(() => filteredData.value.slice(1));

const selectedRequest = ref<FundRequest | null>(null)
const isNewRequest = ref(false)

const formRef = ref()
const isFormValid = ref(false)

const showOverlay = ref(false)
const pendingOverlayClose = ref(false) // tandai kalau user sedang coba tutup overlay
const showConfirmDialog = ref(false)

const datePickerMenu = ref(false)

// Payload
const fundRequestPayload = ref<{
  subject: string | null;
  notes: string | null;
  amount: number | null;
  amountRaw: string;
  time: Date | null;
  branchId: string | null;
  status: string | null
}>({
  subject: null,
  notes: null,
  amount: null,
  amountRaw: '',
  time: new Date(), // waktu saat ini
  branchId: props.user?.assigned_branch?.length === 1 ? props.user.assigned_branch[0].id : 'branch-1',
  status: null
})

// Form Rules
const requieredRules = [(v: string) => !!v || 'Data tidak boleh kosong']
const amtRules = [
  (v: string) => !!v || 'Jumlah tidak boleh kosong',
  (v: string) => {
    const numeric = Number(v.replace(/\D/g, ''))
    return numeric >= 0 || 'Jumlah tidak boleh kurang dari 0'
  }
]
const descRules = [((v: string) => v.length <= 100 || 'Maks 100 karakter'), ((v: string) => !!v || 'Deskripsi tidak boleh kosong')]

function processFundRequest() {
  if (!fundRequestPayload.value) return

  const payload: CreateFundRequest = {
    subject: fundRequestPayload.value.subject ?? '',
    notes: fundRequestPayload.value.notes ?? '',
    amount: fundRequestPayload.value.amount ?? 0,
    branch_id: fundRequestPayload.value.branchId ?? ''
  }

  if (isNewRequest.value) {
    emit('create-fr', payload)
    console.log('Mengirim ke backend:', payload)
  } else {
    const updatePayload: UpdateFundRequest = {
      id: selectedRequest.value?.id ?? '',
      status: selectedRequest.value?.status ?? 'Pending',
      ...payload
    }
    emit('update-fr', updatePayload)
    console.log('Mengirim ke backend:', updatePayload)
  }
  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processFundRequest()
  })
}

function clearPayload() {
  fundRequestPayload.value = {
    subject: null,
    notes: null,
    amount: null,
    amountRaw: '',
    time: new Date(), // waktu saat ini
    branchId: props.user?.assigned_branch?.length === 1 ? props.user.assigned_branch[0].id : 'branch-1',
    status: null
  }
}

function openAddNew() {
  selectedRequest.value = null
  isNewRequest.value = true
  showOverlay.value = true

  clearPayload()
}

function openDetail(request: FundRequest) {
  selectedRequest.value = cloneDeep(request)
  isNewRequest.value = false
  showOverlay.value = true
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false

  if (selectedRequest.value) {
    fundRequestPayload.value = {
      ...selectedRequest.value,
      subject: selectedRequest.value.subject,
      notes: selectedRequest.value.notes,
      amount: selectedRequest.value.amount,
      amountRaw: formatRupiahInput(selectedRequest.value.amount.toString()),
      branchId: selectedRequest.value.branch.id,
      status: selectedRequest.value.status,
      time: selectedRequest.value.meta?.updated_at ?? null
    }
  }

  if (isNewRequest.value) {
    clearPayload()
  }
}

const isChanged = computed(() => {
  if (!fundRequestPayload.value) return false

  if (isNewRequest.value) {
    return (
      fundRequestPayload.value.subject !== null ||
      fundRequestPayload.value.notes !== null ||
      fundRequestPayload.value.amount !== null
    )
  } else {
    return (
      fundRequestPayload.value.subject !== selectedRequest.value?.subject ||
      fundRequestPayload.value.notes !== selectedRequest.value?.notes ||
      fundRequestPayload.value.amount !== selectedRequest.value?.amount ||
      fundRequestPayload.value.branchId !== selectedRequest.value?.branch.id ||
      fundRequestPayload.value.status !== selectedRequest.value?.status ||
      new Date(fundRequestPayload.value.time!).getTime() !== new Date(selectedRequest.value?.meta?.updated_at!).getTime()
    )
  }
})

watch(selectedRequest, (val) => {
  if (val) {
    fundRequestPayload.value = {
      ...val,
      subject: val.subject,
      notes: val.notes,
      amount: val.amount,
      branchId: val.branch.id,
      status: val.status,
      time: val.meta?.updated_at ?? null,
      amountRaw: formatRupiahInput(val.amount.toString())
    }
  }
}, { immediate: true })

watch(showOverlay, (isOpen, wasOpen) => {
  if (!isOpen && wasOpen) {
    if (pendingOverlayClose.value) {
      pendingOverlayClose.value = false
      return // tidak tampilkan confirm dialog
    }
    if (isChanged.value) {
      showOverlay.value = true
      pendingOverlayClose.value = true
      showConfirmDialog.value = true
    }
  }
})

watch(() => fundRequestPayload.value.amountRaw, (val) => {
  const numeric = val.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  fundRequestPayload.value.amount = numeric ? Number(numeric) : null
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="8">
            <div class="d-flex align-center">
              <h4 class="text-h4 mt-1">Permintaan Dana Terkini</h4>
            </div>
            <div v-if="props.branch !== 'all'">
              <i class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.branch.name }}</i>
            </div> 
          </v-col>
          <v-col cols="4" class="mt-auto text-right">
            <v-btn
              v-if="!loading"
              color="primary"
              @click="openAddNew"
            >
              Tambah
            </v-btn>
          </v-col>
        </v-row>
          
        <div v-if="!props.loading">
          <v-card class="bg-lightsecondary mt-5" @click="openDetail(latestRequest)">
            <div v-if="latestRequest" class="pa-5">
              <span class="text-subtitle-2 text-disabled">
                <span class="text-medium-emphasis" v-if="props.branch === 'all'">{{ latestRequest?.branch.name }}: </span>{{ latestRequest.meta?.updated_at ? formatDate(latestRequest.meta?.updated_at) : '' }}
              </span>
              <div class="d-inline-flex align-center justify-space-between w-100">
                <div>
                  <h6 class="text-secondary text-h4 font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ latestRequest?.subject }}</h6>
                  <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.employee.name }}</span>
                </div>
                <div>
                  <div class="d-flex justify-end">  
                    <span
                      :class="{
                        'text-subtitle-2 text-medium-emphasis text-warning': latestRequest?.status === 'Pending',
                        'text-subtitle-2 text-medium-emphasis text-success': latestRequest?.status === 'Disetujui',
                        'text-subtitle-2 text-medium-emphasis text-error': latestRequest?.status === 'Ditolak'
                      }"
                    >{{ latestRequest?.status }}</span>
                  </div>
                  <h4 class="text-h4">{{ formatRupiah(latestRequest?.amount) }}</h4>
                </div>
              </div>
            </div>
          </v-card>
          <div class="mt-4">
            <perfect-scrollbar :style="{ maxHeight: mdAndUp? '30rem' : '12rem'}">
              <v-list v-if="listRequest.length > 0" class="py-0">
                <v-list-item 
                  v-for="(listRequest, i) in listRequest" 
                  :key="i" 
                  :value="listRequest" 
                  color="secondary" 
                  rounded="sm"
                  @click="openDetail(listRequest)"
                >
                  <span class="text-subtitle-2 text-disabled">
                    <span class="text-medium-emphasis" v-if="props.branch === 'all'">{{ listRequest?.branch.name }}: </span>{{ listRequest.meta?.updated_at ? formatDate(listRequest.meta?.updated_at) : '' }}
                  </span>
                  <div class="d-inline-flex align-center justify-space-between w-100">
                    <div>
                      <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                        {{ listRequest?.subject }}
                      </h6>
                      <span class="text-subtitle-2 text-medium-emphasis">{{ listRequest?.employee.name }}</span>
                    </div>
                    <div>
                      <div class="d-flex justify-end">
                        <span v-if="listRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ listRequest?.status }}</span>
                        <span v-else-if="listRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ listRequest?.status }}</span>
                        <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ listRequest?.status }}</span>
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ formatRupiah(listRequest?.amount) }}</div>
                    </div>
                  </div>
                  <v-divider class="my-3" />
                </v-list-item>
              </v-list>
            </perfect-scrollbar>

            <div class="text-center mt-3">
              <v-btn color="primary" variant="text" href="/fundRequests"
                >View All
                <template v-slot:append>
                  <ChevronRightIcon stroke-width="1.5" width="20" />
                </template>
              </v-btn>
            </div>
          </div>
        </div>
        <div v-else class="ml-auto">
          <!-- Skeleton Loading -->
          <v-skeleton-loader
            type="list-item-two-line"
            :loading="props.loading"
          ></v-skeleton-loader>
        </div>
      </v-card-text>
    </v-card>
  </v-card>

  <v-overlay
    v-model="showOverlay"
    fullscreen
    scroll-strategy="none"
    class="d-flex justify-center align-center"
    max-width="400"
  >
    <v-card
      :class="!isNewRequest || selectedRequest === latestRequest ? 'bg-white' : 'bg-lightsecondary'"
      class="rounded-lg pa-6 mt-8"
      style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;"
    >
      <v-form ref="formRef" v-model="isFormValid">
        <!-- Close button -->
        <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="showOverlay = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="d-flex align-center">
          <h4 class="text-h4 mt-1">Buat Permintaan Dana</h4>
        </div>
        <v-divider class="my-3" />

        <div>
          <v-row>
            <v-col cols="6" v-if="!isNewRequest">
              <v-menu
              v-model="datePickerMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ props }">
                <v-text-field
                  :model-value="fundRequestPayload.time ? formatDate(new Date(fundRequestPayload.time)) : ''"
                  v-bind="props"
                  label="Tanggal Permintaan"
                  variant="underlined"
                  prepend-icon="mdi-calendar"
                  :readonly="true"
                  :rules="requieredRules"
                  hide-details
                />
              </template>
              <v-date-picker
                v-model="fundRequestPayload.time"
                @update:model-value="datePickerMenu = false"
              />
            </v-menu>
            </v-col>
            <v-col cols="12" v-if="isNewRequest">
              <v-select
                variant="underlined"
                v-model="fundRequestPayload.branchId"
                label="Cabang"
                :items="props.user.assigned_branch"
                item-title="name"
                item-value="id"
                :rules="requieredRules"
                prepend-icon="mdi-home"
                :disabled="props.user.assigned_branch.length === 1"
                hide-details
              />
            </v-col>
            <v-col cols="6" v-else>
              <v-select
                variant="underlined"
                v-model="fundRequestPayload.branchId"
                label="Cabang"
                :items="[selectedRequest?.branch]"
                item-title="name"
                item-value="id"
                :rules="requieredRules"
                prepend-icon="mdi-home"
                :disabled="props.user.assigned_branch.length === 1"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field 
                v-model="fundRequestPayload.amountRaw" 
                control-variant="hidden"
                variant="underlined"
                :min="0"
                :rules="amtRules"
                prepend-icon="mdi-cash-multiple"
                label="Jumlah Dana"
                prefix="Rp"
                @input="fundRequestPayload.amountRaw = formatRupiahInput(fundRequestPayload.amountRaw)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="fundRequestPayload.subject"
                label="Judul Permintaan"
                variant="underlined"
                prepend-icon="mdi-form-textbox"
                :rules="requieredRules"
              />
            </v-col>
          </v-row>

          <div>
            <v-textarea
              variant="underlined"
              v-model="fundRequestPayload.notes"
              :rules="descRules"
              label="Deskripsi"
              rows="3"
              auto-grow
              prepend-icon="mdi-text-long"
              clear-icon="mdi-close"
              clearable
              counter
            />
          </div>
        </div>

        <v-divider class="my-3" />
      
        <!-- Tombol proses -->
        <div class="d-flex justify-end mt-1">
          <v-btn
            color="primary"
            :disabled="!isFormValid || !isChanged"
            @click="submitForm"
          >
            Simpan
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-overlay>
  
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