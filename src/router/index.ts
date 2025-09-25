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

  const user = auth.user || null;
  const userRole = userStore.me?.role;
  
  if (authRequired && !auth.isAuthenticated) {
    auth.returnUrl = to.fullPath
    return next('/login')
  }
        
  // Logout jika email belum diverifikasi
  if(userStore.me) {
    if (user?.emailVerified == false) {
      console.log('Email belum diverifikasi');
      // auth.logout()
      alertStore.showAlert('Email Anda belum diverifikasi', 'error');
    } else if (userStore.me.role == null) {
      console.log('Email belum dikonfirmasi oleh pemilik');
      // auth.logout()
      alertStore.showAlert('Email Anda belum dikonfirmasi oleh pemilik', 'error');
    }
    
    if ((to.path === '/login' || to.path === '/register')) {
      return next('/');
    }
  }


  // Redirect jika butuh auth tapi belum login
  if (authRequired && !user) {
    auth.returnUrl = to.fullPath;
    return next('/login');
  }
  
  // Cek role-based access
  const allowedRoles = to.meta.requiredRoles as string[] | undefined;
  console.log('allowedRoles', allowedRoles);
  if ((allowedRoles && userRole && !allowedRoles.includes(userRole))) {
    alertStore.showAlert('Anda tidak memiliki akses untuk halaman ini.', 'error');
    return next('/');
  }

  // Lanjutkan
  return next();
});
