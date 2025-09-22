<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getTimeDiff } from '@/utils/helpers/time'
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import Blank from '@/components/shared/Blank.vue';
import type { ApproveFundRequest, FundRequest } from '@/types/finance';
import type { InventoryItem } from '@/types/inventory';
import { formatRupiah } from '@/utils/helpers/currency';
import { useFundRequests } from '@/composables/useFundRequest';
import { useUserStore } from '@/stores/authUser';
import UpdateFundRequest from './UpdateFundRequest.vue';
import { useAlertStore } from '@/stores/alert';

const { openOverlay } = useOverlayManager()
const { loading: lfr, approve } = useFundRequests();
const userStore = useUserStore()
const alertStore = useAlertStore()

const props = defineProps<{
  data: FundRequest
  refresh: () => void
}>()

const emit = defineEmits(['close'])

const isFormValid = ref(false)
const formRef = ref()

const approvalItems = ref<{ 
  item: Pick<InventoryItem, "id" | "name" | "purchase_price" | "unit">;
  quantity: number;
  approved: boolean | null; 
}[]>(
  props.data.items.map(item => ({ 
    item: item.item, 
    quantity: item.quantity,
    approved: item.status === 'Pending' 
    ? null : item.status === 'Disetujui' 
      ? true : false 
  }))
)

const approvalNote = ref<string>(props.data.approval_notes || '')
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

const totalApprovedQuantity = computed(() => {
  return approvalItems.value.reduce((acc, item) => {
    if (item.approved) {
      return acc + 1
    }
    return acc
  }, 0)
})

function processApprovalItems() {
  const payload: ApproveFundRequest = {
    id: props.data.id,
    approval_notes: approvalNote.value || '',
    items: approvalItems.value.map(item => ({
      id: item.item.id,
      approved: item.approved!
    })),
    total_approved: totalApprovedQuantity.value
  }

  openOverlay({
    component: Blank,
    props: {
      confirmToContinue: true,
      confirmMessage: 'Apakah anda yakin ingin menyetujui permintaan ini?',
      onConfirm: async () => {
        approve(payload).then(() => {
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
  console.log(userStore.me?.activity?.shift_op?.id, props.data.shift_warehouse_id)
  if (Number(userStore.me?.id) !== Number(props.data.meta.created_by.id)) {
    alertStore.showAlert('Data permintaan hanya dapat diubah oleh yang membuat', 'warning')
  } else if (userStore.me?.activity?.shift_op?.id !== props.data.shift_warehouse_id) {
    alertStore.showAlert('Data permintaan sudah tidak dapat diubah', 'warning')
  } else {
    openOverlay({
      component: UpdateFundRequest,
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
      <h4 class="text-h4 mt-1"> Detail Permintaan Dana </h4>
      <!-- <v-btn 
        v-if="props.data.status === 'Pending'"
        icon
        variant="plain"
        size="x-small"
        @click="handleUpdate"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn> -->
    </div>
    <i class="text-subtitle-2 text-disabled"> {{ props.data?.id }} </i>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="handleSubmit">
      <v-row no-gutters>
        <v-col cols="7">
          <h6 class="text-secondary text-h4 font-weight-bold">
            {{ props.data.subject }}
          </h6>
          <div class="text-subtitle-2 text-medium-emphasis">
            <div>
              {{ props.data.meta.created_by.name }}
            </div>
            {{ props.data.items.length }} item
          </div>
        </v-col>
        <v-col cols="5" class="text-right">  
          <span 
            class="text-subtitle-2 text-medium-emphasis"
            :class="{
              'text-warning': props.data.status === 'Pending',
              'text-success': props.data.status === 'Disetujui',
              'text-error': props.data.status === 'Ditolak',
              'text-primary': props.data.status === 'Beberapa Disetujui',
            }"
          >{{ props.data.status }}</span>
          <h4 v-if="props.data.meta.created_at" class="text-h4 text-right">{{ getTimeDiff(props.data.meta.updated_at) }}</h4>
          <i class="text-subtitle-2 text-disabled">
            Dibuat {{ getTimeDiff(props.data.meta.created_at) }}
          </i>
        </v-col>
      </v-row>

      <div class="text-caption text-medium-emphasis mt-2">
        Deskripsi: 
        <div>
          <i>{{ props.data.description || '-' }}</i>
        </div>
      </div>
      
      <v-row align="center" justify="center" class="my-4">
        <v-col cols="5">
          <div class="text-right">
            <div class="text-subtitle-2 text-medium-emphasis">Total Permintaan Dana:</div>
            <div class="text-h4 text-medium-emphasis font-weight-bold">{{ formatRupiah(props.data.amount) }}</div>
          </div>
        </v-col>
        <v-divider vertical inset></v-divider>
        <v-col cols="5">
          <div>
            <div class="text-subtitle-2 text-medium-emphasis">Dana yang Disetujui:</div>
            <div class="text-h4 text-success font-weight-bold">
              {{ formatRupiah(approvalItems.filter(item => item.approved).reduce((acc, cur) => acc + (cur.item.purchase_price * cur.quantity), 0)) }}
            </div>
          </div>
        </v-col>
      </v-row>
      
      <!-- Daftar Item -->
      <h4 class="text-subtitle-1 mb-2">Daftar Item:</h4>
      
      <div>
        <template v-for="(item, index) in approvalItems" :key="index">
          <v-divider v-if="index > 0" class="my-2"/>
          <v-row align="center" class="pa-2">
            <v-col cols="7">
              <div class="font-weight-medium text-medium-emphasis">{{ item.item.name }}</div>
              <div class="text-caption text-disabled">Jumlah: {{ item.quantity }} {{ item.item.unit }}</div>
            </v-col>
            <v-col cols="5" class="text-right">
              <div v-if="props.data.status === 'Pending' && userStore.hasRole(['admin', 'pemilik', 'bendahara']) && item.approved === null">
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
      <div v-if="props.data.status === 'Pending' && userStore.hasRole(['admin', 'pemilik', 'bendahara'])">
        <v-divider class="mb-5"></v-divider>
        <div class="text-caption text-medium-emphasis">
          Catatan Bendahara: 
        </div>
        <v-textarea
          v-model="approvalNote"
          :rules="notesRules"
          placeholder="Opsional"
          rows="2"
          auto-grow
          clear-icon="mdi-close-circle"
          clearable
          counter
        />

        <!-- Tombol proses -->
        <div class="d-flex justify-end mt-1" >
          <v-btn 
            color="primary" 
            @click="handleSubmit"
            :disabled="isDisabled"
            :loading="lfr"
          >
            Proses Permintaan
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-card>
</template>