import { useAuthStore } from '@/stores/auth';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const PublicRoutes = {
  path: '/',
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Authentication',
      path: '/login',
      component: () => import('@/views/authentication/auth/LoginPage.vue')
    },
    {
      name: 'Register',
      path: '/register',
      component: () => import('@/views/authentication/auth/RegisterPage.vue')
    },
    {
      name: 'Email Verification',
      path: '/verify-email',
      component: () => import('@/views/authentication/verification/EmailSent.vue'),

    },
    {
      name: 'Error 404',
      path: '/error',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    }
  ]
};

export default PublicRoutes;
