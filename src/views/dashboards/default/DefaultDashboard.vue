<script setup lang="ts">
// imported components
import TotalEarning from './components/TotalEarning.vue';
import TotalOrder from './components/TotalOrder.vue';
import TotalIncome from './components/TotalIncome.vue';
import TotalExpense from './components/TotalExpense.vue';
import CurrentTransaction from './components/CurrentTransaction.vue';
</script>

<template>
  <v-row>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Earning -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalEarning />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Order -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalOrder />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Income -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalIncome />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Total Growth -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="8">
      <TotalExpense />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Popular Stocks -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="4">
      <CurrentTransaction />
    </v-col>
  </v-row>
</template>
