<script setup lang="ts">
import { useBranchList } from '@/composables/useBranchList';
import { useUserStore } from '@/stores/authUser';
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
const {data: branchData, load: loadBranch, loading: lb} = useBranchList()
const userStore = useUserStore()

onMounted(() => {
  loadBranch()
})

const props = defineProps<{
  is_create?: boolean
  confirmBeforeClose: boolean
  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
  refresh: () => void
}>()

const emit = defineEmits(['close'])

function getUserFromLocalStorage() {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : {};
  } catch {
    return {};
  }
}

const userData = getUserFromLocalStorage();

const payload = ref<{
  id: string
  branch_id: string | null
  name: string | null
  phone: string | null
}>({
  id: userData.id || '',
  branch_id: userData.branch_id || null,
  name: userData.name || null,
  phone: userData.phone || null
});

const formRef = ref()
const isFormValid = ref(false)

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi'],
}

const isChanged = computed(() => {
  if (props.is_create) {
    return (
      payload.value.branch_id !== null ||
      payload.value.name !== null ||
      payload.value.phone !== null
    )
  } else {
    return (
      payload.value.branch_id != userData.branch_id || 
      payload.value.name != userData.name || 
      payload.value.phone != userData.phone 
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
  payload.value = {
    id: '',
    branch_id: null,
    name: null,
    phone: null
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
  if (props.is_create) {
    try {
      await userStore.createMe({
        branch_id: payload.value.branch_id!,
        name: payload.value.name!,
        phone: payload.value.phone!
      })
      clearPayload()
      if (typeof props.onIsChangedUpdate === 'function') {
        props.onIsChangedUpdate(false)
      }
      props.refresh()
      emit('close')
    } catch (error) {
      console.error("Failed to create user:", error);
      clearPayload()
      if (typeof props.onIsChangedUpdate === 'function') {
        props.onIsChangedUpdate(false)
      }
      props.refresh()
      emit('close')
    }
    return;
  }

  try {
    await userStore.updateMe({
      id: payload.value.id!,
      branch_id: payload.value.branch_id!,
      name: payload.value.name!,
      phone: payload.value.phone!
    })
    clearPayload()
    if (typeof props.onIsChangedUpdate === 'function') {
      props.onIsChangedUpdate(false)
    }
    props.refresh()
    emit('close')
  } catch (error) {
    console.error("Failed to update user:", error);
    clearPayload()
    if (typeof props.onIsChangedUpdate === 'function') {
      props.onIsChangedUpdate(false)
    }
    props.refresh()
    emit('close')
  }
}
</script>

<template>
  <v-card 
    class="rounded-lg pa-0 height-screen"
    :style="mdAndUp ? 'width: clamp(0px, 90dvw, 500px)' : 'width: clamp(0px, 90dvw, 320px)'"
    style="overflow-y: auto; max-height: 90vh;"
  >
    <v-card-text>
      <v-btn
        icon
        variant="plain"
        style="position: absolute; top: 8px; right: 12px;"
        @click="emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <h4 class="text-h4 mt-1 mb-1">{{ is_create ? 'Isi' : 'Ubah' }} Data Diri</h4>

      <v-divider class="my-4"></v-divider>

      <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="payload.branch_id"
              :items="branchData"
              :disabled="lb"
              prepend-icon="mdi-home"
              item-title="name"
              item-value="id"
              label="Cabang"
              variant="underlined"
              :loading="lb"
              :rules="[...rules.required]"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="payload.name"
              label="Nama"
              variant="underlined"
              prepend-icon="mdi-account"
              :rules="[...rules.required]"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="payload.phone"
              type="number"
              label="Nomor Telepon"
              variant="underlined"
              prepend-icon="mdi-phone"
              prefix="+62 |"
              :rules="[...rules.required]"
              hide-spin-buttons
            />
          </v-col>

          <v-col cols="12" class="text-right">
            <v-btn class="mr-2" variant="plain" @click="emit('close')">
              Batal
            </v-btn>
            <v-btn
              :disabled="!isFormValid || !isChanged || lb || userStore.loading"
              :loading="userStore.loading"
              color="primary"
              type="submit"
            >
              Simpan
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>