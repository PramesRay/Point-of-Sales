<script setup lang="ts">
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import { useStockRequests } from '@/composables/useStockRequest';
import { useUserStore } from '@/stores/authUser';
import { computed, onMounted, ref, watchEffect } from 'vue';
import AddItemRequest from './AddItemRequest.vue';
import type { CreateStockRequestPayload, InventoryItem, StockRequest, UpdateStockRequestPayload } from '@/types/inventory';
import { useInventoryItems } from '@/composables/useInventoryItems';

const userStore = useUserStore();
const { openOverlay } = useOverlayManager()

const { create, update, loading } = useStockRequests();
const { init: loadInventoryItems, data: inventoryItems, categories: inventoryCategories, loading: loadingInventory } = useInventoryItems();

onMounted(() => {
  loadInventoryItems();
});

const props = defineProps<{
  is_create: boolean
  data?: StockRequest
  
  refresh: () => void
  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
}>()

const emit = defineEmits(['close']);


const payload = ref<{
  items: {
    id: string | null
    name: string | null
    quantity: number
    unit: string | null
  }[]
  note: string
}>({
  items: props.data ? props.data.items.map(item => ({
    id: item.item.id,
    name: item.item.name,
    quantity: item.quantity,
    unit: item.item.unit
  })) : [],
  note: props.data ? props.data.note : '',
})

const formRef = ref()
const isFormValid = ref(false)

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi.'],
  positive: [(v: any) => v > 0 || 'Harus lebih dari 0'],
  notes: [(v: string) => (v?.length ?? 0) <= 100 || 'Maks. 100 karakter'],
}

function addItem() {
  openOverlay({
    component: AddItemRequest,
    props: {
      inv_item: inventoryItems.value,
      categories: inventoryCategories.value,
      add: (item: Pick<InventoryItem, 'id' | 'name' | 'quantity' | 'unit'>) => {
        const existed = payload.value.items.find(i => i.id === item.id)
        if (existed) {
          existed.quantity += item.quantity
        } else {
          payload.value.items.push({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit
          })
        }
      }
    }
  })
}

const isChanged = computed(() => {
  if (props.data) {
    return (
      payload.value.note !== props.data.note ||
      JSON.stringify(payload.value.items) !== JSON.stringify(props.data.items.map(item => ({
        id: item.item.id,
        name: item.item.name,
        quantity: item.quantity,
        unit: item.item.unit
      })))
    )
  }
  return payload.value.items.some((item) => item.quantity! > 0)
})

watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})

function removeItem(index: number) {
  if (payload.value.items && payload.value.items.length > index) {
    payload.value.items.splice(index, 1)
  }
}

function createRequest() {
  const createPayload: CreateStockRequestPayload = {
    items: payload.value.items.map((item) => ({
      id: item.id!,
      quantity: item.quantity
    })),
    note: payload.value.note
  }
  create(createPayload).then(() => {
    if (typeof props.onIsChangedUpdate === 'function') {
      props.onIsChangedUpdate(false)
    }
    emit('close')
    props.refresh()
  })
}

function updateRequest() {
  const updatePayload: UpdateStockRequestPayload = {
    id: props.data?.id!,
    items: payload.value.items.map((item) => ({
      id: item.id!,
      quantity: item.quantity
    })),
    note: payload.value.note
  }
  update(updatePayload).then(() => {
    if (typeof props.onIsChangedUpdate === 'function') {
      props.onIsChangedUpdate(false)
    }
    emit('close')
    props.refresh()
  })
}

function handleSubmit() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    if (props.is_create) {
      createRequest()
    } else {
      updateRequest()
    }
  })
}
</script>

<template>
  <v-card 
    class="rounded-lg pa-6 mt-8 bg-white" 
    style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;"
  >
    <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="emit('close')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    
    <h4 class="text-h4">{{ props.is_create ? 'Buat Permintaan Stok' : 'Ubah Permintaan Stok'}}</h4>
    <v-divider class="my-4"></v-divider>
    <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="handleSubmit">
      <div class="d-flex justify-space-between align-baseline">
        <h4 class="text-h5">
          Daftar Item: 
          <span class="text-subtitle-2 text-medium-emphasis">{{ payload.items.length }} item</span>
        </h4>
  
        <v-btn
          variant="text"
          append-icon="mdi-plus"
          color="primary"
          :disabled="loadingInventory"
          :loading="loadingInventory"
          @click="addItem"
        >
          Tambah Item
        </v-btn>
      </div>

      <perfect-scrollbar class="scrollable" style="max-height: 49dvh; overflow-y: scroll; overflow-x: hidden;">
        <v-list>
          <v-list-item
            v-for="(item, index) in payload.items"
            :key="index"
            @click="
              openOverlay({
                component: AddItemRequest,
                props: {
                  inv_item: inventoryItems,
                  categories: inventoryCategories,
                  data: item,
                  add: (data: Pick<InventoryItem, 'id' | 'name' | 'quantity' | 'unit'>) => {
                    payload.items[index] = {
                      id: data.id,
                      name: data.name,
                      quantity: data.quantity,
                      unit: data.unit
                    }
                  },  
                  remove: () => removeItem(index)
                }
              })
            "
          >
            <v-divider v-if="index > 0" class="mb-4 mt-2"></v-divider>
            <v-row>
              <v-col cols="12">
                <v-list-item-title class="font-weight-bold text-medium-emphasis">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>Jumlah: {{ item.quantity }} {{ item.unit }}</v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item>
          <div v-if="payload.items.length === 0" class="text-center text-subtitle-2 text-disabled my-4">
            Item Kosong
          </div>
        </v-list>
      </perfect-scrollbar>
      <v-row>
        <v-col cols="12" class="text-caption text-medium-emphasis">
          <div>
            Catatan: 
          </div>
          <v-textarea
            v-model="payload.note"
            :rules="rules.notes"
            placeholder="Opsional"
            rows="2"
            auto-grow
            clear-icon="mdi-close-circle"
            clearable
            counter
          />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <!-- Tombol proses -->
      <div class="d-flex justify-end mt-1">
        <v-btn 
          block
          color="primary" 
          type="submit"
          :disabled="!isFormValid || !isChanged"
          :loading="loading"
        >
          Proses Permintaan
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>
  