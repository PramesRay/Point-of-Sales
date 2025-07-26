<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getTimeDiff } from '@/utils/helpers/time'
import type { IdName } from '@/types/common';
import type { ApproveStockRequestPayload, InventoryItem, StockRequest } from '@/types/inventory';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import Blank from '@/components/shared/Blank.vue';
import { useStockRequests } from '@/composables/useStockRequest';
const { openOverlay } = useOverlayManager()
const { loading: lsr, update: updateRequest } = useStockRequests();

const props = defineProps<{
  data: StockRequest
}>()

const emit = defineEmits(['close'])

const isFormValid = ref(false)
const formRef = ref()

const approvalItems = ref<{ 
  item: InventoryItem; 
  approved: boolean | null; 
}[]>(
  props.data.items.map(item => ({ 
    item: item.item, 
    approved: item.status === 'Pending' 
    ? null : item.status === 'Disetujui' 
      ? true : false 
  }))
)

const approvalNote = ref<string | null>(null)
const notesRules = [
  (v: string) => (v?.length ?? 0) <= 255 || 'Maksimal 255 karakter',
]

// const approvalItemsComputed = computed(() => {
//   return props.data.items.map(data => {
//     return {
//       item: data.item,
//       approved: data.status === 'Pending' ? null : data.status === 'Disetujui' ? true : false,
//     }
//   })
// })

const isDisabled = computed(() => {
  return !isFormValid.value || approvalItems.value.some(item => item.approved === null)
})

function processApprovalItems() {
  const payload: ApproveStockRequestPayload = {
    id: props.data.id,
    note: approvalNote.value || '',
    items: approvalItems.value.map(item => ({
      id: item.item.id,
      status: item.approved ? 'Disetujui' : 'Ditolak'
    }))
  }

  openOverlay({
    component: Blank,
    props: {
      confirmToContinue: true,
      confirmMessage: 'Apakah anda yakin ingin menyetujui permintaan ini?',
      onConfirm: async () => {
        updateRequest(payload)
      }
    }
  })
}

const handleSubmit = () => {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processApprovalItems()
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
    <div class="d-flex align-center">
      <h4 class="text-h4 mt-1"> Detail Permintaan Stok </h4>
    </div>
    <i class="text-subtitle-2 text-disabled"> {{ props.data?.id }} </i>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="handleSubmit">
      <div class="pb-5">
        <span class="text-subtitle-2 text-medium-emphasis">
          <span>{{ props.data.branch.name }}</span>
        </span>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <div>
            <h6 class="text-secondary text-h4 font-weight-bold">
              {{ props.data.employee.name }}
            </h6>
            <span class="text-subtitle-2 text-medium-emphasis">
              {{ props.data.items.length }} item
            </span>
          </div>
          <div>
            <div class="d-flex justify-end">  
              <span 
                class="text-subtitle-2 text-medium-emphasis"
                :class="{
                  'text-warning': props.data.status === 'Pending',
                  'text-success': props.data.status === 'Disetujui',
                  'text-error': props.data.status === 'Ditolak'
                }"
              >{{ props.data.status }}</span>
            </div>
            <h4 v-if="props.data.time.created_at" class="text-h4 text-right">{{ getTimeDiff(props.data.time.created_at) }}</h4>
            <i v-if="props.data.time.updated_at" class="text-subtitle-2 text-medium-emphasis">
              Diubah {{ getTimeDiff(props.data.time.updated_at) }}
            </i>
          </div>
        </div>
      </div>

      <div v-if="props.data.note" class="text-caption text-medium-emphasis mb-4">
        Catatan: 
        <div>
          <i>{{ props.data.note }}</i>
        </div>
      </div>

      <v-divider class="mb-5"></v-divider>
      
      <!-- Daftar Item -->
      <h4 class="text-subtitle-1 mb-2">Daftar Item:</h4>
      
      <div>
        <template v-for="(item, index) in approvalItems" :key="index">
          <v-row align="center" class="pa-2">
            <v-col cols="7">
              <div class="font-weight-medium text-medium-emphasis">{{ item.item.name }}</div>
              <div class="text-caption text-disabled">Jumlah: {{ item.item.quantity }} {{ item.item.unit }}</div>
            </v-col>
            <v-col cols="5" class="text-right">
              <div v-if="(props.data.status === 'Pending' || props.data.status === 'Beberapa Disetujui') && item.approved === null">
                <v-btn
                  icon  
                  variant="text"
                  class="align-center justify-center text-success"
                  @click="item.approved = true"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn
                  icon  
                  variant="text"
                  class="align-center justify-center text-error"
                  @click="item.approved = false"
                  >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <div v-else>
                <v-btn
                  variant="tonal"
                  class="text-subtitle-2"
                  :class="{
                    'text-success': item.approved === true,
                    'text-error': item.approved === false
                  }"
                  :readonly="props.data.status !== 'Pending'"
                  @click="item.approved = null"
                  >{{ item.approved ? "Disetujui" : "Ditolak" }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-divider v-if="index !== approvalItems?.length - 1" />
        </template>
        
      </div>
      <!-- Input catatan tambahan -->
      <div v-if="props.data.status === 'Pending'">
        <v-divider class="mb-5"></v-divider>
        <div class="text-caption text-medium-emphasis">
          Catatan: 
        </div>
        <v-textarea
          v-model="approvalNote"
          :rules="notesRules"
          label="Opsional"
          rows="2"
          auto-grow
          clear-icon="mdi-close-circle"
          clearable
          counter
        />

        <!-- Tombol proses -->
        <div class="d-flex justify-end mt-1">
          <v-btn 
            color="primary" 
            @click="handleSubmit"
            :disabled="isDisabled"
          >
            Proses Permintaan
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-card>
</template>