<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { formatRupiah } from '@/utils/helpers/currency';
import { useSlideIndicator } from '@/composables/non-services/useSlideIndicator';
import { TableIcon } from 'vue-tabler-icons';
import type { FinanceSummary } from '@/types/finance';
import { useDisplay } from 'vuetify';
import type { IdName } from '@/types/common';

const props = defineProps<{
  data: FinanceSummary;
  data_branch: IdName[];
  loading: boolean;
}>();

const incomes = computed(() => {
  console.log('props.data', props.data);
  if (!props.data) return [];
  
  return Array.isArray(props.data.income.perBranch) ? props.data.income.perBranch : [];
});

const branchOptions = computed(() => {
  return props.data_branch;
});

const incomePerBranch = computed(() => {
  return incomes.value.map(inc => ({
    ...inc,
    branchName: branchOptions.value.find(b => b.id === inc.branch_id)?.name || `Cabang - ${inc.branch_id}`
  })).sort((a, b) => b.netIncome - a.netIncome);
});

const isIncomesReady = computed(() => incomes.value && incomes.value.length > 0);

const { currentSlide, totalSlides, visibleBars, isActiveBar, jumpToSlide } = useSlideIndicator(() => incomes.value);

const { mdAndUp } = useDisplay();
const showArrows = computed(() => mdAndUp.value ? 'hover' : false);
</script>

<template>
  <div class="w-100" v-if="props.loading">
    <v-skeleton-loader
      type="list-item-avatar-two-line"
      class="py-4"
    />
  </div>
  <div v-else class="w-100">
    <v-window
      v-show="isIncomesReady"
      v-model="currentSlide"
      class="total-income-carousel"
      mandatory
      touch
      :show-arrows="showArrows"
    >
      <v-window-item
        v-for="(inc, index) in incomePerBranch"
        :key="inc.branch_id"
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
                      {{ formatRupiah(inc.netIncome) }}
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
