import { createApp, onMounted } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';

import { useAuthStore } from '@/stores/auth'
import { useUserStore } from './stores/authUser';

// print
import print from 'vue3-print-nb';

const app = createApp(App);
app.use(PerfectScrollbarPlugin);
app.use(createPinia());
app.use(VueTablerIcons);
app.use(print);
app.use(VueApexCharts);

const authStore = useAuthStore()
const userStore = useUserStore()

onMounted(async () => {
  await authStore.initialize()
  await userStore.fetchMe()
})

app.use(router);

app.use(vuetify).mount('#app');
