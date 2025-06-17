<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { cloneDeep, create } from 'lodash';

import type { Category } from '@/types/inventory';
import type { Menu } from '@/types/menu'
import type { CreateOrderPayload, Order } from '@/types/order';
import type { Employee } from '@/types/employee';

import { getSuggestedTotalCash } from '@/utils/helpers/payment'
import { formatRupiah, formatRupiahInput } from '@/utils/helpers/currency';

const emit = defineEmits<{
  (e: 'create-order', payload: CreateOrderPayload): Order
  (e: 'process-direct-payment', payload: { order: CreateOrderPayload, payment_method: string }): Order
}>();

const props = defineProps<{
  user: Employee;
  data: Menu[];
  categories: Category[];
  branch: string;
  loading: boolean;
}>();

const currentOrder = ref<Order | null>(null)
const selectedCtg = ref<string | null>('all')

const formRef = ref()
const isFormValid = ref(false)

const showOverlayCreateOrder = ref(false)
const showDetailOrder = ref(false)
const showConfirmDialog = ref(false)
const pendingOverlayClose = ref(false)
const showOverlayInputItem = ref(false)
const showOverlayPayment = ref(false)

const paymentMethod = ref('')
const cashInput = ref('')
const cashNumber = ref(0)
const currentItem = ref({
  id: '',
  name: '',
  description: '',
  price: 0
})
const itemPayload = ref({
  id: '',
  quantity: 1,
  note: ''
})

const orderPayload = ref<{
  branch_id: string | null,
  employee_id: string | null,
  table_number: string | null,
  customer: {
    name: string | null,
    phone: string | null,
  },
  is_take_away: boolean | null,
  items: {
    id: string
    name: string
    quantity: number
    note: string
    price: number
  }[],
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
const booleanReqRules = [(v: boolean) => v !== null || 'Data tidak boleh kosong']
const noteRules = [(v: string) => v.length <= 100 || 'Maks 100 karakter']
const qtyRules = [(v: number) => !!v || 'Jumlah tidak boleh kosong', (v: number) => v >= 0 || 'Jumlah tidak boleh kurang dari 0']
const amtRules = [
  (v: string) => !!v || 'Jumlah tidak boleh kosong',
  (v: string) => {
    const numeric = Number(v.replace(/\D/g, ''))
    return numeric >= 0 || 'Jumlah tidak boleh kurang dari 0'
  }
]

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

const totalPrice = computed(() => {
  if (!orderPayload.value.items?.length) return 0
  return orderPayload.value.items.reduce((prev, curr) => prev + (curr.price ?? 0) * curr.quantity, 0)
})

const isItemChanged = computed(() => {
  if (!itemPayload.value) return false
  return itemPayload.value.quantity > 1 || itemPayload.value.note !== ''
})

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

function openAddItem(menu: Menu) {
  showOverlayInputItem.value = true

  if (!currentItem.value) return

  currentItem.value.id = menu.id
  itemPayload.value.id = menu.id
  currentItem.value.name = menu.name
  currentItem.value.description = menu.description
  currentItem.value.price = menu.price
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

  paymentMethod.value = ''
  cashInput.value = ''
  cashNumber.value = 0
}

function resetItem() {
  currentItem.value = {
    id: '',
    name: '',
    description: '',
    price: 0
  }

  itemPayload.value = {
    id: '',
    quantity: 1,
    note: ''
  }
}

function addItemToCart() {
  pendingOverlayClose.value = true
  showOverlayInputItem.value = false

  // Cek apakah item dengan id dan note yang sama sudah ada
  const existingItem = orderPayload.value.items.find(item => 
    item.id === itemPayload.value.id && item.note === itemPayload.value.note
  );

  console.log('existingItem', existingItem)
  console.log('itemPayload', itemPayload.value)

  if (existingItem) {
    // Jika item sudah ada, hanya tambahkan kuantitasnya
    existingItem.quantity += itemPayload.value.quantity;
  } else {
    // Jika item belum ada, tambahkan item baru ke keranjang
    orderPayload.value.items.push({
      id: itemPayload.value.id,
      name: currentItem.value.name,
      quantity: itemPayload.value.quantity,
      note: itemPayload.value.note,
      price: currentItem.value.price
    });
  }

  resetItem()
}

function openCreateOrder() {
  currentOrder.value = null
  showOverlayCreateOrder.value = true
}


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

function processDirectPayment(paymentMethod: string) {
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

  emit('process-direct-payment', {
    order: payload,
    payment_method: paymentMethod
  })
  
  pendingOverlayClose.value = true
  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    createOrder()
  })
}

function confirmCancel() {
  if (currentOrder.value) currentOrder.value = null
  if (itemPayload.value) resetItem()

  resetOrder()

  pendingOverlayClose.value = true
  showConfirmDialog.value = false

  if (showOverlayInputItem.value) {
    showOverlayCreateOrder.value = true
    showOverlayInputItem.value = false
  } else {
    showOverlayCreateOrder.value = false
    showOverlayInputItem.value = false
    showOverlayPayment.value = false
  }
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

watch(showOverlayCreateOrder, (isOpen, wasOpen) => {
  // Ketika overlay akan ditutup (false) dari keadaan terbuka (true)
  if (!isOpen && wasOpen) {
    if (pendingOverlayClose.value) {
      // Jika user sudah setuju menutup lewat konfirmasi
      pendingOverlayClose.value = false
      return
    }

    // Jika ada perubahan tapi belum dikonfirmasi, batalkan penutupan overlay dan tampilkan dialog
    if (isChanged.value) {
      showOverlayCreateOrder.value = true
      pendingOverlayClose.value = true
      showConfirmDialog.value = true
    }
  }
})

watch(showOverlayInputItem, (isOpen, wasOpen) => {
  // Ketika overlay akan ditutup (false) dari keadaan terbuka (true)
  if (!isOpen && wasOpen) {
    if (pendingOverlayClose.value) {
      // Jika user sudah setuju menutup lewat konfirmasi
      showDetailOrder.value = false
      pendingOverlayClose.value = false
      return
    }
  }

  if (isItemChanged.value) {
    showOverlayInputItem.value = true
    pendingOverlayClose.value = true
    showConfirmDialog.value = true
  }

})

watch(() => cashInput.value, (val) => {
  const numeric = val.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  cashNumber.value = numeric ? Number(numeric) : 0
})
</script>

<template>
  <v-card
    class="bg-primary overflow-hidden bubble-shape-sm"
    elevation="0"
    rounded="md"
    @click="openCreateOrder"
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

  <v-overlay 
    v-model="showOverlayCreateOrder" 
    class="d-flex align-center justify-center "
    fullscreen
    scroll-strategy="none"
  >
    <v-card 
      class="rounded-lg pa-6 mt-8 bg-white height-screen"
      style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 95dvh; scrollbar-width: none;"
    >
      <v-form ref="formRef" v-model="isFormValid">
        <div class="d-flex align-center ga-4 mb-4">
          <v-btn color="darkprimary" icon rounded="sm" variant="flat">
            <ShoppingCartIcon stroke-width="1.5" width="20" />
          </v-btn>
          <v-row>
            <v-col cols="12">
              <h4 class="text-h4 font-weight-medium"> Pesanan Baru: </h4> 
              <v-row>
                <v-col cols="7">
                  <v-select
                  class="small-font"
                  density="compact"
                  v-model="orderPayload.is_take_away"
                    :items="[
                      { value: false, text: 'Makan di Tempat' },
                      { value: true, text: 'Bawa Pulang' }
                    ]"
                    item-title="text"
                    item-value="value"
                    placeholder="Bawa Pulang?"
                    variant="plain"
                    :prepend-inner-icon="orderPayload.is_take_away == true ? 'mdi-store-outline' : 'mdi-food'"
                    :rules="booleanReqRules"
                    single-line
                    hide-details
                    />
                  </v-col>
                  <v-divider vertical class="my-4"></v-divider>
                  <v-col cols="5">
                    <v-text-field
                      v-model="orderPayload.table_number"
                      placeholder="Nomor Meja"
                      :rules="requieredRules"
                      variant="plain"
                      class="small-font text-medium-emphasis table-number-input"
                      single-line
                      hide-details
                      />
                  </v-col>
                </v-row>
            </v-col>
          </v-row>
        </div>

        <div class="mt-4" v-if="!loading">
          <v-expand-transition>
            <div v-if="!showDetailOrder">
            <v-row>
              <v-col cols="12" class=" mb-2">
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

            <perfect-scrollbar v-bind:style="{ height: '30dvh' }">
              <v-list v-if="currentData.length > 0" class="py-0">
                <v-list-item
                  v-for="(item, i) in currentData"
                  :key="i"
                  :value="item"
                  color="secondary"
                  rounded="sm"
                  @click="openAddItem(item)"
                  >
                  <v-divider v-if="i > 0 && i < currentData.length" class="my-3"></v-divider>
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
                    <v-col cols="4" class="text-right my-auto">
                      <h5 class="text-h5 text-medium-emphasis">
                        {{ formatRupiah(item?.price) }}
                      </h5>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </perfect-scrollbar>
            </div>
          </v-expand-transition>

          <div v-if="currentData.length === 0" class="text-subtitle-1 text-medium-emphasis">
            Tidak ada data
          </div>

          <!-- Preview Cart -->
          <div class="text-center" v-if="showDetailOrder">
            <v-btn 
              icon
              variant="text"
              size="x-small"
              class="text-center">
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
          </div>
          <v-card
            class="bg-primary overflow-hidden bubble-shape-sm my-1"
            rounded="md"
            @click="showDetailOrder = !showDetailOrder"
          >
            <v-card-text>
              <div class="text-center mb-1">
                Tinjau Pesanan
              </div>
              <v-btn 
                icon 
                class="position-absolute" 
                variant="text" 
                style="top: 8px; right: 12px;" 
              >
                <v-icon>{{ showDetailOrder ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'}}</v-icon>
              </v-btn>
              <v-row>
                <v-col cols="7">
                  <div @click.stop>
                    <v-text-field
                      class="small-font"
                      density="compact"
                      v-model="orderPayload.customer.name"
                      placeholder="Nama Pembeli"
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
                      placeholder="Nomor Telepon"
                      variant="plain"
                      prepend-inner-icon="mdi-phone"
                      single-line
                      hide-details
                      hide-spin-buttons
                    />
                  </div>
                </v-col>
                <v-col cols="5" class="text-right my-auto">
                  <div class="small-font">
                    {{ orderPayload?.items.length }} item
                  </div>
                  <h4 :class="totalPrice > 1000000 ? 'text-h5' : 'text-h4'">
                    {{  formatRupiah(totalPrice) }}
                  </h4>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <div class="text-center" v-if="!showDetailOrder">
            <v-btn 
              icon
              variant="text"
              size="x-small"
              class="text-center">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </div>
          
          <!-- Daftar Cart Item -->
          <v-expand-transition>
            <div v-if="showDetailOrder" class="mt-4">
              <h4 class="text-h4">Daftar Item:</h4>
            <div class="mt-2" v-if="orderPayload.items.length > 0">
              <perfect-scrollbar class="scrollable" style="max-height: 30dvh; overflow-y: scroll; overflow-x: hidden;">
                <v-list-item v-for="(item, index) in orderPayload.items" :key="index" class="px-1">
                  <v-divider v-if="index > 0" class="my-2"></v-divider>
                  <v-row align="center">
                    <v-col cols="6" class="ml-0">
                      <div class="font-weight-medium">{{ item.name }}</div>
                      <div class="text-h6 text-medium-emphasis d-flex ga-2">Catatan: 
                        <div v-if="!item.note">
                          -
                        </div>
                        <v-textarea
                          v-else
                          v-model="item.note"
                          class="small-font text-disabled text-area-custom"
                          density="compact"
                          variant="plain"
                          rows="2"
                          auto-grow
                          hide-details
                          single-line
                        />
                      </div>
                    </v-col>
                    <v-col cols="1">
                      <v-btn
                        icon
                        variant="text"
                        size="x-small"
                        class="text-center text-error"
                        @click="removeItem(index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="5" class="text-right align-top pt-0 pe-0">
                      <v-number-input
                        v-model="item.quantity"
                        control-variant="split"
                        variant="plain"
                        :min="1"
                        :max="currentData.find((item: any) => item.id === currentItem?.id)?.quantity"
                        :rules="qtyRules"
                        single-line
                        hide-details
                        inset
                      />
                    </v-col>
                  </v-row>
                </v-list-item>
              </perfect-scrollbar>
            </div>
            <div v-else>
              <h5 class="text-h5 text-disabled text-center mt-2">Belum ada item</h5>
            </div>
          </div>
        </v-expand-transition>
          
          <!-- Tombol -->
          <v-divider class="my-4"></v-divider>
          <v-row >
            <v-col cols="12" class="pa-2">
              <v-btn 
                block
                color="success"
                :disabled="!isFormValid || orderPayload.items.length === 0 || props.loading"
                :loading="props.loading"
                @click="showOverlayPayment = true"
              >Langsung Bayar</v-btn>
            </v-col>
            <v-col cols="6" class="pa-2">
              <v-btn 
                block
                color="error"
                variant="outlined"
                @click="showOverlayCreateOrder = false"
              >Batal</v-btn>
            </v-col>
            <v-col cols="6" class="pa-2">
              <v-btn 
                block
                color="primary"
                :disabled="!isFormValid || orderPayload.items.length === 0 || props.loading"
                :loading="props.loading"
                @click="submitForm()"
              >Simpan</v-btn>
            </v-col>
          </v-row>
        </div>
        <!-- Menambahkan Skeleton Loader untuk menunggu data -->
        <div v-else>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>
      </v-form>
    </v-card>
  </v-overlay>
  
   <!-- Overlay Input Item Baru -->
  <v-overlay 
    v-model="showOverlayInputItem" 
    class="d-flex align-center justify-center"
    fullscreen
    scroll-strategy="none"
  >
    <v-card 
      class="rounded-lg pa-6 height-screen"
      style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 95dvh; scrollbar-width: none;"
    >
    <h4 class="text-h4 mb-6">Tambah Item</h4>
    <!-- Close button -->
    <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="showOverlayInputItem = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    
    <v-row class="align-center">
      <v-col cols="5">
        <h4 class="text-h4 text-medium-emphasis text-center">
          <div>{{ currentItem?.name }}</div>
          <div>{{ formatRupiah(currentItem?.price) }}</div>
        </h4>
      </v-col>
      <v-divider vertical inset></v-divider>
      <v-col cols="6">
        <div class="text-subtitle-1 text-disabled">
          {{ currentItem?.description }}
        </div>
      </v-col>
    </v-row>
        <div class="mx-auto mt-2 w-50">
          <v-number-input 
          v-model="itemPayload.quantity" 
          label="Jumlah"
          control-variant="split"
          variant="plain"
          :min="1" 
          :max="currentData.find((item: any) => item.id === currentItem?.id)?.quantity"
          :rules="qtyRules"
          single-line
          />
        </div>
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="itemPayload.note" 
              label="Catatan"
              variant="filled"
              :rules="noteRules"
              rows="3"
              auto-grow
              prepend-inner-icon="mdi-text-long"
              clear-icon="mdi-close"
              clearable
              counter
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn
              variant="text" 
              @click="showOverlayInputItem = false"
            >Batal</v-btn>
            <v-btn
              color="primary" 
              @click="addItemToCart"
            >Tambah</v-btn>
          </v-col>
        </v-row>
    </v-card>
  </v-overlay>

  <!-- Overlay Bayar -->
   <v-overlay
    v-model="showOverlayPayment"
    fullscreen
    scroll-strategy="none"
    class="d-flex justify-center align-start"
  >
    <v-card
      class="rounded-lg pa-6 mt-8 bg-white height-screen"
      style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 95dvh; scrollbar-width: none;"
    >
      <!-- Close button -->
      <v-btn
        icon
        variant="text"
        style="position:absolute; top:8px; right:12px;" 
        @click="showOverlayPayment = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <h4 class="text-h4">Pembayaran</h4>
      <v-divider class="my-2"></v-divider>

      <div class="text-center mb-4">
        <div class="text-subtitle-2 text-medium-emphasis"> Total Pembayaran</div>
        <h1 class="text-h1">{{ formatRupiah(totalPrice ?? 0) }}</h1>
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
            v-for="amount in getSuggestedTotalCash(totalPrice || 0)"
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
        v-if="paymentMethod === 'cash' && totalPrice && cashNumber !== 0 && cashNumber >= totalPrice"
        class="text-subtitle-2 text-medium-emphasis mt-6 text-center"
      >
        Total Kembalian: 
        <div class="text-h4">{{ formatRupiah(cashNumber - totalPrice) }}</div>
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
            @click="processDirectPayment(paymentMethod)"
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

.table-number-input  {
  margin-top: -14px;
}

.text-area-custom .v-field__input{
  padding-top: 0 ;
  min-height: 0.7rem;
  mask-image: none;
}
</style>