<script setup lang="ts">
import { useInventoryItems } from '@/composables/useInventoryItems';
import type { InventoryItem } from '@/types/inventory';
import { ref, computed, onMounted } from 'vue'

const { init: loadInventoryItems, data: inventoryItems, categories: inventoryCategories, loading: loadingInventory } = useInventoryItems();

onMounted(() => {
  loadInventoryItems();
});

const props = defineProps<{
  data?: Pick<InventoryItem, 'id' | 'name' | 'quantity' | 'unit'>
  add: (data: Pick<InventoryItem, 'id' | 'name' | 'quantity' | 'unit'>) => void
}>()

const emit = defineEmits(['close'])

const formRef = ref()
const isFormValid = ref(false)
const selectedCtg = ref<string>('all')

const filteredInventoryItems = computed(() => {
  if (selectedCtg.value === 'all') return inventoryItems.value
  return inventoryItems.value.filter(item => item.category?.id === selectedCtg.value)
})

const payload = ref<{ 
  items: { 
    id: string | null, 
    name: string | null,
    quantity: number 
    unit: string | null
  }
}>({
  items: {
    id: props.data ? props.data.id : null,
    name: props.data ? props.data.name : null,
    quantity: props.data ? props.data.quantity : 1,
    unit: props.data ? props.data.unit : null
  }
})

function handleSubmit() {
  if (!isFormValid.value) return
  const item = {
    id: payload.value.items.id!,
    name: payload.value.items.name!,
    quantity: payload.value.items.quantity,
    unit: payload.value.items.unit!
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
            :items="[{ id: 'all', name: 'Semua' }, ...inventoryCategories]"
            item-title="name"
            item-value="id"
            prepend-icon="mdi-format-list-bulleted-type"
            variant="underlined"
            label="Kategori"
            :rules="[v => !!v || 'Kategori wajib diisi']"
            :loading="loadingInventory"
            :disabled="loadingInventory"
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
            :loading="loadingInventory"
            :disabled="loadingInventory"
            :return-object="false"
            @update:model-value="
              payload.items.name = inventoryItems.find(item => item.id === payload.items.id)?.name!,
              payload.items.unit = inventoryItems.find(item => item.id === payload.items.id)?.unit!
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

      <v-row class="mt-4">
        <v-col cols="12" class="d-flex justify-end">
          <v-btn 
            color="primary" 
            type="submit"
            :disabled="!isFormValid"
          >
            Tambah
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>