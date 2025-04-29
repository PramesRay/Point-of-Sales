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
  if (props.data?.length == 1) {
    return props.data.map(item => ({
      branchId: item.branchId,
      branchName: item.branchName,
      income: item.income,
    }))
  }
  else {
    return props.data
    .filter((item, index) => index !== 0)
    .map(item => ({
      branchId: item.branchId,
      branchName: item.branchName,
      income: item.income,
    }))
    .sort((a, b) => b.income - a.income);
  }
})
const isIncomesReady = computed(() => incomes.value && incomes.value.length > 0);

const { currentSlide, totalSlides, visibleBars, isActiveBar, jumpToSlide } = useSlideIndicator(() => incomes.value);

const { mdAndUp } = useDisplay();
const showArrows = computed(() => mdAndUp.value ? 'hover' : false);

console.log(incomes.value)
</script>

<template>
  <div class="carousel-container" v-if="!props.loading">
    <v-window
      v-show="isIncomesReady"
      v-model="currentSlide"
      class="total-income-carousel flex-grow-1"
      mandatory
      touch
      :show-arrows="showArrows"
    >
      <v-window-item
        v-for="(inc, index) in incomes"
        :key="index"
        :value="index"
      >
        <v-row no-gutters justify="center">
          <v-col cols="12">
            <v-card
              v-if="index === 0"
              class="overflow-hidden bubble-shape-sm mb-6"
              elevation="0"
              rounded="md"
            >
              <v-card-text>
                <div class="d-flex align-center ga-4">
                  <v-btn color="lightwarning" icon rounded="sm" variant="flat">
                    <BuildingStoreIcon stroke-width="1.5" width="25" class="text-warning" />
                  </v-btn>
                  <div>
                    <h4 class="text-h4 font-weight-medium">{{ formatRupiah(inc.income) }}</h4>
                    <span class="text-subtitle-2 text-medium-emphasis text-disabled">
                      Total Pendapatan {{ inc.branchName }}
                    </span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
            <v-card
              v-else
              class="bg-primary overflow-hidden bubble-shape-sm mb-6"
              elevation="0"
              rounded="md"
            >
              <v-card-text>
                <div class="d-flex align-center ga-4">
                  <v-btn color="darkprimary" icon rounded="sm" variant="flat">
                    <BuildingStoreIcon stroke-width="1.5" width="25" class="text-white" />
                  </v-btn>
                  <div>
                    <h4 class="text-h4 font-weight-medium">{{ formatRupiah(inc.income) }}</h4>
                    <span class="text-subtitle-2 text-medium-emphasis text-white">
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

    <div class="slide-indicator-bar">
      <div
        v-for="i in visibleBars"
        :key="i"
        :class="['bar', { active: isActiveBar(i) }]"
        @click="jumpToSlide(i)"
      />
    </div>
  </div>
  <div class="carousel-container" v-else>
    <v-skeleton-loader
      type="list-item-avatar-two-line"
      class="py-4"
    />
  </div>
</template>

<style scoped lang="scss">
/* Tidak perlu styling width! Biarkan v-slide-group yang mengatur */
.v-card-text {
  padding: 20px;
}

.carousel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;

  .total-income-carousel {
    flex-grow: 1;
  }

  .slide-indicator-bar {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    z-index: 9999; /* Menambahkan z-index untuk memastikan indikator di atas elemen lainnya */
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

.v-window__controls,
.v-window__controls .v-btn,
.v-window__controls .v-btn__overlay,
.v-window__controls .v-btn__underlay {
  background-color: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}
</style>