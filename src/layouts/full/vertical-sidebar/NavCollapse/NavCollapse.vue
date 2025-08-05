<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavItem from '../NavItem/NavItem.vue';
import Icon from '../IconSet.vue';

const props = defineProps({ item: Object, level: Number });

const isOpen = ref(false);
const router = useRouter();

function onTitleClick(event) {
  // Jangan toggle group, tapi navigasi ke halaman parent
  if (props.item.to) {
    router.push(props.item.to);
  }
}

// Mencegah event bubbling saat klik panah
function onArrowClick(event) {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <v-list-group
    v-model="isOpen"
    no-action
    :value="item.title"
    class="mb-1"
  >
    <!-- SLOT ACTIVATOR -->
    <template v-slot:activator="{ props: activatorProps }">
      <v-list-item
        v-bind="activatorProps"
        rounded
        @click.stop
        @click="onTitleClick"
        :disabled="item.disabled"
      >
        <!-- Icon -->
        <template v-slot:prepend>
          <Icon :item="item.icon" :level="level" />
        </template>

        <!-- Title -->
        <v-list-item-title class="mr-auto">{{ item.title }}</v-list-item-title>

        <!-- Subtitle (optional) -->
        <v-list-item-subtitle
          v-if="item.subCaption"
          class="text-caption mt-n1 hide-menu"
        >
          {{ item.subCaption }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>

    <!-- Children -->
    <template v-for="(subitem, i) in item.children" :key="i">
      <NavCollapse v-if="subitem.children" :item="subitem" :level="level + 1" />
      <NavItem v-else :item="subitem" :level="level + 1" />
    </template>
  </v-list-group>
</template>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s;
}
</style>