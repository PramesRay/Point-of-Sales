<script setup lang="ts">
import { ref } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
// Icon Imports
import { BellIcon, SettingsIcon, Menu2Icon } from 'vue-tabler-icons';

import ProfileDD from './ProfileDD.vue';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import { useUserStore } from '@/stores/authUser';

const { openOverlay } = useOverlayManager()
const userStore = useUserStore();
const isChanged = ref(false);

const customizer = useCustomizerStore();

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
function getUserFromLocalStorage() {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : {};
  } catch {
    return {};
  }
}

const user = getUserFromLocalStorage();
</script>

<template>
  <v-app-bar elevation="0" height="80">
    <v-btn
      class="hidden-md-and-down text-secondary"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
      size="small"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>
    <v-btn
      class="hidden-lg-and-up text-secondary ms-3"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
      size="small"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>
    
    <v-toolbar-title class="text-h3 text-medium-emphasis">
      Hai, {{ userStore.me?.name.split(' ')[0] || 'Sobat' }}
    </v-toolbar-title>

    <!-- ---------------------------------------------- -->
    <!-- User Profile -->
    <!-- ---------------------------------------------- -->
      
    <v-btn
      class="profileBtn text-primary"
      color="lightprimary"
      variant="flat"
      rounded="pill"
      @click="
      openOverlay({
        component: ProfileDD,
        props: {
          confirmBeforeClose: true,
          isChanged
        }
      })"
    >
      <v-icon
        size="30"
        class="mr-2 py-2"
      >mdi-account-circle</v-icon>
      <!-- <v-avatar size="30" class="mr-2 py-2">
      </v-avatar> -->
      <SettingsIcon stroke-width="1.5" />
    </v-btn>
  </v-app-bar>
</template>
