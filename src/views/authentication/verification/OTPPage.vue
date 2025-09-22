<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const otp = ref('');
const countdown = ref(60);
const canResend = ref(false);
const isVerifying = ref(false);

function startCountdown() {
  countdown.value = 60;
  canResend.value = false;
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(interval);
      canResend.value = true;
    }
  }, 1000);
}

async function resendOTP() {
  try {
    await authStore.resendOTP();
    startCountdown();
  } catch (error) {
    console.error('Resend OTP error:', error);
  }
}

async function verifyOTP() {
  if (!otp.value) return;
  isVerifying.value = true;
  try {
    await authStore.verifyOTP(otp.value);
    router.push('/dashboard');
  } catch (err) {
    console.error('OTP verification failed:', err);
  } finally {
    isVerifying.value = false;
  }
}

onMounted(() => {
  const phone = authStore.tempUser.phone;
  if (!phone) {
    router.replace('/register');
    return;
  }
  resendOTP();
});
</script>

<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" max-width="400" elevation="0">
      <v-card-title class="text-h3 text-center">Verifikasi Kode OTP</v-card-title>
      
      <div class="text-center text-subtitle-1 text-medium-emphasis mt-2">
        <div>Kode telah dikirim ke nomor: <strong>{{ authStore.tempUser.phone }}</strong></div>
        <div class="text-subtitle-2 mt-1">Silahkan cek SMS Anda untuk mendapatkan kode OTP!</div>
      </div>

      <v-card-text class="py-0">
        <v-otp-input
          v-model="otp"
          length="6"
          type="number"
          variant="solo"
          class="my-4"
          autofocus
        />

        <v-btn
          color="primary"
          :loading="isVerifying"
          :disabled="otp.length !== 6"
          block
          @click="verifyOTP"
        >
          Verifikasi
        </v-btn>

        <div class="text-center mt-4">
          <v-btn
            v-if="canResend"
            variant="text"
            size="small"
            color="primary"
            @click="resendOTP"
          >
            Kirim Ulang Kode
          </v-btn>
          <div v-else class="text-caption text-medium-emphasis">
            Kirim ulang kode dalam {{ countdown }} detik
          </div>
        </div>
      </v-card-text>
    </v-card>

    <div id="recaptcha-container" class="d-none" />
  </v-container>
</template>

<style scoped>
</style>
