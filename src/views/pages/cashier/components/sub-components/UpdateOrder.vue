<script setup lang="ts">
import { ref, computed, watchEffect, watch } from 'vue'
import { formatRupiah } from '@/utils/helpers/currency'

import type { Category } from '@/types/inventory'
import type { Menu, MenuSale } from '@/types/menu'
import type { CreateOrderPayload, Order, OrderItem, UpdateOrderPayload } from '@/types/order'

import { useUserStore } from '@/stores/authUser'
const userStore = useUserStore()

import { useCurrentOrders } from '@/composables/useCurrentOrder'
import { useOverlayManager } from '@/composables/non-services/useOverlayManager'
import Payment from './Payment.vue'
import AddToChart from './AddToChart.vue'
import Blank from '@/components/shared/Blank.vue'
import { cloneDeep } from 'lodash'
import { useAlertStore } from '@/stores/alert'

const { openOverlay } = useOverlayManager()
const { create, update, loading: lo } = useCurrentOrders()

const emit = defineEmits(['close'])

const props = defineProps<{
  is_create?: boolean
  data_order?: Order
  data_menu: MenuSale[]
  categories: Category[]
  refresh: () => void
  onIsChangedUpdate?: (val: boolean) => void
}>()

const formRef = ref()
const isFormValid = ref(false)

const selectedCtg = ref<string | null>('all')

const itemInChart = ref<(Pick<OrderItem, 'id' | 'item_id' | 'quantity' | 'status' | 'note'> & Omit<Menu, "branch" | "meta" | "category">)[]>(
  props.data_order ? cloneDeep(props.data_order.items) : []
);

const totalPrice = computed(() => {
  payload.value.amount = itemInChart.value.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
  return payload.value.amount
})

const showDetailOrder = ref(false)

const payload = ref<CreateOrderPayload>({
  branch_id: userStore.me?.activity?.branch?.id || '',
  table_number: props.data_order ? props.data_order.table_number : '',
  customer: props.data_order ? props.data_order.customer : {
    name: '',
    phone: '',
  },
  is_take_away: props.data_order ? props.data_order.is_take_away : false,
  items: props.data_order ? props.data_order.items.map((item) => ({
    id: item.id,
    item_id: item.item_id,
    quantity: item.quantity,
    note: item.note || '', // default to an empty string if note is undefined
  })) : [],
  amount: props.data_order ? props.data_order.amount : 0
})

const requieredRules = [(v: string) => !!v || 'Data tidak boleh kosong']
const booleanReqRules = [(v: boolean) => v !== null || 'Data tidak boleh kosong']

const select_ctgs = computed(() => [{ id: 'all', name: 'Semua' }, ...props.categories])

const currentData = computed(() => {
  // if (!props.data_menu?.length || !selectedCtg.value) return []
  if (selectedCtg.value === 'all') return props.data_menu
  return props.data_menu.filter(item => item.category?.id === selectedCtg.value)
})

const isChanged = computed(() => {
  if (props.is_create) {
    return (
      payload.value.branch_id !== null ||
      payload.value.table_number !== null ||
      payload.value.customer?.name !== null ||
      payload.value.customer?.phone !== null ||
      payload.value.is_take_away !== null ||
      itemInChart.value.length > 0
    )
  } else {
    return (
      payload.value.branch_id !== props.data_order?.branch.id ||
      payload.value.table_number !== props.data_order?.table_number ||
      payload.value.customer?.name !== props.data_order?.customer.name ||
      payload.value.customer?.phone !== props.data_order?.customer.phone ||
      payload.value.is_take_away !== props.data_order?.is_take_away ||
      itemInChart.value.length !== props.data_order?.items.length
    )
  }
})

watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})

async function processOrder() {
  if (!payload.value) return

  payload.value.items = itemInChart.value.map((item) => ({
    id: item.id,
    item_id: item.item_id,
    quantity: item.quantity,
    note: item.note!,
  }))
  payload.value.amount = totalPrice.value
  console.log('items: ',payload.value.items)

  if (props.is_create) {
    await create(payload.value)
  } else {
    const updatePayload: UpdateOrderPayload = {
      id: props.data_order?.id ?? '',
      branch_id: payload.value.branch_id ?? '',
      table_number: payload.value.table_number ?? '',
      customer:  {
        name: payload.value.customer.name ?? '',
        phone: payload.value.customer.phone ?? '',
      },
      is_take_away: payload.value.is_take_away,
      items: payload.value.items,
      amount: payload.value.amount
    }

    await update(updatePayload)
  }
  props.refresh()
  emit('close')
}

/* ================
ADD ITEM SECTION
=============== */
const currentItem = ref({
  id: '',
  name: '',
  description: '',
  price: 0
})

// const isItemChanged = computed(() => {
//   if (!itemInChart.value) return false
//   return itemInChart.value.quantity > 1 || itemInChart.value.note !== ''
// })

const qtyRules = (idx: number) => [
  (v: number) => !!v || 'Wajib isi',
  (v: number) => v >= 1 || 'Minimal 1',
  (v: number) => v <= getMaxForRow(idx) || `Maksimal ${getMaxForRow(idx)}`
]

function onQtyChange(idx: number, val: number) {
  const max = getMaxForRow(idx)
  if (val > max) itemInChart.value[idx].quantity = max
  if (val < 1) itemInChart.value[idx].quantity = 1
}


// sisa stok real-time untuk suatu menu (memperhitungkan keranjang saat ini)
const getRemainingStock = (menuId: string) => {
  const menu = props.data_menu.find(m => m.id === menuId)
  if (!menu) return 0
  const taken = itemInChart.value
    .filter(i => i.status === 'Pending' && i.item_id === menuId)
    .reduce((sum, i) => sum + i.quantity, 0)
  return Math.max(menu.quantity - taken, 0)
}

// maksimum untuk membuat BARIS BARU (add item)
const getMaxForNewLine = (menuId: string) => {
  return getRemainingStock(menuId)
}

// maksimum untuk MENGEDIT baris yang sudah ada
// logika: (sisa stok di luar baris ini) + (qty baris ini)
const getMaxForRow = (rowIndex: number) => {
  const row = itemInChart.value[rowIndex]
  if (!row) return 0
  const menu = props.data_menu.find(m => m.id === row.item_id)
  if (!menu) return 0

  const takenByOthers = itemInChart.value
    .filter((i, idx) => i.status === 'Pending' && i.item_id === row.item_id && idx !== rowIndex)
    .reduce((sum, i) => sum + i.quantity, 0)

  const remainingExcludingThis = Math.max(menu.quantity - takenByOthers, 0)
  return remainingExcludingThis // ini sudah termasuk “+ current row qty” karena row.qty tidak dihitung di takenByOthers
}

function openAddItem(menu: Menu) {
  if (!currentItem.value) return

  currentItem.value.id = menu.id
  currentItem.value.name = menu.name
  currentItem.value.description = menu.description
  currentItem.value.price = menu.price

  // openOverlay input item
  openOverlay({
    component: AddToChart,
    props: {
      menu: menu,
      max: getMaxForNewLine(menu.id),
      // menus: props.data_menu,
      onSubmit: (data: OrderItem) => {
        addItemToCart(data)
      }
    }
  })
}


function resetItem() {
  currentItem.value = {
    id: '',
    name: '',
    description: '',
    price: 0
  }
}

function addItemToCart(data: Pick<OrderItem, 'id' | 'item_id' | 'quantity' | 'note'>) {
  const menu = props.data_menu.find(m => m.id === data.item_id)
  if (!menu) return

  // Sisa stok untuk baris BARU (sebelum gabung)
  const maxNew = getMaxForNewLine(data.item_id)
  if (maxNew <= 0) {
    useAlertStore().showAlert('Stok menu tidak cukup', 'error')
    return
  }

  // Cek apakah item dengan id dan note yang sama sudah ada
  const existingItem = itemInChart.value
    .filter(item => item.status === 'Pending')
    .find(item => item.item_id === data.item_id && item.note?.trim() === data.note?.trim()
  );

  if (existingItem) {
    // Jika item sudah ada, hanya tambahkan kuantitasnya
    existingItem.quantity += data.quantity;
  } else {
    // Jika item belum ada, tambahkan item baru ke keranjang
    
    itemInChart.value.push({
      id: data.id,
      item_id: menu?.id ?? '',
      name: menu?.name ?? '',
      description: menu?.description ?? '',
      threshold: menu?.threshold ?? 0,
      price: menu?.price ?? 0,
      quantity: data.quantity,
      note: data.note ?? '',
      status: 'Pending'
    });
  }

  resetItem()
}

function updateItemCart(data: Pick<OrderItem, 'id' | 'item_id' | 'quantity' | 'note'>, index: number) {
  itemInChart.value[index] = {
    ...itemInChart.value[index],
    quantity: data.quantity,
    note: data.note
  }
}

function isItemExist(data: OrderItem, index: number) {
  const existingIndex = itemInChart.value
    .filter((item, i) => i !== index && item.status === 'Pending')
    .findIndex(item => item.id === data.id && item.note === data.note);

  if (existingIndex !== -1) {
    itemInChart.value[existingIndex].quantity += data.quantity;
    removeItem(index);
  }
}

/* ================
PAYMENT SECTION
=============== */
function handleDirectPayment() {
  payload.value.items = itemInChart.value.map((item) => ({
    id: item.item_id,
    item_id: item.item_id,
    quantity: item.quantity,
    note: item.note!,
  }))
  
  openOverlay({
    component: Payment,
    props: {
      is_direct_payment: true,
      payload: payload.value,
      amount: totalPrice.value,
      item_in_chart: itemInChart.value,
      paymentSucceded: () => {
        props.refresh()
        emit('close')
      }
    }
  })
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processOrder()
  })
}

function removeItem(index: number) {
  openOverlay({
    component: Blank,
    props: {
      confirmToContinue: true,
      confirmMessage: 'Apakah anda yakin ingin menghapus item ini?',
      onConfirm: () => {
        if (itemInChart.value && itemInChart.value.length > index) {
          itemInChart.value.splice(index, 1)
        }
      }
    }
  })
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
</script>

<template>
  <v-card 
      class="rounded-lg pa-6 mt-8 bg-white height-screen"
      style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 95dvh; scrollbar-width: none;"
    >
      <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
        <div class="d-flex align-center ga-4 mb-4">
          <v-btn color="darkprimary" icon rounded="sm" variant="flat">
            <ShoppingCartIcon stroke-width="1.5" width="20" />
          </v-btn>
          <v-row>
            <v-col cols="12">
              <div class="d-flex align-center">
                <h4 class="text-h4 font-weight-medium"> {{ props.is_create ? 'Pesanan Baru: ' : 'Detail Pesanan: '}} </h4> 
                <span>
                  <v-text-field
                    type="number"
                    hide-spin-buttons
                    v-model="payload.table_number"
                    placeholder="Nomor Meja"
                    prepend-inner-icon="mdi-select-place"
                    :rules="requieredRules"
                    variant="plain"
                    density="compact"
                    style="min-width: 6rem"
                    class="small-font text-medium-emphasis table-number-input ml-2"
                    single-line
                    hide-details
                  />
                </span>
              </div>
              <v-row>
                <v-col cols="12">
                  <v-select
                    style="max-width: 10rem"
                    class="small-font"
                    density="compact"
                    v-model="payload.is_take_away"
                    :items="[
                      { value: false, text: 'Makan di Tempat' },
                      { value: true, text: 'Bawa Pulang' }
                    ]"
                    item-title="text"
                    item-value="value"
                    placeholder="Bawa Pulang?"
                    variant="plain"
                    :prepend-inner-icon="payload.is_take_away == true ? 'mdi-store-outline' : 'mdi-food'"
                    :rules="booleanReqRules"
                    single-line
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>

        <div class="mt-4">
          <v-expand-transition>
            <div v-if="!showDetailOrder">
            <v-row>
              <v-col cols="12" class=" mb-2">
                <v-select
                  color="primary"
                  variant="outlined"
                  hide-details
                  v-model="selectedCtg"
                  :items="select_ctgs"
                  item-title="name"
                  item-value="id"
                  label="Pilih Kategori"
                  :return-object="false"
                  single-line
                />
              </v-col>
            </v-row>

            <perfect-scrollbar v-bind:style="{ maxHeight: '40dvh' }" class="mb-4">
              <v-list v-if="currentData.length > 0" class="py-0">
                <v-list-item
                  v-for="(item, i) in currentData"
                  :key="i"
                  :value="item"
                  color="secondary"
                  rounded="sm"
                  :disabled="item?.quantity == 0"
                  @click="openAddItem(item)"
                  >
                  <v-divider v-if="i > 0 && i < currentData.length" class="my-3"></v-divider>
                  <v-row>
                    <!-- Kolom kiri -->
                    <v-col cols="8">
                      <div class="text-subtitle-2 text-medium-emphasis">
                        <i v-if="item?.quantity == 0" class="text-error"> Stok Habis </i>
                        <i v-else-if="item?.quantity <= item.threshold" class="text-warning"> Stok Menipis </i>
                      </div>
                      <h4 class="text-h4 text-medium-emphasis font-weight-bold">
                        {{ item?.name }}
                      </h4>
                      <div class="text-subtitle-2 text-medium-emphasis">
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

          <div v-if="currentData.length === 0" class="text-subtitle-1 text-medium-emphasis text-center">
            Tidak ada data menu
          </div>

          <!-- Preview Cart -->
          <div class="text-center" v-if="showDetailOrder">
            <v-btn 
              icon
              variant="text"
              size="x-small"
              class="text-center"
              @click="showDetailOrder = !showDetailOrder"
              >
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
                      v-model="payload.customer.name"
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
                      v-model="payload.customer.phone"
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
                    <span>{{ itemInChart.length }} Menu</span> |
                    <span>{{ itemInChart.reduce((total, item) => total + item.quantity, 0) }} Item</span>
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
              class="text-center"
              @click="showDetailOrder = !showDetailOrder"
              >
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </div>
          
          <!-- Daftar Cart Item -->
          <v-expand-transition>
            <div v-show="showDetailOrder" class="mt-4">
              <h4 class="text-h4">Daftar Item:</h4>
              <div class="mt-2" v-if="itemInChart.length > 0">
                <perfect-scrollbar class="scrollable" style="max-height: 40dvh; overflow-y: scroll; overflow-x: hidden;">
                  <v-list-item 
                    v-for="(item, index) in itemInChart" 
                    :key="index" 
                    class="px-1"
                    :disabled="item.status !== 'Pending'"
                    @click="
                      openOverlay({
                        component: AddToChart,
                        props: {
                          menu: currentData.find(menu => menu.id === item.id),
                          data: item,
                          max: getMaxForNewLine(item.id),
                          onSubmit: (data: Pick<OrderItem, 'id' | 'item_id' | 'quantity' | 'note'>) => {
                            addItemToCart(data)
                          },
                          onUpdate: (data: Pick<OrderItem, 'id' | 'item_id' | 'quantity' | 'note'>) => {
                            updateItemCart(data, index)
                          }
                        }
                      })
                    "
                  >
                    <v-divider v-if="index > 0" class="my-2"></v-divider>
                    <v-row align="center" no-gutters>
                      <v-col cols="6" class="ml-0">
                        <div class="font-weight-medium">{{ item.name }}</div>
                        <div class="text-h6 text-medium-emphasis d-flex ga-2">Catatan: </div>
                        <div class="text-subtitle-2 text-disabled">
                          {{ item.note || '-'}}
                        </div>
                      </v-col>
                      <v-btn
                        v-if="!item.status || item.status === 'Pending'"
                        icon
                        variant="text"
                        size="x-small"
                        class="text-center text-error"
                        @click.stop="removeItem(index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-col cols="auto" class="text-center" align-self="center" v-if="!item.status || item.status === 'Pending'">
                        <v-number-input
                          v-model="item.quantity"
                          control-variant="split"
                          hide-spin-buttons
                          variant="plain"
                          :min="1"
                          :max="getMaxForRow(index)"
                          :rules="qtyRules(index)"
                          single-line
                          hide-details
                          inset
                          @click.stop
                        />
                      </v-col>
                      <v-col cols="6" v-else class="text-caption text-medium-emphasis text-right">
                        {{ item.quantity }} item
                        <div 
                          class="text-subtitle-1" 
                          :class="
                            item.status === 'Refund' ? 'text-error' :
                            item.status === 'Diproses' ? 'text-primary' :
                            item.status === 'Tersaji' ? 'text-success' : 'text-disabled'"
                          >
                          {{ item.status }}
                        </div>
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
            <v-col cols="12" class="pa-2" v-if="userStore.hasRole(['admin', 'pemilik', 'dapur']) && !props.data_order">
              <v-btn 
                block
                color="success"
                :disabled="!isFormValid || itemInChart.length === 0 || lo"
                :loading="lo"
                @click="handleDirectPayment()"
              >Langsung Bayar</v-btn>
            </v-col>
            <v-col cols="6" class="pa-2">
              <v-btn 
                block
                color="error"
                variant="outlined"
                @click="emit('close')"
              >Batal</v-btn>
            </v-col>
            <v-col cols="6" class="pa-2">
              <v-btn 
                block
                color="primary"
                :disabled="!isFormValid || itemInChart.length === 0 || lo"
                :loading="lo"
                @click="submitForm()"
              >Simpan</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-form>
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