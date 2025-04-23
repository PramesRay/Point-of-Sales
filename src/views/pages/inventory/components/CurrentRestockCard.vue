<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowDownLeftCircleIcon, ShoppingCartIcon, CircleArrowDownLeftIcon } from 'vue-tabler-icons';

const select = ref<{ state: 'Restoran 1' | 'Restoran 2' | 'Restoran 3' | 'Restoran 4'}>({ state: 'Restoran 1' });

const items = [
  { state: 'Restoran 1' },
  { state: 'Restoran 2' },
  { state: 'Restoran 3' },
  { state: 'Restoran 4' }
];

const dataRestoran = ref({
  "Restoran 1": {
    request: 12,
    week: [12, 8, 5, 14],
    month: [11, 6, 9, 13, 8, 14, 4, 7]
  },
  "Restoran 2": {
    request: 14,
    week: [14, 10, 7, 12],
    month: [9, 7, 11, 15, 6, 12, 5, 10]
  },
  "Restoran 3": {
    request: 13,
    week: [13, 9, 8, 15],
    month: [10, 5, 13, 14, 8, 9, 7, 12]
  },
  "Restoran 4": {
    request: 15,
    week: [15, 7, 12, 9],
    month: [8, 6, 10, 12, 7, 13, 5, 9]
  }
});

</script>

<template>
  <v-card elevation="0" class="bg-secondary overflow-hidden bubble-shape bubble-secondary-shape">
    <v-card-text>
      <div class="d-flex align-start mb-3">
        <v-btn icon rounded="sm" color="darksecondary" variant="flat">
          <BuildingStoreIcon stroke-width="1.5" width="25" />
        </v-btn>
        <div class="mx-3">
          <v-select
              class="custom-select font-weight-medium"
              variant="plain"
              hide-details
              density="compact"
              v-model="select"
              :items="items"
              item-title="state"
              item-value="state"
              label="Restoran"
              return-object
              single-line
            >
            </v-select>
        </div>
      </div>
      <div>
          <h2 class="text-h1 font-weight-medium d-flex align-center gap-1">
            <div class="d-flex align-baseline">
              <span class="mx-1"> {{ dataRestoran[select.state].request }} </span>
              <span class="text-body-2"> Permintaan Restock </span>
            </div>
          </h2>
          <span class="text-subtitle-1 text-medium-emphasis text-white">Belum Dikonfirmasi</span>
        </div>
    </v-card-text>
  </v-card>
</template>

<style>
.custom-select .v-field__input {
  font-size: 0.8rem !important;
  color: #fff !important;
}

</style>