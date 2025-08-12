import { ref, watch } from 'vue'
import type { Component } from 'vue'

interface ConfirmOptions {
  title: string
  message: string
  color?: string
  image?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  persistent?: boolean
  maxWidth?: string | number
}

// Menyimpan semua overlay dalam stack
interface OverlayItem {
  component: Component
  props: Record<string, any>
  isChanged: boolean
  overlayVisible: boolean
  zIndex: number
}

let overlayManagerSingleton: ReturnType<typeof createOverlayManager> | null = null

function createOverlayManager() {
  const overlayStack = ref<OverlayItem[]>([]) // Stack untuk menyimpan overlay yang aktif

  const confirmVisible = ref(false)
  const confirmOptions = ref<ConfirmOptions>({
    title: '',
    message: '',
    confirmText: 'Ya',
    cancelText: 'Tidak',
    color: 'error',
    onConfirm: undefined,
    persistent: true,
    maxWidth: 320
  })

  function openOverlay({
    component,
    props = {}
  }: {
    component: Component
    props?: Record<string, any>
  }) {
    const overlayItem: OverlayItem = {
      component,
      props,
      isChanged: props.isChanged || false,  // Initial state of each overlay
      overlayVisible: true,
      zIndex: overlayStack.value.length + 1
    }

    if (props.confirmToContinue) {
      confirmOptions.value = {
        title: props.confirmTitle || 'Konfirmasi Aksi',
        message: props.confirmMessage || 'Apakah Anda yakin ingin melanjutkan aksi ini?',
        confirmText: 'Ya',
        cancelText: 'Batal',
        color: props.confirmColor || 'error',
        image: props.confirmImage || null,
        onConfirm: () => {
          props.onConfirm?.(); 
          forceCloseOverlay();
        },
        persistent: true,
        maxWidth: 400
      };
      confirmVisible.value = true; // Menampilkan dialog konfirmasi
    }

    // Inject handler ke props, biar bisa dipanggil dari komponen
    overlayItem.props.onIsChangedUpdate = (val: boolean) => {
      overlayItem.isChanged = val
    }

    overlayStack.value.push(overlayItem)
  }

  function closeOverlay() {
    const current = overlayStack.value[overlayStack.value.length - 1]

    if (current?.props?.confirmBeforeClose && current?.isChanged) {
      confirmOptions.value = {
        title: 'Batalkan Perubahan?',
        message: 'Perubahan belum disimpan. Yakin ingin menutup?',
        confirmText: 'Ya, Tutup',
        cancelText: 'Kembali',
        color: 'error',
        onConfirm: () => {
          forceCloseOverlay()
        },
        persistent: true,
        maxWidth: 400
      }

      confirmVisible.value = true
      return
    }
    current.overlayVisible = false
    forceCloseOverlay()
  }

  function forceCloseOverlay() {
    overlayStack.value.pop()
  }

  function closeConfirmDialog() {
    confirmVisible.value = false
  }

  return {
    overlayStack,
    confirmVisible,
    confirmOptions,
    openOverlay,
    closeOverlay,
    forceCloseOverlay,
    closeConfirmDialog
  }
}

export function useOverlayManager() {
  if (!overlayManagerSingleton) {
    overlayManagerSingleton = createOverlayManager()
  }
  return overlayManagerSingleton
}