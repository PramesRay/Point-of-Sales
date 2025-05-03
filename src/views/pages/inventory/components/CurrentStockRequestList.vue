<script setup lang="ts">
import type { StockRequestList } from '@/types/inventory';
import { formatRupiah } from '@/utils/helpers/currency'
import { formatDate } from "@/utils/helpers/format-date";
import { ref, computed, watch } from 'vue'
import { getTimeAgo } from "@/utils/helpers/time-ago";
  
const selectedRequest = ref<StockRequestList | null>(null)
const showOverlay = ref(false)
const showOverlayMap = ref<Record<string, boolean>>({})

function openDetail(request: StockRequestList) {
  selectedRequest.value = request
  showOverlay.value = true
}

const notesRules = [(v: string) => v.length <= 100 || 'Maks 100 karakter']

function approveItem(item: any) {
  console.log('Status:', item.name)
  // Lanjutkan logic submit ke backend nanti
}

const approvalItems = ref<any[]>([])
const approvalNote = ref('')

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

watch(showOverlay, (val) => {
  if (!val) {
    approvalItems.value = approvalItems.value.map(item => ({ ...item, approved: null }))
  }
})

// fungsi simulasi kirim data ke backend
function prosesApproval() {
  const payload = {
    requestId: selectedRequest.value?.id,
    approvalNote: approvalNote.value,
    items: approvalItems.value.map(item => ({
      id: item.id,
      status: item.approved ? 'Diterima' : 'Ditolak'
    }))
  }

  console.log('Mengirim ke backend:', payload)
  // TODO: kirim via API seperti axios.post('/api/approve-request', payload)
  showOverlay.value = false
}


const props = defineProps<{
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

// Ambil permintaan terbaru
const latestRequest = computed(() => filteredData.value[0]);

const latestRequestTimeAgo = computed(() => {
  if (!latestRequest.value?.time.createdAt) return ''
  if (!latestRequest.value?.time.updatedAt) {
    return getTimeAgo(latestRequest.value.time.createdAt)
  } else {
    return getTimeAgo(latestRequest.value.time.updatedAt)
  }
})

// Sisanya untuk list biasa
const listRequest = computed(() => filteredData.value.slice(1));

const listRequestTimeAgo = computed(() => {
  return listRequest.value.map((item) => {
    if (!item.time.createdAt) return ''
    if (!item.time.updatedAt) {
      return getTimeAgo(item.time.createdAt)
    } else {
      return getTimeAgo(item.time.updatedAt)
    }
  })
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div>
          <div class="d-flex align-center">
            <h4 class="text-h4 mt-1">Permintaan Stok Terkini</h4>
            <div v-if="props.branch !== 'all'" class="ml-auto">
              <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.branch.name }}</span>
            </div>
            <!-- <div class="ml-auto">
              <v-menu transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                  <v-btn color="primary" size="small" icon rounded="sm" variant="text" v-bind="props">
                    <DotsIcon stroke-width="1.5" width="25" />
                  </v-btn>
                </template>
                <v-sheet rounded="md" width="150" class="elevation-10">
                  <v-list>
                    <v-list-item value="1">
                      <v-list-item-title>Today</v-list-item-title>
                    </v-list-item>
                    <v-list-item value="2">
                      <v-list-item-title>This Month</v-list-item-title>
                    </v-list-item>
                    <v-list-item value="3">
                      <v-list-item-title>This Year</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-sheet>
              </v-menu>
            </div> -->
          </div>

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
                      Tap to See Detail
                    </span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">  
                      <span v-if="latestRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ latestRequest?.status }}</span>
                      <span v-else-if="latestRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ latestRequest?.status }}</span>
                      <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ latestRequest?.status }}</span>
                    </div>
                    <h4 class="text-h4 text-right">{{ getTimeAgo(latestRequest.time.createdAt) }}</h4>
                    <i v-if="latestRequest.time.updatedAt !== null" class="text-subtitle-2 text-medium-emphasis">
                      Diubah {{ getTimeAgo(latestRequest.time.updatedAt) }}
                    </i>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4">
              <perfect-scrollbar v-bind:style="{ height: '180px' }">
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
                          Tap to See Detail
                        </span>
                      </div>
                      <div>
                        <div class="d-flex justify-end">
                          <span v-if="listRequest?.status === 'Pending'" class="text-subtitle-2 text-medium-emphasis text-warning">{{ listRequest?.status }}</span>
                          <span v-else-if="listRequest?.status === 'Disetujui'" class="text-subtitle-2 text-medium-emphasis text-success">{{ listRequest?.status }}</span>
                          <span v-else class="text-subtitle-2 text-medium-emphasis text-error">{{ listRequest?.status }}</span>
                        </div>
                        <div class="text-subtitle-1 text-medium-emphasis font-weight-bold text-right">{{ getTimeAgo(listRequest.time.createdAt) }}</div>
                        <i v-if="listRequest.time.updatedAt" class="text-subtitle-2 text-medium-emphasis">
                          Diubah {{ getTimeAgo(listRequest.time.updatedAt) }}
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
        </div>
      </v-card-text>
    </v-card>
  </v-card>

  <!-- Overlay Detail -->
<v-overlay
  v-model="showOverlay"
  fullscreen
  scroll-strategy="none"
  class="d-flex justify-center align-start"
>
  <v-card
    :class="selectedRequest === latestRequest ? 'bg-lightsecondary' : 'bg-white'"
    class="rounded-lg pa-5 mt-8"
    style="width: 90vw; max-width: 90vw;"
  >
    <!-- Close button -->
    <div
      style="position: absolute; top: 8px; right: 12px; font-size: 20px; cursor: pointer;"
      @click="showOverlay = false"
    >
      ×
    </div>
    <div class="d-flex align-center">
      <h4 class="text-h4 mt-1">Detil Permintaan Stok</h4>
      <div v-if="props.branch !== 'all'" class="ml-auto">
        <span class="text-subtitle-2 text-medium-emphasis">{{ selectedRequest?.branch.name }}</span>
      </div>
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
                'text-warning': selectedRequest.status === 'Pending',
                'text-success': selectedRequest.status === 'Disetujui',
                'text-error': selectedRequest.status === 'Ditolak'
              }"
            >{{ selectedRequest?.status }}</span>
          </div>
          <h4 class="text-h4 text-right">{{ getTimeAgo(selectedRequest?.time.createdAt) }}</h4>
          <i v-if="selectedRequest.time.updatedAt !== null" class="text-subtitle-2 text-medium-emphasis">
            Diubah {{ getTimeAgo(selectedRequest.time.updatedAt) }}
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
        <v-row align="center" class="py-2">
          <v-col cols="8">
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-caption">Jumlah: {{ item.quantity }}</div>
          </v-col>
          <v-col cols="4" class="text-right">
            <div v-if="(selectedRequest?.status === 'Pending' || selectedRequest?.status === 'Beberapa Disetujui') && item.approved === null">
              <v-btn
                icon  
                variant="text"
                class="align-center justify-center text-success"
                @click="item.approved = true"
              >
              <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn
                icon  
                variant="text"
                class="align-center justify-center text-error"
                @click="item.approved = false"
                >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <div v-if="item.approved !== null">
              <span 
                class="text-subtitle-2 text-medium-emphasis"
                  :class="{
                    'text-success': item.approved === true,
                    'text-error': item.approved === false
                  }"
                >{{ item.approved ? "Disetujui" : "Ditolak" }}</span>
                <v-btn
                  icon
                  variant="text"
                  class="text-inputBorder text-subtitle-2"
                  @click="item.approved = null"
                  >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </div>
          </v-col>
        </v-row>
      <v-divider v-if="index !== approvalItems?.length - 1" />
    </template>
    
    <v-divider class="mb-5"></v-divider>

    <!-- Input catatan tambahan -->
    <div v-if="selectedRequest?.note" class="text-caption text-medium-emphasis">
      Catatan: 
    </div>
    <v-textarea
      v-model="approvalNote"
      :rules="notesRules"
      label="Opsional"
      rows="2"
      auto-grow
      clear-icon="mdi-close-circle"
      clearable
      counter
    />

      <!-- Tombol proses -->
      <div class="d-flex justify-end mt-1">
        <v-btn 
          color="primary" 
          @click="prosesApproval"
          
        >
          Proses Permintaan
        </v-btn>
      </div>
    </div>
  </v-card>
</v-overlay>
</template>