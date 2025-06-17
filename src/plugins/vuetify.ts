import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi' // ✅ font-based mdi
import '@mdi/font/css/materialdesignicons.css'       // ✅ include mdi font CSS
import { icons } from './mdi-icon'; // Import icons from separate file
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { PurpleTheme } from '@/theme/LightTheme';
import { VTimePicker } from 'vuetify/labs/VTimePicker'

export default createVuetify({
  components: {
    ...components,
    VTimePicker
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...icons
    },
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'PurpleTheme',
    themes: {
      PurpleTheme
    }
  },
  defaults: {
    VBtn: {},
    VCard: {
      rounded: 'md'
    },
    VTextField: {
      rounded: 'lg'
    },
    VTooltip: {
      // set v-tooltip default location to top
      location: 'top'
    }
  }
});
