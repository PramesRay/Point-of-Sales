<script setup lang="ts">
import type { MenuSale } from '@/types/menu';
import type { OrderItem } from '@/types/order';
import { formatRupiah } from '@/utils/helpers/currency'
import { ref } from 'vue';

const emit = defineEmits(['close'])

const props = defineProps<{
  menu: MenuSale
  data?: OrderItem
  // menus: MenuSale[]

  onSubmit: (data: OrderItem) => void
  onUpdate: (data: OrderItem) => void
}>()

const payload = ref<OrderItem>({
  id: props.menu.id,
  name: props.menu.name,
  quantity: props.data ? props.data.quantity : 1,
  note: props.data ? props.data.note || '' : '',
  price: props.menu.price,
  status: 'Pending'
})

const formRef = ref()
const isFormValid = ref(false)

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi.'],
  positive: [(v: any) => v > 0 || 'Harus lebih dari 0'],
  notes: [(v: string) => (v?.length ?? 0) <= 100 || 'Maks. 100 karakter'],
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    if (props.data) {
      props.onUpdate(payload.value)
    } else {
      props.onSubmit(payload.value)
    }
    emit('close')
  })
}

</script>

<template>
  <v-card 
    class="rounded-lg pa-6 height-screen"
    style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 95dvh; scrollbar-width: none;"
  >
    <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
      <h4 class="text-h4 mb-6">Tambah Item</h4>
      <!-- Close button -->
      <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      
      <v-row class="align-center">
        <v-col cols="5">
          <h4 class="text-h4 text-medium-emphasis text-center">
            <div>{{ props.menu.name }}</div>
            <div>{{ props.menu.price && formatRupiah(props.menu.price) }}</div>
          </h4>
        </v-col>
        <v-divider vertical inset></v-divider>
        <v-col cols="6">
          <div class="text-subtitle-1 text-disabled">
            {{ props.menu.description || '-' }}
          </div>
        </v-col>
      </v-row>
      <div class="mx-auto mt-2 w-50">
        <v-number-input 
          v-model="payload.quantity" 
          label="Jumlah"
          control-variant="split"
          variant="plain"
          :min="1" 
          :max="menu.quantity"
          :rules="rules.positive"
          single-line
        />
      </div>
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="payload.note" 
            label="Catatan"
            variant="filled"
            :rules="rules.notes"
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
            @click="emit('close')"
          >Batal</v-btn>
          <v-btn
            color="primary" 
            type="submit"
          >{{ props.data ? 'Perbarui' : 'Tambah' }}</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>