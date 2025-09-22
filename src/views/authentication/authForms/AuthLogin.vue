<script setup lang="ts">
import { ref } from 'vue';
import Google from '@/assets/images/auth/social-google.svg';
import { router } from '@/router';
import { auth} from '@/plugins/firebase';

import { useAuthStore } from '@/stores/auth';
import { useAlertStore } from '@/stores/alert';
import type { LoginPayload } from '@/types/auth';

const authStore = useAuthStore();
const alert = useAlertStore();
const show1 = ref(false);
const loginForm = ref();
const isSubmitting = ref(false);
const isForgetPassword = ref(false);

const loginPayload = ref<LoginPayload>({
  email: '',
  password: ''
})

function clearPayload() {
  loginPayload.value = {
    email: '',
    password: ''
  }
}

const rules = {
  required: [(v: string) => !!v || 'Wajib diisi'],
  email: [(v: string) => /^$|^[\w\.-]+@[\w\.-]+\.[\w]{2,}$/.test(v) || 'Email tidak valid'],
  password: [(v: string) => v.length >= 6 || 'Password minimal 6 karakter', (v: string) => v.length <= 16 || 'Password maksimal 16 karakter']
}

async function handleLoginWithGoogle() {
  try {
    isSubmitting.value = true;
    await authStore.loginWithGoogle();
    router.push('/');
  } catch (err: any) {
    console.error(err);
    alert.showAlert(err.message, 'error');
  } finally {
    isSubmitting.value = false;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function handleSubmit() {
  const {valid} = await loginForm.value.validate();
  if (!valid) return;
  isSubmitting.value = true;

  try {
    if (isForgetPassword.value) {
      try {
        if (localStorage.getItem('countdown')) {
          const start = Number(localStorage.getItem('countdown')!);
          const elapsed = Math.floor((Date.now() - start) / 1000);
          if (elapsed > 60) {
            await authStore.requestResetPassword(loginPayload.value.email);
            localStorage.setItem('email', loginPayload.value.email);
          } else {
            alert.showAlert(`Proses Reset Password sedang berlangsung, tunggu hingga selesai`, 'info');
          }
          router.push('/verify-email?mode=reset');
        } else {
          await authStore.requestResetPassword(loginPayload.value.email);
          localStorage.setItem('email', loginPayload.value.email);
          router.push('/verify-email?mode=reset');
        }
      } catch (err: any) {
        throw new Error(err);
      }
    } else {
      try {
        const result = await authStore.login(loginPayload.value);
        router.push('/');
        clearPayload();
      } catch (err: any) {
        if (err.message === 'Email belum diverifikasi') {
          localStorage.setItem('email', loginPayload.value.email);
          router.push('/verify-email?mode=verify');
        } else {
          alert.showAlert(err.message || 'Login gagal', 'error');
        }
      }
    }
  } catch (err: any) {
    throw new Error(err);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <v-btn block color="primary" variant="outlined" class="text-lightText googleBtn" @click="handleLoginWithGoogle">
    <img :src="Google" alt="google" />
    <span class="ml-2">Masuk dengan Akun Google</span></v-btn
  >
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <v-btn variant="outlined" class="orbtn" rounded="md" size="small">OR</v-btn>
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">Masuk dengan Email</h5>
  <v-form @submit.prevent="handleSubmit" ref="loginForm" class="mt-4 loginForm" lazy-validation>
    <v-text-field
      v-model="loginPayload.email"
      :rules="[...rules.required, ...rules.email]"
      label="Email Address"
      class="mt-4 mb-8"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-if="!isForgetPassword"
      v-model="loginPayload.password"
      :rules="rules.password"
      label="Password"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
      class="pwdInput"
    ></v-text-field>

    <div class="d-sm-flex align-center mt-2 mb-7 mb-sm-0">
      <div class="ml-auto">
        <a @click="isForgetPassword = !isForgetPassword" class="text-primary text-decoration-none">{{ isForgetPassword ? 'Kembali' : 'Lupa Password?'}}</a>
      </div>
    </div>
    <v-btn color="secondary" :loading="isSubmitting" block class="mt-4" variant="flat" size="large" type="submit">
      {{ isForgetPassword ? 'Kirim Link Reset' : 'Masuk'}}
    </v-btn>
  </v-form>

  <div class="mt-5 text-right">
    <v-divider />
    <v-btn variant="plain" to="/register" class="mt-2 text-capitalize mr-n2">Belum punya akun?</v-btn>
  </div>
</template>

<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>
