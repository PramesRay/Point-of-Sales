<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'
import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import type { StockRequest } from '@/types/inventory'
import type { IdName } from '@/types/common'
import type { RestockMenuSalesPayload, MenuSale } from '@/types/menu'
import type { ShiftKitchen } from '@/types/shift'
import { useOverlayManager } from '@/composables/non-services/useOverlayManager'
import { useMenuItems } from '@/composables/useMenuItems'
import Blank from '@/components/shared/Blank.vue'

const { qtyUpdate, loading } = useMenuItems()

const { mdAndUp } = useDisplay()
const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data: ShiftKitchen
  branch: IdName | undefined | null
  loading?: boolean
  refresh: () => void
}>()

// Salin data dan tambahkan properti tambahan untuk UI
const currentData = ref<{
  id: string
  name: string
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

// Submit handler (belum dihubungkan ke emit/request API)
function handleSubmit() {
  const itemsToSubmit = currentData.value.filter(item => item.showQty)
  const payload: RestockMenuSalesPayload = itemsToSubmit.map(item => ({
    id: item.id,
    quantity: item.newQty
  }))

  openOverlay({
    component: Blank,
    props: {
      confirmToContinue: true,
      confirmMessage: 'Apakah anda yakin ingin merestock seluruh menu ini?',
      onConfirm: () => {
        qtyUpdate(payload).then(() => {
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
              v-if="props.branch && props.branch.id !== 'all' && !props.loading"
              class="text-subtitle-2 text-medium-emphasis"
            >
              {{ props.branch?.name }}
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
            <ScrollContainer :style="{ maxHeight: mdAndUp ? '35rem' : '18rem' }">
              <v-list v-if="currentData.length > 0" class="">
                <v-list-item
                  v-for="(item, i) in currentData"
                  :key="i"
                  class="ps-2"
                  color="secondary"
                  rounded="sm"
                >
                  <v-row no-gutters>
                    <v-col cols="4">
                      <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 120px; overflow: hidden;">
                        {{ item.name }}
                      </h6>
                      <div class="text-subtitle-2 text-disabled">
                        <div>Tersedia: <span class="text-h4 text-medium-emphasis font-weight-bold">{{ item.final }}</span></div>
                        <span>Stok awal: {{ item.initial }}</span>
                      </div>
                    </v-col>
                    <v-col cols="8" class="ps-2">
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
                            :min="item.is_add ? item.final : 1"
                            :max="item.is_add ? Infinity : item.final"
                            inset
                            density="compact"
                            style="max-width: 8rem; min-width: 6rem;"
                            @click.stop
                          />
                        </v-card>

                        <div style="min-width: fit-content;">
                          <v-btn-group
                            size="x-small"
                            variant="outlined"
                            density="compact"
                          >
                            <v-btn icon v-if="!item.showQty" @click="toggleQtyField(item), item.is_add = false">
                              <v-icon>mdi-minus</v-icon>
                            </v-btn>
                            <v-btn icon v-if="!item.showQty" @click="toggleQtyField(item), item.is_add = true">
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                            <v-btn icon v-if="item.showQty" @click="toggleQtyField(item)">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </v-btn-group>
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