import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/authUser';
import { useAlertStore } from '@/stores/alert';

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

// interface User {
//   // Define the properties and their types for the user data here
//   // For example:
//   id: number;
//   name: string;
// }

// // Assuming you have a type/interface for your authentication store
// interface AuthStore {
//   user: User | null;
//   returnUrl: string | null;
//   login(username: string, password: string): Promise<void>;
//   logout(): void;
// }

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/login', '/register', '/starter'];
  const isPublicPage = publicPages.includes(to.path);
  const auth = useAuthStore();
  const userStore = useUserStore();
  const authRequired = !isPublicPage && to.matched.some((record) => record.meta.requiresAuth);

  const user = auth.user;
  const userRole = userStore.me?.role;

  // Redirect jika sudah login tapi ke halaman login/register
  if (user && (to.path === '/login' || to.path === '/register')) {
    return next({ name: 'LandingPage' });
  }

  // Redirect jika butuh auth tapi belum login
  if (authRequired && !user) {
    auth.returnUrl = to.fullPath;
    return next('/login');
  }

  
  // Cek role-based access
  const allowedRoles = to.meta.requiredRoles as string[] | undefined;
  console.log('allowedRoles', allowedRoles);
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    useAlertStore().showAlert('Anda tidak memiliki akses untuk halaman ini.', 'error');
    // Arahkan pengguna ke halaman yang sesuai dengan perannya
    if (userRole === 'Admin') {
      return next({ name: 'Pemilik' });
    } else if (userRole === 'Kasir') {
      return next({ name: 'Kasir' });
    } else if (userRole === 'Gudang') {
      return next({ name: 'Gudang' });
    } else if (userRole === 'Dapur') {
      return next({ name: 'Dapur' });
    } else {
      return next({ name: 'Starter' }); // Default halaman jika role tidak ditemukan
    }
  }

  // Lanjutkan
  next();
});
