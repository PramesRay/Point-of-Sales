import { defineStore } from 'pinia';
import { router } from '@/router';
import api from '@/services/api'; // Menggunakan Axios dengan interceptor
import type { LoginPayload, RegisterPayload, UserAuth } from '@/types/auth';
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  type User,
  EmailAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '@/plugins/firebase';
import { useUserStore } from './authUser';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // Sementara, nanti ubah menjadi null
    user: null as User | null,
    loading: false,
    returnUrl: null as string | null,
    isAuthenticated: false,
    _handlingToken: false,
    _unsubscribeAuth: null as null | (() => void)
  }),
  actions: {
    async initialize() {
      this.loading = true;

      this.detachAuthListener();

      let firstResolveDone = false;
      this._handlingToken = false;

      await new Promise<void>((resolve) => {
        this._unsubscribeAuth = onIdTokenChanged(auth, async (u) => {
          console.log('[auth] onIdTokenChanged → user:', !!u, 'uid:', u?.uid)
          if (this._handlingToken) return;
          this._handlingToken = true;
          try {
            if (u) {
              this.user = u;
              this.isAuthenticated = true;
            } else {
              this.user = null;
              this.isAuthenticated = false;
            }
          } finally {
            this._handlingToken = false;
            this.loading = false;
            if (!firstResolveDone) {
              firstResolveDone = true;
              resolve();
            }
          }
        });
      });
    },

    // panggil saat logout manual
    detachAuthListener() {
      if (this._unsubscribeAuth) {
        this._unsubscribeAuth()
        this._unsubscribeAuth = null
      }
    },
    
    async loginWithGoogle(){
      this.loading = true
      try {
        const result = await signInWithPopup(auth, googleProvider);
        
        await api.get('/employee/me')
        .catch(async error => {
          if (error.status === 404) {
            await api.post(`${baseUrl}/auth/register`, { 
              name: result.user.displayName,
              email: result.user.email,
              uid: result.user.uid,
            })
            throw new Error('Akun berhasil dibuat, silahkan konfirmasi kepada pemilik');
          }
        });
        
        this.user = result.user;
        this.isAuthenticated = true;
        
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
          // await signOut(auth); // Logout paksa
          localStorage.setItem('email', payload.email);
          router.push('/verify-email');
          throw new Error('Email belum diverifikasi');
        }  
        
        const response = await api.get('/employee/me');

        if (response.data.data.role == null) {
          // await signOut(auth); // Logout paksa
          throw new Error('Email belum dikonfirmasi oleh pemilik');
        }

        // Simpan data pengguna dari API
        this.user = result.user;
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
        console.error("Login failed:", error);
        this.isAuthenticated = false
        this.user = null
        localStorage.removeItem('user')
        
        if (error.code === 'auth/invalid-password') {
          throw new Error('Password tidak valid. Minimal 6 karakter.');
        } else if (error.code === 'auth/user-not-found') {
          throw new Error('Email tidak ditemukan.');
        } else if (error.code === 'auth/too-many-requests') {
          throw new Error('Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.');
        } else if (error.code === 'auth/invalid-credential') {
          throw new Error('Kredensial tidak valid.');
        } else if (error.message) {
          throw new Error(error.message);
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
          displayName: (payload.first_name + ' ' + payload.last_name).trim(),
        });
        
        await sendEmailVerification(result.user);
        
        await api.post(`${baseUrl}/auth/register`, { 
          name: (payload.first_name + ' ' + payload.last_name).trim(),
          email: payload.email,
          uid: result.user.uid,
        });
  
        this.user = {
          ...result.user,
          displayName: (payload.first_name + ' ' + payload.last_name).trim(),
        };
        this.isAuthenticated = true;

        localStorage.setItem('lastSyncedProfile', JSON.stringify({
          name: this.user.displayName,
          email: this.user.email
        }));

        // await signOut(auth); // Logout paksa
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
    async updateUserProfile(name: string) {
      const user = auth.currentUser;
      if (!user) throw new Error('User tidak ditemukan');
  
      try {
        await updateProfile(user, { displayName: name });
        await api.put(`/employee-me`, { name });
      } catch (error) {
        console.error('Gagal memperbarui profil pengguna:', error);
        throw error;
      }
    },

    
    async changeEmail(newEmail: string, oldPassword: string) {
      if (!auth.currentUser) throw new Error('User tidak ditemukan');
      try {
        await reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(auth.currentUser.email!, oldPassword));
        await verifyBeforeUpdateEmail(auth.currentUser!, newEmail);
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          throw new Error('Email sudah terdaftar');
        } else if (err.code === 'auth/invalid-credential') {
          throw new Error('Kredensial tidak valid');
        }
        throw err.response?.data?.message || 'Ganti mengirim verifikasi email';
      }
    },
    
    async changePassword(oldPassword: string, newPassword: string) {
      const user = auth.currentUser;
      if (!user) throw new Error('User tidak ditemukan');

      try {
        await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email!, oldPassword));
        await updatePassword(user, newPassword);
      } catch (err: any) {
        if (err.code === 'auth/invalid-credential') {
          throw new Error('Kredensial tidak valid');
        }
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
    async logout() {
      this.loading = true
      try {
        await signOut(auth);
        this.detachAuthListener();
        this.user = null;
        this.isAuthenticated = false;
        useUserStore().setNull();
        localStorage.removeItem('lastSyncedProfile'); // Hapus setelah berhasil sync
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        this.loading = false
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