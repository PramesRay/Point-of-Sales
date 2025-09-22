<template>
  <v-container class="d-flex flex-column align-center justify-center text-center mt-16">
    <v-slide-y-transition mode="out-in">
      <v-card class="pa-8 animate-fade-in" elevation="0" max-width="400" rounded="md">
        <v-icon color="primary" size="64">
          {{ mode === 'verify' ? 'mdi-email-alert' : 'mdi-lock-reset' }}
        </v-icon>

        <h2 class="text-h3 font-weight-bold mt-4 mb-2">
          {{ mode === 'verify' ? 'Verifikasi Email Telah Dikirim!' : 'Link Reset Password Telah Dikirim!' }}
        </h2>

        <p class="text-body-2 mb-6">
          {{ mode === 'verify'
            ? `Kami telah mengirimkan link verifikasi ke ${email}. Silakan cek kotak masuk (atau folder spam) untuk mengaktifkan akun kamu.`
            : `Kami telah mengirimkan link reset password ke ${email}. Silakan cek kotak masuk untuk mengatur ulang kata sandi kamu.` }}
        </p>

        <div class="d-flex flex-column align-center">
            <v-btn color="primary" class="mb-2" to="/login">
              Login
            </v-btn>

            <v-btn v-if="mode === 'verify'" variant="plain" color="warning" class="mb-2" @click="handleCheckVerification" :loading="isResending" :disabled="isResending">
              Cek Status Verifikasi
            </v-btn>
          
          <v-btn
            variant="plain"
            class="text-subtitle-2 text-medium-emphasis"
            @click="handleResend"
            :loading="isResending"
            :disabled="countdown > 0"
            >
            {{ mode === 'verify' ? 'Kirim Ulang Email Verifikasi' : 'Kirim Ulang Link Reset' }}
            <span v-if="countdown > 0"> ({{ countdown }})</span>
          </v-btn>
        </div>

        <v-snackbar v-model="snackbar" color="success" :timeout="3000" top>
          {{ mode === 'verify' ? 'Email verifikasi telah dikirim ulang!' : 'Link reset password telah dikirim ulang!' }}
        </v-snackbar>

      </v-card>
    </v-slide-y-transition>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { auth } from '@/plugins/firebase';

import { useAuthStore } from '@/stores/auth';
import { useAlertStore } from '@/stores/alert';
import { router } from '@/router';
import { onUnmounted } from 'vue';

const route = useRoute();
const authStore = useAuthStore();
const alert = useAlertStore();

const checking = ref(false);
const isResending = ref(false);
const snackbar = ref(false);
const countdown = ref(0);
const mode = ref<'verify' | 'reset'>(route.query.mode === 'reset' ? 'reset' : 'verify');

const email = localStorage.getItem('email');

let countdownInterval: number | null = null;

function startCountdown(seconds: number) {
  countdown.value = seconds;
  if (!localStorage.getItem('countdown')) {
    localStorage.setItem('countdown', String(Date.now()));
  } else {
    const start = Number(localStorage.getItem('countdown')!);
    const elapsed = Math.floor((Date.now() - start) / 1000);
    if (elapsed > 60) {
      localStorage.setItem('countdown', String(Date.now()));
    }
  }
  countdownInterval = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownInterval!);
    }
  }, 1000);
}

async function handleCheckVerification() {
  const user = auth.currentUser;
  if (!user) return;

  checking.value = true;

  try {
    await user.reload(); 
    if (user.emailVerified) {
      // const idToken = await user.getIdToken();
      // await authStore.verifySessionAfterEmail(idToken); 

      alert.showAlert('Email berhasil diverifikasi! Kamu akan diarahkan ke halaman utama.', 'success')
      setTimeout(() => router.push('/'), 2000); 
    } else {
      alert.showAlert('Email kamu belum terverifikasi. Coba lagi setelah klik link di email.', 'error')
    }
  } catch (err: any) {
    alert.showAlert('Terjadi kesalahan saat memeriksa status verifikasi.', 'error')
    console.error(err);
  } finally {
    checking.value = false;
  }
}

async function handleResend() {
  isResending.value = true;
  try {
    if (mode.value === 'verify') {
      await authStore.resendVerification();
    } else {
      const email = localStorage.getItem('email');
      if (!email) throw new Error('Email tidak ditemukan.');
      
      await authStore.requestResetPassword(email);
    }
    snackbar.value = true;
    startCountdown(60);
  } catch (err) {
    console.error('Gagal kirim ulang email:', err);
  } finally {
    isResending.value = false;
  }
}

onMounted(() => {
  if (!email) {
    alert.showAlert(`Email tidak ditemukan! Otomatis kembali ke login`, 'error');
    router.push('/login');
  }
  if (localStorage.getItem('countdown')) {
    const start = Number(localStorage.getItem('countdown')!);
    const elapsed = Math.floor((Date.now() - start) / 1000);
    countdown.value = Math.max(0, 60 - elapsed);
  } else {
    countdown.value = 60;
  }
  startCountdown(countdown.value);
});

onUnmounted(() => {
  if (localStorage.getItem('countdown')) {
    const start = Number(localStorage.getItem('countdown')!);
    const elapsed = Math.floor((Date.now() - start) / 1000);
    if (elapsed > 60) {
      localStorage.removeItem('email');
      localStorage.removeItem('countdown');
    }
  }

})
</script>

<style scoped>

.animate-fade-in {
  animation: fade-in 0.6s ease-in-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
