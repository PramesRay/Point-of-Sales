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
      component: () => import('@/views/dashboards/default/FinanceDashboard.vue') //sementara seperti ini, perlu diganti agar yang di render page sesuai role mereka.
    },
    {
      name: 'Default',
      path: '/dashboard/default',
      component: () => import('@/views/dashboards/default/FinanceDashboard.vue')
    },
    {
      name: 'Owner',
      path: '/dashboard/owner',
      component: () => import('@/views/dashboards/owner/OwnerDashboard.vue')
    },
    {
      name: 'Cashier',
      path: '/page/cashier',
      component: () => import('@/views/pages/cashier/CashierPage.vue')
    },
    {
      name: 'Inventory',
      path: '/page/inventory',
      component: () => import('@/views/pages/inventory/InventoryPage.vue')
    },
    {
      name: 'Kitchen',
      path: '/page/kitchen',
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
