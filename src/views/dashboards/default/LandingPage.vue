<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { useRoute } from 'vue-router'

import { useUserStore } from '@/stores/authUser';
import { useAlertStore } from '@/stores/alert';

// imported components
import CreateOrder from './components/CreateOrder.vue';
import CurrentOrderQue from './components/CurrentOrderQue.vue';
import CurrentReservation from './components/CurrentReservation.vue';

const route = useRoute()
const userStore = useUserStore();
const { mdAndUp } = useDisplay()
const alertStore = useAlertStore();

// imported composables
import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useMenuItems } from '@/composables/useMenuItems';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import ProfileDD from '@/layouts/full/vertical-header/ProfileDD.vue';
import type { UpdateUser, User } from '@/types/user';
import { useReservation } from '@/composables/useReservation';
import { useBranchList } from '@/composables/useBranchList';

function getUserFromLocalStorage() {
  const user = localStorage.getItem('user-nurchs') ? JSON.parse(localStorage.getItem('user-nurchs') as string) : null
  return user
}

// Data Loading
const userData = getUserFromLocalStorage();
const { openOverlay } = useOverlayManager();
const { load: loadBranch, data: branchData } = useBranchList();
const { load: loadCurrentOrder, data: currentOrder, loading: lco } = useCurrentOrders();
const { data: reservationData, loading: lr, load: loadReservation } = useReservation()
const { loadItemSales, loadCategory, data: menuSales, categories, loading: lm } = useMenuItems();

const visibleComponent = computed(() => {
  return route.query['show-only'] as string | undefined
})

const isChanged = ref(false);
const loadParams = {filter: {'created_by': userData?.fk_user_id}}

onMounted(() => {
  if (!userData) { 
    alertStore.showAlert('Ups, isi data diri dulu ya!', 'warning')
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
          const userData = getUserFromLocalStorage();
          loadCurrentOrder(loadParams);
          loadItemSales(userData?.branch?.id);
          loadCategory()
          loadReservation(loadParams);
        }
      }
    });
    return
  } else {
    loadBranch();
    loadCategory()
    loadCurrentOrder(loadParams);
    loadItemSales(userData?.branch?.id);
    loadReservation(loadParams);
  }
})

watch(() => userStore.me, () => {
    loadCurrentOrder(loadParams);
    loadItemSales(userStore.me?.branch.id);
    loadReservation(loadParams);
  }
)

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
            :data_category="categories"
            :refresh="() => loadCurrentOrder(loadParams)"
            class="flex-grow-1" 
          />
        </v-col>
        <v-col cols="12">
          <CurrentOrderQue
            :data="currentOrder.data"
            :data_menu="menuSales"
            :data_category="categories"
            :branch="userData?.branch"
            :loading="lco || lm"
          
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
          <CurrentReservation
            :data="reservationData" 
            :branch="userData?.branch"
            :branch_option="branchData"
            :loading="lr"
            :refresh="() => loadReservation(loadParams)"
            class="flex-grow-1"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>