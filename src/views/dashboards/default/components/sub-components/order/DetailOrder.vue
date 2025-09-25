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
import type { Menu } from '@/types/menu';
import { useAlertStore } from '@/stores/alert';
import { router } from '@/router';

const userStore = useUserStore();
const alertStore = useAlertStore()
const { openOverlay } = useOverlayManager()
const { updateItemStatus, updateStatus } = useCurrentOrders();


const emit = defineEmits(['close'])
const props = defineProps<{
  data_order: Order;
  data_menu: Menu[];
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
    if (newVal === null) {
      emit('close')
    }
  }
)

const copied = ref(false)

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  copied.value = true
}

function handlePayment() {
  const snap_token = currentOrder.value.snap_token
  // @ts-ignore
  window.snap.pay(snap_token, {
    onSuccess: (result: any) => {
      alertStore.showAlert('Pembayaran Berhasil', 'success')
      console.log('result', result)
      emit('close')
    },
    onPending: (result: any) => {
      alertStore.showAlert('Pembayaran Pending, silahkan selesaikan pembayaran', 'warning')
      console.log('result', result)
    },
    onError: (result: any) => {
      alertStore.showAlert('Pembayaran Gagal', 'error')
      console.log('result', result)
    },
    onClose: () => {
      props.refresh()
      console.log('Payment ditutup')
      emit('close')
    }
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
                  <div v-if="item.status === 'Tersaji'" class="text-success">
                    Selesai
                  </div>
                  <div v-else-if="item.status === 'Pending'" class="text-warning">
                    Pending
                  </div>
                  <div v-else-if="item.status === 'Diproses'" class="text-primary">
                    Diproses
                  </div>
                  <div v-else class="text-error">
                    Batal
                  </div>
                </div>
                <div 
                  v-if="currentOrder?.payment_status === 'Lunas' || currentOrder?.status === 'Batal' || currentOrder?.status === 'Refund'"
                  class="text-subtitle-2 text-medium-emphasis"
                >
                  <div class="text-error" v-if="item.status === 'Refund'" >
                    Refund
                  </div>
                </div>
                <div class="text-subtitle-2 text-medium-emphasis">
                  {{ formatRupiah(item.price) }}
                </div>
              </v-col>
            </v-row>
          </v-list-item>
        </perfect-scrollbar>
        
        <v-divider class="my-3"></v-divider>

        <v-row class="my-2" no-gutters justify="end">
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
          <v-btn
              class="mt-2"
              v-if="!(currentOrder?.status === 'Selesai' || currentOrder?.status === 'Batal' || currentOrder?.status === 'Refund' || currentOrder?.payment_status === 'Lunas' || currentOrder?.payment_status === 'Gagal' || currentOrder?.payment_status === 'Batal')"
              color="success"
              :disabled="props.loading"
              :loading="props.loading"
              @click="handlePayment"
            >
              Pembayaran
            </v-btn>
        </v-row>
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