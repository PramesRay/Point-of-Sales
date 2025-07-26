<script setup lang="ts">
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import { useInventoryItems } from '@/composables/useInventoryItems';
import { useMenuItems } from '@/composables/useMenuItems';
import { useStockRequests } from '@/composables/useStockRequest';
import { useUserStore } from '@/stores/authUser';
import type { CreateStockRequestPayload, InventoryItem } from '@/types/inventory';
import type { MenuSale } from '@/types/menu';
import { computed, onMounted, ref, watchEffect } from 'vue';
import AddItemRequest from './AddItemRequest.vue';
import Blank from '@/components/shared/Blank.vue';

const userStore = useUserStore();
const { openOverlay } = useOverlayManager()

const { create, loading } = useStockRequests();

const props = defineProps<{
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
  items: [],
  note: '',
})

const formRef = ref()
const isFormValid = ref(false)
const selectedCtg = ref()

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi.'],
  positive: [(v: any) => v > 0 || 'Harus lebih dari 0'],
  notes: [(v: string) => (v?.length ?? 0) <= 100 || 'Maks. 100 karakter'],
}

function addItem() {
  openOverlay({
    component: AddItemRequest,
    props: {
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
  create(payload.value)
}

function handleSubmit() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    createRequest()
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
    
    <h4 class="text-h4">Tambah Permintaan Stok</h4>
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
                  data: item,
                  add: (data: Pick<InventoryItem, 'id' | 'name' | 'quantity' | 'unit'>) => {
                    payload.items[index] = {
                      id: data.id,
                      name: data.name,
                      quantity: data.quantity,
                      unit: data.unit
                    }
                  }
                }
              })
            "
          >
            <v-divider v-if="index > 0" class="mb-4 mt-2"></v-divider>
            <v-row>
              <v-col cols="10">
                <v-list-item-title class="font-weight-bold text-medium-emphasis">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>Jumlah: {{ item.quantity }} {{ item.unit }}</v-list-item-subtitle>
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <v-btn 
                  icon
                  color="error" 
                  variant="text"
                  @click="
                  openOverlay({
                    component: Blank,
                    props: {
                      confirmToContinue: true,
                      confirmMessage: 'Apakah anda yakin ingin menghapus item ini?',
                      onConfirm: () => removeItem(index)
                    }
                  })
                  "
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
          <div v-if="payload.items.length === 0" class="text-center text-subtitle-2 text-disabled my-4">
            Item Kosong
          </div>
        </v-list>
      </perfect-scrollbar>
      <v-row>
        <v-col cols="12">
          <div class="text-caption text-medium-emphasis">
            Catatan: 
          </div>
          <v-textarea
            v-model="payload.note"
            :rules="rules.notes"
            label="Opsional"
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
  