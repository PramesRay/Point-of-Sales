<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import sidebarItems from './sidebarItem';

import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import Logo from '../logo/LogoMain.vue';

import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/authUser';

const authStore = useAuthStore();
const userStore = useUserStore();

// Pastikan data pengguna sudah tersedia (fetch data jika perlu)
if (authStore.isAuthenticated && !userStore.me) {
  userStore.fetchMe();  // Ambil data pengguna jika belum ada
}

const user = computed(() => userStore.me);

// Filter sidebar items berdasarkan role dan access pengguna
const sidebarMenu = computed(() => {
  return sidebarItems.filter(item => {
    // Periksa apakah pengguna memiliki akses yang diperlukan
    // const hasRequiredAccess = item.requiredAccess ? userStore.hasAccess(item.requiredAccess) : true;

    // Periksa apakah pengguna memiliki role yang diperlukan
    const hasRequiredRole = item.requiredRoles ? (user.value?.role ? item.requiredRoles.includes(user.value?.role) : false) : true;

    // Tampilkan item jika pengguna memiliki akses atau role yang diperlukan
    return (
      // hasRequiredAccess || 
      hasRequiredRole
    );
  });
});

const customizer = useCustomizerStore();
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="75"
    mobile-breakpoint="lg"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <!---Logo part -->

    <div class="">
      <!-- <Logo /> -->
      <v-img
        class="mx-auto"
        src="/temp_logo.png"
        max-width="100"
        max-height="100"
        cover
      />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4">
        <!---Menu Loop -->
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <!---Item Sub Header -->
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <!---Item Divider -->
          <v-divider class="my-3" v-else-if="item.divider" />
          <!---If Has Child -->
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
          <!---Single Item-->
          <NavItem :item="item" v-else class="leftPadding" />
          <!---End Single Item-->
        </template>
      </v-list>
      <div class="pa-4 text-center">
        <v-chip color="inputBorder" size="small"> v1.0.0 </v-chip>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
