<script setup lang="ts">
import type { Category } from '@/types/inventory';
import type { MenuSale } from '@/types/menu'

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import UpdateOrder from './sub-components/UpdateOrder.vue';

const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data_menu: MenuSale[];
  categories: Category[];
  refresh: () => void
}>();

</script>

<template>
  <v-card
    class="bg-primary overflow-hidden bubble-shape-sm"
    elevation="0"
    rounded="md"
    @click="
      openOverlay({
        component: UpdateOrder,
        props: {
          is_create: true,
          data_menu: props.data_menu,
          categories: props.categories,
          refresh: () => props.refresh()
        },
      })
    "
  >
    <v-card-text>
      <div class="d-flex align-center ga-4">
        <v-btn color="darkprimary" icon rounded="sm" variant="flat">
          <ShoppingCartIcon stroke-width="1.5" width="20" />
        </v-btn>
        <span>
          <h4 class="text-h4 font-weight-medium"> Buat Pesanan </h4>
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>