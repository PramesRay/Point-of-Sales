<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SettingsIcon, LogoutIcon } from 'vue-tabler-icons';

import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/authUser';

import { formatDate } from '@/utils/helpers/format-date';
import { getTimeDiff } from '@/utils/helpers/time';

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import StartShiftCashier from '@/views/pages/cashier/components/StartShift.vue';
import UpdateShiftCashier from '@/views/pages/cashier/components/UpdateShift.vue';

import StartShiftKitchen from '@/views/pages/kitchen/components/StartShift.vue';
import UpdateShiftKitchen from '@/views/pages/kitchen/components/UpdateShift.vue';
import UpdateShiftWarehouse from '@/views/pages/inventory/components/UpdateShift.vue';

import Blank from '@/components/shared/Blank.vue';
import Start from '@/views/pages/shift/Start.vue';
import { useShift } from '@/composables/useShift';
import type { ShiftCashier, ShiftKitchen, ShiftWarehouse } from '@/types/shift';

const authStore = useAuthStore();
const userStore = useUserStore();
const { openOverlay } = useOverlayManager()
const { endEmployee, loadShiftbyRole, startWarehouse, shiftCashier, shiftKitchen, shiftEmployee, shiftWarehouse, loading } = useShift()

const isChanged = ref(false)
const hover = ref(false)

// Fungsi untuk mendapatkan pagi siang sore malam
function getGreeting() {
  const currentHour = new Date().getHours();
  console.log('currentHour', currentHour);
  if (currentHour >= 0 && currentHour < 12) {
    return 'Pagi';
  } else if (currentHour >= 12 && currentHour < 15) {
    return 'Siang';
  } else if (currentHour >= 15 && currentHour < 18) {
    return 'Sore';
  } else {
    return 'Malam';
  }
}

onMounted(() => {
  if (!userStore.me || loading.value) {
    userStore.fetchMe();
    userStore.fetchShift();
  }

  if (userStore.me?.activity?.is_active) {
    loadShiftbyRole(userStore.me.activity.branch?.id)
  }
})
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- profile DD -->
  <!-- ---------------------------------------------- -->
  <div class="pa-4">
    <h4 class="mb-n1">Selamat {{ getGreeting() }}, <span class="font-weight-regular">{{ userStore.me?.name.split(' ')[0] }}</span></h4>
    <span class="text-subtitle-2 text-medium-emphasis">{{ userStore.me?.role }}</span>

    <!-- <v-text-field persistent-placeholder placeholder="Search" class="my-3" color="primary" variant="outlined" hide-details>
      <template v-slot:prepend-inner>
        <SearchIcon stroke-width="1.5" size="20" class="text-lightText SearchIcon" />
      </template>
    </v-text-field> -->

    <v-divider></v-divider>
    <perfect-scrollbar style="height: auto; max-height: 80dvh">
      <div v-if="!userStore.me?.activity?.is_active" class="rounded-md pa-5 my-3 circle sm-circle lg-circle bg-containerBg">
        <h4>Tidak Aktif</h4>
        <h6 class="text-subtitle-2 text-disabled mr-11 pr-11 mt-2">
          Terakhir Aktif
        </h6>
        <h5 class="text-h5 font-weight-medium text-medium-emphasis mb-2">
          {{ formatDate(userStore.me?.activity?.last_active || new Date()).split('pukul')[0] }}
        </h5>
        <span class="mr-2">
          <v-btn
            :ripple="false"
            icon
            variant="plain"
            density="compact"
            @mouseover="hover = true"
            @mouseleave="hover = false"
            @touchstart="hover = !hover"
            @click="
              openOverlay({
                component: Start,
                props: {
                  confirmBeforeClose: true,
                  isChanged
                }
              })
            "
          >
            <v-icon>{{ hover ? 'mdi-door-sliding-open' : 'mdi-door-sliding' }}</v-icon>
          </v-btn>
          <span v-show="hover" class="text-subtitle-2">
            Mulai Shift
          </span>
        </span>
      </div>
      <div v-else class="rounded-md pa-5 my-3 circle sm-circle lg-circle bg-lightwarning">
        <h4 class="d-flex justify-space-between">
          Aktif
          <div>
            <span class="text-subtitle-2 text-disabled">
              <v-icon size="x-small">mdi-clock-outline</v-icon>
              {{ getTimeDiff(userStore.me?.activity.last_active || new Date(), false) }}
            </span>
            <v-divider class="mx-1" vertical/>
            <span class="text-subtitle-2 text-disabled">
              <v-icon size="x-small">mdi-store</v-icon>
              {{ userStore.hasRole('Gudang') ? 'Gudang' : userStore.me?.activity.branch?.name }}
            </span>
          </div>
        </h4>
        <h6 class="text-subtitle-2 text-disabled mr-11 pr-11 mt-2">
          Dimulai pada:
        </h6>
        <h5 class="text-h5 font-weight-medium text-medium-emphasis mb-2">{{ formatDate(userStore.me?.activity.last_active || new Date()).replace(' pukul', ': ') }}</h5>
        <div class="mr-2">
          <v-btn
            :ripple="false"
            :loading="loading"
            icon
            variant="plain"
            density="compact"
            @mouseover="hover = true"
            @mouseleave="hover = false"
            @touchstart="hover = !hover"
            @click="
              openOverlay({
                component: Blank,
                props: {
                  confirmToContinue: true,
                  confirmMessage: 'Apakah anda yakin ingin mengakhiri shift?',
                  loading,
                  onConfirm: () => {
                    endEmployee(userStore.me?.activity?.branch?.id || '')
                  }
                }
              })
            "
          >
            <v-icon>{{ !hover ? 'mdi-door-sliding-open' : 'mdi-door-sliding' }}</v-icon>
          </v-btn>
          <span v-show="hover" class="text-subtitle-2">
            Akhiri Shift
          </span>
        </div>
        <v-progress-circular v-if="loading" indeterminate color="warning" height="1"/>
        <div v-if="userStore.hasRole(['Admin', 'Pemilik', 'Dapur', 'Kasir']) && !loading">
          <div v-if="userStore.hasRole(['Admin', 'Pemilik', 'Kasir'])">
            <!-- Mekanisme kondisional rendering perlu ditingkatkan? -->
            <v-btn 
              v-if="shiftCashier?.total == 0"
              elevation="1"
              append-icon="mdi-cash-register"
              @click="openOverlay({
                component: StartShiftCashier,
                props: {
                  confirmBeforeClose: true,
                  isChanged: isChanged
                }
              })"
            > 
              Inisiasi Kas
            </v-btn>
            <v-btn 
              v-else
              class="mt-2"
              color="success"
              elevation="1"
              append-icon="mdi-cash-register"
              @click="openOverlay({
                component: UpdateShiftCashier,
                props: {
                  data: shiftCashier.data[0] as ShiftCashier,
                  confirmBeforeClose: true,
                  isChanged: isChanged
                }
              })"
            > 
              Kas
            </v-btn>
          </div>

          <div v-if="userStore.hasRole(['Admin', 'Pemilik', 'Dapur'])">
            <v-btn 
              v-if="shiftKitchen?.total == 0"
              elevation="1"
              append-icon="mdi-stove"
              @click="openOverlay({
                component: StartShiftKitchen,
                props: {
                  confirmBeforeClose: true,
                  isChanged: isChanged
                }
              })"
            > 
              Inisiasi Stok
            </v-btn>
            <v-btn 
              v-else
              class="mt-2"
              color="warning"
              elevation="1"
              append-icon="mdi-stove"
              @click="openOverlay({
                component: UpdateShiftKitchen,
                props: {
                  data: shiftKitchen.data[0] as ShiftKitchen,
                  confirmBeforeClose: true,
                  isChanged: isChanged
                }
              })
              "
            > 
              Stok
            </v-btn>
          </div>
          <!-- shift warehouse -->
          <div v-if="userStore.hasRole(['Admin', 'Pemilik', 'Gudang'])">
            <v-btn 
              v-if="shiftWarehouse?.total == 0"
              elevation="1"
              append-icon="mdi-warehouse"
              @click="openOverlay({
                component: Blank,
                props: {
                  confirmToContinue: true,
                  confirmMessage: 'Apakah anda yakin ingin memulai shift gudang?',
                  loading,
                  onConfirm: () => {
                    startWarehouse()
                  }
                }
              })"
            > 
              Inisiasi Gudang
            </v-btn>
            <v-btn 
              v-else
              class="mt-2"
              color="primary"
              elevation="1"
              append-icon="mdi-warehouse"
              @click="openOverlay({
                component: UpdateShiftWarehouse,
                props: {
                  data: shiftWarehouse.data[0] as ShiftWarehouse,
                  confirmBeforeClose: true,
                  isChanged: isChanged
                }
              })
              "
            > 
              Gudang
            </v-btn>
          </div>
        </div>
      </div>
      <!-- 
      <v-divider></v-divider>

      <div class="bg-lightprimary rounded-md px-5 py-3 my-3">
        <div class="d-flex align-center justify-space-between">
          <h5 class="text-h5">Start DND Mode</h5>
          <div>
            <v-switch v-model="swt1" color="primary" hide-details></v-switch>
          </div>
        </div>
        <div class="d-flex align-center justify-space-between">
          <h5 class="text-h5">Allow Notifications</h5>
          <div>
            <v-switch v-model="swt2" color="primary" hide-details></v-switch>
          </div>
        </div>
      </div>

      <v-divider></v-divider> -->

      <v-list class="">
        <v-list-item color="secondary" rounded="md">
          <template v-slot:prepend>
            <SettingsIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2"> Pengaturan Akun</v-list-item-title>
        </v-list-item>

        <!-- <v-list-item color="secondary" rounded="md">
          <template v-slot:prepend>
            <UserIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2"> Social Profile</v-list-item-title>

          <template v-slot:append>
            <v-chip color="warning" class="text-white" text="02" variant="flat" size="small" />
          </template>
        </v-list-item> -->

        <v-list-item
          color="secondary"
          class="text-error"
          rounded="md"
          @click="
            openOverlay({
              component: Blank,
              props: {
                confirmToContinue: true,
                confirmMessage: 'Apakah anda yakin ingin logout?',
                loading: authStore.loading,
                onConfirm:() => {
                  authStore.logout()
                }
              }
            })
          "
        >
          <template v-slot:prepend v-if="!authStore.loading">
            <LogoutIcon size="20" class="mr-2" />
          </template>
          <template v-slot:prepend v-else>
            <v-progress-circular indeterminate color="error" size="20" />
          </template>

          <v-list-item-title class="text-subtitle-2"> Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </div>
</template>