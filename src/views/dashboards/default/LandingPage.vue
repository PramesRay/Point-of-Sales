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
import CreateOrder from './components/CreateOrder.vue';
import CurrentOrderQue from './components/CurrentOrderQue.vue';

// imported composables
import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useMenuItems } from '@/composables/useMenuItems';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import ProfileDD from '@/layouts/full/vertical-header/ProfileDD.vue';
import type { UpdateUser, User } from '@/types/user';

function getUserFromLocalStorage() {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : {};
  } catch {
    return {};
  }
}

// Data Loading
const userData = getUserFromLocalStorage();
const { openOverlay } = useOverlayManager();
const { load: loadCurrentOrder, data: currentOrder, loading: lco } = useCurrentOrders();
const { loadItemSales, dataItemSales: menuSales, categories, loading: lm } = useMenuItems();

const visibleComponent = computed(() => {
  return route.query['show-only'] as string | undefined
})

const isChanged = ref(false);
const loadParams = {
  filter: {
    'meta.created_by.id': userData.id,
  },
  sortBy: 'meta.updated_at',
  sortDesc: true
}

onMounted(() => {
  if (!userData) { 
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
          loadItemSales(userData?.branch.id);
        }
      }
    });
    return
  }

  loadCurrentOrder(loadParams);
  loadItemSales(userData?.branch.id);
})

const branchId = computed(() => route.query.branch_id as string | undefined);
const table = computed(() => route.query.table as string | undefined);

// Save branchId and table to localStorage 'user' if present in query
if (branchId.value || table.value) {
  const payload: UpdateUser = { 
    ...userData, 
    branch_id: branchId.value ? branchId.value : userData.branch?.id || '',
    table: table.value ? table.value : userData.table || '' 
  };
  userStore.updateMe(payload);
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="6" v-if="(!visibleComponent || visibleComponent === 'pesanan')">
      <v-row>
        <v-col cols="12">
          <CreateOrder 
            :data_menu="menuSales"
            :categories="categories"
            :refresh="() => loadCurrentOrder(loadParams)"
            class="flex-grow-1" 
          />
        </v-col>
        <v-col cols="12">
          <CurrentOrderQue
            :data="currentOrder.data"
            :data_menu="menuSales"
            :branch="userData?.branch"
            :loading="lco"
          
            :refresh="() => loadCurrentOrder(loadParams)"
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