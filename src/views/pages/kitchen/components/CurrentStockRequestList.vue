<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp, smAndDown } = useDisplay()

import { getTimeDiff } from "@/utils/helpers/time";

import type { CreateStockRequestPayload, StockRequestList } from '@/types/inventory';
import type { Branch } from '@/types/branch';

import { useInventoryItems } from "@/composables/useInventoryItems";
import type { Employee } from '@/types/employee';
const { init: initItems, data: inventoryItem, categories, loading: li } = useInventoryItems();

onMounted(() => {
  initItems();
});

const emit = defineEmits<{
  (e: 'create-request', payload: any): void
}>();

const props = defineProps<{
  user: Employee;
  data: StockRequestList[];
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

const filteredInventoryItem = computed(() => {
  if (!inventoryItem.value) {
    return []
  } else {
    return inventoryItem.value.filter((item) => item.quantity! > item.threshold!)
  }
})

// Ambil permintaan terbaru
const latestRequest = computed(() => filteredData.value[0]);

// Sisanya untuk list biasa
const listRequest = computed(() => filteredData.value.slice(1));

const formRef = ref()
const isFormValid = ref(false)

const showOverlay = ref(false)
const showAddOverlay = ref(false)
const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false)
const isManuallySaving = ref(false)

const selectedRequest = ref<StockRequestList | null>(null)
const approvalItems = ref<any[]>([])
const approvalNote = ref('')

const noteRules = [(v: string) => v.length <= 100 || 'Maks 100 karakter']

const newRequest = ref<CreateStockRequestPayload>({
  branch_id: props.user?.assigned_branch?.length === 1 ? props.user.assigned_branch[0].id : 'branch-1',
  items: [],
  note: '',
})

function openAddRequest() {
  showAddOverlay.value = true
  // Inisialisasi data form kosong/standar
  newRequest.value = {
    branch_id: props.user?.assigned_branch?.length === 1 ? props.user.assigned_branch[0].id : 'branch-1', // ambil dari storage
    items: [],
    note: '',
  }
}

function addItem() {
  if (!newRequest.value.items) newRequest.value.items = []
  newRequest.value.items.push({
      id: null,
      name: null,
      quantity: 1,
      unit: null
  })
}

function removeItem(index: number) {
  if (newRequest.value.items && newRequest.value.items.length > index) {
    newRequest.value.items.splice(index, 1)
  }
}

const isChanged = computed(() => {
  if (!newRequest.value) return false

  return (
    newRequest.value.branch_id !== props.user.assigned_branch[0].id ||
    newRequest.value.items.length > 0
  )
})

function openDetail(request: StockRequestList) {
  selectedRequest.value = request
  showOverlay.value = true
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false
  showAddOverlay.value = false

  if (selectedRequest.value) {
    selectedRequest.value = null
    approvalItems.value = []
    approvalNote.value = ''
  }
}

// fungsi simulasi kirim data ke backend
function createRequest() {
  const payload = {
    branch_id: newRequest.value.branch_id,
    items: newRequest.value.items,
    note: newRequest.value.note
  }

  emit('create-request', payload)
  
  isManuallySaving.value = true
  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    createRequest()
  })
}

function updateItem(index: number) {
  if (newRequest.value.items[index].id) {
    const item = filteredInventoryItem.value.find(item => item.id === newRequest.value.items[index].id)
    if (item) {
      newRequest.value.items[index].name = item.name
      newRequest.value.items[index].unit = item.unit
    }
  }
}

// saat overlay terbuka, clone item untuk keperluan approval
watch(selectedRequest, (val) => {
  if (val) {
    approvalItems.value = val.items.map(items => ({
      ...items.item,
      approved: null
    }))
    approvalNote.value = ''
  } 
})

watch(showAddOverlay, (isOpen, wasOpen) => {
  // Ketika overlay akan ditutup (false) dari keadaan terbuka (true)
  if (!isOpen && wasOpen) {
    if (isManuallySaving.value) {
      // Reset dan biarkan overlay benar-benar tertutup
      isManuallySaving.value = false
      return
    }
    
    if (pendingOverlayClose.value) {
      // Jika user sudah setuju menutup lewat konfirmasi
      pendingOverlayClose.value = false
      return
    }

    // Jika ada perubahan tapi belum dikonfirmasi, batalkan penutupan overlay dan tampilkan dialog
    if (isChanged.value) {
      showAddOverlay.value = true
      pendingOverlayClose.value = true
      showConfirmDialog.value = true
    } 
  }
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
          <v-row class="justify-space-between">
            <v-col cols="8">
              <div class="d-flex align-center">
                <h4 class="text-h4 mt-1">Permintaan Stok Terkini</h4>
              </div>
              <div v-if="props.branch !== 'all'">
                <i class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.branch.name }}</i>
              </div> 
            </v-col>
            <v-col cols="4" sm="3" class="mt-auto">
              <v-btn
                v-if="!loading"
                color="primary"
                @click="openAddRequest"
              >
                Tambah
              </v-btn>
            </v-col>
          </v-row>

          <div v-if="!props.loading">
            <v-card class="bg-lightsecondary mt-5"
              @click="openDetail(latestRequest)"
            >
              <div v-if="latestRequest" class="pa-5">
                <span class="text-subtitle-2 text-medium-emphasis">
                  <span v-if="props.branch === 'all'">{{ latestRequest?.branch.name }}: </span>{{ latestRequest?.items.length }} item
                </span>
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <h6 class="text-secondary text-h4 font-weight-bold">
                      {{ latestRequest?.employee.name }}
                    </h6>
                    <span class="text-subtitle-2 text-medium-emphasis">
                      Lihat Detail
                    </span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">  
                      <span v-if="latestRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ latestRequest?.status }}</span>
                      <span v-else-if="latestRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ latestRequest?.status }}</span>
                      <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ latestRequest?.status }}</span>
                    </div>
                    <h4 class="text-h4 text-right">{{ getTimeDiff(latestRequest.time.created_at) }}</h4>
                    <i v-if="latestRequest.time.updated_at !== null" class="text-subtitle-2 text-disabled">
                      Diubah {{ getTimeDiff(latestRequest.time.updated_at) }}
                    </i>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4">
              <perfect-scrollbar :style="{ maxHeight: mdAndUp? '20rem' : '12rem'}">
                <v-list v-if="listRequest.length > 0" class="py-0">
                  <v-list-item v-for="(listRequest, i) in listRequest" :key="i" :value="listRequest" color="secondary" rounded="sm" @click="openDetail(listRequest)">
                    <span class="text-subtitle-2 text-medium-emphasis">
                      <span v-if="props.branch === 'all'">{{ listRequest.branch.name }}: </span>{{ listRequest.items.length }} item
                    </span>
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                          {{ listRequest?.employee.name }}
                        </h6>
                        <span class="text-subtitle-2 text-medium-emphasis">
                          Lihat Detail
                        </span>
                      </div>
                      <div>
                        <div class="d-flex justify-end">
                          <span v-if="listRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ listRequest?.status }}</span>
                          <span v-else-if="listRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ listRequest?.status }}</span>
                          <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ listRequest?.status }}</span>
                        </div>
                        <div class="text-subtitle-1 text-medium-emphasis font-weight-bold text-right">{{ getTimeDiff(listRequest.time.created_at) }}</div>
                        <i v-if="listRequest.time.updated_at" class="text-subtitle-2 text-disabled">
                          Diubah {{ getTimeDiff(listRequest.time.updated_at) }}
                        </i>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </perfect-scrollbar>

              <div class="text-center mt-3">
                <v-btn color="primary" variant="text" href="/StockRequestList"
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

  <!-- Overlay Detail -->
  <v-overlay
    v-model="showOverlay"
    fullscreen
    scroll-strategy="none"
    class="d-flex justify-center align-center"
  >
    <v-card
      :class="selectedRequest === latestRequest ? 'bg-lightsecondary' : 'bg-white'"
      class="rounded-lg pa-6 heigh-screen"
      style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 90vh;"
    >
      <!-- Close button -->
      <v-btn
        icon
        variant="text"
        style="position:absolute; top:8px; right:12px;" 
        @click="showOverlay = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div >
        <h4 class="text-h4">Detil Permintaan Stok</h4>
        <i class="text-subtitle-2 text-disabled">Request Id: {{ selectedRequest?.id }}</i>
      </div>
        <div class="py-5">
          <span class="text-subtitle-2 text-medium-emphasis">
            <span v-if="props.branch === 'all'">{{ selectedRequest?.branch.name }}</span>
          </span>
          <div class="d-inline-flex align-center justify-space-between w-100">
            <div>
              <h6 class="text-secondary text-h4 font-weight-bold">
                {{ selectedRequest?.employee.name }}
              </h6>
              <span class="text-subtitle-2 text-medium-emphasis">
                {{ selectedRequest?.items.length }} item
              </span>
            </div>
            <div>
              <div class="d-flex justify-end">  
                <span 
                  class="text-subtitle-2 text-medium-emphasis"
                  :class="{
                    'text-warning': selectedRequest?.status === 'Pending',
                    'text-success': selectedRequest?.status === 'Disetujui',
                    'text-error': selectedRequest?.status === 'Ditolak'
                  }"
                >{{ selectedRequest?.status }}</span>
              </div>
              <h4 v-if="selectedRequest?.time.created_at" class="text-h4 text-right">{{ getTimeDiff(selectedRequest?.time.created_at) }}</h4>
              <i v-if="selectedRequest?.time.updated_at" class="text-subtitle-2 text-disabled">
                Diubah {{ getTimeDiff(selectedRequest?.time.updated_at) }}
              </i>
            </div>
          </div>
        </div>

        <div v-if="selectedRequest?.note" class="text-caption text-medium-emphasis mb-4">
          Catatan: 
          <div>
            <i>{{ selectedRequest.note }}</i>
          </div>
        </div>

        <v-divider class="mb-5"></v-divider>
        
        <!-- Daftar Item -->
        <h4 class="text-subtitle-1 mb-2">Daftar Item:</h4>
        
        <div>
          <template v-for="(item, index) in approvalItems" :key="index">
            <v-divider v-if="index > 0" class="my-2"></v-divider>
            <v-row align="center" class="py-2">
              <v-col cols="7">
                <div class="font-weight-medium">{{ item.name }}</div>
                <div class="text-caption">Jumlah: {{ item.quantity }} {{ item.unit }}</div>
              </v-col>
              <v-col cols="5" class="text-right">
                <span class="text-subtitle-2 text-medium-emphasis">
                  {{ item.status }}
                </span>
              </v-col>
            </v-row>
          </template>
        </div>
    </v-card>
  </v-overlay>

  <!-- Overlay Input -->
  <v-overlay 
    v-model="showAddOverlay"
    fullscreen
    scroll-strategy="none"
    class="d-flex justify-center align-center"
  >
    <v-card 
      class="rounded-lg pa-6 height-screen" 
      style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 90vh;"
    >
      <v-btn
        icon
        variant="text"
        style="position:absolute; top:8px; right:12px;" 
        @click="showAddOverlay = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      
      <h4 class="text-h4">Tambah Permintaan Stok</h4>
      <v-divider class="my-4"></v-divider>
      <v-form ref="formRef" v-model="isFormValid">
        <v-row>
          <v-col cols="12" class="py-0">
            <v-select
              v-model="newRequest.branch_id"
              :items="props.user.assigned_branch"
              label="Cabang"
              item-title="name"
              item-value="id"
              :disabled="props.user.assigned_branch.length === 1"
              :rules="[v => !!v || 'Cabang wajib diisi']"
              prepend-inner-icon="mdi-home"
            ></v-select>
          </v-col>
          <v-col cols="12" class="pt-0">
            <div class="text-caption text-medium-emphasis">
              Catatan: 
            </div>
            <v-textarea
              v-model="newRequest.note"
              :rules="noteRules"
              label="Opsional"
              rows="2"
              auto-grow
              clear-icon="mdi-close-circle"
              clearable
              counter
            />
          </v-col>
        </v-row>

        <h4 class="text-h5 my-2">
          Daftar Item: 
          <span class="text-subtitle-2 text-medium-emphasis">{{ newRequest.items.length }} item</span>
        </h4>
        <perfect-scrollbar class="scrollable" style="max-height: 49dvh; overflow-y: scroll; overflow-x: hidden;">
          <v-row
            v-for="(item, index) in newRequest.items"
            :key="index"
            class="align-center"
            no-gutters
          >
            <v-divider v-if="index > 0" class="my-2"></v-divider>
            <v-col cols="10">
              <v-autocomplete
                v-model="item.id"
                @update:model-value="updateItem(index)"
                :items="filteredInventoryItem.map(item => ({ title: item.name, value: item.id }))"
                :loading="li"
                variant="underlined"
                :label="'Nama Item #' + (index + 1)"
                :rules="[v => !!v || 'Nama item wajib diisi']"
              />
            </v-col>
            <v-col cols="2" class="text-center">
              <v-btn icon variant="text" color="error" @click="removeItem(index)" title="Hapus Item">
                <v-icon >mdi-delete</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6" class="pe-2">
              <v-number-input
                v-model.number="item.quantity"
                control-variant="split"
                variant="underlined"
                label="Jumlah"
                :rules="[v => v > 0 || 'Jumlah harus lebih dari 0']"
                :min="1"
              />
            </v-col>
            <v-col cols="6" class="ps-3">
              <v-select
                v-model="item.unit"
                variant="underlined"
                label="Satuan"
                disabled
                :rules="[v => !!v || 'Satuan wajib diisi']"
              />
            </v-col>
          </v-row>
        </perfect-scrollbar>
        
        <v-btn
          class="mt-2 mx-auto"
          variant="outlined"
          color="primary"
          @click="addItem"
        >
          Tambah Item
        </v-btn>

        <v-divider class="my-4"></v-divider>

        <!-- Tombol proses -->
        <div class="d-flex justify-end mt-1">
          <v-btn 
            color="primary" 
            @click="submitForm"
            :disabled="!isFormValid || !isChanged"
            :loading="props.loading"
          >
            Proses Permintaan
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