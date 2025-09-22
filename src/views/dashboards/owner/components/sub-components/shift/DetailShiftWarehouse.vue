<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

import type { ShiftWarehouse } from '@/types/shift'

import { cloneDeep } from 'lodash'

const { mdAndUp } = useDisplay()

const props = defineProps<{
  data: ShiftWarehouse
}>()

const emit = defineEmits(['close'])

const currentData = ref(cloneDeep(props.data))

</script>

<template>
  <v-card 
    class="rounded-lg pa-0 height-screen"
    :style="mdAndUp ? 'width: clamp(0px, 90dvw, 500px)' : 'width: clamp(0px, 90dvw, 320px)'"
    style="overflow-y: auto; max-height: 90vh;"
  >
    <v-card-text>
      <div
        style="position: absolute; top: 8px; right: 12px; font-size: 20px; cursor: pointer;"
        @click="
          emit('close')
        "
      >
        <v-icon>mdi-close</v-icon>
      </div>

      <div>
        <h4 class="text-h4 mt-1 mb-1">Detail Shift Gudang</h4>
        <div class="text-subtitle-2 text-disabled">
          {{ currentData.id }}
        </div>
      </div>

      <v-divider class="my-4"></v-divider>

      <v-list class="ma-0 pa-0">
        <div class="d-flex align-center justify-space-between font-weight-bold">
          <v-list-subheader class="text-subtitle-1 font-weight-bold">
            Permintaan Stok
          </v-list-subheader>
          {{ currentData.total_restock_request }}
        </div>
        <v-list-item class="px-0 mx-2">
          <v-expansion-panels multiple variant="accordion" elevation="0">  
            <v-expansion-panel>
              <v-expansion-panel-title class="px-2">
                <div class="text-caption text-disabled">
                  Permintaan Stok Disetujui
                </div>
                <template v-slot:actions>
                  <div class="text-caption text-medium-emphasis font-weight-bold text-success">
                    {{ currentData.request_approved }}
                  </div>
                </template>
              </v-expansion-panel-title>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title class="px-2">
                <div class="text-caption text-disabled">
                  Permintaan Stok Ditolak
                </div>
                <template v-slot:actions>
                  <div class="text-caption text-medium-emphasis font-weight-bold text-error">
                    {{ currentData.request_rejected }}
                  </div>
                </template>
              </v-expansion-panel-title>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-list-item>
        
        <div class="d-flex align-center justify-space-between font-weight-bold mt-4">
          <v-list-subheader class="text-subtitle-1 font-weight-bold">
            Perpindahan Stok
          </v-list-subheader>
          {{ currentData.total_stock_movement }}
        </div>
        <v-list-item class="px-0 mx-2">
          <v-expansion-panels multiple variant="accordion" elevation="0">
            <v-expansion-panel>
              <v-expansion-panel-title class="px-2">
                <div class="text-caption text-disabled">
                  Stock Movement Masuk
                </div>
                <template v-slot:actions>
                  <div class="text-caption text-medium-emphasis font-weight-bold text-success">
                    {{ currentData.stock_movement_in }}
                  </div>
                </template>
              </v-expansion-panel-title>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title class="px-2">
                <div class="text-caption text-disabled">
                  Stock Movement Keluar
                </div>
                <template v-slot:actions>
                  <div class="text-caption text-medium-emphasis font-weight-bold text-error">
                    {{ currentData.stock_movement_out }}
                  </div>
                </template>
              </v-expansion-panel-title>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-list-item>
      </v-list>

      <div class="text-medium-emphasis my-4 mx-2">
        <div class="font-weight-bold my-2">Catatan: </div>
        <div class="text-subtitle-2 text-disabled">
          {{ currentData.notes || '-' }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>