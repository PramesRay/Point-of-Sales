import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/auth';

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
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register', '/starter'];
  const auth = useAuthStore();

  const isPublicPage = publicPages.includes(to.path);
  const authRequired = !isPublicPage && to.matched.some((record) => record.meta.requiresAuth);

  // Jika user sudah login dan mencoba mengakses halaman login/register, arahkan ke LandingPage
  if (auth.user && (to.path === '/login' || to.path === '/register')) {
    // User logged in and trying to access the login page
    // if (auth.returnUrl && (auth.returnUrl !== '/login' && auth.returnUrl !== '/register')) {
      //   next(auth.returnUrl);
      // } else {
        next({name:'LandingPage'});
    // }
  } else if (authRequired && !auth.user) {
    // Jika halaman membutuhkan autentikasi dan user belum login
    auth.returnUrl = to.fullPath; // Simpan halaman yang akan diakses
    next('/login'); // Redirect ke login
  } else {
    // Semua kondisi lain
    next(); // Lanjutkan ke halaman tujuan
  }
});
