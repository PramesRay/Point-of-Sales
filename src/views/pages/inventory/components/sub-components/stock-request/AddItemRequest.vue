<script setup lang="ts">
import Blank from '@/components/shared/Blank.vue';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import type { IdName } from '@/types/common';
// import { useInventoryItems } from '@/composables/useInventoryItems';
import type { InventoryItem } from '@/types/inventory';
import { ref, computed, onMounted } from 'vue'

const { openOverlay } = useOverlayManager()
// const { init: loadInventoryItems, data: inventoryItems, categories: inventoryCategories, loading: loadingInventory } = useInventoryItems();

// onMounted(() => {
//   loadInventoryItems();
// });

const props = defineProps<{
  inv_item: InventoryItem[]
  categories: IdName[]
  data?: Pick<InventoryItem, 'id' | 'name' | 'quantity' | 'unit' | 'purchase_price'>
  add: (data: Pick<InventoryItem, 'id' | 'name' | 'quantity' | 'unit' | 'purchase_price'>) => void
  remove: () => void
}>()

const emit = defineEmits(['close'])

const formRef = ref()
const isFormValid = ref(false)
const selectedCtg = ref<string>('all')

const filteredInventoryItems = computed(() => {
  if (selectedCtg.value === 'all') return props.inv_item
  return props.inv_item.filter(item => item.category?.id === selectedCtg.value)
})

const payload = ref<{ 
  items: { 
    id: string | null, 
    name: string | null,
    quantity: number 
    unit: string | null,
    purchase_price: number
  }
}>({
  items: {
    id: props.data ? props.data.id : null,
    name: props.data ? props.data.name : null,
    quantity: props.data ? props.data.quantity : 1,
    unit: props.data ? props.data.unit : null,
    purchase_price: props.data ? props.data.purchase_price : 0
  }
})

function handleSubmit() {
  if (!isFormValid.value) return
  const item = {
    id: payload.value.items.id!,
    name: payload.value.items.name!,
    quantity: payload.value.items.quantity,
    unit: payload.value.items.unit!,
    purchase_price: payload.value.items.purchase_price
  }
  props.add(item)
  emit('close')
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
    
    <h4 class="text-h4">Tambah Item</h4>
    
    <v-divider class="my-4"></v-divider>

    <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            v-model="selectedCtg"
            :items="[{ id: 'all', name: 'Semua' }, ...props.categories]"
            item-title="name"
            item-value="id"
            prepend-icon="mdi-format-list-bulleted-type"
            variant="underlined"
            label="Kategori"
            :rules="[v => !!v || 'Kategori wajib diisi']"
            @update:model-value="payload.items.id = null"
            :return-object="false"
          />
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            v-model="payload.items.id"
            :items="filteredInventoryItems"
            item-title="name"
            item-value="id"
            prepend-icon="mdi-cart"
            variant="underlined"
            label="Nama Item"
            :rules="[v => !!v || 'Nama item wajib diisi']"
            :return-object="false"
            @update:model-value="
              payload.items.name = props.inv_item.find(item => item.id === payload.items.id)?.name!,
              payload.items.unit = props.inv_item.find(item => item.id === payload.items.id)?.unit!,
              payload.items.purchase_price = props.inv_item.find(item => item.id === payload.items.id)?.purchase_price!
              "
          />
        </v-col>
        <div class="mx-auto mt-2 w-50">
          <v-number-input
            v-model.number="payload.items.quantity"
            control-variant="split"
            variant="underlined"
            :label="'Jumlah ' + (payload.items.unit ? `(${payload.items.unit})` : '')"
            :rules="[v => v > 0 || 'Jumlah harus lebih dari 0']"
            :min="1"
            :disabled="!payload.items.id"
          />
        </div>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-row class="mt-4" no-gutters>
        <v-col cols="12" class="d-flex justify-space-between">
          <v-btn 
            v-if="props.data"
            color="error" 
            variant="plain"
            text="Hapus"
            prepend-icon="mdi-delete"
            @click="
            openOverlay({
              component: Blank,
              props: {
                confirmToContinue: true,
                confirmMessage: 'Apakah anda yakin ingin menghapus item ini?',
                onConfirm: () => {
                  props.remove()
                  emit('close')
                }
              }
            })
            "
          />
          <v-spacer v-else/>
          <v-btn 
            color="primary" 
            type="submit"
            :disabled="!isFormValid"
          >
            {{ props.data ? 'Simpan' : 'Tambah'}}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>