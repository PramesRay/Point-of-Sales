<script setup lang="ts">
import { computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
const { mdAndUp } = useDisplay()

import { useOverlayManager } from '@/composables/non-services/useOverlayManager'

const {
  overlayStack,
  confirmVisible,
  confirmOptions,
  closeOverlay,
  forceCloseOverlay,
  closeConfirmDialog
} = useOverlayManager()

// watcher untuk handle exit overlay via esc atau klik di luar overlay dengan memanfaatkan visibilitas
const currentOverlay = computed(() => overlayStack.value[overlayStack.value.length - 1])

// watch(currentOverlay, (overlay) => {
//   if (overlay?.overlayVisible) {
//     window.addEventListener('keydown', (e) => {
//       if (e.key === 'Escape') {
//         closeOverlay()
//       }
//     })
//   } else {
//     window.removeEventListener('keydown', (e) => {
//       if (e.key === 'Escape') {
//         closeOverlay()
//       }
//     })
//   }
// })

function handleCloseConfirmDialog() {
  if (overlayStack.value[overlayStack.value.length - 1].props?.confirmToContinue) {
    closeConfirmDialog()
    forceCloseOverlay()
  } else {
    closeConfirmDialog()
  }
}

</script>

<template>
  <!-- Overlay utama -->
  <v-overlay
    v-for="(overlay, index) in overlayStack"
    :key="index"
    v-model="overlay.overlayVisible"
    class="align-center justify-center"
    scrim="black"
    persistent
    fullscreen
    close-on-back
    :style="{ zIndex: 2000 + overlay?.zIndex }"
  >
    <component
      :is="overlay.component"
      v-bind="overlay.props"
      @close="closeOverlay"
      @forceClose="forceCloseOverlay"
    />
    <!-- Dialog konfirmasi tutup -->
    <v-dialog
      v-model="confirmVisible"
      :persistent="confirmOptions.persistent"
      :style="{
        width: mdAndUp ? 'clamp(0px, 90dvw, 500px)' : 'clamp(0px, 90dvw, 320px)',
        zIndex: 2000 + overlay?.zIndex + 2
      }"
      class="d-flex justify-center align-center"
    >
      <v-card class="pa-3">
        <v-card-title class="text-h3">{{ confirmOptions.title }}</v-card-title>
        <v-card-text class="py-2 text-subtitle-1 text-medium-emphasis">
          {{ confirmOptions.message }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="plain" @click="handleCloseConfirmDialog">
            {{ confirmOptions.cancelText }}
          </v-btn>
          <v-btn
            :loading="currentOverlay.props.loading"
            variant="flat"
            color="error"
            @click="() => {
              confirmOptions.onConfirm?.()
              closeConfirmDialog()
            }"
          >
            {{ confirmOptions.confirmText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-overlay>

</template>