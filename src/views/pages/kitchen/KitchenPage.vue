<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { hasRole } from '@/utils/helpers/user';

// imported components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CurrentOrder from './components/CurrentOrder.vue';
import CurrentStockRequestList from './components/CurrentStockRequestList.vue';
import CurrentOrderQue from './components/CurrentOrderQue.vue';

// imported composables
import { useBranchList } from '@/composables/useBranchList';
import { useStockRequests } from "@/composables/useStockRequest";
import { useCurrentOrders } from '@/composables/useCurrentOrder';
import { useUser } from '@/composables/useUser';

// Data Loading
const { data: me, loading: lu, fetchMe } = useUser();
const { branches, loading: lb } = useBranchList();
const { data: currentOrder, loading: lco, error, updateOrder } = useCurrentOrders();
const { summary, list: stockRequestlist, loading: lsr, createRequest } = useStockRequests();

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
    title="Kitchen"
    :breadcrumbs="[
      { title: 'Kitchen', href: '/page/kitchen' }
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
    <!-- -------------------------------------------------------------------- -->
    <!-- Current Order Card -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <CurrentOrder 
        :data="currentOrder" 
        :branch="selectedBranch"
        :loading="lco" 
        class="flex-grow-1" 
      />
    </v-col>
    
    <!-- -------------------------------------------------------------------- -->
    <!-- Current Order Que -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4" v-if="me && hasRole(me, ['admin', 'kitchen', 'cashier'])">
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

    <!-- -------------------------------------------------------------------- -->
    <!-- Current Stock Request List -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4" v-if="me">
      <CurrentStockRequestList 
        :user="me"
        :data="stockRequestlist" 
        :branch="selectedBranch"
        :loading="lsr" 
        @create-request="createRequest"
        class="flex-grow-1" 
      />
    </v-col>
  </v-row>
</template>