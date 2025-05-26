<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp, smAndDown } = useDisplay()

import { getSuggestedTotalCash } from '@/utils/helpers/payment'
import { formatRupiah, formatRupiahInput } from '@/utils/helpers/currency'
import { getTimeAgo } from "@/utils/helpers/time-ago";
import { hasRole } from '@/utils/helpers/user';

import type { Order, OrderItem } from '@/types/order';
import type { Employee } from '@/types/employee';

const emit = defineEmits<{
  (e: 'proses-order', payload: { id: string; status: string }): Order
  (e: 'process-payment', payload: { id: string; payment_method: string }): Order
}>();

const props = defineProps<{
  user: Employee;
  data: Order[];
  branch: string;
  loading?: boolean;
}>();

// Computed untuk filter transaksi berdasarkan branch
const filteredData = computed(() => {
  if (props.branch === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx?.branch?.id === props.branch
  );
});

// Ambil permintaan terbaru
const latestOrderQue = computed(() => filteredData?.value[0] || null);

// Sisanya untuk list biasa
const listOrderQue = computed(() => filteredData?.value?.slice(1) || []);

const selectedOrder = ref<Order | null>(null)
const showOverlay = ref(false)
const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false)
const isManuallySaving = ref(false)
const orderStatus = ref('')
const paymentMethod = ref('')
const inPayment = ref(false)
const cashInput = ref('')
const cashNumber = ref(0)

const amtRules = [
  (v: string) => !!v || 'Jumlah tidak boleh kosong',
  (v: string) => {
    const numeric = Number(v.replace(/\D/g, ''))
    return numeric >= 0 || 'Jumlah tidak boleh kurang dari 0'
  }
]

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
}

function openDetail(request: Order) {
  selectedOrder.value = cloneDeep(request)
  showOverlay.value = true
  orderStatus.value = request.status ?? ''
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false
  inPayment.value = false

  if (selectedOrder.value) selectedOrder.value = null

  orderStatus.value = ''
  paymentMethod.value = ''
  inPayment.value = false
  cashInput.value = ''
  cashNumber.value = 0
}

// fungsi simulasi kirim data ke backend
function processOrder(status: "Pending" | "Diproses" | "Selesai" | "Batal") {
  if (selectedOrder.value) {
    selectedOrder.value.status = status
  }
  
  emit('proses-order', {
    id: selectedOrder.value?.id ?? '',
    status: status,
  })
  
  if (orderStatus.value === 'Selesai' || orderStatus.value === 'Batal') {
    isManuallySaving.value = true
    confirmCancel()
  }
}

function processPayment(paymentMethod: string) {
  if (selectedOrder.value) {
    selectedOrder.value.payment_status = 'Selesai'
  }
  
  emit('process-payment', {
    id: selectedOrder.value?.id ?? '',
    payment_method: paymentMethod
  })
  
  isManuallySaving.value = true
  confirmCancel()
}

watch(showOverlay, (isOpen, wasOpen) => {
  // Ketika overlay akan ditutup (false) dari keadaan terbuka (true)
  if (!isOpen && wasOpen) {
    if (isManuallySaving.value) {
      // 👇 Reset dan biarkan overlay benar-benar tertutup
      isManuallySaving.value = false
      return
    }
    
    if (pendingOverlayClose.value) {
      // Jika user sudah setuju menutup lewat konfirmasi
      pendingOverlayClose.value = false
      return
    }
  }
})

watch(() => cashInput.value, (val) => {
  const numeric = val.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  cashNumber.value = numeric ? Number(numeric) : 0
})
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div>
          <div class="d-flex align-center">
            <h4 class="text-h4 mt-1">Antrian Pesanan</h4>
            <div v-if="props.branch !== 'all'" class="ml-auto">
              <span class="text-subtitle-2 text-medium-emphasis">{{ latestOrderQue?.branch?.name }}</span>
            </div>
          </div>

          <div v-if="!props.loading || !loading">
            <v-card class="bg-lightsecondary mt-5"
              @click="openDetail(latestOrderQue)"
            >
              <div v-if="latestOrderQue" class="pa-5">
                <span>
                  {{ latestOrderQue?.is_take_away ? 'Bawa Pulang' : 'Makan Di Tempat' }} 
                </span> 
                <span v-if="!latestOrderQue?.is_take_away" class="text-subtitle-2 text-medium-emphasis">
                  : Meja {{ latestOrderQue?.table_number }} 
                </span>
                <div class="d-inline-flex align-center justify-space-between w-100">
                  <div>
                    <h6 class="text-secondary text-h4 font-weight-bold">
                      {{ latestOrderQue?.customer?.name }}
                    </h6>
                    <div class="text-secondary text-subtitle-2 text-medium-emphasis">
                      {{ latestOrderQue?.items?.length }} item
                    </div>
                    <span class="text-subtitle-2 text-disabled">
                      Lihat Detail
                    </span>
                  </div>
                  <div>
                    <div class="d-flex justify-end">  
                      <span 
                        class="text-subtitle-2 text-medium-emphasis"
                        :class="{
                          'text-success': latestOrderQue?.status === 'Selesai',
                          'text-error': latestOrderQue?.status === 'Batal',
                          'text-warning': latestOrderQue?.status === 'Pending',
                          'text-primary': latestOrderQue?.status === 'Diproses'
                        }"
                      >{{ latestOrderQue?.status }}</span>
                    </div>
                    <h4 class="text-h4 text-right">{{ getTimeAgo(latestOrderQue.meta.created_at) }}</h4>
                    <i v-if="latestOrderQue?.meta?.updated_at !== null" class="text-subtitle-2 text-disabled">
                      Diubah {{ getTimeAgo(latestOrderQue.meta.updated_at) }}
                    </i>
                  </div>
                </div>
              </div>
            </v-card>
            <div class="mt-4">
              <perfect-scrollbar :style="{ maxHeight: mdAndUp? '20rem' : '12rem'}">
                <v-list v-if="listOrderQue?.length > 0" class="py-0">
                  <v-list-item v-for="(listOrderQue, i) in listOrderQue" :key="i" :value="listOrderQue" color="secondary" rounded="sm" @click="openDetail(listOrderQue)">
                    <span class="text-subtitle-2 text-medium-emphasis">
                      {{ listOrderQue?.is_take_away ? 'Bawa Pulang' : 'Makan Di Tempat' }} 
                    </span> 
                    <span v-if="!listOrderQue?.is_take_away" class="text-subtitle-2 text-disabled">
                      : Meja {{ listOrderQue?.table_number }} 
                    </span>
                    <div class="d-inline-flex align-center justify-space-between w-100">
                      <div>
                        <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                          {{ listOrderQue?.employee?.name }}
                        </h6>
                        <div class="text-subtitle-2 text-medium-emphasis">
                          {{ listOrderQue?.items?.length }} item
                        </div>
                        <span class="text-subtitle-2 text-disabled">
                          Lihat Detail
                        </span>
                      </div>
                      <div>
                        <div class="d-flex justify-end">
                          <span 
                            class="text-subtitle-2 text-medium-emphasis"
                            :class="{
                              'text-success': listOrderQue?.status === 'Selesai',
                              'text-error': listOrderQue?.status === 'Batal',
                              'text-warning': listOrderQue?.status === 'Pending',
                              'text-primary': listOrderQue?.status === 'Diproses'
                            }"
                          >{{ listOrderQue?.status }}</span>
                        </div>
                        <div class="text-subtitle-1 text-medium-emphasis font-weight-bold text-right">{{ getTimeAgo(listOrderQue.meta.created_at) }}</div>
                        <i v-if="listOrderQue?.meta?.updated_at" class="text-subtitle-2 text-disabled">
                          Diubah {{ getTimeAgo(listOrderQue.meta.updated_at) }}
                        </i>
                      </div>
                    </div>
                    <v-divider class="my-3"/>
                  </v-list-item>
                </v-list>
              </perfect-scrollbar>

              <div class="text-center mt-3">
                <v-btn color="primary" variant="text" href="/Order"
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
              :loading="!props.loading || !loading"
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
    class="d-flex justify-center align-center"
  >
    <v-card
      :class="selectedOrder === latestOrderQue ? 'bg-lightsecondary' : 'bg-white'"
      class="rounded-lg pa-6 ma-4 height-screen"
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

      <h4 class="text-h4">Detil Pesanan</h4>
      <i class="text-subtitle-2 text-disabled">Order Id: {{ selectedOrder?.id }}</i>
      <v-divider class="my-2"></v-divider>

      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col cols="12">
              <span class="font-weight-medium">
                <span v-if="props.branch === 'all'">{{ selectedOrder?.branch.name }} </span> 
                <span v-if="!selectedOrder?.is_take_away" class="text-caption">: Meja {{ selectedOrder?.table_number }} </span>
              </span>
              <div class="text-subtitle-2 text-medium-emphasis">
                <i >{{ selectedOrder?.is_take_away ? 'Bawa Pulang' : 'Makan Di Tempat' }}</i>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="7">
              <h4 class="text-secondary text-h4 font-weight-bold">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                >
                  <v-icon size="x-large">mdi-account</v-icon>: 
                </v-btn>
                {{ selectedOrder?.customer.name }}
              </h4>
              <div class="text-subtitle-2 text-medium-emphasis" >
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  :href="`https://wa.me/${selectedOrder?.customer.phone}`"
                >
                  <v-icon size="x-large">mdi-phone</v-icon>: 
                </v-btn>
                {{ selectedOrder?.customer.phone }}
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  @click="copyToClipboard(selectedOrder?.customer.phone ?? '')"
                >
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </div>
              <div class="text-subtitle-2 text-medium-emphasis">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                >
                  <v-icon size="x-large">mdi-food</v-icon>: 
                </v-btn>
                {{ selectedOrder?.items.length }} item
              </div>
            </v-col>
            <v-col cols="5">  
              <div class="text-right">
                <div 
                class="text-subtitle-2 text-medium-emphasis"
                :class="{
                  'text-success': selectedOrder?.status === 'Selesai',
                  'text-error': selectedOrder?.status === 'Batal',
                  'text-warning': selectedOrder?.status === 'Pending',
                  'text-primary': selectedOrder?.status === 'Diproses'
                }"
              >{{ selectedOrder?.status }}</div>
              <h4 v-if="selectedOrder?.meta.created_at" class="text-h4">{{ getTimeAgo(selectedOrder?.meta.created_at) }}</h4>
              <i v-if="selectedOrder?.meta.updated_at" class="text-subtitle-2 text-disabled">
                Diubah {{ getTimeAgo(selectedOrder?.meta.updated_at) }}
              </i>
            </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-2 text-disabled text-right">
                <span
                  class="text-h5 text-high-emphasis ml-1"
                  :class="{
                    'text-success': selectedOrder?.payment_status === 'Selesai',
                    'text-error': selectedOrder?.payment_status === 'Gagal',
                    'text-warning': selectedOrder?.payment_status === 'Pending',
                  }"
                > Pembayaran {{ selectedOrder?.payment_status }}
                </span>
                <div>
                  Total Harga: <span class="text-h4 text-high-emphasis ml-1">{{ formatRupiah(selectedOrder?.amount ?? 0) }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      
      <!-- Daftar Item -->
      <h4 class="text-subtitle-1 my-2">Daftar Item:</h4>
      <perfect-scrollbar class="scrollable" style="max-height: 50vh; overflow-y: scroll; overflow-x: hidden;">
        <v-list-item v-for="(item, index) in selectedOrder?.items" :key="index" class="px-1">
          <v-divider v-if="index > 0"></v-divider>
          <v-row align="center" class="py-1">
            <v-col cols="7">
              <div class="text-medium-emphasis">
                <span>{{ item.name }}</span>
                <span class="text-caption"> x{{ item.quantity }}</span>
              </div>
              <div>
                <span class="text-subtitle-2 text-medium-emphasis">
                  catatan: {{ item.note !== '' ? item.note : '-' }}
                </span>
              </div>
            </v-col>
            <v-col cols="5" class="text-right">
              <div class="text-subtitle-2 text-medium-emphasis">
                {{ formatRupiah(item.price) }}
              </div>
            </v-col>
          </v-row>
        </v-list-item>
      </perfect-scrollbar>

      <v-divider class="my-3"></v-divider>

      <!-- Tombol proses -->
      <v-row v-if="props.user.role ?? hasRole(props.user.role, ['admin', 'kitchen'])">
        <v-col cols="12" v-if="orderStatus === 'Pending'">
          <v-btn 
            color="warning" 
            block
            @click="orderStatus = 'Diproses', processOrder('Diproses')"
            :disabled="props.loading"
            :variant="props.loading? 'outlined' : 'elevated'"
            :loading="props.loading"
          >
            Proses Pesanan
          </v-btn>
        </v-col>
        <v-col cols="12" v-if="orderStatus === 'Diproses'">
          <v-btn 
            color="primary"
            block
            @click="orderStatus = 'Selesai', processOrder('Selesai')"
            :disabled="props.loading"
            :variant="props.loading? 'outlined' : 'elevated'"
            :loading="props.loading"
          >
            Siap Saji
          </v-btn>
        </v-col>
      </v-row>
      
      <!-- Tombol untuk Role Kasir -->
      <v-row v-if="(props.user.role ?? hasRole(props.user.role, ['admin', 'cashier'])) && selectedOrder?.payment_status === 'Pending'">
        <v-col cols="6">
          <v-btn 
            color="error"
            block
            @click="orderStatus = 'Batal', processOrder('Batal')"
            :disabled="props.loading"
            variant="outlined"
            :loading="props.loading"
          >
            Batalkan Pesanan
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn 
            color="success"
            block
            @click="inPayment = true"
            :disabled="props.loading"
            :variant="props.loading? 'outlined' : 'elevated'"
            :loading="props.loading"
          >
            Pembayaran
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-overlay>
  
  <v-overlay
    v-model="inPayment"
    fullscreen
    scroll-strategy="none"
    class="d-flex justify-center align-center"
  >
    <v-card
      :class="selectedOrder === latestOrderQue ? 'bg-lightsecondary' : 'bg-white'"
      class="rounded-lg pa-6 mt-8 height-screen"
      style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 90vh;"
    >
      <!-- Close button -->
      <v-btn
        icon
        variant="text"
        style="position:absolute; top:8px; right:12px;" 
        @click="inPayment = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <h4 class="text-h4">Pembayaran</h4>
      <i class="text-subtitle-2 text-disabled">Order Id: {{ selectedOrder?.id }}</i>
      <v-divider class="my-2"></v-divider>

      <div class="text-center mb-4">
        <div class="text-subtitle-2 text-medium-emphasis"> Total Pembayaran</div>
        <h1 class="text-h1">{{ formatRupiah(selectedOrder?.amount ?? 0) }}</h1>
      </div>
      
      <div class="text-subtitle-2 text-medium-emphasis mb-2">Pilih Metode Pembayaran: </div>
      <v-row>
        <v-col cols="6">
          <v-btn
            block
            prepend-icon="mdi-cash"
            @click="paymentMethod = 'cash'"
            :variant="paymentMethod === 'cash' ? 'tonal' : 'elevated'"
          >
            Cash  
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            block
            prepend-icon="mdi-qrcode-scan"
            @click="paymentMethod = 'qris'"
            :variant="paymentMethod === 'qris' ? 'tonal' : 'elevated'"
          >
            QRIS
          </v-btn>
        </v-col>
      </v-row>

      <div v-if="paymentMethod === 'cash'">
        <v-row class="mt-2">
          <v-col cols="12" sm="6">
            <v-text-field 
              v-model="cashInput" 
              control-variant="hidden"
              variant="underlined"
              :min="0"
              :rules="amtRules"
              prepend-icon="mdi-cash-multiple"
              label="Jumlah Uang Tunai"
              prefix="Rp"
              @input="cashInput = formatRupiahInput(cashInput)"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row  class="justify-center">
          <v-col
            v-for="amount in getSuggestedTotalCash(selectedOrder?.amount || 0)"
            :key="amount"
            cols="4"
            sm="3"
            md="2"
            lg="2"
          >
            <v-btn
              block
              color="primary"
              @click="cashInput = formatRupiahInput(amount.toString())"
              :variant="amount === cashNumber ? 'tonal' : 'outlined'"
            >
              {{ formatRupiah(amount) }}
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <div 
        v-if="paymentMethod === 'cash' && selectedOrder?.amount && cashNumber !== 0 && cashNumber >= selectedOrder?.amount"
        class="text-subtitle-2 text-medium-emphasis mt-6 text-center"
      >
        Total Kembalian: 
        <div class="text-h4">{{ formatRupiah(cashNumber - selectedOrder?.amount) }}</div>
      </div>
      <div 
        v-if="paymentMethod === 'qris'"
        class="text-subtitle-1 text-disabled mt-6 text-center"
      >
        Pastikan pembayaran QRIS sudah berhasil, yaa!
      </div>

      <v-divider class="my-4"></v-divider>

      <v-row>
        <v-col cols="12">
          <v-btn 
            color="success"
            block
            @click="processPayment(paymentMethod)"
            :disabled="props.loading || paymentMethod === '' || (paymentMethod === 'qris' ? false : cashNumber === 0)"
            :variant="props.loading || paymentMethod === '' || (paymentMethod === 'qris' ? false : cashNumber === 0) ? 'outlined' : 'elevated'"
            :loading="props.loading"
          >
            Bayar
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-overlay>
</template>