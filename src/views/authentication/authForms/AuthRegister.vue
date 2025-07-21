<script setup lang="ts">
import { ref } from 'vue';
import Google from '@/assets/images/auth/social-google.svg';
import { router } from '@/router';

import type { RegisterPayload } from '@/types/auth';
import { useAuthStore } from '@/stores/auth';
import { useAlertStore } from '@/stores/alert';

const authStore = useAuthStore();
const alert = useAlertStore();

const show1 = ref(false);
const confrim_password = ref('');
const Regform = ref(); // <- ini wajib sekarang
const isSubmitting = ref(false);

const registerPayload = ref<RegisterPayload>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: ''
});

const rules = {
  required: [(v: string) => !!v || 'Wajib diisi'],
  min: [(v: string) => v.length >= 8 || 'Minimal 8 karakter'],
  max: [(v: string) => v.length <= 16 || 'Maksimal 16 karakter'],
  include_number: [(v: string) => /\d/.test(v) || 'Harus mengandung angka'],
  include_caps: [(v: string) => /[A-Z]/.test(v) || 'Harus mengandung huruf besar'],
  phone: [(v: string) => v.length <= 13 || 'Nomor maksimal 13 digit'],
  email: [(v: string) => /^$|^[\w\.-]+@[\w\.-]+\.[\w]{2,}$/.test(v) || 'Email tidak valid'],
  confrim_password: [(v: string) => v === registerPayload.value.password || 'Password tidak sama']
};

async function handleSubmit() {
  const { valid } = await Regform.value.validate();
  if (!valid) return;
  
  isSubmitting.value = true;

  try {
    if (localStorage.getItem('countdown')) {
      const start = Number(localStorage.getItem('countdown')!);
      const elapsed = Math.floor((Date.now() - start) / 1000);
      if (elapsed > 60) {
        const result = await authStore.register(registerPayload.value);
        if (result.user.emailVerified){
          router.push('/')
        }
        localStorage.setItem('email', registerPayload.value.email);
      } else {
        alert.showAlert(`Proses Reset Password sedang berlangsung, tunggu hingga selesai`, 'info');
      }
      router.push('/verify-email?mode=verify');
    } else {
      const result = await authStore.register(registerPayload.value);
      if (result.user.emailVerified){
        router.push('/')
      }
      localStorage.setItem('email', registerPayload.value.email);
      router.push('/verify-email?mode=verify');
    }
  } catch (err: any) {
    throw new Error(err);
  } finally {
    isSubmitting.value = false;
  }
}
</script>


<template>
  <v-btn block color="primary" variant="outlined" class="text-lightText googleBtn">
    <img :src="Google" alt="google" />
    <span class="ml-2">Daftar dengan Akun Google</span></v-btn
  >
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <v-btn variant="outlined" class="orbtn" rounded="md" size="small">OR</v-btn>
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">Daftar dengan Email</h5>
  <v-form @submit.prevent="handleSubmit" ref="Regform" lazy-validation class="mt-4 loginForm">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="registerPayload.first_name"
          :rules="rules.required"
          label="Nama Awal"
          variant="outlined"
          color="primary"
          density="comfortable"
          hide-details="auto"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="registerPayload.last_name"
          label="Nama Akhir"
          variant="outlined"
          color="primary"
          density="comfortable"
          hide-details="auto"
        />
      </v-col>
    </v-row>

    <v-text-field
      v-model="registerPayload.email"
      :rules="[...rules.required, ...rules.email]"
      label="Email"
      class="mt-4 mb-4"
      variant="outlined"
      color="primary"
      density="comfortable"
      hide-details="auto"
    />

    <v-text-field
      type="number"
      hide-spin-buttons
      v-model="registerPayload.phone"
      :rules="[...rules.required, ...rules.phone]"
      label="Nomor Telepon"
      prefix="+62 |"
      class="mt-4 mb-4"
      variant="outlined"
      color="primary"
      density="comfortable"
      hide-details="auto"
    />

    <v-text-field
      v-model="registerPayload.password"
      :rules="[...rules.required, ...rules.min, ...rules.max, ...rules.include_number, ...rules.include_caps]"
      label="Kata Sandi"
      :type="show1 ? 'text' : 'password'"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="show1 = !show1"
      variant="outlined"
      color="primary"
      density="comfortable"
      class="pwdInput"
      hide-details
    />

    <!-- Password Guide -->
    <v-fade-transition>
      <div v-show="registerPayload.password.length > 0" class="ms-3">
        <p class="text-disabled text-subtitle-2 mt-1">Password harus terdiri dari:</p>
        <ul class="text-disabled text-subtitle-2 ms-4">
          <li :class="{ 'text-error': registerPayload.password.length < 6 || registerPayload.password.length > 16, 'text-success': registerPayload.password.length >= 6 && registerPayload.password.length <= 16 }">
            6-16 karakter
            <v-icon v-if="registerPayload.password.length >= 8 && registerPayload.password.length <= 16" class="text-success" size="x-small">mdi-check</v-icon>
          </li>
          <li :class="{ 'text-error': !/[A-Z]/.test(registerPayload.password), 'text-success': /[A-Z]/.test(registerPayload.password) }">
            1 huruf besar
            <v-icon v-if="/[A-Z]/.test(registerPayload.password)" class="text-success" size="x-small">mdi-check</v-icon>
          </li>
          <li :class="{ 'text-error': !/\d/.test(registerPayload.password), 'text-success': /\d/.test(registerPayload.password) }">
            1 angka
            <v-icon v-if="/\d/.test(registerPayload.password)" class="text-success" size="x-small">mdi-check</v-icon>
          </li>
        </ul>
      </div>
    </v-fade-transition>

    <v-text-field
      v-model="confrim_password"
      :rules="rules.confrim_password"
      label="Konfirmasi Kata Sandi"
      :type="show1 ? 'text' : 'password'"
      variant="outlined"
      color="primary"
      density="comfortable"
      hide-details="auto"
      class="pwdInput mt-4"
    />

    <v-btn
      :loading="isSubmitting"
      :disabled="isSubmitting"
      block
      color="secondary"
      class="mt-4"
      variant="flat"
      size="large"
      type="submit"
    >
      Daftar
    </v-btn>
  </v-form>
  <div class="mt-5 text-right">
    <v-divider />
    <v-btn variant="plain" to="/login" class="mt-2 text-capitalize mr-n2">Sudah punya akun?</v-btn>
  </div>

  <div id="recaptcha-container"></div>
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
</style>
