<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { cloneDeep, create } from 'lodash';

import type { Category } from '@/types/inventoryItem';
import type { Menu } from '@/types/menu'
import type { CreateOrderPayload } from '@/types/order';
import type { Employee } from '@/types/employee';

import { formatRupiah } from '@/utils/helpers/currency';
import { copyToClipboard } from '@/utils/helpers/clipboard';

const emit = defineEmits<{
  (e: 'create-order', payload: CreateOrderPayload): void
}>();

const props = defineProps<{
  user: Employee;
  data: Menu[];
  categories: Category[];
  branch: string;
  loading: boolean;
}>();

const currentOrder = ref<Menu | null>(null)
const formRef = ref()
const isFormValid = ref(false)
const selectedCtg = ref<string | null>('all')
const showOverlay = ref(false)
const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false)
const isPayNow = ref<boolean | null>(null)

const orderPayload = ref<{
  branch_id: string | null,
  employee_id: string | null,
  table_number: string | null,
  customer: {
    name: string | null,
    phone: string | null,
  },
  is_take_away: boolean | null,
  items: any[],
}>({
  branch_id: null,
  employee_id: null,
  table_number: null,
  customer: {
    name: null,
    phone: null,
  },
  is_take_away: null,
  items: [],
})

const requieredRules = [(v: string) => !!v || 'Data tidak boleh kosong']
const descRules = [(v: string) => v.length <= 100 || 'Maks 100 karakter']
const qtyRules = [
  (v: string) => !!v || 'Jumlah tidak boleh kosong',
  (v: string) => {
    const numeric = Number(v.replace(/\D/g, ''))
    return numeric >= 0 || 'Jumlah tidak boleh kurang dari 0'
  }
]

function openDetail(request: Menu) {
  currentOrder.value = cloneDeep(request)
  showOverlay.value = true
}

function resetOrder() {
  orderPayload.value = {
    branch_id: null,
    employee_id: null,
    table_number: null,
    customer: {
      name: null,
      phone: null,
    },
    is_take_away: null,
    items: [],
  }

  isPayNow.value = null
}

function openAddNew() {
  currentOrder.value = null
  showOverlay.value = true
}

const categories = computed(() => [{ id: 'all', name: 'Semua' }, ...props.categories])

const filteredByBranchData = computed(() => {
  if (props.branch === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx.branch.id === props.branch
  );
});

const currentData = computed(() => {
  if (!props.data?.length || !selectedCtg.value) return []
  if (selectedCtg.value === 'all') return filteredByBranchData.value
  return filteredByBranchData.value.filter(item => item.category?.id === selectedCtg.value)
})

function createOrder() {
  if (!orderPayload.value) return

  const payload: CreateOrderPayload = {
    branch_id: orderPayload.value.branch_id ?? '',
    employee_id: orderPayload.value.employee_id ?? '',
    table_number: orderPayload.value.table_number ?? '',
    customer:  {
      name: orderPayload.value.customer.name ?? '',
      phone: orderPayload.value.customer.phone ?? '',
    },
    is_take_away: orderPayload.value.is_take_away ?? null,
    items: orderPayload.value.items
  }

  emit('create-order', payload)
  
  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    createOrder()
  })
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false

  if (currentOrder.value) currentOrder.value = null

  resetOrder()
}

const isChanged = computed(() => {
  if (!orderPayload.value) return false

  return (
    orderPayload.value.branch_id !== null ||
    orderPayload.value.employee_id !== null ||
    orderPayload.value.table_number !== null ||
    orderPayload.value.customer?.name !== null ||
    orderPayload.value.customer?.phone !== null ||
    orderPayload.value.is_take_away !== null ||
    orderPayload.value.items.length > 0
  )
})

const totalPrice = computed(() => {
  if (!orderPayload.value.items?.length) return 0
  return orderPayload.value.items.reduce((prev, curr) => prev + curr.price * curr.quantity, 0)
})

function addItem() {
  if (!orderPayload.value.items) orderPayload.value.items = []
  orderPayload.value.items.push({
    id: '',
    quantity: 1,
    note: ''
  })
}

function removeItem(index: number) {
  if (orderPayload.value.items && orderPayload.value.items.length > index) {
    orderPayload.value.items.splice(index, 1)
  }
}

watch(
  () => props.categories,
  (newCategories) => {
    if (newCategories?.length && !selectedCtg.value) {
      selectedCtg.value = newCategories[0].id
    }
  },
  { immediate: true }
)

watch(showOverlay, (isOpen, wasOpen) => {
  // Ketika overlay akan ditutup (false) dari keadaan terbuka (true)
  if (!isOpen && wasOpen) {
    if (pendingOverlayClose.value) {
      // Jika user sudah setuju menutup lewat konfirmasi
      pendingOverlayClose.value = false
      return
    }

    // Jika ada perubahan tapi belum dikonfirmasi, batalkan penutupan overlay dan tampilkan dialog
    if (isChanged.value) {
      showOverlay.value = true
      pendingOverlayClose.value = true
      showConfirmDialog.value = true
    }
  }
})
</script>

<template>
  <v-card
    class="bg-primary overflow-hidden bubble-shape-sm mb-6"
    elevation="0"
    rounded="md"
  >
    <v-card-text>
      <div class="d-flex align-center ga-4">
        <v-btn color="darkprimary" icon rounded="sm" variant="flat">
          <ShoppingCartIcon stroke-width="1.5" width="20" />
        </v-btn>
        <span>
          <h4 class="text-h4 font-weight-medium"> Buat Pesanan </h4>
        </span>
      </div>
    </v-card-text>
  </v-card>

  <!-- nanti pisah jadi overlay -->
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <div class="d-flex align-center ga-4 mb-4">
          <v-btn color="darkprimary" icon rounded="sm" variant="flat">
            <ShoppingCartIcon stroke-width="1.5" width="20" />
          </v-btn>
          <span>
            <h4 class="text-h4 font-weight-medium"> Pesanan Baru </h4>
          </span>
        </div>

        <v-row>
          <v-col cols="12">
            <v-select
              color="primary"
              variant="outlined"
              hide-details
              v-model="selectedCtg"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Pilih Kategori"
              :loading="loading"
              :return-object="false"
              single-line
            />
          </v-col>
        </v-row>

        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-if="loading">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>

        <div class="mt-4" v-if="!loading">
          <perfect-scrollbar v-bind:style="{ height: '180px' }">
            <v-list v-if="currentData.length > 0" class="py-0">
              <v-list-item
                v-for="(item, i) in currentData"
                :key="i"
                :value="item"
                color="secondary"
                rounded="sm"
                @click="openDetail(item)"
              >
              <v-row>
                <!-- Kolom kiri -->
                  <v-col cols="8">
                    <div v-if="item?.quantity <= 10" class="text-subtitle-2 text-medium-emphasis">
                      <i> Stok sisa: {{ item?.quantity }} </i>
                    </div>
                    <h4 class="text-h4 text-medium-emphasis font-weight-bold">
                      {{ item?.name }}
                    </h4>
                    <div class="text-subtitle-2 text-medium-emphasis text-success">
                      {{ item?.description }}
                    </div>
                  </v-col>

                  <!-- Kolom kanan -->
                  <v-col cols="4" class="text-right">
                    <h5 class="text-h5 text-medium-emphasis">
                      {{ formatRupiah(item?.price) }}
                    </h5>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>

          <div v-if="currentData.length === 0" class="text-subtitle-1 text-medium-emphasis">
            Tidak ada data
          </div>

          <!-- Preview Cart -->
          <v-card
            class="bg-primary overflow-hidden bubble-shape-sm my-6"
            rounded="md"
          >
            <v-card-text>
              <v-form ref="formRef" v-model="isFormValid">
                <div class="text-center mb-1">
                  Tinjau Pesanan
                </div>
                <v-btn icon class="position-absolute" density="comfortable" variant="text" style="top: 8px; right: 12px;" @click="showOverlay = false">
                  <v-icon>mdi-fullscreen</v-icon>
                </v-btn>
                <v-row>
                  <v-col cols="7">
                    <div>
                      <v-text-field
                        class="small-font"
                        density="compact"
                        v-model="orderPayload.customer.name"
                        label="Nama Pembeli"
                        :rules="requieredRules"
                        variant="plain"
                        prepend-inner-icon="mdi-account"
                        single-line
                        hide-details
                      />
                      <v-text-field
                        type="number"
                        class="small-font"
                        density="compact"
                        v-model="orderPayload.customer.phone"
                        label="Nomor Telepon"
                        variant="plain"
                        prepend-inner-icon="mdi-phone"
                        single-line
                        hide-details
                      />
                      <v-select
                        class="small-font"
                        density="compact"
                        v-model="orderPayload.is_take_away"
                        :items="[
                          { value: 'true', text: 'Makan di Tempat' },
                          { value: 'false', text: 'Bawa Pulang' }
                        ]"
                        item-title="text"
                        item-value="value"
                        label="Bawa Pulang?"
                        variant="plain"
                        :prepend-inner-icon="orderPayload.is_take_away == true ? 'mdi-store-outline' : 'mdi-food'"
                        single-line
                        hide-details
                      />
                      <v-select
                        class="small-font"
                        density="compact"
                        v-model="isPayNow"
                        :items="[
                          { value: true, text: 'Bayar Sekarang'},
                          { value: false, text: 'Bayar Nanti'}
                        ]"
                        item-title="text"
                        item-value="value"
                        label="Pembayaran"
                        variant="plain"
                        :prepend-inner-icon="isPayNow ? 'mdi-cash' : 'mdi-cash-clock'"
                        single-line
                        hide-details
                      />
                    </div>
                    <div class="">
                    </div>
                  </v-col>
                  <v-col cols="5" class="text-right my-auto">
                    <div class="small-font">
                      {{ orderPayload?.items.length }} item
                    </div>
                    <h4 class="text-h4">
                      {{  formatRupiah(totalPrice) }}
                    </h4>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <!-- <div class="text-center mb-1">
              <v-btn 
                icon
                variant="text"
                size="x-small"
                class="text-center">
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </div> -->
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
  
  
  
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
</style>