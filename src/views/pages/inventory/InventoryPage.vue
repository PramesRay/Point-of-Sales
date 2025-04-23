<script setup lang="ts">
// imported components
import CurrentFundRequest from '@/views/dashboards/default/components/CurrentFundRequest.vue';
import CurrentRestockCard from './components/CurrentRestockCard.vue';
</script>

<template>
  <v-row>
    <!-- -------------------------------------------------------------------- -->
    <!-- Current Restock Card -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <CurrentRestockCard />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Current Item Request -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <CurrentItemRequest />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Inventory Stock -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <InventoryStock />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Stock Movement -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="8">
      <StockMovement />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Current Fund Request -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="8">
      <CurrentFundRequest />
    </v-col>
  </v-row>
</template>
