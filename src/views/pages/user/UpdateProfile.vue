<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useDisplay } from 'vuetify';
const { mdAndUp } = useDisplay()
import { getAuth } from 'firebase/auth';

import type { Employee, UpdateEmployeeByEmployee } from '@/types/employee';

import { useUser } from '@/composables/useUser';
import { useBranchList } from '@/composables/useBranchList';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import Blank from '@/components/shared/Blank.vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { useAlertStore } from '@/stores/alert';

const { openOverlay } = useOverlayManager()
const alertStore = useAlertStore()
const authStore = useAuthStore()

// async function handleEmailActionFromQuery() {

//   const mode = route.query.mode as string | undefined;       // 'verifyAndChangeEmail' atau 'verifyEmail'
//   const oobCode = route.query.oobCode as string | undefined;

//   if (!oobCode) return;

//   const isEmailChange = mode === 'verifyAndChangeEmail' || mode === 'verifyEmail';
//   if (!isEmailChange) return;

//   // Terapkan aksi dari link
//   await applyActionCode(auth, oobCode);

//   // Freshen token SEKALI di SINI (bukan di onIdTokenChanged)
//   await auth.currentUser?.reload(); 
//   await auth.currentUser?.getIdToken(true);

//   // Bersihkan query supaya tidak re-run
//   router.replace({ query: { ...route.query, mode: undefined, oobCode: undefined } });

//   // optional: notifikasi sukses
//   alertStore.showAlert('Email kamu berhasil diverifikasi.', 'success');
// }

// watch(() => route.query, handleEmailActionFromQuery)


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

const payload = ref<UpdateEmployeeByEmployee>({
  uid: authStore.user?.uid!,
  name: authStore.user?.displayName!,
  email: authStore.user?.email!
})

const formRef = ref()
const isFormValid = ref(false)
const snackbar = ref(false);
const isProcessing = ref(false);
const countdown = ref(0);
let countdownInterval: number | null = null;

const isChangeName = ref<boolean>(false)
const isChangeEmail = ref<boolean>(false)
const isChangePassword = ref<boolean>(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPass = ref(false)

const rules = {
  required: [(v: string) => !!v || 'Wajib diisi'],
  min: [(v: string) => v.length >= 8 || 'Minimal 8 karakter'],
  max: [(v: string) => v.length <= 16 || 'Maksimal 16 karakter'],
  include_number: [(v: string) => /\d/.test(v) || 'Harus mengandung angka'],
  include_caps: [(v: string) => /[A-Z]/.test(v) || 'Harus mengandung huruf besar'],
  phone: [(v: string) => v.length <= 13 || 'Nomor maksimal 13 digit'],
  email: [(v: string) => /^$|^[\w\.-]+@[\w\.-]+\.[\w]{2,}$/.test(v) || 'Email tidak valid'],
  confrim_password: [(v: string) => v === newPassword.value || 'Password tidak sama']
};

const isChanged = computed(() => {
  if (isChangeName.value) {
    return payload.value.name.trim() !== authStore.user?.displayName!.trim();
  }
  
  if (isChangePassword.value) {
    return newPassword.value.trim() !== ''
  }
  return isChangeEmail.value && payload.value.email.trim() !== authStore.user?.email!.trim();
})

watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})


function clearPayload() {
  payload.value = {
    uid: authStore.user?.uid!,
    name: authStore.user?.displayName!,
    email: authStore.user?.email!
  }

  formRef.value?.resetValidation()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    openOverlay({
      component: Blank,
      props: {
        confirmToContinue: true,
        confirmMessage: `Apakah anda yakin ingin mengubah ${isChangeName.value ? 'nama' : ''} ${isChangeEmail.value ? 'email' : ''} ${isChangePassword.value ? 'password' : ''} anda?`,
        loading: isProcessing.value,
        onConfirm: () => {
          processSubmit()
        }
      }
    })
  })
}

async function processSubmit() {
  isProcessing.value = true
  try {
    if (isChangeName.value) {
      await authStore.updateUserProfile(payload.value.name)
    }

    if (isChangeEmail.value) {
      await handleVerification()
    }

    if (isChangePassword.value) {
      await authStore.changePassword(oldPassword.value, newPassword.value)
    }
    props.refresh()
    handleClose()
  } catch (error: any) {
    console.log(error)
    // props.refresh()
    // handleClose()
    alertStore.showAlert(error, 'error');
  } finally {
    isProcessing.value = false
  }
}

function handleClose() {
  clearPayload()
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(false)
  }
  emit('close')
}

// onMounted(() => {
//   if (localStorage.getItem('countdown')) {
//     const start = Number(localStorage.getItem('countdown')!);
//     const elapsed = Math.floor((Date.now() - start) / 1000);
//     countdown.value = Math.max(0, 60 - elapsed);
//   } else {
//     countdown.value = 60;
//   }
//   startCountdown(countdown.value);
// });

// onUnmounted(() => {
//   if (localStorage.getItem('countdown')) {
//     const start = Number(localStorage.getItem('countdown')!);
//     const elapsed = Math.floor((Date.now() - start) / 1000);
//     if (elapsed > 60) {
//       localStorage.removeItem('countdown');
//     }
//   }
// })

// function startCountdown(seconds: number) {
//   countdown.value = seconds;
//   if (!localStorage.getItem('countdown')) {
//     localStorage.setItem('countdown', String(Date.now()));
//   } else {
//     const start = Number(localStorage.getItem('countdown')!);
//     const elapsed = Math.floor((Date.now() - start) / 1000);
//     if (elapsed > 60) {
//       localStorage.setItem('countdown', String(Date.now()));
//     }
//   }
//   countdownInterval = window.setInterval(() => {
//     if (countdown.value > 0) {
//       countdown.value--;
//     } else {
//       clearInterval(countdownInterval!);
//     }
//   }, 1000);
// }

async function handleVerification() {
  await authStore.changeEmail(payload.value.email, oldPassword.value).then(() => {
    alertStore.showAlert('Login ulang setelah klik link verifikasi', 'info');
    snackbar.value = true;
    // startCountdown(60);
    isChangeEmail.value = false
  })
}

</script>

<template>
  <v-snackbar v-model="snackbar" color="success" :timeout="3000" top>
    Email verifikasi telah dikirim!
  </v-snackbar>
  <v-card 
    class="rounded-lg pa-6 mt-8 bg-white" 
    style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;"
  >
    <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="handleClose()">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div>
      <h4 class="text-h4 mt-1"> Detail Akun </h4>
      <i class="text-subtitle-2 text-disabled">ID: {{ payload.uid }}</i>
    </div>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
      
      <v-row class="justify-center" no-gutters>
        <v-col cols="6">
          <div class="d-flex align-start mb-4">
            <v-icon class="text-disabled me-2">mdi-account-cog</v-icon>
            <div>
              <div class="text-h6 text-disabled">Peran:</div>
              <div class="text-h4 text-disabled mt-1">{{ props.data.role }}</div>
            </div>
          </div>
        </v-col>

        <v-col cols="6">
          <div class="d-flex align-start mb-2">
            <v-icon class="text-disabled me-1">mdi-home</v-icon>
            <div>
              <div class="text-h6 text-disabled">Cabang:</div>
              <div class="ms-4 mt-2">
                <v-progress-circular
                  v-if="lb"
                  indeterminate
                  color="primary"
                  class="mb-2"
                ></v-progress-circular>
                <ol v-else class="text-subtitle-1 text-disabled">
                  <li v-for="id in props.data.assigned_branch" class="mb-1">
                    {{ branchData.find(b => b.id === id)?.name }}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" class="mb-4">
          <v-text-field
            v-model="payload.name"
            label="Nama"
            :readonly="!isChangeName"
            :variant="isChangeName ? 'underlined' : 'plain'"
            prepend-icon="mdi-account"
            :rules="rules.required"
            class="mt-2"
            hide-details
          >
            <template #append-inner>
              <v-btn
                icon
                class="text-disabled"
                :class="{ 'text-error': isChangeName }"
                variant="text"
                size="small"
                @click="
                  if (isChangeName) {
                    isChangeName = false;
                    payload.name = authStore.user?.displayName!;
                  } else {
                    isChangeName = true;
                  }
                "
              >
                <v-icon>{{ isChangeName ? 'mdi-close' : 'mdi-pencil' }}</v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <v-text-field
            v-model="payload.email"
            :readonly="!isChangeEmail"
            :variant="isChangeEmail ? 'underlined' : 'plain'"
            prepend-icon="mdi-email"
            :rules="rules.email"
            class="mt-2"
            hide-details
          >
            <template #label>
              <span class="text-disabled">Email</span>
              <span v-if="isChangeEmail" class="text-disabled"> Baru</span>
              <span v-if="authStore.user?.emailVerified && !isChangeEmail" class="text-primary ms-1">
                <v-icon size="small">mdi-check-decagram</v-icon>
              </span>
            </template>
            <template #append-inner>
              <v-btn
                icon
                class="text-disabled"
                :class="{ 'text-error': isChangeEmail }"
                variant="text"
                size="small"
                @click="
                  if (isChangeEmail) {
                    isChangeEmail = false;
                    payload.email = authStore.user?.email!;
                  } else {
                    isChangeEmail = true;
                  }
                "
              >
                <v-icon>{{ isChangeEmail ? 'mdi-close' : 'mdi-pencil' }}</v-icon>
              </v-btn>
              <!-- <v-btn
                v-if="!authStore.user?.emailVerified || isChangeEmail"
                icon
                class="text-disabled text-primary"
                variant="text"
                size="small"
                @click="handleVerification()"
              >
                <v-icon>mdi-send</v-icon>
              </v-btn> -->
            </template>
          </v-text-field>
          <v-text-field
            v-if="isChangePassword || isChangeEmail"
            v-model="oldPassword"
            label="Kata Sandi Lama"
            :readonly="!(isChangePassword || isChangeEmail)"
            :variant="isChangePassword ? 'underlined' : 'plain'"
            prepend-icon="mdi-lock"
            :rules="[...rules.required]"
            :type="showPass ? 'text' : 'password'"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPass = !showPass"
            hide-details
            class="mt-2"
          />

          <div v-if="isChangePassword">
            <v-text-field
              v-model="newPassword"
              label="Kata Sandi"
              :readonly="!isChangePassword"
              :variant="isChangePassword ? 'underlined' : 'plain'"
              prepend-icon="mdi-lock"
              :rules="[...rules.required, ...rules.min, ...rules.max, ...rules.include_number, ...rules.include_caps]"
              :type="showPass ? 'text' : 'password'"
              @click:append="showPass = !showPass"
              hide-details
              class="mt-2"
            />
  
            <!-- Password Guide -->
            <v-fade-transition>
              <div v-show="newPassword.length > 0" class="ms-3">
                <p class="text-disabled text-subtitle-2 mt-1">Password harus terdiri dari:</p>
                <ul class="text-disabled text-subtitle-2 ms-4">
                  <li :class="{ 'text-error': newPassword.length < 6 || newPassword.length > 16, 'text-success': newPassword.length >= 6 && newPassword.length <= 16 }">
                    6-16 karakter
                    <v-icon v-if="newPassword.length >= 8 && newPassword.length <= 16" class="text-success" size="x-small">mdi-check</v-icon>
                  </li>
                  <li :class="{ 'text-error': !/[A-Z]/.test(newPassword), 'text-success': /[A-Z]/.test(newPassword) }">
                    1 huruf besar
                    <v-icon v-if="/[A-Z]/.test(newPassword)" class="text-success" size="x-small">mdi-check</v-icon>
                  </li>
                  <li :class="{ 'text-error': !/\d/.test(newPassword), 'text-success': /\d/.test(newPassword) }">
                    1 angka
                    <v-icon v-if="/\d/.test(newPassword)" class="text-success" size="x-small">mdi-check</v-icon>
                  </li>
                </ul>
              </div>
            </v-fade-transition>
  
            <v-text-field
              v-model="confirmPassword"
              :rules="rules.confrim_password"
              variant="underlined"
              prepend-icon="mdi-lock"
              label="Konfirmasi Kata Sandi"
              :type="showPass ? 'text' : 'password'"
              hide-details="auto"
              class="pwdInput mt-4"
            />
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-3" />
      
      <div class="d-flex align-center justify-space-between mt-1">
        <span>
          <v-btn
            :variant="isChangePassword ? 'tonal' : 'plain'"
            color="error"
            size="small"
            :loading="lu"
            @click="isChangePassword = !isChangePassword"
          >
            Ubah Password
          </v-btn>
        </span>
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
            :loading="isProcessing"
            :disabled="isProcessing || !(isFormValid && isChanged)"
            type="submit"
          >
            Simpan
          </v-btn>
        </span>
      </div>
    </v-form>
  </v-card>
</template>