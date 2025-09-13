<!--
<template>
  <div v-if="isLoading" class="fill-height">
    Loader in center page
    <v-progress-circular size="64" indeterminate color="primary" class="mx-auto my-auto"/>
  </div>

  <div v-else>
    The rest of your application content goes here
    <GlobalOverlay />
    <GlobalAlert />
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/authUser'; 
import { RouterView } from 'vue-router';
import GlobalAlert from '@/components/shared/GlobalAlert.vue';
import GlobalOverlay from '@/components/shared/GlobalOverlay.vue';

const authStore = useAuthStore();
const userStore = useUserStore();
const isLoading = ref(true);

onMounted(async () => {
  authStore.checkAuthentication();

  if (authStore.isAuthenticated) {
    userStore.fetchMe().then(() => {
      isLoading.value = false; // Set loading to false after fetching is complete
    }).catch(() => {
      isLoading.value = false; // Also stop loading in case of an error
    });

    userStore.fetchShift();
  } else {
    isLoading.value = false; // If user data is already available, stop loading
  }
});
</script> 
-->

<template>
  <GlobalOverlay />
  <GlobalAlert />
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import GlobalAlert from './components/shared/GlobalAlert.vue';
import GlobalOverlay from '@/components/shared/GlobalOverlay.vue';
</script>
