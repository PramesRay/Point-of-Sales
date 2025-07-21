import { useUserStore } from '@/stores/authUser';

const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/dashboards/default/LandingPage.vue'), //sementara seperti ini, perlu diganti agar yang di render page sesuai role mereka.
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore();
        
        // Periksa apakah data pengguna sudah ada (mencegah akses sebelum fetching selesai)
        if (!userStore.me) {
          // Redirect ke login jika pengguna tidak ditemukan
          await userStore.fetchMe();
          console.log('Fetching pengguna di router.');
        }

        if (!userStore.me) {
          // Redirect ke login jika pengguna tidak ditemukan
          next('/login');
          console.log('Pengguna tidak ditemukan, arahkan ke halaman login.');
        } else {
          // Berdasarkan role, arahkan pengguna ke halaman yang sesuai
          if (userStore.hasRole('Admin')) {
            next({name:'Pemilik'});
          } else if (userStore.hasRole('Kasir')) {
            next({name:'Kasir'});
          } else if (userStore.hasRole('Gudang')) {
            next({name:'Gudang'});
          } else if (userStore.hasRole('Dapur')) {
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
      component: () => import('@/views/dashboards/finance/FinanceDashboard.vue')
    },
    {
      name: 'Transaksi',
      path: '/dashboard/bendahara/transaksi',
      component: () => import('@/views/dashboards/finance/components/sub-component/TableTransaction.vue')
    },

    {
      name: 'Pemilik',
      path: '/dashboard/pemilik',
      component: () => import('@/views/dashboards/owner/OwnerDashboard.vue')
    },
    {
      name: 'Kasir',
      path: '/halaman/kasir',
      component: () => import('@/views/pages/cashier/CashierPage.vue')
    },
    {
      name: 'Gudang',
      path: '/halaman/gudang',
      component: () => import('@/views/pages/inventory/InventoryPage.vue')
    },
    {
      name: 'Dapur',
      path: '/halaman/dapur',
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
