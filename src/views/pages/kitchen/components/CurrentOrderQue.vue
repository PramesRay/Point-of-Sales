<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash';
import { useDisplay } from 'vuetify';
const { mdAndUp, smAndDown } = useDisplay()

import { getSuggestedTotalCash } from '@/utils/helpers/payment'
import { formatRupiah, formatRupiahInput } from '@/utils/helpers/currency'
import { getTimeDiff } from "@/utils/helpers/time";

import type { Order, OrderItem, UpdateOrderPayload } from '@/types/order';

import { useUserStore } from '@/stores/authUser';
import type { IdName } from '@/types/common';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import DetailOrder from '../../cashier/components/sub-components/DetailOrder.vue';
import { useMenuItems } from '@/composables/useMenuItems';
import Blank from '@/components/shared/Blank.vue';
import { updateOrderData } from '@/services/totalOrder/currentOrderService';
import Payment from '../../cashier/components/sub-components/Payment.vue';
import { useCurrentOrders } from '@/composables/useCurrentOrder';

const { loadItemSales, dataItemSales: menuSales, categories, loading: lm } = useMenuItems();
const { update, loading: lo } = useCurrentOrders()
const { openOverlay } = useOverlayManager()
const userStore = useUserStore();

onMounted(() => {
  loadItemSales()
})

const props = defineProps<{
  data: Order[];
  branch: IdName | undefined;
  loading: boolean;
  refresh: () => void
}>();

// Computed untuk filter transaksi berdasarkan branch
const filteredData = computed(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx?.branch?.id === props.branch?.id
  );
});

// Ambil permintaan terbaru
const latestOrderQue = computed(() => filteredData?.value[0] || null);

// Sisanya untuk list biasa
const listOrderQue = computed(() => filteredData?.value?.slice(1) || []);

const selectedOrder = ref<Order | null>(null)
const itemInSelectedOrder = ref<(OrderItem & { name: string; description: string; price: number })[]>(
  selectedOrder.value?.items.map((item) => {
    const menu = menuSales.value.find((menu) => menu.id === item.id)
    return {
      ...item,
      name: menu?.name || '',
      description: menu?.description || '',
      price: menu?.price || 0
    }
  }) || []
)

const showOverlay = ref(false)
const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false)
const isManuallySaving = ref(false)

const paymentMethod = ref('')
const inPayment = ref(false)
const cashInput = ref('')
const cashNumber = ref(0)
const copied = ref(false)

const amtRules = [
  (v: string) => !!v || 'Jumlah tidak boleh kosong',
  (v: string) => {
    const numeric = Number(v.replace(/\D/g, ''))
    return numeric >= 0 || 'Jumlah tidak boleh kurang dari 0'
  }
]

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  copied.value = true
}


function openDetail(order: Order) {
  selectedOrder.value = cloneDeep(order)
  showOverlay.value = true
  copied.value = false
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false
  inPayment.value = false

  if (selectedOrder.value) selectedOrder.value = null

  paymentMethod.value = ''
  inPayment.value = false
  cashInput.value = ''
  cashNumber.value = 0
  copied.value = false
}

// fungsi simulasi kirim data ke backend
function processOrder(status: "Pending" | "Diproses" | "Selesai" | "Batal") {
  // if (selectedOrder.value) {
  //   selectedOrder.value.status = status
  // }
  
  // emit('proses-order', {
  //   id: selectedOrder.value?.id ?? '',
  //   status: status,
  // })
  
  // if (selectedOrder.value?.status === 'Selesai' || selectedOrder.value?.status === 'Batal') {
  //   isManuallySaving.value = true
  //   confirmCancel()
  // }
}

function processPayment(paymentMethod: string) {
  // if (selectedOrder.value) {
  //   selectedOrder.value.payment_status = 'Selesai'
  // }
  
  // emit('process-payment', {
  //   id: selectedOrder.value?.id ?? '',
  //   payment_method: paymentMethod
  // })
  
  // isManuallySaving.value = true
  // confirmCancel()
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
          </div>
          <div v-if="props.branch?.id != 'all'" class="ml-auto">
            <span class="text-subtitle-2 text-medium-emphasis">{{ props.branch?.name }}</span>
          </div>

          <div v-if="!props.loading">
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
                    <h4 class="text-h4 text-right">{{ getTimeDiff(latestOrderQue.meta.created_at) }}</h4>
                    <i v-if="latestOrderQue?.meta?.updated_at !== null" class="text-subtitle-2 text-disabled">
                      Diubah {{ getTimeDiff(latestOrderQue.meta.updated_at) }}
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
                        <div class="text-subtitle-1 text-medium-emphasis font-weight-bold text-right">{{ getTimeDiff(listOrderQue.meta.created_at) }}</div>
                        <i v-if="listOrderQue?.meta?.updated_at" class="text-subtitle-2 text-disabled">
                          Diubah {{ getTimeDiff(listOrderQue.meta.updated_at) }}
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

      <div v-if="props.loading" class="text-center my-4">
        <v-progress-circular indeterminate color="primary" height="1"></v-progress-circular>
      </div>
      <div v-else>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <span class="font-weight-medium">
                  <span v-if="props.branch?.id != 'all'">{{ selectedOrder?.branch.name }} </span> 
                  <span v-if="!selectedOrder?.is_take_away" class="text-caption"> Meja {{ selectedOrder?.table_number }} </span>
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
                    <v-icon>{{ copied ? 'mdi-clipboard-check-multiple-outline' : 'mdi-clipboard-multiple-outline'}}</v-icon>
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
                <h4 v-if="selectedOrder?.meta.created_at" class="text-h4">{{ getTimeDiff(selectedOrder?.meta.created_at) }}</h4>
                <i v-if="selectedOrder?.meta.updated_at" class="text-subtitle-2 text-disabled">
                  Diubah {{ getTimeDiff(selectedOrder?.meta.updated_at) }}
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
        <div class="d-flex align-center justify-space-between mt-4 mb-2">
          <h4 class="text-subtitle-1">Daftar Item:</h4>
          <!-- Add Item Button -->
          <span class="text-subtitle-2 text-medium-emphasis">
            <v-btn
              append-icon="mdi-pencil"
              color="warning"
              variant="text"
              size="small"
              @click="
                openOverlay({
                  component: DetailOrder,
                  props: {
                    data_order: selectedOrder,
                    data_menu: menuSales,
                    categories: categories,
                    refresh: () => props.refresh()
                  },
                })
              "
            >
              Ubah Item
            </v-btn>
          </span>
        </div>
        <perfect-scrollbar class="scrollable" style="max-height: 50vh; overflow-y: scroll; overflow-x: hidden;">
          <v-list-item
            v-for="(item, index) in selectedOrder?.items" 
            :key="index" 
            class="px-1"
          >
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
                <div 
                  v-if="selectedOrder?.payment_status === 'Selesai'"
                  class="text-subtitle-2 text-medium-emphasis"
                >
                  <div class="text-error" v-if="item.status === 'Refund'" >
                    Refund
                  </div>
                  <div v-if="(userStore.hasRole(['Admin', 'Pemilik', 'Kasir']))">
                    <v-btn
                      class="px-0"
                      append-icon="mdi-refresh"
                      density="compact"
                      color="error"
                      variant="plain"
                      size="small"
                      @click="
                      // nanti ganti jadi komponen khusus refund
                        openOverlay({
                          component: Blank,
                          props: {
                            confirmToContinue: true,
                            confirmMessage: 'Apakah anda yakin ingin refund item ini?',
                            onConfirm: () => {
                              props.refresh()
                            }
                          },
                        })
                      "
                    >
                      Refund
                    </v-btn>
                    {{ formatRupiah(item.price) }}
                  </div>
                </div>
                <div v-else class="text-subtitle-2 text-medium-emphasis">
                  <div class="text-error" v-if="item.status === 'Pending'">
                    <v-btn 
                      color="warning" 
                      variant="plain"
                      size="small"
                      class="px-0"
                      density="compact"
                      :disabled="props.loading"
                      :loading="props.loading"
                      @click="
                        openOverlay({
                          component: Blank,
                          props: {
                            confirmToContinue: true,
                            confirmMessage: 'Apakah anda yakin ingin memproses pesanan ini?',
                            onConfirm: () => {
                              updateOrderData({
                                id: selectedOrder?.id!,
                                status: 'Diproses',
                              }),
                              props.refresh()
                            }
                          },
                        })
                      "
                    >
                      Proses Menu
                    </v-btn>
                  </div>
                  <div v-if="item.status === 'Diproses'">
                    <v-btn 
                      color="primary"
                      variant="plain"
                      size="small"
                      class="px-0"
                      density="compact"
                      :disabled="props.loading"
                      :loading="props.loading"
                      @click="
                        openOverlay({
                          component: Blank,
                          props: {
                            confirmToContinue: true,
                            confirmMessage: 'Apakah anda yakin ingin pesanan ini siap saji?',
                            onConfirm: () => {
                              updateOrderData({
                                id: selectedOrder?.id!,
                                status: 'Selesai',
                              }),
                              props.refresh()
                            }
                          },
                        })
                      "
                    >
                      Siap Saji
                    </v-btn>
                  </div>
                  <div>
                    {{ formatRupiah(item.price) }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-list-item>
        </perfect-scrollbar>
        
        <!-- Tombol proses -->
        <!-- <v-row v-if="(userStore.hasRole(['Admin', 'Pemilik', 'Dapur'])) && selectedOrder?.payment_status === 'Pending'">
          <v-col cols="12" v-if="selectedOrder.status === 'Pending'">
            <v-btn 
              color="warning" 
              block
              :disabled="props.loading"
              :loading="props.loading"
              @click="
                openOverlay({
                  component: Blank,
                  props: {
                    confirmToContinue: true,
                    confirmMessage: 'Apakah anda yakin ingin memproses pesanan ini?',
                    onConfirm: () => {
                      updateOrderData({
                        id: selectedOrder?.id!,
                        status: 'Diproses',
                      }),
                      props.refresh()
                    }
                  },
                })
              "
            >
              Proses Pesanan
            </v-btn>
          </v-col>
          <v-col cols="12" v-if="selectedOrder.status === 'Diproses'">
            <v-btn 
              color="primary"
              block
              :disabled="props.loading"
              :loading="props.loading"
              @click="
                openOverlay({
                  component: Blank,
                  props: {
                    confirmToContinue: true,
                    confirmMessage: 'Apakah anda yakin ingin pesanan ini siap saji?',
                    onConfirm: () => {
                      updateOrderData({
                        id: selectedOrder?.id!,
                        status: 'Selesai',
                      }),
                      props.refresh()
                    }
                  },
                })
              "
            >
              Siap Saji
            </v-btn>
          </v-col>
        </v-row> -->
        
        <!-- Tombol untuk Role Kasir -->
        <div v-if="(userStore.hasRole(['Admin', 'Kasir'])) && selectedOrder?.payment_status === 'Pending'">
          <v-divider class="my-3"></v-divider>
          <div class="d-flex justify-space-between align-center">
            <v-btn 
              color="error"
              variant="plain"
              prepend-icon="mdi-delete"
              size="small"
              :disabled="props.loading"
              :loading="props.loading"
              @click="
                openOverlay({
                  component: Blank,
                  props: {
                    confirmToContinue: true,
                    confirmMessage: 'Apakah anda yakin ingin membatalkan pesanan ini?',
                    onConfirm: () => {
                      updateOrderData({
                        id: selectedOrder?.id!,
                        status: 'Batal',
                      }),
                      props.refresh()
                      showOverlay = false
                    }
                  },
              })"
            >
              Batalkan
            </v-btn>
  
            <v-btn 
              color="success"
              :disabled="props.loading"
              :loading="props.loading"
              @click="
                openOverlay({
                  component: Payment,
                  props: {
                    data: selectedOrder,
                    item_in_chart: itemInSelectedOrder,
                    paymentSucceded: () => {
                      props.refresh()
                    }
                  },
                })
              "
            >
              Pembayaran
            </v-btn>
          </div>
      </div>
    </div>
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

  <v-dialog v-model="showConfirmDialog" persistent max-width="400">
    <v-card class="pa-3">
      <v-card-title class="text-h3">Batalkan Pesanan?</v-card-title>
      <v-card-text class="text-subtitle-1 text-medium-emphasis">
        Apakah Anda yakin ingin membatalkan pesanan ini?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="showConfirmDialog = false">Kembali</v-btn>
        <v-btn variant="elevated" color="error" @click="processOrder('Batal')">Ya, Batalkan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>