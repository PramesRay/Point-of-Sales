const PublicRoutes = {
  path: '/',
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Landing Page',
      path: '/',
      component: () => import('@/views/dashboards/default/LandingPage.vue')
    },
    {
      name: 'Error 404',
      path: '/error',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    }
  ]
};

export default PublicRoutes;
