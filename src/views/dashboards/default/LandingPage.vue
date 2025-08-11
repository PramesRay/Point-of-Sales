<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()
import { useRoute } from 'vue-router'
const route = useRoute()

import { useUserStore } from '@/stores/authUser';
import { useAlertStore } from '@/stores/alert';
const userStore = useUserStore();
const alertStore = useAlertStore();

// imported components
// import CreateOrder from './components/CreateOrder.vue';
// import CurrentOrderQue from './components/CurrentOrderQue.vue';

// imported composables
import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useMenuItems } from '@/composables/useMenuItems';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import ProfileDD from '@/layouts/full/vertical-header/ProfileDD.vue';

// Data Loading
const { openOverlay } = useOverlayManager();
const { load: loadCurrentOrder, data: currentOrder, loading: lco } = useCurrentOrders();
const { loadItemSales, dataItemSales: menuSales, categories, loading: lm } = useMenuItems();

const visibleComponent = computed(() => {
  return route.query['show-only'] as string | undefined
})

const isChanged = ref(false);
const loadParams = {
  filter: {
    'meta.created_by.id': userStore.me?.id,
  },
  sortBy: 'meta.updated_at',
  sortDesc: true
}

onMounted(() => {
  if (!userStore.me) { 
    openOverlay({
      component: ProfileDD,
      props: {
        is_create: true,
        confirmBeforeClose: true,
        isChanged,
        onIsChangedUpdate: (val: boolean) => {
          isChanged.value = val;
        },
        refresh: () => {
          loadCurrentOrder(loadParams);
          loadItemSales(userStore.me?.branch.id);
        }
      }
    });
    return
  }

  loadCurrentOrder(loadParams);
  loadItemSales(userStore.me?.branch.id);
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="6" v-if="(!visibleComponent || visibleComponent === 'pesanan')">
      <v-row>
        <v-col cols="12">
          <CreateOrder 
            :data_menu="menuSales"
            :categories="categories"
            :refresh="loadCurrentOrder"
            class="flex-grow-1" 
          />
        </v-col>
        <v-col cols="12">
          <CurrentOrderQue
            :data="currentOrder.data"
            :branch="userStore.me?.branch"
            :loading="lco"
          
            :load="loadCurrentOrder"
            :refresh="loadCurrentOrder"
            class="flex-grow-1" 
          />
        </v-col>
      </v-row>
    </v-col>

    <!-- Kolom Kanan: Create Order + Current Order Que -->
    <v-col cols="12" md="6">
      <v-row>
        <v-col cols="12" v-if="(!visibleComponent || visibleComponent === 'reservasi')">
          
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>