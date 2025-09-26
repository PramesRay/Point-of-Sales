import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/authUser';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const MainRoutes = {
  path: '/',
  meta: { requiresAuth: true },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '', // << relative ke '/main'
      component: () => import('@/views/dashboards/default/LandingPage.vue'),
      beforeEnter: async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const authStore = useAuthStore()
        const userStore = useUserStore()

        // hanya fetch saat sudah authenticated
        if (authStore.isAuthenticated && !userStore.me) {
          await userStore.fetchMe().catch(() => {})
        }

        if (!authStore.isAuthenticated) {
          return next('/login')
        } else {
          // Berdasarkan role, arahkan pengguna ke halaman yang sesuai
          if (userStore.hasRole(['admin', 'pemilik'])) {
            next({name:'Pemilik'});
          } else if (userStore.hasRole('bendahara')) {
            next({name:'Bendahara'});
          } else if (userStore.hasRole('kasir')) {
            next({name:'Kasir'});
          } else if (userStore.hasRole('gudang')) {
            next({name:'Gudang'});
          } else if (userStore.hasRole('dapur')) {
            next({name:'Dapur'});
          } else {
            next({name:'Starter'});  // Default halaman jika role tidak ditemukan
          }
        }
      }
    },
    {
      name: 'Bendahara',
      path: '/dashboard/bendahara',
      meta: {
        requiredRoles: ['admin', 'pemilik', 'bendahara']
      },
      component: () => import('@/views/dashboards/finance/FinanceDashboard.vue')
    },
    {
      name: 'Pemilik',
      path: '/dashboard/pemilik',
      meta: {
        requiredRoles: ['admin', 'pemilik']
      },
      component: () => import('@/views/dashboards/owner/OwnerDashboard.vue')
    },
    {
      name: 'Kasir',
      path: '/halaman/kasir',
      meta: {
        requiredRoles: ['admin', 'pemilik', 'kasir']
      },
      component: () => import('@/views/pages/cashier/CashierPage.vue')
    },
    {
      name: 'Gudang',
      path: '/halaman/gudang',
      meta: {
        requiredRoles: ['admin', 'pemilik', 'gudang']
      },
      component: () => import('@/views/pages/inventory/InventoryPage.vue')
    },
    {
      name: 'Dapur',
      path: '/halaman/dapur',
      meta: {
        requiredRoles: ['admin', 'pemilik', 'dapur']
      },
      component: () => import('@/views/pages/kitchen/KitchenPage.vue')
    },
    {
      name: 'Starter',
      path: '/starter',
      component: () => import('@/views/StarterPage.vue')
    },
    // {
    //   name: 'Tabler Icons',
    //   path: '/icons/tabler',
    //   component: () => import('@/views/utilities/icons/TablerIcons.vue')
    // },
    // {
    //   name: 'Material Icons',
    //   path: '/icons/material',
    //   component: () => import('@/views/utilities/icons/MaterialIcons.vue')
    // },
    // {
    //   name: 'Typography',
    //   path: '/utils/typography',
    //   component: () => import('@/views/utilities/typography/TypographyPage.vue')
    // },
    // {
    //   name: 'Shadows',
    //   path: '/utils/shadows',
    //   component: () => import('@/views/utilities/shadows/ShadowPage.vue')
    // },
    // {
    //   name: 'Colors',
    //   path: '/utils/colors',
    //   component: () => import('@/views/utilities/colors/ColorPage.vue')
    // }
  ]
};

export default MainRoutes;