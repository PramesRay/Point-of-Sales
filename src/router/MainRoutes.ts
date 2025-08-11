import { useUserStore } from '@/stores/authUser';

const MainRoutes = {
  path: '/',
  redirect: '/',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/dashboards/default/LandingPage.vue'), //sementara seperti ini, perlu diganti agar yang di render page sesuai role mereka.
    },
  ]
};

export default MainRoutes;
