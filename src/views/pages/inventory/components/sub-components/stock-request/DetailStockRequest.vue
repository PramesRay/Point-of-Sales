<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getTimeDiff } from '@/utils/helpers/time'
import type { IdName } from '@/types/common';
import type { ApproveStockRequestPayload, InventoryItem, StockRequest } from '@/types/inventory';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import Blank from '@/components/shared/Blank.vue';
import { useStockRequests } from '@/composables/useStockRequest';
import { useUserStore } from '@/stores/authUser';
import { useAlertStore } from '@/stores/alert';
import UpdateStockRequest from './UpdateStockRequest.vue';

const { openOverlay } = useOverlayManager()
const userStore = useUserStore()
const alertStore = useAlertStore()
const { loading: lsr, update } = useStockRequests();

const props = defineProps<{
  data: StockRequest
  refresh: () => void
}>()

const emit = defineEmits(['close'])

const isFormValid = ref(false)
const formRef = ref()

const approvalItems = ref<{ 
  item: Pick<InventoryItem, "id" | "name" | 'quantity' | "unit">; 
  approved: boolean | null; 
}[]>(
  props.data.items.map(item => ({ 
    item: {
      id: item.item.id,
      name: item.item.name,
      quantity: item.quantity,
      unit: item.item.unit
    },
    approved: item.status === 'Pending' 
    ? null : item.status === 'Disetujui' 
      ? true : false 
  }))
)

const approvalNote = ref<string | null>(null)
const notesRules = [
  (v: string) => (v?.length ?? 0) <= 100 || 'Maksimal 100 karakter',
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
      approved: item.approved!
    }))
  }

  openOverlay({
    component: Blank,
    props: {
      confirmToContinue: true,
      confirmMessage: 'Apakah anda yakin ingin menyetujui permintaan ini?',
      onConfirm: async () => {
        update(payload).then(() => {
          props.refresh()
          emit('close')
        })
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

const handleUpdate = () => {
  if (userStore.me?.id !== props.data.meta.created_by.id) {
    alertStore.showAlert('Data permintaan hanya dapat diubah oleh yang membuat', 'warning')
  } else if (userStore.me?.activity?.shift_op_id !== props.data.shift.kitchen) {
    alertStore.showAlert('Data permintaan sudah tidak dapat diubah', 'warning')
  } else {
    openOverlay({
      component: UpdateStockRequest,
      props: {
        data: props.data,
        refresh: props.refresh
      }
    })
  }
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
      <v-btn 
        v-if="props.data.status === 'Pending'"
        icon
        variant="plain"
        size="x-small"
        @click="handleUpdate"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </div>
    <i class="text-subtitle-2 text-disabled"> {{ props.data?.id }} </i>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="handleSubmit">
      <v-row align="center">
        <v-col cols="6">
          <span class="text-subtitle-2 text-medium-emphasis">
            <span>{{ props.data.branch.name }}</span>
          </span>
          <h6 class="text-secondary text-h4 font-weight-bold">
            {{ props.data.meta.created_by.name }}
          </h6>
          <span class="text-subtitle-2 text-medium-emphasis">
            {{ props.data.items.length }} item
          </span>
        </v-col>
        <v-col cols="6" class="text-right">
          <div>  
            <span 
              class="text-subtitle-2 text-medium-emphasis"
              :class="{
                'text-warning': props.data.status === 'Pending',
                'text-success': props.data.status === 'Disetujui',
                'text-error': props.data.status === 'Ditolak'
              }"
            >{{ props.data.status }}</span>
          </div>
          <h4 v-if="props.data.meta.created_at" class="text-h4">{{ getTimeDiff(props.data.meta.created_at) }}</h4>
          <i v-if="props.data.meta.updated_at" class="text-subtitle-2 text-medium-emphasis">
            Diubah {{ getTimeDiff(props.data.meta.updated_at) }}
          </i>
        </v-col>
      </v-row>

      <div class="text-caption text-medium-emphasis mt-4">
        Catatan: 
        <div>
          <i>{{ props.data.note }}</i>
        </div>
      </div>

      <!-- <v-divider class="my-4"></v-divider> -->
      
      <!-- Daftar Item -->
      <h4 class="text-subtitle-1 mt-4">Daftar Item:</h4>
      
      <div class="mb-2">
        <template v-for="(item, index) in approvalItems" :key="index">
          <v-divider v-if="index > 0" class="my-2"/>
          <v-row align="center" class="pa-2">
            <v-col cols="7">
              <div class="font-weight-medium text-medium-emphasis">{{ item.item.name }}</div>
              <div class="text-caption text-disabled">Jumlah: {{ item.item.quantity }} {{ item.item.unit }}</div>
            </v-col>
            <v-col cols="5" class="text-right">
              <div v-if="props.data.status === 'Pending' && userStore.hasRole(['Admin', 'Pemilik', 'Gudang']) && item.approved === null">
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
                  v-if="item.approved !== null"
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
        </template>
      </div>

      <!-- Input catatan tambahan -->
      <div v-if="props.data.status === 'Pending' && userStore.hasRole(['Admin', 'Pemilik', 'Gudang'])">
        <div class="text-caption text-medium-emphasis">
          Catatan Gudang: 
        </div>
        <v-textarea
          v-model="approvalNote"
          :rules="notesRules"
          placeholder="Opsional"
          rows="2"
          auto-grow
          clear-icon="mdi-close"
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