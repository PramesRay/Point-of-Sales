<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { ArchiveIcon, CopyIcon, DownloadIcon, FileExportIcon } from 'vue-tabler-icons';
import iconCard from '@/assets/images/icons/icon-card.svg';
import { formatRupiah } from '@/utils/helpers/currency';
import type { FinanceSummary } from '@/types/finance';
import type { IdName } from '@/types/common';

const props = defineProps<{
  data: FinanceSummary;
  loading: boolean;
}>();

const earningData = computed(() => {
  if (!props.data) return undefined;
  return props.data.income;
})
</script>

<template>
  <v-card elevation="0" class="bg-secondary overflow-hidden bubble-shape bubble-secondary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-6">
        <v-btn icon rounded="sm" color="darksecondary" variant="flat">
          <img :src="iconCard" width="25" />
        </v-btn>
      </div>
      <h2 class="text-h1 font-weight-medium">
        {{ earningData ? formatRupiah(earningData.total.netIncome) : '0' }} <a href="#"><CircleArrowUpRightIcon stroke-width="1.5" width="28" class="text-white" /> </a>
      </h2>
      <div class="text-subtitle-1 text-medium-emphasis text-white">
        Total Seluruh Pendapatan
      </div>
      <div class="text-subtitle-2 text-medium-emphasis text-disabled text-white">
        per {{ new Date(earningData?.period.start!).toLocaleString('default', { month: 'long' }) }}
      </div>
    </v-card-text>
  </v-card>
</template>
