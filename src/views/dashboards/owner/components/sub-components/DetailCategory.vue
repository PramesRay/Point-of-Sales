<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import Blank from '@/components/shared/Blank.vue';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '@/types/inventory';
import { useMenu } from '@/composables/useMenuItems';
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore()

const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data?: Category;
  is_create: boolean

  refresh: () => void

  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
}>()

const emit = defineEmits(['close'])

const { createCategory, updateCategory, removeCategory, loading: lm } = useMenu()

const payload = ref<{[K in keyof CreateCategoryPayload]: CreateCategoryPayload[K] | null}>({
  name: props.is_create ? null : props.data?.name ?? null,
  description: props.is_create ? null : props.data?.description ?? null
})

const formRef = ref()
const isFormValid = ref(false)

const rules = {
  required: [(v: string) => !!v || 'Data tidak boleh kosing']
}

const isChanged = computed(() => {
  if (props.is_create) {
    return (
      payload.value.name !== null ||
      payload.value.description !== null
    )
  } else {
    return (
      payload.value.name !== props.data?.name ||
      payload.value.description !== props.data?.description
    )
  }
})

watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})

function clearPayload() {
  if (props.is_create) {
    payload.value = {
      name: null,
      description: null
    }
  } else {
    payload.value = {
      name: props.data?.name ?? null,
      description: props.data?.description ?? null
    }
  }

  formRef.value?.resetValidation()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processSubmit()
  })
}

async function processSubmit() {
  try {
    if (props.is_create) {
      await createCategory(payload.value as CreateCategoryPayload)
      alertStore.showAlert('Berhasil menambahkan kategori', 'success')
      props.refresh()
    }
    else {
      const updatePayload: UpdateCategoryPayload = {
        id: props.data!.id,
        ...payload.value as CreateCategoryPayload
      }
      await updateCategory(updatePayload)
      alertStore.showAlert('Berhasil memperbarui kategori', 'success')
      props.refresh()
    }
    handleClose()
  } catch (error) {
    props.refresh()
    console.log(error)
    handleClose()
  }
}

async function processDelete() {
  try {
    await removeCategory(props.data!.id)
    props.refresh()
    handleClose()
  } catch (error) {
    props.refresh()
    console.log(error)
    handleClose()
  }
}

function handleClose() {
  clearPayload()
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(false)
  }
  emit('close')
}

</script>

<template>
  <v-card 
    class="rounded-lg pa-6 mt-8 bg-white" 
    style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;"
  >
    <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="handleClose()">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div class="d-flex align-center">
      <h4 class="text-h4 mt-1"> {{ is_create ? 'Tambah Kategori' : 'Detail Kategori' }} </h4>
    </div>
    <i class="text-subtitle-2 text-disabled"> {{ is_create ? '' : props.data?.id }} </i>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid">
      <v-row class="justify-center" no-gutters>
        <v-col cols="12">
          <v-text-field
            v-model="payload.name"
            label="Nama"
            variant="underlined"
            prepend-icon="mdi-food"
            :rules="rules.required"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="payload.description"
            label="Deskripsi"
            variant="underlined"
            prepend-icon="mdi-text"
          />
        </v-col>
      </v-row>

      <v-divider class="my-3" />
      
      <div>
        <div 
          class="d-flex align-center justify-end mt-1"
          :class="is_create ? 'justify-end' : 'justify-space-between'"
        >
          <!-- delete button -->
          <v-btn
            v-if="!is_create"
            icon
            variant="text"
            class="mr-1 text-error"
            density="compact"
            :loading="lm"
            @click="
              openOverlay({
                component: Blank,
                props: {
                  confirmToContinue: true,
                  confirmMessage: 'Apakah anda yakin ingin menghapus akun ini?',
                  onConfirm: () => {
                    processDelete()
                  }
                }
              })
            "
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>

          <span>
            <v-btn
              variant="plain"
              :disabled="lm"
              @click="emit('close')"
            >
              Batal
            </v-btn>
            <v-btn
              class="ms-2"
              color="primary"
              :loading="lm"
              :disabled="!isFormValid || !isChanged"
              @click="submitForm"
            >
              Simpan
            </v-btn>
          </span>
        </div>
      </div>
    </v-form>
  </v-card>
</template>