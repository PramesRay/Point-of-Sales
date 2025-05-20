<script setup lang="ts">
import type { Branch } from '@/types/branch';
import type { FundRequest } from '@/types/finance';
import { formatRupiah, formatRupiahInput } from '@/utils/helpers/currency'
import { formatDate } from "@/utils/helpers/format-date";
import { ref, computed, watch } from 'vue'

const props = defineProps<{
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
    (tx) => tx.branchId === props.branch
  );
});

// Ambil transaksi terbaru
const latestRequest = computed(() => filteredData.value[0]);

// Sisanya untuk list biasa
const listRequest = computed(() => filteredData.value.slice(1));

const formRef = ref()
const isFormValid = ref(false)
const datePickerMenu = ref(false)
const showOverlay = ref(false)
const pendingOverlayClose = ref(false) // tandai kalau user sedang coba tutup overlay
const showConfirmDialog = ref(false)
const currencyValue = ref('');
const user = JSON.parse(localStorage.getItem('user') || '{}')
const branches = ref<Branch[]>(user?.branches ?? [{ id: 'branch-1', name: 'Restoran 1' }])


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

// Payload
const createFundRequest = ref<{
  subject: string | null;
  description: string | null;
  amount: number | null;
  amountRaw: string;
  employee: string | null;
  time: Date | null;
  branchId: string | null;
}>({
  subject: null,
  description: null,
  amount: null,
  amountRaw: '',
  employee: user.employee ?? 'Dummy Employee', // ambil dari storage
  time: new Date(), // waktu saat ini
  branchId: user?.branches?.length === 1 ? user.branches[0].id : 'branch-1' // ambil dari storage
})


function processCreateMovement() {
  if (!createFundRequest.value) return

  const payload = {
    subject: createFundRequest.value.subject,
    description: createFundRequest.value.description,
    amount: createFundRequest.value.amount,
    time: createFundRequest.value.time ? new Date(createFundRequest.value.time).toISOString() : null,
    branchId: createFundRequest.value.branchId,
    employee: createFundRequest.value.employee
  }

  console.log('Mengirim ke backend:', payload)

  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processCreateMovement()
  })
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false

  if (createFundRequest.value) {
    createFundRequest.value = {
      subject: null,
      description: null,
      amount: null,
      amountRaw: '',
      employee: user.employee ?? 'Dummy Employee', // ambil dari storage
      time: new Date(), // waktu saat ini
      branchId: user?.branches?.length === 1 ? user.branches[0].id : 'branch-1' // ambil dari storage
    }
  }
}

const isChanged = computed(() => {
  if (!createFundRequest.value) return false

  return (
    createFundRequest.value.subject !== null ||
    createFundRequest.value.description !== null ||
    createFundRequest.value.amount !== null ||
    createFundRequest.value.employee !== null ||
    createFundRequest.value.time !== null ||
    createFundRequest.value.branchId !== null
  )
})

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

watch(() => createFundRequest.value.amountRaw, (val) => {
  const numeric = val.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  createFundRequest.value.amount = numeric ? Number(numeric) : null
})

</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row >
          <v-col cols="8">
            <div class="d-flex align-center">
              <h4 class="text-h4 mt-1">Permintaan Dana Terkini</h4>
            </div>
            <div v-if="props.branch !== 'all'">
              <i class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.branchName }}</i>
            </div> 
          </v-col>
          <v-col cols="4" sm="3" class="mt-auto">
            <v-btn
              v-if="!loading"
              color="primary"
              @click="showOverlay = true"
            >
              Tambah
            </v-btn>
          </v-col>
        </v-row>
          
        <div v-if="!props.loading">
          <v-card class="bg-lightsecondary mt-5">
            <div v-if="latestRequest" class="pa-5">
              <span class="text-subtitle-2 text-medium-emphasis">
                <span v-if="props.branch === 'all'">{{ latestRequest?.branchName }}: </span>{{ formatDate(latestRequest?.date) }}
              </span>
              <div class="d-inline-flex align-center justify-space-between w-100">
                <div>
                  <h6 class="text-secondary text-h4 font-weight-bold" style="max-width: 150px; overflow: hidden;">{{ latestRequest?.request }}</h6>
                  <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.name }}</span>
                </div>
                <div>
                  <div class="d-flex justify-end">  
                    <span v-if="latestRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ latestRequest?.status }}</span>
                    <span v-else-if="latestRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ latestRequest?.status }}</span>
                    <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ latestRequest?.status }}</span>
                  </div>
                  <h4 class="text-h4">{{ formatRupiah(latestRequest?.price) }}</h4>
                </div>
              </div>
            </div>
          </v-card>
          <div class="mt-4">
            <perfect-scrollbar v-bind:style="{ height: '180px' }">
              <v-list v-if="listRequest.length > 0" class="py-0">
                <v-list-item v-for="(listRequest, i) in listRequest" :key="i" :value="listRequest" color="secondary" rounded="sm">
                  <span class="text-subtitle-2 text-medium-emphasis">
                    <span v-if="props.branch === 'all'">{{ listRequest?.branchName }}: </span>{{ formatDate(listRequest?.date) }}
                  </span>
                  <div class="d-inline-flex align-center justify-space-between w-100">
                    <div>
                      <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                        {{ listRequest?.request }}
                      </h6>
                      <span class="text-subtitle-2 text-medium-emphasis">{{ listRequest?.name }}</span>
                    </div>
                    <div>
                      <div class="d-flex justify-end">
                        <span v-if="listRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ listRequest?.status }}</span>
                        <span v-else-if="listRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ listRequest?.status }}</span>
                        <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ listRequest?.status }}</span>
                      </div>
                      <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ formatRupiah(listRequest?.price) }}</div>
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
    class="d-flex justify-center align-start"
  >
    <v-card
      class="rounded-lg pa-6 mt-8 bg-white "
      style="width: 90vw; max-width: 90vw;"
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
            <v-col cols="12">
              <v-text-field
                :model-value="createFundRequest.time ? formatDate(new Date(createFundRequest.time)) : ''"
                v-bind="props"
                label="Tanggal Permintaan"
                variant="underlined"
                prepend-icon="mdi-calendar"
                :readonly="true"
                :rules="requieredRules"
                disabled
                hide-details
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                variant="underlined"
                v-model="createFundRequest.employee"
                label="Pegawai"
                :rules="requieredRules"
                prepend-icon="mdi-human-male"
                disabled
                hide-details
              />
            </v-col>
            <v-col cols="6">
              <v-select
                variant="underlined"
                v-model="createFundRequest.branchId"
                label="Cabang"
                :items="branches"
                :rules="requieredRules"
                item-title="name"
                item-value="id"
                prepend-icon="mdi-home"
                disabled
                hide-details
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field 
                v-model="createFundRequest.amountRaw" 
                control-variant="hidden"
                variant="underlined"
                :min="0"
                :rules="amtRules"
                prepend-icon="mdi-cash-multiple"
                label="Jumlah Dana"
                prefix="Rp"
                @input="createFundRequest.amountRaw = formatRupiahInput(createFundRequest.amountRaw)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="createFundRequest.subject"
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
              v-model="createFundRequest.description"
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