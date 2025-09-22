<template>
  <GlobalOverlay />
  <GlobalAlert />
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import GlobalAlert from './components/shared/GlobalAlert.vue';
import GlobalOverlay from '@/components/shared/GlobalOverlay.vue';
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = import.meta.env.VITE_NODE_ENV === 'dev'
    ? 'https://app.sandbox.midtrans.com/snap/snap.js'
    : 'https://app.midtrans.com/snap/snap.js'
  script.setAttribute(
    'data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY_DEV
  )
  document.body.appendChild(script)
})
</script>
