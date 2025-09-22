<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

import { useBranchList } from '@/composables/useBranchList';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import Blank from '@/components/shared/Blank.vue';
import type { Branch, CreateBranchPayload, UpdateBranchPayload } from '@/types/branch';
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore()
const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data?: Branch;
  is_create: boolean
  
  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void

  refresh: () => void
}>()

const emit = defineEmits(['close'])

const { load, loading: lb, create, update, remove } = useBranchList()

const payload = ref<{[K in keyof CreateBranchPayload]: CreateBranchPayload[K] | null}>({
  name: props.is_create ? null : props.data?.name ?? null,
  description: props.is_create ? null : props.data?.description ?? null,
  address: props.is_create ? null : props.data?.address ?? null,
  contact: props.is_create ? null : props.data?.contact ?? null,
  open_time: props.is_create ? null : props.data?.operational.open_time ?? null,
  close_time: props.is_create ? null : props.data?.operational.close_time ?? null,
})

const formRef = ref()
const isFormValid = ref(false)
const ot_open = ref(false)
const ct_open = ref(false)

const rules = {
  required: [(v: string) => !!v || 'Data tidak boleh kosing'],
  required_number: [(v: number) => !!v || 'Data tidak boleh kosing'],
}

const isChanged = computed(() => {
  if (props.is_create) {
    return (
      payload.value.name !== null ||
      payload.value.description !== null ||
      payload.value.address !== null ||
      payload.value.contact !== null ||
      payload.value.open_time !== null ||
      payload.value.close_time !== null
    )
  } else {
    return (
      payload.value.name !== props.data?.name ||
      payload.value.description !== props.data?.description ||
      payload.value.address !== props.data?.address ||
      payload.value.contact !== props.data?.contact ||
      payload.value.open_time !== props.data?.operational.open_time ||
      payload.value.close_time !== props.data?.operational.close_time
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
  if (!props.data) return false

  if (props.is_create) {
    payload.value = {
      name: null,
      description: null,
      address: null,
      contact: null,
      open_time: null,
      close_time: null
    }
  } else {
    payload.value = {
      name: props.data.name,
      description: props.data.description,
      address: props.data.address,
      contact: props.data.contact,
      open_time: props.data.operational.open_time,
      close_time: props.data.operational.close_time
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
      await create(payload.value as CreateBranchPayload)
      alertStore.showAlert('Berhasil menambahkan cabang baru', 'success')
    }
    else {
      const updatePayload: UpdateBranchPayload = {
        id: props.data!.id,
        ...payload.value as CreateBranchPayload
      }
      await update(updatePayload)
      alertStore.showAlert('Berhasil memperbarui cabang', 'success')
    }
    props.refresh()
    handleClose()
    load()
  } catch (error) {
    console.log(error)
    props.refresh()
    handleClose()
    load()
  }
}

async function processDelete() {
  try {
    await remove(props.data!.id)
    alertStore.showAlert('Berhasil menghapus cabang', 'success')
    props.refresh()
    handleClose()
  } catch (error) {
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
      <h4 class="text-h4 mt-1"> {{ is_create ? 'Tambah Cabang' : 'Detail Cabang' }} </h4>
    </div>
    <i class="text-subtitle-2 text-disabled">{{ is_create ? '' : props.data!.id }}</i>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid">
      <v-row class="justify-center" no-gutters>
        <v-col cols="6">
          <v-text-field
            v-model="payload.name"
            label="Nama"
            variant="underlined"
            prepend-icon="mdi-store"
            :rules="rules.required"
          />
        </v-col>  
        <v-col cols="6">
          <v-text-field
            v-model="payload.contact"
            type="number"
            label="Kontak"
            variant="underlined"
            prepend-icon="mdi-phone"
            :rules="rules.required"
            hide-spin-buttons
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="payload.description"
            label="Deskripsi"
            variant="underlined"
            prepend-icon="mdi-text"
            :rules="rules.required"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="payload.address"
            label="Alamat"
            variant="underlined"
            prepend-icon="mdi-map-marker"
            :rules="rules.required"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="payload.open_time"
            :active="ot_open"
            :focus="ot_open"
            label="Waktu Buka"
            variant="underlined"
            prepend-icon="mdi-clock-outline"
            :rules="rules.required"
            readonly
          >
            <v-dialog
              v-model="ot_open"
              activator="parent"
              width="auto"
            >
              <v-time-picker
                v-if="ot_open"
                v-model="payload.open_time"
                format="24hr"
              />
            </v-dialog>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="payload.close_time"
            :active="ct_open"
            :focus="ct_open"
            label="Waktu Tutup"
            variant="underlined"
            prepend-icon="mdi-clock-outline"
            :rules="rules.required"
            readonly
          >
            <v-dialog
              v-model="ct_open"
              activator="parent"
              width="auto"
            >
              <v-time-picker
                v-if="ct_open"
                v-model="payload.close_time"
                format="24hr"
              />
            </v-dialog>
          </v-text-field>
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
            :loading="lb"
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
              :disabled="lb"
              @click="emit('close')"
            >
              Batal
            </v-btn>
            <v-btn
              class="ms-2"
              color="primary"
              :loading="lb"
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