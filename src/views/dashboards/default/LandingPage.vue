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
import type { IdName } from '@/types/common';

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

onMounted(async() => {
  if (!userData) { 
    alertStore.showAlert('Ups, isi data diri dulu ya!', 'warning')
    openOverlay({
      component: ProfileDD,
      props: {
        confirmBeforeClose: true,
        isChanged,
        onIsChangedUpdate: (val: boolean) => {
          isChanged.value = val;
        },
        refresh: () => {
          const userData = getUserFromLocalStorage();
          const loadParams = {filter: {'created_by': userData?.fk_user_id}}

          loadCurrentOrder(loadParams);
          userData?.branch ? loadItemSales(userData?.branch.id) : null;
          loadCategory()
          loadReservation(loadParams);
        }
      }
    });
    return
  } else {
    await loadBranch();
    loadCategory()
    loadCurrentOrder(loadParams);
    userData?.branch ? loadItemSales(userData?.branch.id) : null;
    loadReservation(loadParams);
  }
})

watch(() => userStore.me, () => {
    const userData = getUserFromLocalStorage();
    const loadParams = {filter: {'created_by': userData?.fk_user_id}}

    loadCurrentOrder(loadParams);
    userData?.branch ? loadItemSales(userData?.branch.id) : null;
    loadReservation(loadParams);
  }
)

const branchId = computed(() => route.query.branch_id as string | undefined);
const table = computed(() => route.query.table as string | undefined);

watch(
  () => branchData.value,
  (branches) => {
    if ((branchId.value || table.value) && branches && branches.length > 0) {
      const branch = branches.find((b: any) => b?.id?.toString() === branchId.value);

      if(!branch?.operational.is_active) return alertStore.showAlert('Cabang ini sedang tidak aktif!', 'warning')

      const payload: UpdateUser = { 
        ...userData, 
        branch: branch ? { 
          id: branch.id,
          name: branch.name
         } : userData?.branch || null,
        table: table.value || userData?.table || null
      };
      localStorage.setItem('user-nurchs', JSON.stringify(payload));
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-row>
    <v-col cols="12" class="d-flex justify-center mt-2" v-if="!userData">
      <p class="text-subtitle-1 text-disabled text-center"> Ups, isi data diri dulu ya pada modul profile di kanan atas halaman ini!  </p>
    </v-col>

    <template v-else-if="userData.branch">
      <v-col cols="12" md="6" v-if="(!visibleComponent || visibleComponent === 'pesanan')">
        <v-row>
          <v-col cols="12">
            <CreateOrder 
              :data_menu="menuSales"
              :data_category="categories"
              :data_branches="branchData"
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
    </template>
  
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