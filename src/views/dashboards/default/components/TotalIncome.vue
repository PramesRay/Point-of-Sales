<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { formatRupiah } from '@/utils/helpers/currency';
import { useSlideIndicator } from '@/composables/useSlideIndicator';
import { TableIcon } from 'vue-tabler-icons';
import type { FinanceSummary } from '@/types/finance';
import { useDisplay } from 'vuetify';

const props = defineProps<{
  data: FinanceSummary[];
  loading: boolean;
}>();

const incomes = computed(() => {
  if (!props.data?.length) return [];

  // Ambil semua jika hanya 1 data
  if (props.data.length === 1) return props.data;

  // Jika lebih dari 1, skip index ke-0 dan urutkan
  return props.data.slice(1).sort((a, b) => b.income - a.income);
});

const isIncomesReady = computed(() => incomes.value && incomes.value.length > 0);

const { currentSlide, totalSlides, visibleBars, isActiveBar, jumpToSlide } = useSlideIndicator(() => incomes.value);

const { mdAndUp } = useDisplay();
const showArrows = computed(() => mdAndUp.value ? 'hover' : false);
</script>

<template>
<div v-if="!props.loading" class="w-100">
  <v-window
    v-show="isIncomesReady"
    v-model="currentSlide"
    class="total-income-carousel"
    mandatory
    touch
    :show-arrows="showArrows"
  >
    <v-window-item
      v-for="(inc, index) in incomes"
      :key="inc.branchId"
      :value="index"
      eager
    >
      <v-row
        no-gutters
        justify="center"
        class="d-flex align-center justify-center"
      >
        <v-col cols="12">
          <v-card
            :class="[
              'overflow-hidden bubble-shape-sm mb-4',
              index === 0 ? '' : 'bg-primary',
            ]"
            elevation="0"
            rounded="md"
          >
            <v-card-text>
              <div class="d-flex align-center ga-4">
                <v-btn
                  :color="index === 0 ? 'lightwarning' : 'darkprimary'"
                  icon
                  rounded="sm"
                  variant="flat"
                >
                  <BuildingStoreIcon
                    stroke-width="1.5"
                    width="25"
                    :class="index === 0 ? 'text-warning' : 'text-white'"
                  />
                </v-btn>
                <div>
                  <h4 class="text-h4 font-weight-medium">
                    {{ formatRupiah(inc.income) }}
                  </h4>
                  <span
                    :class="[
                      'text-subtitle-2 text-medium-emphasis',
                      index === 0 ? 'text-disabled' : 'text-white',
                    ]"
                  >
                    Total Pendapatan {{ inc.branchName }}
                  </span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-window-item>
  </v-window>
  <div class="carousel-container" >
    <div class="slide-indicator-bar">
      <div
        v-for="i in visibleBars"
        :key="i"
        :aria-label="`Slide ${i + 1}`"
        role="button"
        tabindex="0"
        :class="['bar', { active: isActiveBar(i) }]"
        @click="jumpToSlide(i)"
        @keypress.enter="jumpToSlide(i)"
      />
    </div>
  </div>
</div>
  

  <div class="carousel-container d-flex flex-column h-100" v-else>
    <v-skeleton-loader
      type="list-item-avatar-two-line"
      class="py-4"
    />
  </div>
</template>

<style scoped lang="scss">
.v-card-text {
  padding: 20px;
}

.carousel-container {
  position: relative;

  .total-income-carousel {
    flex-grow: 1;
  }

  .slide-indicator-bar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
  }
}

.bar {
  width: 20px;
  height: 4px;
  border-radius: 2px;
  background-color: #c4c4c4;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bar.active {
  width: 32px;
  background-color: #ffffff;
}
</style>
