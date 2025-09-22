<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'
import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import type { StockRequest } from '@/types/inventory'
import type { IdName } from '@/types/common'
import type { RestockMenuSalesPayload, MenuSale } from '@/types/menu'
import type { ShiftKitchen, UpdateShiftKitchenPayload } from '@/types/shift'
import { useOverlayManager } from '@/composables/non-services/useOverlayManager'
import { useMenu } from '@/composables/useMenuItems'
import Blank from '@/components/shared/Blank.vue'
import { useShift } from '@/composables/useShift'

const { mdAndUp } = useDisplay()
const { openOverlay } = useOverlayManager()
const { updateKitchen } = useShift()

const props = defineProps<{
  data: ShiftKitchen
  branch: IdName | undefined | null
  loading?: boolean
  refresh: () => void
}>()

const currentShiftKichen = computed(() => props.data)

// Salin data dan tambahkan properti tambahan untuk UI
const currentData = ref<{
  id: string
  name: string
  threshold: number
  initial: number
  final: number
  showQty: boolean
  newQty: number
  is_add: boolean
}[]>([])

watch(() => props.data, (newVal) => {
  currentData.value = (newVal?.quantity_menu || []).map(item => ({
    ...item,
    showQty: false,
    newQty: item.final,
    is_add: true
  }))
}, { immediate: true })


// Tombol tambah hanya muncul jika ada yang ingin ditambahkan dan qty > 0
const canSubmit = computed(() =>
currentData.value.some(item => item.showQty && (item.is_add ? item.newQty > item.final : item.newQty < item.final))
)

function resetData() {
  currentData.value = (props.data?.quantity_menu || []).map(item => ({
    ...item,
    showQty: false,
    newQty: item.final,
    is_add: true
  }))
}

function handleSubmit() {
  const items = currentData.value.filter(item => item.showQty)
  const itemsToSubmit: { id: string; quantity: number}[] = items.map(item => ({
    id: item.id,
    quantity: item.newQty,
  }))

  const payload: Omit<UpdateShiftKitchenPayload, 'notes'> = {
    id: props.data.id,
    final_menu: itemsToSubmit
  }

  openOverlay({
    component: Blank,
    props: {
      confirmToContinue: true,
      confirmMessage: 'Apakah anda yakin ingin mengubah jumlah seluruh menu ini?',
      onConfirm: () => {
        updateKitchen(payload)
          .then(() => {
            resetData()
            props.refresh()
          })
      }
    }
  })
  console.log('payload', payload)
}

function toggleQtyField(item: any) {
  item.showQty = !item.showQty
  if (!item.showQty) item.newQty = item.final // Reset saat ditutup
}
</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row>
          <v-col cols="8">
            <div class="d-flex align-center">
              <h4 class="text-h4 mt-1">Menu Penjualan</h4>
            </div>
            <div 
              v-if="!props.branch && !props.loading"
              class="text-subtitle-2 text-medium-emphasis"
            >
              {{ currentShiftKichen?.branch?.name }}
            </div> 
          </v-col>
          <v-col cols="4" class="mt-auto text-right">
            <v-btn
              v-if="canSubmit && !props.loading"
              color="success"
              :disabled="props.loading || loading"
              :loading="props.loading || loading"
              @click="handleSubmit"
            >
              Simpan
            </v-btn>
          </v-col>
        </v-row>

        <div v-if="!props.loading">
          <div class="my-4">
            <ScrollContainer :style="{ maxHeight: mdAndUp ? '35rem' : '18rem' }" v-if="!currentShiftKichen?.end">
              <v-list v-if="currentData.length > 0" class="">
                <v-list-item
                  v-for="(item, i) in currentData"
                  :key="i"
                  class="ps-2"
                  color="secondary"
                  rounded="sm"
                >
                  <v-row no-gutters align="center">
                    <v-col cols="5">
                      <span v-if="item.final <= item.threshold" class="text-subtitle-2 text-medium-emphasis text-warning">Perlu Restock</span>
                      <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 120px; overflow: hidden;">
                        {{ item.name }}
                      </h6>
                      <div class="text-subtitle-2 text-disabled">
                        <div class="text-h5 text-medium-emphasis font-weight-bold">Tersedia: <span class="text-h4">{{ item.final }}</span></div>
                        <span>Stok awal: {{ item.initial }}</span>
                      </div>
                    </v-col>
                    <v-col cols="7" class="ps-2">
                      <div
                        class="d-flex align-center justify-end ga-2"
                        style="overflow-x: auto; flex-wrap: nowrap; min-width: 0;"
                      >
                        <v-card elevation="0" variant="plain">
                          <v-number-input
                            v-show="item.showQty"
                            v-model="item.newQty"
                            control-variant="split"
                            variant="outlined"
                            hide-details
                            :min="item.is_add ? item.final : 0"
                            :max="item.is_add ? Infinity : item.final"
                            inset
                            density="compact"
                            style="max-width: 8rem; min-width: 6rem;"
                            @click.stop
                          />
                        </v-card>

                        <div style="min-width: fit-content;">
                          <v-btn 
                            v-if="!item.showQty" 
                            icon
                            color="error"
                            variant="text"
                            @click="toggleQtyField(item), item.is_add = false"
                          >
                            <v-icon>mdi-minus</v-icon>
                          </v-btn>
                          <v-btn 
                            v-if="!item.showQty" 
                            icon
                            color="primary"
                            variant="text"
                            @click="toggleQtyField(item), item.is_add = true"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>

                          <v-btn
                            v-if="item.showQty"
                            icon
                            variant="plain"
                            @click="toggleQtyField(item)"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-col>


                  </v-row>
                  <v-divider class="my-3" />
                </v-list-item>
              </v-list>
              <div v-else class="text-center text-subtitle-2 text-disabled mt-4">
                Data Menu tidak ditemukan
              </div>
            </ScrollContainer>
            <div v-else class="text-center text-subtitle-2 text-disabled mt-4">
              Tidak ada shift aktif
            </div>
          </div>
        </div>
        <div v-else class="ml-auto">
          <v-skeleton-loader
            type="list-item-two-line"
            :loading="props.loading"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>