<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()

import type { Employee, UpdateEmployeePayloadByOwner } from '@/types/employee';

import { useUser } from '@/composables/useUser';
import { useBranchList } from '@/composables/useBranchList';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import Blank from '@/components/shared/Blank.vue';

const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data: Employee;

  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void

  refresh: () => void
}>()

const emit = defineEmits(['close'])

const { update, remove, loading: lu } = useUser()
const { data: branchData, load, loading: lb } = useBranchList()

onMounted(() => {
  load()
})

const payload = ref<UpdateEmployeePayloadByOwner>({
  id: props.data.id,
  role: props.data.role,
  assigned_branch_id: props.data.assigned_branch?.map(b => b.id) ?? []
})

const formRef = ref()
const isFormValid = ref(false)

const rules = {
  required: [(v: string) => !!v || 'Data tidak boleh kosing'],
  required_array: [(v: any) => v.length > 0 || 'Data tidak boleh kosing'],
}

const isChanged = computed(() => {
  return (
    payload.value.role !== props.data.role ||
    payload.value.assigned_branch_id.length != props.data.assigned_branch?.length
  )
})

watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})


function clearPayload() {
  payload.value = {
    id: props.data.id,
    role: props.data.role,
    assigned_branch_id: props.data.assigned_branch?.map(b => b.id) ?? []
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
    await update(payload.value)
    props.refresh()
    handleClose()
  } catch (error) {
    console.log(error)
    props.refresh()
    handleClose()
  }
}

async function processDelete() {
  try {
    await remove(payload.value.id)
    props.refresh()
    handleClose()
  } catch (error) {
    console.log(error)
    props.refresh()
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
      <h4 class="text-h4 mt-1"> Detail Akun </h4>
      <i class="text-subtitle-2 text-disabled"></i>
    </div>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid">
      
      <v-row class="justify-center" no-gutters>
        <v-col cols="12" class="mb-6">
          <div class="d-flex align-center text-subtitle-2 font-weigth-bold text-medium-emphasis pt-2">
            <v-icon class="mr-2" size="30">mdi-account-circle</v-icon>
            <div class="align-center">
              <h4 class="text-h4 font-weight-bold">{{ props.data.name }}</h4>
              <span class="text-subtitle-2 text-medium-emphasis">{{ props.data.email }}</span>
            </div>
          </div>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="payload.role"
            variant="underlined"
            label="Peran"
            :items="['Admin', 'Pemilik', 'Bendahara', 'Gudang', 'Dapur', 'Kasir']"
            :rules="rules.required"
            prepend-icon="mdi-account-cog"
          />
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            v-model="payload.assigned_branch_id"
            label="Cabang"
            variant="underlined"
            prepend-icon="mdi-home"
            :items="branchData"
            item-title="name"
            item-value="id"
            multiple
            :rules="rules.required_array"
            :loading="lb"
            :return-object="false"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2" :text="item.title"></v-chip>

              <span
                v-if="index === 2"
                class="text-grey text-caption align-self-center"
              >
                (+{{ payload.assigned_branch_id.length - 2 }} lainnya)
              </span>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>

      <v-divider class="my-3" />
      
      <div>
        <div class="d-flex align-center justify-space-between justify-end mt-1">
          <!-- delete button -->
          <v-btn
            icon
            variant="text"
            class="mr-1 text-error"
            density="compact"
            :loading="lu"
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
              :disabled="lu"
              @click="emit('close')"
            >
              Batal
            </v-btn>
            <v-btn
              class="ms-2"
              color="primary"
              :loading="lu"
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