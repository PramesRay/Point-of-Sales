import { useAuthStore } from '@/stores/auth';

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
      name: 'OTP',
      path: '/otp',
      component: () => import('@/views/authentication/verification/OTPPage.vue'),
      beforeEnter: (to, from, next) => {
        const auth = useAuthStore();
        if (auth.user) {
          next('/');
        } else {
          next();
        }
      }
    },
    {
      name: 'Error 404',
      path: '/error',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    }
  ]
};

export default PublicRoutes;
