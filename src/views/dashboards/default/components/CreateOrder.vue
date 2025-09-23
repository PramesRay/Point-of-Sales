<script setup lang="ts">
import type { Category } from '@/types/inventory';

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import UpdateOrder from './sub-components/order/UpdateOrder.vue';
import { computed } from 'vue';
import type { Menu } from '@/types/menu';

const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data_menu: Menu[]
  data_category: Category[]
  refresh: () => void
}>();

const data_menus = computed(() => props.data_menu)
const data_categories = computed(() => props.data_category)

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
          data_menu: data_menus,
          categories: data_categories,
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