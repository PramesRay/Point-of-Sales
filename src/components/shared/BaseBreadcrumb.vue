<script setup lang="ts">
import { ChevronRightIcon } from 'vue-tabler-icons';

interface BreadcrumbItem {
  title: string;
  disabled?: boolean;
  href?: string;
}

const props = defineProps<{
  title: string;
  breadcrumbs: BreadcrumbItem[];
  useCustomDividerIcon?: boolean;
}>();

const { title, breadcrumbs, useCustomDividerIcon } = props;
</script>

<template>
  <v-row class="page-breadcrumb ma-0 rounded-md">
    <v-col cols="12">
      <v-row no-gutters class="align-center">
        <!-- Title -->
        <v-col md="5" class="px-1">
          <h3 class="text-h3">{{ title }}</h3>
        </v-col>

        <!-- Breadcrumb -->
        <v-col md="7" cols="12">
          <div class="d-flex align-center text-h5 px-1">
            <v-icon size="small" class="text-secondary mr-2">mdi-home</v-icon>

            <!-- Divider setelah Home Icon -->
            <div>
              <ChevronRightIcon v-if="useCustomDividerIcon" size="18" class="text-secondary" />
              <span v-else class="text-secondary">/</span>
            </div>

            <!-- Manual rendering breadcrumbs + divider -->
            <template v-for="(item, i) in breadcrumbs" :key="i">
              <v-breadcrumbs-item
                :to="item.href"
                :disabled="item.disabled"
                class="pl-2 pr-2"
              >
                {{ item.title }}
              </v-breadcrumbs-item>

              <!-- Divider manual kecuali setelah last item -->
              <template v-if="i !== breadcrumbs.length - 1">
                <div>
                  <ChevronRightIcon v-if="useCustomDividerIcon" size="18" class="text-secondary" />
                  <span v-else class="text-secondary">/</span>
                </div>
              </template>
            </template>

            <!-- Last item slot -->
            <template v-if="$slots.last">
              <div>
                <ChevronRightIcon v-if="useCustomDividerIcon" size="18" class="text-secondary" />
                <span v-else class="text-secondary">/</span>
              </div>
              <v-breadcrumbs-item class="pl-2 pr-2">
                <slot name="last" />
              </v-breadcrumbs-item>
            </template>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.page-breadcrumb {
  position: sticky;
  z-index: 1;
  background-color: white;
  top: 80px;

  .v-icon {
    vertical-align: middle;
  }

  .breadcrumb-select {
    min-width: 150px; // Biar V-Select ga kecil banget
    max-width: 220px;
    .v-input {
      margin: 0;
      background: transparent !important;
      box-shadow: none !important;
      font-size: 0.95rem;
      font-weight: 500;
      padding: 0;
    }
    .v-field {
      background: transparent !important;
      padding: 0;
      min-height: 32px;
      height: 32px;
      align-items: center;
    }
    .v-select__selection-text {
      padding: 0 !important;
    }
    .v-input__control {
      border: none;
    }
    .v-input__details {
      display: none;
    }
  }
}
</style>