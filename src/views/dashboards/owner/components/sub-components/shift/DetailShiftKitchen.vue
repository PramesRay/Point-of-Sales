<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'

import type { ShiftKitchen } from '@/types/shift'

import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import { cloneDeep } from 'lodash'
import { useMenu } from '@/composables/useMenuItems'

const { mdAndUp } = useDisplay()

const props = defineProps<{
  data: ShiftKitchen
}>()

const emit = defineEmits(['close'])

const currentData = cloneDeep(props.data)

const isShowMenu = ref(false)

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

      <h4 class="text-h4 mt-1 mb-1">Detail Shift Dapur</h4>
      <div class="text-subtitle-2 text-disabled">{{ currentData.branch?.name }}</div>

      <v-divider class="my-4"></v-divider>

      <ScrollContainer :maxHeight="'70dvh'" style="overflow-x: hidden;">
        <v-list class="ma-0 pa-0" style="overflow-x: hidden;">
          <div class="d-flex align-center justify-space-between font-weight-bold">
            <v-list-subheader class="text-subtitle-1 font-weight-bold">
              Pesanan
            </v-list-subheader>
            {{ currentData.total_order }}
          </div>
          <v-list-item class="px-0 mx-2">
            <v-expansion-panels multiple variant="accordion" elevation="0">  
              <v-expansion-panel>
                <v-expansion-panel-title class="px-2">
                  <div class="text-caption text-disabled">
                    Pesanan Selesai
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-medium-emphasis font-weight-bold text-success">
                      {{ currentData.completed_order }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>
  
              <v-expansion-panel>
                <v-expansion-panel-title class="px-2">
                  <div class="text-caption text-disabled">
                    Pesanan Dibatalkan
                  </div>
                  <template v-slot:actions>
                    <div class="text-caption text-medium-emphasis font-weight-bold text-error">
                      {{ currentData.canceled_order }}
                    </div>
                  </template>
                </v-expansion-panel-title>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item>
          
          <div class="d-flex align-center justify-space-between font-weight-bold" @click="isShowMenu = !isShowMenu">
            <v-list-subheader class="text-subtitle-1 font-weight-bold">
              Manajemen Menu
            </v-list-subheader>
            <v-icon>{{ isShowMenu ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </div>
          <v-expand-transition v-show="isShowMenu">
            <v-table :items="currentData.quantity_menu" style="overflow-x: hidden;">
              <thead>
                <tr>
                  <th style="max-width: 30dvw;">Nama Menu</th>
                  <th class="text-center">Stok Awal</th>
                  <th class="text-center">Stok Terkini</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentData.quantity_menu" :key="index" >
                  <td style="max-width: 30dvw; overflow: hidden; text-overflow: ellipsis;">
                    <h4 class="text-h5 font-weight-medium">
                      {{ item.name }}
                    </h4>
                  </td>
                  <td class="text-center text-disabled">
                    {{ item.initial || '-' }}
                  </td>
                  <td class="text-center text-disabled">
                    {{ item.final || '-' }}
                  </td>
                </tr>
              </tbody>
            </v-table>

            <div v-if="currentData.quantity_menu.length === 0" class="text-center text-subtitle-2 text-disabled my-4">
              Data Menu Sales tidak ditemukan
            </div>
          </v-expand-transition>
        </v-list>
        
        <div class="text-medium-emphasis my-4 mx-2">
          <div class="font-weight-bold my-2">Catatan: </div>
          <div class="text-subtitle-2 text-disabled">
            {{ currentData.notes || '-' }}
          </div>
        </div>
      </ScrollContainer>
    </v-card-text>
  </v-card>
</template>