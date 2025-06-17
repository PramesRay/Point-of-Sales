<script setup lang="ts">
import { ref, computed, watch, toRaw } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import { formatRupiah, formatRupiahInput } from '@/utils/helpers/currency'
import { formatDate } from "@/utils/helpers/format-date";
import type { Employee } from '@/types/employee';
import { cloneDeep } from 'lodash';
import { hasRole } from '@/utils/helpers/user';
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

import type { CreateFundRequest, FundRequest, UpdateFundRequest } from '@/types/finance';
import type { InventoryItem } from '@/types/inventory';
import type { IdName } from '@/types/common';

const emit = defineEmits<{
  (e: 'create-fr', payload: CreateFundRequest): FundRequest
  (e: 'update-fr', payload: UpdateFundRequest): FundRequest
  (e: 'delete-fr', id: string): void
}>();

const props = defineProps<{
  user: Employee;
  data: FundRequest[];
  inv_items: InventoryItem[];
  branch: IdName;
  loading?: boolean;
}>();

// Computed untuk filter transaksi berdasarkan branch
const filteredData = computed(() => {
  if (props.branch.id === 'all') {
    return props.data;
  }
  return props.data.filter(
    (tx) => tx.branch.id === props.branch.id
  );
});

const filteredInventoryItems = computed(() => {
  if (!props.inv_items.length) {
    return []
  } else {
    return props.inv_items
  }
})

// Ambil transaksi terbaru
const latestRequest = computed(() => filteredData.value[0]);

// Sisanya untuk list biasa
const listRequest = computed(() => filteredData.value.slice(1));

const selectedRequest = ref<FundRequest | null>(null)
const isNewRequest = ref(false)

const formRef = ref()
const isFormValid = ref(false)

const showOverlay = ref(false)
const pendingOverlayClose = ref(false) // tandai kalau user sedang coba tutup overlay
const showConfirmDialog = ref(false)

const showItems = ref(false)

// Payload
const fundRequestPayload = ref<{
  subject: string | null;
  notes: string | null;
  amount: number | null;
  amountRaw: string;
  branchId: string | null;
  status: string | null;
  items: { 
    item: {
      id: string | null, 
      name: string | null, 
      purchase_price: number | null
      unit: {
        default: string | null
        options: string[]
      }
    }; 
    quantity: number | null 
  }[],
  approvement: { by: { id: string, name: string}[]; note: string; }
}>({
  subject: null,
  notes: null,
  amount: null,
  amountRaw: '',
  branchId: props.user?.assigned_branch?.length === 1 ? props.user.assigned_branch[0].id : 'branch-1',
  status: null,
  items: [{ 
    item: {
      id: null, 
      name: null, 
      purchase_price: null,
      unit: {
        default: null,
        options: []
      }
    }, 
    quantity: null, 
  }],
  approvement: { by: [{ id: '', name: ''}], note: '' }
})

// Form Rules
const requieredRules = [(v: string) => !!v || 'Data tidak boleh kosong']
const amtRules = [
  (v: string) => !!v || 'Jumlah tidak boleh kosong',
  (v: string) => {
    const numeric = Number(v.replace(/\D/g, ''))
    return numeric >= 0 || 'Jumlah tidak boleh kurang dari 0'
  }
]
const reqRules = [(v: string) => !!v || 'Data tidak boleh kosong']
const descRules = [((v: string) => v.length <= 100 || 'Maks 100 karakter')]

function processFundRequest() {
  if (!fundRequestPayload.value) return

  const payload: CreateFundRequest = {
    subject: fundRequestPayload.value.subject ?? '',
    notes: fundRequestPayload.value.notes ?? '',
    amount: fundRequestPayload.value.amount ?? 0,
    branch_id: fundRequestPayload.value.branchId ?? '',
    items: fundRequestPayload.value.items.map((val) => ({ item_id: val.item.id!, quantity: val.quantity! }))
  }

  if (isNewRequest.value) {
    emit('create-fr', payload)
    console.log('Mengirim ke backend:', payload)
  } else {
    const updatePayload: UpdateFundRequest = {
      id: selectedRequest.value?.id ?? '',
      status: selectedRequest.value?.status ?? 'Pending',
      approvement_note: selectedRequest.value?.approvement.note ?? '',
      ...payload
    }
    emit('update-fr', updatePayload)
    console.log('Mengirim ke backend:', updatePayload)
  }
  confirmCancel()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processFundRequest()
  })
}

function clearPayload() {
  if (isNewRequest.value) {
    fundRequestPayload.value = {
      subject: null,
      notes: null,
      amount: null,
      amountRaw: '',
      branchId: props.user?.assigned_branch?.length === 1 ? props.user.assigned_branch[0].id : 'branch-1',
      status: null,
      approvement: { by: [{ id: '', name: ''}], note: '' },
      items: [{ 
        item: {
          id: null, 
          name: null, 
          purchase_price: null, 
          unit: { 
            default: null, 
            options: [] 
          }
        }, 
        quantity: null
      }]
    }
  }

  if (selectedRequest.value) {
    fundRequestPayload.value = {
      ...selectedRequest.value,
      subject: selectedRequest.value.subject,
      notes: selectedRequest.value.notes,
      amount: selectedRequest.value.amount,
      amountRaw: formatRupiahInput(selectedRequest.value.amount.toString()),
      branchId: selectedRequest.value.branch.id,
      status: selectedRequest.value.status,
      items: selectedRequest.value.items.map(item => ({ 
        item: {
          id: item.item.id ?? null, 
          name: item.item.name ?? null, 
          purchase_price: item.item.purchase_price?.[item.item.unit?.default ?? 0] ?? null,
          unit: {
            default: item.item.unit?.default ?? null,
            options: item.item.unit?.options ?? []
          }
        },
        quantity: item.quantity,
       })),
      approvement: selectedRequest.value.approvement
    }
  }
}

function openAddNew() {
  selectedRequest.value = null
  isNewRequest.value = true
  showOverlay.value = true

  clearPayload()
}

function openDetail(request: FundRequest) {
  selectedRequest.value = cloneDeep(request)
  isNewRequest.value = false
  showOverlay.value = true
}

function confirmCancel() {
  pendingOverlayClose.value = true
  showConfirmDialog.value = false
  showOverlay.value = false

  clearPayload()
}

function addItem() {
  if (!fundRequestPayload.value.items) fundRequestPayload.value.items = []
  fundRequestPayload.value.items.push({ 
    item: {
      id: null, 
      name: null, 
      purchase_price: null,
      unit: {
        default: null,
        options: []
      }
    }, 
    quantity: null })
}

function itemKey(index: number, item: typeof fundRequestPayload.value.items[0]) {
  // Gunakan kombinasi index + item id + nama sebagai key unik supaya reset saat item berubah
  return `${index}-${item.item.id || 'empty'}-${item.item.name || 'empty'}`;
}

function onItemIdChange(selectedId: string, index: number) {
  
  const selectedItem = filteredInventoryItems.value.find(item => item.id === selectedId);
  if (selectedItem) {
    fundRequestPayload.value.items[index] = {
      item :{
        id: selectedItem.id,
        name: selectedItem.name,
        purchase_price: selectedItem.purchase_price?.[selectedItem.unit?.default ?? 0] ?? null,
        unit: selectedItem.unit!
      },
      quantity: 1
    }
  }
  const found = fundRequestPayload.value.items.some((item, i) => item.item.id === selectedId && i !== index);
  if (found) {
    fundRequestPayload.value.items[index].item.id = null
    alertStore.showAlert(`Item sudah ada di daftar!`, 'warning');
  }
}

function onUnitChanged(unit: string, index: number) {
  const selectedItem = filteredInventoryItems.value.find(item => item.id === fundRequestPayload.value.items[index].item.id);
  if (selectedItem) {
    fundRequestPayload.value.items[index] = {
      item :{
        id: selectedItem.id,
        name: selectedItem.name,
        purchase_price: selectedItem.purchase_price?.[unit] ?? null,
        unit: selectedItem.unit!
      },
      quantity: 1
    }
  }
}

function removeItem(index: number) {
  if (fundRequestPayload.value.items && fundRequestPayload.value.items.length > index) {
    fundRequestPayload.value.items.splice(index, 1)
  }
}

const isChanged = computed(() => {
  if (!fundRequestPayload.value) return false

  if (isNewRequest.value) {
    return (
      fundRequestPayload.value.subject !== null ||
      fundRequestPayload.value.notes !== null ||
      fundRequestPayload.value.amount !== null
    )
  } else {
    return (
      fundRequestPayload.value.subject !== selectedRequest.value?.subject ||
      fundRequestPayload.value.notes !== selectedRequest.value?.notes ||
      fundRequestPayload.value.amount !== selectedRequest.value?.amount ||
      fundRequestPayload.value.branchId !== selectedRequest.value?.branch.id ||
      JSON.stringify(fundRequestPayload.value.items.map(item => ({
        id: item.item.id,
        unit: item.item.unit?.default,
        quantity: item.quantity
      }))) !== JSON.stringify(selectedRequest.value?.items.map(item => ({
        id: item.item.id,
        unit: item.item.unit?.default,
        quantity: item.quantity
      }))) ||
      fundRequestPayload.value.status !== selectedRequest.value?.status
    )
  }

})

watch(() => fundRequestPayload.value.items, (val) => {
  
    const totalAmount = val.reduce((acc, item) => acc + (item.item.purchase_price ?? 0) * (item.quantity!), 0);
    fundRequestPayload.value.amount = totalAmount;
    fundRequestPayload.value.amountRaw = formatRupiahInput(totalAmount.toString());
  
}, { deep: true });

watch(selectedRequest, (val) => {
  if (val) {
    fundRequestPayload.value = {
      ...val,
      subject: val.subject,
      notes: val.notes,
      amount: val.amount,
      branchId: val.branch.id,
      status: val.status,
      items: val.items.map((item) => ({
        item: {
          id: item.item.id ?? null,
          name: item.item.name ?? null,
          purchase_price: item.item.purchase_price?.[item.item.unit?.default ?? 0] ?? null,
          unit: {
            default: item.item.unit?.default ?? null,
            options: item.item.unit?.options ?? []
          }
        },
        quantity: item.quantity ?? null
      })),
      amountRaw: formatRupiahInput(val.amount.toString())
    }
  }
}, { immediate: true })

watch(showOverlay, (isOpen, wasOpen) => {
  if (!isOpen && wasOpen) {
    if (pendingOverlayClose.value) {
      pendingOverlayClose.value = false
      return // tidak tampilkan confirm dialog
    }
    if (isChanged.value) {
      showOverlay.value = true
      pendingOverlayClose.value = true
      showConfirmDialog.value = true
    }
  }
})

watch(() => fundRequestPayload.value.amountRaw, (val) => {
  const numeric = val.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  fundRequestPayload.value.amount = numeric ? Number(numeric) : null
})
</script>

<template>
  <v-card elevation="0" style="height: fit-content;">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="8">
            <div class="d-flex align-center">
              <h4 class="text-h4 mt-1">Permintaan Dana Terkini</h4>
            </div>
            <div v-if="props.branch.id !== 'all'">
              <i class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.branch.name }}</i>
            </div> 
          </v-col>
          <v-col cols="4" class="mt-auto text-right">
            <v-btn
              v-if="!loading"
              color="primary"
              @click="openAddNew"
            >
              Tambah
            </v-btn>
          </v-col>
        </v-row>
          
        <div v-if="!props.loading">
          <v-card class="bg-lightsecondary mt-5" @click="openDetail(latestRequest)">
            <div v-if="latestRequest" class="pa-5">
              <span class="text-subtitle-2 text-disabled">
                <span 
                  class="text-medium-emphasis" 
                  v-if="props.branch.id === 'all'"
                >{{ latestRequest?.branch.name }}: </span>
                {{ latestRequest.meta?.updated_at ? `${formatDate(latestRequest.meta?.updated_at).slice(0,-11)}: ${formatDate(latestRequest.meta?.updated_at).slice(-5)}` : '' }}
              </span>
              <v-row no-gutters>
                <v-col cols="7" class="pe-1">
                  <h6 class="text-secondary text-h4 font-weight-bold" style="overflow: scroll; scrollbar-width: none; white-space: nowrap;">{{ latestRequest?.subject }}</h6>
                  <span class="text-subtitle-2 text-medium-emphasis">{{ latestRequest?.employee.name }}</span>
                </v-col>
                <v-col cols="5" class="text-right">
                  <span
                    :class="{
                      'text-subtitle-2 text-medium-emphasis text-warning': latestRequest?.status === 'Pending',
                      'text-subtitle-2 text-medium-emphasis text-success': latestRequest?.status === 'Disetujui',
                      'text-subtitle-2 text-medium-emphasis text-error': latestRequest?.status === 'Ditolak'
                    }"
                  >{{ latestRequest?.status }}</span>
                  <h5 class="text-h5 text-medium-emphasis font-weight-bold">{{ formatRupiah(latestRequest?.amount) }}</h5>
                </v-col>
              </v-row>
            </div>
          </v-card>
          <div class="mt-4">
            <perfect-scrollbar :style="{ maxHeight: mdAndUp? '30rem' : '12rem'}">
              <v-list v-if="listRequest.length > 0" class="py-0">
                <v-list-item 
                  v-for="(listRequest, i) in listRequest" 
                  :key="i" 
                  :value="listRequest" 
                  color="secondary" 
                  rounded="sm"
                  @click="openDetail(listRequest)"
                >
                  <span class="text-subtitle-2 text-disabled">
                    <span
                      class="text-medium-emphasis"
                      v-if="props.branch.id === 'all'"
                    >{{ listRequest?.branch.name }}: </span>
                    {{ listRequest.meta?.updated_at ? `${formatDate(listRequest.meta?.updated_at).slice(0,-11)}: ${formatDate(listRequest.meta?.updated_at).slice(-5)}` : '' }}
                  </span>
                  <v-row no-gutters>
                    <v-col cols="7" class="pe-1">
                      <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="overflow: scroll; scrollbar-width: none; white-space: nowrap;">
                        {{ listRequest?.subject }}
                      </h6>
                      <span class="text-subtitle-2 text-medium-emphasis">{{ listRequest?.employee.name }}</span>
                    </v-col>
                    <v-col cols="5" class="text-right ps-1" style="overflow: scroll; scrollbar-width: none; white-space: nowrap;">
                      <span
                        :class="{
                          'text-subtitle-2 text-medium-emphasis text-warning': listRequest?.status === 'Pending',
                          'text-subtitle-2 text-medium-emphasis text-success': listRequest?.status === 'Disetujui',
                          'text-subtitle-2 text-medium-emphasis text-error': listRequest?.status === 'Ditolak' || listRequest?.status === 'Beberapa Disetujui'
                        }"
                      >{{ listRequest?.status }}</span>
                      <div class="text-subtitle-1 text-medium-emphasis font-weight-bold">{{ formatRupiah(listRequest?.amount) }}</div>
                    </v-col>
                  </v-row>
                  <v-divider class="my-3" />
                </v-list-item>
              </v-list>
            </perfect-scrollbar>

            <div class="text-center mt-3">
              <v-btn color="primary" variant="text" href="/fundRequests"
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

  <v-overlay
    v-model="showOverlay"
    fullscreen
    scroll-strategy="none"
    class="d-flex justify-center align-center"
    max-width="400"
  >
  <!-- hide scroll in card -->
    <v-card
      :class="selectedRequest && selectedRequest.id === latestRequest.id ? 'bg-lightsecondary' : 'bg-white'"
      class="rounded-lg pa-6"
      style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;"
    >
      <v-form ref="formRef" v-model="isFormValid">
        <!-- Close button -->
        <v-btn icon class="position-absolute text-disabled" variant="text" style="top: 8px; right: 12px;" @click="showOverlay = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="d-flex align-center">
          <h4 class="text-h4 mt-1 mr-2">{{ isNewRequest ? 'Buat Permintaan Dana' : 'Detail Permintaan Dana' }}</h4>

          <span v-if="hasRole(props.user, ['admin', 'finance', 'owner']) && !isNewRequest">
            <v-btn
              icon  
              variant="text"
              class="align-center justify-center text-success"
              :disabled="selectedRequest?.status === 'Disetujui'"
              @click="selectedRequest && (selectedRequest.status = 'Disetujui')"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn
              icon  
              variant="text"
              class="align-center justify-center text-error"
              :disabled="selectedRequest?.status === 'Ditolak'"
              @click="selectedRequest && (selectedRequest.status = 'Ditolak')"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </span>
        </div>
        
        <v-divider class="my-3" />

        <v-row no-gutters>
          <v-col cols="12" v-if="!isNewRequest">
            <v-textarea
              v-model="fundRequestPayload.approvement.note"
              variant="outlined"
              :rules="descRules"
              label="Catatan"
              rows="2"
              class="small-font small-placeholder"
              auto-grow
              prepend-inner-icon="mdi-text-long"
              clear-icon="mdi-close"
              clearable
              counter
            />
          </v-col>
          <v-col cols="12" v-if="props.user.assigned_branch.length > 1">
            <v-select
              variant="underlined"
              v-model="fundRequestPayload.branchId"
              label="Cabang"
              :items="props.user.assigned_branch"
              item-title="name"
              item-value="id"
              :rules="requieredRules"
              prepend-icon="mdi-home"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex-column align-center justify-center mb-4">
              <div class="d-flex text-subtitle-2 text-medium-emphasis justify-center">Jumlah Dana</div>
              <div class="d-flex text-h3 justify-center text-success">Rp {{ formatRupiahInput(fundRequestPayload.amountRaw) }}</div>
            </div>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="fundRequestPayload.subject"
              label="Judul Permintaan"
              variant="underlined"
              prepend-icon="mdi-form-textbox"
              :rules="requieredRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" @click="showItems = !showItems">
            <h4 class="text-h5 mt-2" >
              Daftar Item: 
              <span class="text-subtitle-2 text-medium-emphasis me-1">{{ fundRequestPayload.items.length }} item</span>
              <v-btn
                icon  
                variant="text"
                size="x-small"
              >
              <v-icon>{{ showItems ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
            </v-btn>
          </h4>
          </v-col>
          <v-expand-transition>
            <v-col cols="12" v-show="showItems">
              <perfect-scrollbar class="scrollable my-1" style="max-height: 16rem; overflow-y: scroll; overflow-x: hidden; ">
                <v-row
                  v-for="(item, index) in fundRequestPayload.items"
                  :key="index"
                  class="align-center ps-2"
                  no-gutters
                >
                  <v-divider v-if="index > 0" class="mt-2"></v-divider>
                  <v-col cols="10">
                    <v-autocomplete
                      :key="`autocomplete-${itemKey(index, item)}`"
                      class="small-placeholder"
                      v-model="item.item.id"
                      :items="filteredInventoryItems.map(item => ({ title: item.name, value: item.id }))"
                      @update:model-value="(val: string) => onItemIdChange(val, index)"
                      variant="underlined"
                      :placeholder="'Nama Item #' + (index + 1)"
                      :rules="reqRules"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="2" class="text-center">
                    <v-btn icon variant="text" color="error" @click="removeItem(index)" title="Hapus Item">
                      <v-icon >mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="5" class="pe-2">
                    <v-number-input
                      v-model.number="item.quantity"
                      class="small-placeholder"
                      control-variant="split"
                      variant="underlined"
                      placeholder="Jumlah"
                      :rules="[v => v > 0 || 'Jumlah harus lebih dari 0']"
                      :min="1"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="3" class="ps-3">
                    <v-select
                      v-model="item.item.unit.default"
                      class="small-placeholder"
                      @update:model-value="(val: string) => onUnitChanged(val, index)"
                      variant="underlined"
                      :items="item.item.unit.options"
                      placeholder="Satuan"
                      :rules="[v => !!v || 'Satuan wajib diisi']"
                      hide-details
                    />
                  </v-col>
                  <v-col v-if="item.item.id !== null" cols="4" class="ps-3 mt-auto" align-self="stretch">
                    <div class="text-subtitle-2 text-medium-emphasis"> @{{ formatRupiah(item.item.purchase_price ?? 0) }} </div>
                  </v-col>
                </v-row>
              </perfect-scrollbar>

              <v-btn
                class="mt-2 mx-auto"
                variant="outlined"
                color="primary"
                @click="addItem()"
              >
              Tambah Item
            </v-btn>
          </v-col>
        </v-expand-transition>
      </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              variant="underlined"
              v-model="fundRequestPayload.notes"
              :rules="descRules || reqRules"
              label="Deskripsi"
              rows="3"
              class="small-font"
              auto-grow
              prepend-icon="mdi-text-long"
              clear-icon="mdi-close"
              clearable
              counter
            />
          </v-col>
        </v-row>
        
        <v-divider class="my-3" />
                
        <!-- Tombol proses -->
        <div class="d-flex justify-end mt-1">
          <v-btn
            :color="selectedRequest?.status === 'Disetujui' ? 'success' : selectedRequest?.status === 'Ditolak' ? 'error' : 'primary'"
            :disabled="!isFormValid || !isChanged"
            @click="submitForm"
            >
            {{ isNewRequest ? 'Buat' : 'Simpan'}}
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

<style>
.small-font .v-field__input {
  font-size: 0.8rem !important;
}

/* style css kecuali untuk v-icon */
.small-placeholder .v-field {
  font-size: 0.8rem !important;
}

.small-placeholder .v-icon {
  font-size: 1.5rem !important;
}
</style>