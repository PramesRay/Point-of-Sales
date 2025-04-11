<script setup lang="ts">
// imported components
import TotalEarning from './components/TotalEarning.vue';
import TotalOrder from './components/TotalOrder.vue';
import TotalIncome from './components/TotalIncome.vue';
import TotalExpense from './components/TotalExpense.vue';
import CurrentTransaction from './components/CurrentTransaction.vue';
import CurrentFundRequest from './components/CurrentFundRequest.vue';
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
    <!-- Total Expense -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="8">
      <TotalExpense />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Current Transaction -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="4">
      <CurrentTransaction />
    </v-col>
    
    <!-- -------------------------------------------------------------------- -->
    <!-- Current Fund Request -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="4">
      <CurrentFundRequest />
    </v-col>
  </v-row>
</template>
