<script setup lang="ts">

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import UpdateOrder from './sub-components/order/UpdateOrder.vue';
import ProfileDD from '@/layouts/full/vertical-header/ProfileDD.vue';
import { computed, ref } from 'vue';
import type { Category } from '@/types/inventory';
import type { Menu } from '@/types/menu';
import type { Branch } from '@/types/branch';
import { useUserStore } from '@/stores/authUser';
import { useAlertStore } from '@/stores/alert';
const userStore = useUserStore()
const alertStore = useAlertStore()

const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data_menu: Menu[]
  data_category: Category[]
  data_branches: Branch[]
  refresh: () => void
}>();

const data_menus = computed(() => props.data_menu)
const data_categories = computed(() => props.data_category)
const data_branches = computed(() => props.data_branches)

const branchActive = computed<boolean>(() => {
  const targetId = userStore.me?.branch?.id;
  if (targetId == null) return false;

  const b = data_branches.value.find(
    br => String(br.id) === String(targetId)
  );

  // Sesuaikan path is_active dengan struktur milikmu
  return b?.operational?.activity?.is_active === true;
});
const isChanged = ref(false);

function handleOpenCreateOrder() {
  if (userStore.me?.branch === null || userStore.me?.table === null) {
    alertStore.showAlert("Silahkan pilih cabang terlebih dahulu yaa", "warning")

    openOverlay({
      component: ProfileDD,
      props: {
        user: userStore.me,
        confirmBeforeClose: true,
        isChanged,
        onIsChangedUpdate: (val: boolean) => {
          isChanged.value = val;
        }
      }
    });
    
    return
  }

  if(!branchActive.value) {
    alertStore.showAlert("Cabang ini sedang tidak aktif", "warning")
    return
  }

  openOverlay({
    component: UpdateOrder,
    props: {
      is_create: true,
      data_menu: data_menus.value,
      categories: data_categories.value,
      refresh: () => props.refresh()
    },
  })
}
</script>

<template>
  <v-card
    class="bg-primary overflow-hidden bubble-shape-sm"
    elevation="0"
    rounded="md"
    @click="handleOpenCreateOrder"
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