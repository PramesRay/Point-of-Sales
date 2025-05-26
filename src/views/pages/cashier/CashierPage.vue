<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { hasRole } from '@/utils/helpers/user';
import { useDisplay } from 'vuetify';
const { mdAndUp, smAndDown } = useDisplay()

// imported components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CurrentOrder from '../kitchen/components/CurrentOrder.vue';
import CreateOrder from './components/CreateOrder.vue';
import CurrentOrderQue from '../kitchen/components/CurrentOrderQue.vue';
import CurrentTransaction from '@/views/dashboards/default/components/CurrentTransaction.vue';

// imported composables
import { useBranchList } from '@/composables/useBranchList';
import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useTransactions } from '@/composables/useTransactionList';
import { useUser } from '@/composables/useUser';
import { useMenuItems } from '@/composables/useMenuItems';

// Data Loading
const { data: me, loading: lu, fetchMe } = useUser();
const { branches, loading: lb } = useBranchList();
const { data: currentOrder, loading: lco, error, updateOrder, createOrder, processDirectPayment } = useCurrentOrders();
const { transactions, loading: ltx } = useTransactions();
const { init, data: menuItems, categories, loadingData, loadingBranches } = useMenuItems();

onMounted(() => {
  fetchMe();
})

// Branch Selection
const route = useRoute();
const router = useRouter();
const branchOptions = computed(() => [
  { id: 'all', name: 'Semua Cabang' },
  ...branches.value
]);
const selectedBranch = computed({
  get: () => String(route.query.branch || 'all'),
  set: val => {
    router.replace({ query: { ...route.query, branch: val } });
  }
});
</script>

<template>
  <BaseBreadcrumb
    title="Kasir"
    :breadcrumbs="[
      { title: 'Kasir', href: '/page/cashier' }
    ]"
  >
    <template #last>
      <div class="pb-3">
        <v-select
          class="ma-0 pa-0 align-center text-subtitle-1"
          variant="plain"
          v-model="selectedBranch"
          :items="branchOptions"
          item-title="name"
          item-value="id"
          :loading="lb"
          hide-details
          density="compact"
        />
      </div>
    </template>
  </BaseBreadcrumb>

  <v-row>
    <!-- Kolom Kiri: Current Order + Current Transaction -->
    <v-col cols="12" md="6">
      <v-row>
        <v-col cols="12" v-if="me && hasRole(me, ['admin', 'kitchen', 'cashier'])">
          <CurrentOrder 
            :data="currentOrder" 
            :branch="selectedBranch"
            :loading="lco" 
            class="flex-grow-1" 
          />
        </v-col>
        
        <v-col cols="12" v-if="mdAndUp">
          <CurrentTransaction
            :data="transactions"
            :branch="selectedBranch"
            :loading="ltx"
            class="flex-grow-1"
          />
        </v-col>
      </v-row>
    </v-col>

    <!-- Kolom Kanan: Create Order + Current Order Que -->
    <v-col cols="12" md="6">
      <v-row>
        <v-col cols="12" v-if="me && hasRole(me, ['admin', 'kitchen', 'cashier'])">
          <CreateOrder 
            :user="me"
            :data="menuItems"
            :categories="categories"
            :branch="selectedBranch"
            :loading="lco" 
            @create-order="createOrder"
            @process-direct-payment="processDirectPayment"
            class="flex-grow-1" 
          />
        </v-col>

        <v-col cols="12" v-if="me && hasRole(me, ['admin', 'kitchen', 'cashier'])">
          <CurrentOrderQue
            :user="me"
            :data="currentOrder" 
            :branch="selectedBranch"
            :loading="lco" 
            @proses-order="updateOrder"
            @process-payment="updateOrder"
            class="flex-grow-1" 
          />
        </v-col>

        <v-col cols="12" v-if="smAndDown">
          <CurrentTransaction
            :data="transactions"
            :branch="selectedBranch"
            :loading="ltx"
            class="flex-grow-1"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
