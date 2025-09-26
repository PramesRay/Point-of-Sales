import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/authUser';
import { useAlertStore } from '@/stores/alert';
import { watch } from 'vue';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    MainRoutes,
    PublicRoutes
  ]
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const userStore = useUserStore();
  const alertStore = useAlertStore();
  
  const publicPages = ['/login', '/register', '/starter'];
  const isPublicPage = publicPages.includes(to.path);
  const authRequired = !isPublicPage && to.matched.some((record) => record.meta.requiresAuth);

  if (auth.loading) {
    // tunggu selesai sekali
    await new Promise<void>(resolve => {
      const stop = watch(() => auth.loading, v => { if (!v) { stop(); resolve(); } }, { immediate: true });
    });
  }

  // 2) Jika butuh auth tapi belum login → ke login
  if (authRequired && !auth.isAuthenticated) {
    auth.returnUrl = to.fullPath;
    return next('/login');
  }

  // 3) Sudah login tapi profil belum ada → fetch sekali & TUNGGU
  if (auth.isAuthenticated && !userStore.me) {
    try { await userStore.fetchMe(); } catch { /* biarin null */ }
  }

  // 4) Validasi email & konfirmasi (TANPA logout)
  if (auth.isAuthenticated && userStore.me) {
    if (auth.user?.emailVerified === false) {
      alertStore.showAlert('Email Anda belum diverifikasi', 'error');
      return next('/verify-email'); // arahkan, jangan signOut
    }
    if (userStore.me.role == null) {
      alertStore.showAlert('Email Anda belum dikonfirmasi oleh pemilik', 'error');
      return next('/starter'); // arahkan, jangan signOut
    }
    if (to.path === '/login' || to.path === '/register') {
      return next('/'); // sudah login
    }
  }

  // 5) Role-based access (SESUDAH me terisi)
  const allowedRoles = to.meta.requiredRoles as string[] | undefined;
  // console.log('allowedRoles', allowedRoles, 'userRole', userStore.me?.role);

  if (allowedRoles && userStore.me?.role && !allowedRoles.includes(userStore.me.role)) {
    alertStore.showAlert('Anda tidak memiliki akses untuk halaman ini.', 'error');
    return next('/'); // fallback aman
  }

  return next();
});
