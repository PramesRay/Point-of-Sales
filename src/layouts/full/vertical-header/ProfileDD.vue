<script setup lang="ts">
import Blank from '@/components/shared/Blank.vue';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import { useBranchList } from '@/composables/useBranchList';
import { useUserStore } from '@/stores/authUser';
import type { User } from '@/types/user';
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
const { openOverlay } = useOverlayManager()

const {data: branchData, load: loadBranch, loading: lb} = useBranchList()
const userStore = useUserStore()
const route = useRoute()

onMounted(() => {
  loadBranch()
})


const props = defineProps<{
  user?: User
  confirmBeforeClose: boolean
  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
  refresh: () => void
}>()

const emit = defineEmits(['close'])

const payload = ref<{
  id: string
  branch_id: string | null
  table: string | null
  name: string | null
  phone: string | null
}>({
  id: props.user?.id || '',
  branch_id: props.user?.branch?.id || null,
  table: props.user?.table || null,
  name: props.user?.name || null,
  phone: props.user?.phone || null
});

const formRef = ref()
const isFormValid = ref(false)

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi'],
}

const isChanged = computed(() => {
  if (!props.user) {
    return (
      payload.value.branch_id !== null ||
      payload.value.table !== null ||
      payload.value.name !== null ||
      payload.value.phone !== null
    )
  }
  return (
    payload.value.branch_id !== props.user.branch?.id ||
    payload.value.table !== props.user.table ||
    payload.value.name !== props.user.name ||
    payload.value.phone !== props.user.phone
  );
})


watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})

function clearPayload() {
  payload.value = {
    id: props.user?.id || '',
    branch_id: props.user?.branch.id || null,
    table: props.user?.table || null,
    name: props.user?.name || null,
    phone: props.user?.phone || null
  }
  formRef.value?.resetValidation()
}

watch(() => payload.value.phone, (val) => {
  if (val === null) return;
  // Remove non-digit characters
  let digits = String(val).replace(/\D/g, '');
  // Remove leading zeros
  digits = digits.replace(/^0+/, '');
  // Limit to 13 digits
  if (digits.length > 13) digits = digits.slice(0, 13);
  payload.value.phone = digits;
});

// Update processSubmit to use formatPhoneForBackend
async function processSubmit() {
  if (!props.user || props.user === null) {
    try {
      const response = await userStore.createMe({
        name: payload.value.name!,
        phone: payload.value.phone!
      });
      const branch = branchData.value.find((branch: any) => branch.id === payload.value.branch_id)
      const user: User = {
        id: response.data.id,
        fk_user_id: response.data.fk_user_id,
        name: payload.value.name!,
        phone: payload.value.phone!,
        branch: {
          id: branch?.id!,
          name: branch?.name!
        },
        table: payload.value.table!
      }
      userStore.setMe(user);
      if (typeof props.onIsChangedUpdate === 'function') {
        props.onIsChangedUpdate(false);
      }
      props.refresh();
      emit('close');
    } catch (error) {
      console.error("Failed to create user:", error);
    }
    return;
  }

  try {
    const response = await userStore.updateMe({
      id: payload.value.id!,
      name: payload.value.name!,
      phone: payload.value.phone!
    });
    const branch = branchData.value.find((branch: any) => branch.id === payload.value.branch_id)
    const user: User = {
      id: response.data.id,
      fk_user_id: response.data.fk_user_id,
      name: payload.value.name!,
      phone: payload.value.phone!,
      branch: {
        id: branch?.id!,
        name: branch?.name!
      },
      table: payload.value.table!
    }
    userStore.setMe(user);
    clearPayload();
    if (typeof props.onIsChangedUpdate === 'function') {
      props.onIsChangedUpdate(false);
    }
    props.refresh();
    emit('close');
  } catch (error) {
    console.error("Failed to update user:", error);
  }
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    openOverlay({
      component: Blank,
      props: {
        confirmTitle: 'Tunggu Dulu!',
        confirmMessage: 'Apakah kamu yakin data yang dimasukkan sudah benar?',
        confirmToContinue: true,
        confirmImage: 'reminder_loc.png',
        onConfirm: async () => {
          processSubmit()
        },
      }
    });
  })
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

      <h4 class="text-h4 mt-1 mb-1">{{ (!props.user || props.user === null) ? 'Isi' : 'Ubah' }} Data Diri</h4>
      <i v-if="props.user || props.user != null" class="text-subtitle-2 text-disabled">Id: {{ props.user?.id }}</i>

      <v-divider class="my-4"></v-divider>

      <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="7">
            <v-select
              v-model="payload.branch_id"
              :items="branchData"
              :disabled="lb || (!!route.query.branch_id && route.query.branch_id !== '') || (!!route.query.table && route.query.table !== '')"
              prepend-icon="mdi-home"
              item-title="name"
              item-value="id"
              label="Cabang"
              variant="underlined"
              :loading="lb"
              :rules="[...rules.required]"
            />
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field
              v-model="payload.table"
              label="Meja"
              variant="underlined"
              prepend-icon="mdi-select-place"
              :disabled="lb || (!!route.query.branch_id && route.query.branch_id !== '') || (!!route.query.table && route.query.table !== '')"
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