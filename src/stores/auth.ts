import { defineStore } from 'pinia';
import { router } from '@/router';
import api from '@/services/api'; // Menggunakan Axios dengan interceptor
import type { LoginPayload, RegisterPayload, UserAuth } from '@/types/auth';
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/plugins/firebase';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // Sementara, nanti ubah menjadi null
    user: null as UserAuth | null,
    loading: false,
    returnUrl: null as string | null,
    isAuthenticated: false
  }),
  actions: {
    async initialize() {
      this.loading = true;
      return new Promise<void>((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const token = await user.getIdToken()
            this.user = {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
            };
            this.isAuthenticated = true;
          } else {
            this.user = null;
            this.isAuthenticated = false;
          }
          this.loading = false;
          resolve();
        });
      });
    },
    async loginWithGoogle(){
      this.loading = true
      try {
        const result = await signInWithPopup(auth, googleProvider);
        
        this.user = {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email
        };
        this.isAuthenticated = true;
        
        const idToken = await result.user.getIdToken();
        // await api.post(`${baseUrl}/auth/google`, {idToken})
        router.push('/');
      } catch (error) {
        console.error('Gagal login dengan Google:', error);
        throw error;  
      } finally {
        this.loading = false
      }
    },
    async login(payload: LoginPayload) {
      this.loading = true;
      try {
        const result = await signInWithEmailAndPassword(auth, payload.email, payload.password);
        if (!result.user.emailVerified) {
          await signOut(auth); // Logout paksa
          throw new Error('Email belum diverifikasi');
        }
        // const idToken = await result.user.getIdToken();

        // DELETE SECTION ================================================
        // const session = await api.post(`${baseUrl}/auth/login`, {idToken})
        // DELETE SECTION ================================================
        
        // Simpan data pengguna dari API
        this.user = {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email
        };
        this.isAuthenticated = true;

        // Reset returnUrl setelah login dan redirect
        const redirectUrl = this.returnUrl || '/';
        this.returnUrl = null;
        
        // // Cek apakah kita sudah berada di halaman yang sama
        const currentPath = router.currentRoute.value.path;
        if (currentPath !== redirectUrl) {
          router.push(redirectUrl);
        }

        return result
      } catch (error: any) {
        // Tangani error lebih baik dengan pesan yang jelas (HAPUS KALAU BE SUDAH TERSEDIA)
        // const mockUser: UserAuth = {
        //   uid: 'mock-user-id',
        //   name: 'mock-user',
        //   email: 'mock-email@example.com',
        // }
        // // this.accessToken = 'mock-access-token';
        // this.user = mockUser
        // this.isAuthenticated = true;

        // localStorage.setItem('user', JSON.stringify(mockUser));
        
        console.error("Login failed:", error);
        // (UNCOMMENT KALAU BE SUDAH TERSEDIA)
        this.isAuthenticated = false
        this.user = null
        localStorage.removeItem('user')
        
        if (error.code === 'auth/invalid-password') {
          throw new Error('Password tidak valid. Minimal 8 karakter.');
        } else if (error.code === 'auth/user-not-found') {
          throw new Error('Email tidak ditemukan.');
        } else if (error.code === 'auth/too-many-requests') {
          throw new Error('Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.');
        } else if (error.code === 'auth/invalid-credential') {
          throw new Error('Credensial tidak valid.');
        } else {
          throw new Error('Login gagal');
        }
      } finally {
        this.loading = false;
      }
    },
    // register
    async register(payload: RegisterPayload) {
      this.loading = true
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );

        // untuk mengirim ke backend
        await updateProfile(result.user, {
          displayName: payload.first_name + ' ' + payload.last_name,
        });
        
        await sendEmailVerification(result.user);

        // await api.post(`${baseUrl}/auth/register`, { 
        //   name: payload.first_name + ' ' + payload.last_name,
        //   idToken 
        // });
  
        this.user = {
          uid: result.user.uid,
          name: payload.first_name + ' ' + payload.last_name,
          email: result.user.email
        };
        this.isAuthenticated = true;
        router.push('/');
        return result
      } catch (err: any) {
        // error handling untuk semua skenario yang memungkinkan
        if (err.code === 'auth/email-already-in-use') {
          throw new Error('Email sudah terdaftar');
        } else if (err.code === 'auth/invalid-email') {
          throw new Error('Email tidak valid');
        } 
        throw err || 'Registrasi gagal';
      } finally {
        this.loading = false
      }
    },
    async verifySessionAfterEmail(idToken: string) {
      if (!idToken) return;
      this.loading = true;
      try {
        const session = await api.post(`${baseUrl}/auth/verify-email`, { idToken });
  
        // this.user = {
        //   uid: session.data.uid,
        //   name: session.data.name,
        //   email: session.data.email
        // };
      } catch (error) {
        // Sementara (HAPUS SETELAH BACKEND TERSEDIA!!!)
        // const mockUser: UserAuth = {
        //   uid: 'mock-user-id',
        //   name: 'mock-user',
        //   email: 'mock-email@example.com',
        // }
        // this.user = mockUser;
        // localStorage.setItem('user', JSON.stringify(mockUser));
        throw error || 'Email belum diverifikasi';
      } finally {
        this.loading = false
      }
    },
    async resendVerification() {
      const user = auth.currentUser
      if (!user) throw new Error('User tidak ditemukan.')
      
      this.loading = true
      try {
        await sendEmailVerification(user)
      } catch (error) {
        console.error('Gagal kirim ulang email verifikasi:', error)
        throw error
      } finally {
        
      }
    },
    async changePassword(newPassword: string) {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');

      try {
        await updatePassword(user, newPassword);
      } catch (err: any) {
        throw err.response?.data?.message || 'Ganti password gagal';
      }
    },
    async requestResetPassword(email: string) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (err: any) {
        throw err.response?.data?.message || 'Reset password gagal';
      }
    },
    async resetPassword(oobCode: string, newPassword: string) {
      if (!oobCode) throw new Error('Kode reset password tidak valid');
      this.loading = true;
      try {
        await confirmPasswordReset(auth, oobCode, newPassword);
        console.log('Password berhasil diperbarui');
      } catch (error) {
        console.error('Gagal memperbarui password:', error);
        throw error;
      } finally {
        this.loading = false
      }
    },
    // async verifyOTP(otp: string) {
    //   try {
    //     const userCredential = await this.confirmationResult?.confirm(otp)
    //     const firebaseUid = userCredential?.user.uid

    //     if (!firebaseUid) {
    //       throw new Error('Verifikasi OTP gagal');
    //     }

    //     const res = await api.post('/auth/verify', {
    //       firebase_uid: firebaseUid,
    //       phone: this.tempUser.phone,
    //     })
        
    //     // Hapus data sementara setelah berhasil
    //     localStorage.removeItem('tempUser');

    //     // Simpan data pengguna di localStorage (Auto Login User)
    //     this.user = res.data.user;
    //     this.isAuthenticated = true;
    //     localStorage.setItem('user', JSON.stringify(res.data));
        
    //     return res.data;
    //   } catch (err: any) {
    //     // Sementara (HAPUS SETELAH BACKEND TERSEDIA!!!)
    //     localStorage.removeItem('tempUser');
    //     console.log('Error! Bypassing OTP verification for now.');
    //     const mockUser = {
    //       id: 'mock-user-id',
    //       username: 'mock-user',
    //       token: 'mock-token',
    //     }
    //     this.user = mockUser
    //     this.isAuthenticated = true;
    //     localStorage.setItem('user', JSON.stringify(mockUser));
    //     router.push('/');

    //     throw err.response?.data?.message || err || 'Verifikasi OTP gagal';
    //   }
    // },
    // // resend otp
    // async resendOTP() {
    //   const recaptcha = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
    //       size: 'invisible',
    //       callback: () => {
    //         console.log('recaptcha solved')
    //       }
    //     })
    //   try {
    //     this.confirmationResult = await signInWithPhoneNumber(firebaseAuth, `+62${this.tempUser.phone}`, recaptcha)
    //   } catch (err: any) {
    //     console.warn('Bypassing Firebase OTP due to error:', err)
    //     // Simulasi berhasil kirim OTP meskipun error
    //     this.confirmationResult = { confirm: async () => ({ user: { uid: 'bypass-uid' } }) } as any
    //   }
    // },
    async logout() {
      this.loading = true
      try {
        await signOut(auth);
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        this.loading = false
        this.user = null;
        this.isAuthenticated = false;
      }
    },
    // Memeriksa apakah sudah login saat aplikasi dimulai
    async checkAuthentication() {
      try {
        // Ambil user dari localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (storedUser) {
          this.user = storedUser; // Set user data dari localStorage
          this.isAuthenticated = true; // Tandai bahwa pengguna sudah login
        } else {
          this.isAuthenticated = false;
          this.user = null;
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        this.isAuthenticated = false;
        this.user = null;
      }
    }
  }
});
