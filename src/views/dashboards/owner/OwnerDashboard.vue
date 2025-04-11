<script setup lang="ts">
// imported components
import EmployeeActive from './components/EmployeeActive.vue';
import TotalOrder from '@/views/dashboards/default/components/TotalOrder.vue';
import Timesheets from './components/Timesheets.vue';
// import CurrentReservation from './components/CurrentReservation.vue';

</script>

<template>
  <v-row>
    <!-- -------------------------------------------------------------------- -->
    <!-- Employee Active -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <EmployeeActive />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Order -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalOrder />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Timesheets -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <Timesheets />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Current Reservation -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="8">
      <CurrentReservation />
    </v-col>
  </v-row>
</template>
