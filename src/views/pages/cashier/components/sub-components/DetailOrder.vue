<script setup lang="ts">
import { defineProps, ref } from 'vue';

import type { Order } from '@/types/order';

import { formatRupiah } from '@/utils/helpers/currency';
import { getTimeDiff } from "@/utils/helpers/time";

import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import { useUserStore } from '@/stores/authUser';

import UpdateOrder from './UpdateOrder.vue';
import Blank from '@/components/shared/Blank.vue';
import Payment from './Payment.vue'

const userStore = useUserStore();
const { openOverlay } = useOverlayManager()
const { update, loading } = useCurrentOrders();


const emit = defineEmits(['close'])
const props = defineProps<{
  data_order: Order;
  data_menu: any[];
  categories: any;
  refresh: () => void;
}>();

const copied = ref(false)

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  copied.value = true
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
      <i class="text-subtitle-2 text-disabled">{{ props.data_order?.id }}</i>
      <v-divider class="my-2"></v-divider>

      <div v-if="loading" class="text-center my-4">
        <v-progress-circular indeterminate color="primary" height="1"></v-progress-circular>
      </div>
      <div v-else>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <span class="font-weight-medium">
                  <span>{{ props.data_order?.branch.name }}</span>
                  <span v-if="!props.data_order?.is_take_away" class="text-caption"> Meja {{ props.data_order?.table_number }} </span>
                </span>
                <div class="text-subtitle-2 text-medium-emphasis">
                  <i >{{ props.data_order?.is_take_away ? 'Bawa Pulang' : 'Makan Di Tempat' }}</i>
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
                  {{ props.data_order?.customer.name }}
                </h4>
                <div class="text-subtitle-2 text-medium-emphasis" >
                  <v-btn
                    icon
                    variant="text"
                    size="x-small"
                    :href="`https://wa.me/${props.data_order?.customer.phone}`"
                  >
                    <v-icon size="x-large">mdi-phone</v-icon>: 
                  </v-btn>
                  {{ props.data_order?.customer.phone }}
                  <v-btn
                    icon
                    variant="text"
                    size="x-small"
                    @click="copyToClipboard(props.data_order?.customer.phone ?? '')"
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
                  {{ props.data_order?.items.length }} item
                </div>
              </v-col>
              <v-col cols="5">  
                <div class="text-right">
                  <div 
                  class="text-subtitle-2 text-medium-emphasis"
                  :class="{
                    'text-success': props.data_order?.status === 'Selesai',
                    'text-error': props.data_order?.status === 'Batal',
                    'text-warning': props.data_order?.status === 'Pending',
                    'text-primary': props.data_order?.status === 'Diproses'
                  }"
                >{{ props.data_order?.status }}</div>
                <h4 v-if="props.data_order?.meta.created_at" class="text-h4">{{ getTimeDiff(props.data_order?.meta.created_at) }}</h4>
                <i v-if="props.data_order?.meta.updated_at" class="text-subtitle-2 text-disabled">
                  Diubah {{ getTimeDiff(props.data_order?.meta.updated_at) }}
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
                      'text-success': props.data_order?.payment_status === 'Selesai',
                      'text-error': props.data_order?.payment_status === 'Gagal',
                      'text-warning': props.data_order?.payment_status === 'Pending',
                    }"
                  > Pembayaran {{ props.data_order?.payment_status }}
                  </span>
                  <div>
                    Total Harga: <span class="text-h4 text-high-emphasis ml-1">{{ formatRupiah(props.data_order?.amount ?? 0) }}</span>
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
              class="text-disabled"
              variant="plain"
              size="small"
              @click="
                openOverlay({
                  component: UpdateOrder,
                  props: {
                    data_order: props.data_order,
                    data_menu: props.data_menu,
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
            v-for="(item, index) in props.data_order?.items" 
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
                <div 
                  v-if="props.data_order?.payment_status === 'Selesai'"
                  class="text-subtitle-2 text-medium-emphasis"
                >
                  <div class="text-error" v-if="item.status === 'Refund'" >
                    Refund
                  </div>
                  <div v-else>
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
                  <div v-if="item.status === 'Pending'">
                    <v-btn 
                      color="warning" 
                      variant="tonal"
                      size="small"
                      :disabled="loading"
                      :loading="loading"
                      @click="
                        openOverlay({
                          component: Blank,
                          props: {
                            confirmToContinue: true,
                            confirmMessage: 'Apakah anda yakin ingin memproses pesanan ini?',
                            onConfirm: () => {
                              update({
                                id: props.data_order?.id!,
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
                  <div v-else-if="item.status === 'Diproses'">
                    <v-btn 
                      color="primary"
                      variant="tonal"
                      size="small"
                      :disabled="loading"
                      :loading="loading"
                      @click="
                        openOverlay({
                          component: Blank,
                          props: {
                            confirmToContinue: true,
                            confirmMessage: 'Apakah anda yakin pesanan ini sudah siap saji?',
                            onConfirm: () => {
                              update({
                                id: props.data_order?.id!,
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
                  <div v-else-if="item.status === 'Tersaji'" class="text-success">
                    Selesai
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
        <!-- <v-row v-if="(userStore.hasRole(['Admin', 'Pemilik', 'Dapur'])) && props.data_order?.payment_status === 'Pending'">
          <v-col cols="12" v-if="props.data_order.status === 'Pending'">
            <v-btn 
              color="warning" 
              block
              :disabled="loading"
              :loading="loading"
              @click="
                openOverlay({
                  component: Blank,
                  props: {
                    confirmToContinue: true,
                    confirmMessage: 'Apakah anda yakin ingin memproses pesanan ini?',
                    onConfirm: () => {
                      update({
                        id: props.data_order?.id!,
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
          <v-col cols="12" v-if="props.data_order.status === 'Diproses'">
            <v-btn 
              color="primary"
              block
              :disabled="loading"
              :loading="loading"
              @click="
                openOverlay({
                  component: Blank,
                  props: {
                    confirmToContinue: true,
                    confirmMessage: 'Apakah anda yakin ingin pesanan ini siap saji?',
                    onConfirm: () => {
                      update({
                        id: props.data_order?.id!,
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
        <div v-if="(userStore.hasRole(['Admin', 'Pemilik', 'Kasir', 'Dapur'])) && props.data_order?.payment_status === 'Pending'">
          <v-divider class="my-3"></v-divider>
          <v-row class="d-flex justify-space-between align-center">
            <v-col cols="auto">
              <v-btn 
                v-if="userStore.hasRole(['Admin', 'Pemilik', 'Dapur'])"
                color="error"
                block
                variant="plain"
                prepend-icon="mdi-delete"
                size="small"
                :disabled="loading"
                :loading="loading"
                @click="
                  openOverlay({
                    component: Blank,
                    props: {
                      confirmToContinue: true,
                      confirmMessage: 'Apakah anda yakin ingin membatalkan pesanan ini?',
                      onConfirm: () => {
                        update({
                          id: props.data_order?.id!,
                          status: 'Batal',
                        }),
                        props.refresh()
                        emit('close')
                      }
                    },
                  })"
              >
                Batalkan
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                v-if="userStore.hasRole(['Admin', 'Pemilik', 'Kasir'])"
                color="success"
                block
                :disabled="loading"
                :loading="loading"
                @click="
                  openOverlay({
                    component: Payment,
                    props: {
                      data: props.data_order,
                      paymentSucceded: () => {
                        props.refresh()
                      }
                    },
                  })
                "
              >
                Pembayaran
              </v-btn>
            </v-col>
          </v-row>
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