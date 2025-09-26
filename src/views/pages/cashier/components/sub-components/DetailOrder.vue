<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue';

import type { Order, OrderItem, UpdateOrderItemStatusPayload } from '@/types/order';

import { formatRupiah } from '@/utils/helpers/currency';
import { getTimeDiff } from "@/utils/helpers/time";

import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import { useUserStore } from '@/stores/authUser';

import UpdateOrder from './UpdateOrder.vue';
import Blank from '@/components/shared/Blank.vue';
import Payment from './Payment.vue'
import RefundOrder from './RefundOrder.vue';
import type { MenuSale } from '@/types/menu';
import { useAlertStore } from '@/stores/alert';

const userStore = useUserStore();
const alertStore = useAlertStore();
const { openOverlay } = useOverlayManager()
const { updateItemStatus, updateStatus } = useCurrentOrders();


const emit = defineEmits(['close'])
const props = defineProps<{
  data_order: Order;
  data_menu: MenuSale[];
  categories: any;
  loading: boolean;
  refresh: () => void;
}>();

const currentOrder = computed(() => {
  return props.data_order
})

watch(
  () => currentOrder.value,
  (newVal) => {
    if (newVal === undefined) {
      emit('close')
    }
  }
)

const copied = ref(false)

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  copied.value = true
}

const refund_item = ref<UpdateOrderItemStatusPayload & { amount_refund: number}>()

const addRefundItem = (item: OrderItem) => {
  if(!refund_item.value) refund_item.value = {
    id: currentOrder?.value.id,
    items: [],
    amount_refund: 0,
  }
  
  if(!refund_item.value.items) refund_item.value.items = []

  refund_item.value.items.push({
    id: item.id,
    status: 'Refund',
  })

  refund_item.value.amount_refund += item.price * item.quantity
}

const resetRefundItem = () => {
  refund_item.value = {
    id: currentOrder?.value.id,
    items: [],
    amount_refund: 0,
  }
}

function handlePayment() {
  return openOverlay({
    component: Payment,
    props: {
      data: currentOrder.value,
      paymentSucceded: () => {
        props.refresh()
        emit('close')
      }
    },
  })
}
</script>

<template>
  <v-card 
      class="rounded-lg pa-6 mt-8 bg-white height-screen"
      style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 95dvh; scrollbar-width: none;"
    >
      <!-- Close button -->
      <v-btn
        icon
        variant="text"
        style="position:absolute; top:8px; right:12px;" 
        @click="emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <h4 class="text-h4">Detil Pesanan</h4>
      <i class="text-subtitle-2 text-disabled">{{ currentOrder?.id }}</i>
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
                  <span>{{ currentOrder?.branch.name }}</span>
                  <span v-if="!currentOrder?.is_take_away" class="text-caption"> Meja {{ currentOrder?.table_number }} </span>
                </span>
                <div class="text-subtitle-2 text-medium-emphasis">
                  <i >{{ currentOrder?.is_take_away ? 'Bawa Pulang' : 'Makan Di Tempat' }}</i>
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
                  {{ currentOrder?.customer.name }}
                </h4>
                <div class="text-subtitle-2 text-medium-emphasis" >
                  <v-btn
                    icon
                    variant="text"
                    size="x-small"
                    :href="`https://wa.me/${currentOrder?.customer.phone}`"
                  >
                    <v-icon size="x-large">mdi-phone</v-icon>: 
                  </v-btn>
                  {{ currentOrder?.customer.phone }}
                  <v-btn
                    icon
                    variant="text"
                    size="x-small"
                    @click="copyToClipboard(currentOrder?.customer.phone ?? '')"
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
                  {{ currentOrder?.items.length }} item
                </div>
              </v-col>
              <v-col cols="5">  
                <div class="text-right">
                  <div 
                  class="text-subtitle-2 text-medium-emphasis"
                  :class="{
                    'text-success': currentOrder?.status === 'Selesai',
                    'text-error': currentOrder?.status === 'Batal',
                    'text-warning': currentOrder?.status === 'Pending',
                    'text-primary': currentOrder?.status === 'Diproses'
                  }"
                >{{ currentOrder?.status }}</div>
                <h4 v-if="currentOrder?.meta.updated_at" class="text-h4">{{ getTimeDiff(currentOrder?.meta.updated_at) }}</h4>
                <i v-if="currentOrder?.meta.created_at" class="text-subtitle-2 text-disabled">
                  Dibuat {{ getTimeDiff(currentOrder?.meta.created_at) }}
                </i>
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
            <!-- <v-btn
              v-if="currentOrder?.status !== 'Selesai' && currentOrder?.status !== 'Batal' && currentOrder?.payment_status === 'Pending' && !currentOrder?.snap_token"
              append-icon="mdi-pencil"
              class="text-disabled"
              variant="plain"
              size="small"
              @click="
                openOverlay({
                  component: UpdateOrder,
                  props: {
                    data_order: currentOrder,
                    data_menu: props.data_menu,
                    categories: props.categories,
                    refresh: () => props.refresh()
                  },
                })
              "
            >
              Ubah Item
            </v-btn> -->
            <v-btn
              v-if="refund_item?.items && refund_item.items.length > 0"
              color="error"
              variant="tonal"
              size="small"
              @click="
                openOverlay({
                  component: RefundOrder,
                  props: {
                    payload: refund_item,
                    refresh: () => {
                      resetRefundItem()
                      props.refresh()
                    },
                  },
                })
              "
            >
              {{refund_item.items.length}} item refund
            </v-btn>
          </span>
        </div>
        <perfect-scrollbar class="scrollable" style="max-height: 50vh; overflow-y: scroll; overflow-x: hidden;">
          <v-list-item
            v-for="(item, index) in currentOrder?.items" 
            :key="index" 
            class="px-1"
          >
            <v-divider v-if="index > 0" class="mb-2"></v-divider>
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
                  <div v-if="item.status === 'Pending'">
                    <v-btn 
                      color="warning" 
                      variant="tonal"
                      size="small"
                      :disabled="props.loading"
                      :loading="props.loading"
                      @click="
                        openOverlay({
                          component: Blank,
                          props: {
                            confirmToContinue: true,
                            confirmMessage: 'Apakah anda yakin ingin memproses pesanan ini?',
                            onConfirm: async () => {
                              await updateItemStatus({
                                id: currentOrder?.id!,
                                items: [{
                                  id: item.id,
                                  status: 'Diproses',
                                }],
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
                  <div v-else-if="item.status === 'Diproses'">
                    <v-btn 
                      color="primary"
                      variant="tonal"
                      size="small"
                      :disabled="props.loading"
                      :loading="props.loading"
                      @click="
                        openOverlay({
                          component: Blank,
                          props: {
                            confirmToContinue: true,
                            confirmMessage: 'Apakah anda yakin pesanan ini sudah siap saji?',
                            onConfirm: async () => {
                              await updateItemStatus({
                                id: currentOrder?.id!,
                                items: [{
                                  id: item.id,
                                  status: 'Tersaji',
                                }],
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
                  <div v-else :class="{
                    'text-error': item.status === 'Batal',
                    'text-success': item.status === 'Tersaji',
                  }">
                    {{ item.status }}
                  </div>
                </div>
                <div 
                  v-if="currentOrder?.payment_status === 'Lunas'"
                  class="text-subtitle-2 text-medium-emphasis"
                >
                  <div class="text-error" v-if="item.status === 'Refund'" >
                    Refund
                  </div>
                  <div v-else>
                    <v-btn
                      v-if="!(refund_item?.items.find(i => i.id === item.id))"
                      class="px-0"
                      append-icon="mdi-keyboard-backspace"
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
                            onConfirm: () => addRefundItem(item)
                          },
                        })
                      "
                    >
                      Refund
                    </v-btn>
                    <v-btn
                      v-else
                      class="px-0 text-disabled"
                      append-icon="mdi-refresh"
                      density="compact"
                      variant="plain"
                      size="small"
                      @click="
                        refund_item.items = refund_item.items.filter(i => i.id !== item.id)
                      "
                    >
                      Batal Refund
                    </v-btn>
                    {{ formatRupiah(item.price) }}
                  </div>
                </div>
                <div v-else class="text-subtitle-2 text-medium-emphasis">
                  {{ formatRupiah(item.price) }}
                </div>
              </v-col>
            </v-row>
          </v-list-item>
        </perfect-scrollbar>
        
        <v-divider class="my-3"></v-divider>

        <v-row class="my-2" no-gutters>
          <v-col cols="12">
            <div class="text-subtitle-2 text-disabled text-right">
              <span
                class="text-h5 text-high-emphasis ml-1"
                :class="{
                  'text-success': currentOrder?.payment_status === 'Lunas',
                  'text-error': currentOrder?.payment_status === 'Gagal' || currentOrder?.payment_status === 'Batal',
                  'text-warning': currentOrder?.payment_status === 'Pending',
                }"
              > Pembayaran {{ currentOrder?.payment_status }}
              </span>
              <div>
                Total Harga: <span class="text-h4 text-high-emphasis ml-1">{{ formatRupiah(currentOrder?.amount ?? 0) }}</span>
              </div>
            </div>
          </v-col>
        </v-row>
        
        <!-- Tombol untuk Role kasir -->
        <div v-if="(userStore.hasRole(['admin', 'pemilik', 'kasir', 'dapur', 'kasir'])) && (currentOrder?.payment_status === 'Pending' || currentOrder?.payment_status === 'Gagal')" class="d-flex justify-end align-center">
          <div class="d-flex align-center" v-if="userStore.hasRole(['admin', 'pemilik', 'dapur', 'kasir']) && currentOrder?.status === 'Pending'">
            <v-btn 
              color="error"
              block
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
                    onConfirm: async () => {
                      await updateStatus({
                        id: currentOrder?.id!,
                        status: 'Batal',
                      })
                      props.refresh()
                      emit('close')
                    }
                  },
                })"
            >
              Batalkan
            </v-btn>
          </div>
          <v-btn
            v-if="userStore.hasRole(['admin', 'pemilik', 'kasir']) && !(currentOrder?.status === 'Selesai' || currentOrder?.status === 'Batal' || currentOrder?.status === 'Refund')"
            color="success"
            :disabled="props.loading"
            :loading="props.loading"
            @click="handlePayment"
          >
            Pembayaran
          </v-btn>
        </div>
      </div>
    </v-card>
</template>

<!-- styling untuk mengecilkan ukuran text dalam input -->
 <style>
.small-font {
  font-size: 0.7rem !important;
}

.small-font .v-icon {
  font-size: 1rem;
  align-self: center;
}

.small-font .v-label {
  font-size: 0.8rem;
}

.small-font .v-text-field input {
  font-size: 0.8rem;
}

.small-font .v-field__input {
  font-size: 0.8rem;
}

.table-number-input  {
  margin-top: -14px;
}

.text-area-custom .v-field__input{
  padding-top: 0 ;
  min-height: 0.7rem;
  mask-image: none;
}
</style>