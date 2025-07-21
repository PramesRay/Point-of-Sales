<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { DataTableHeader } from 'vuetify'
import type { SortItem } from 'vuetify/lib/components/VDataTable/composables/sort';

const props = defineProps<{
  headers: DataTableHeader[]
  fetchData: (params: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    filters?: Record<string, any>
  }) => Promise<{ data: any[]; total: number }>
  searchable?: boolean
  pagination?: boolean // default true
}>()

const emit = defineEmits<{
  (e: 'row-click', value: any): void
  (e: 'update:filters', filters: Record<string, any>): void
}>()

// State
const page = ref<number>(1)
const itemsPerPage = ref<number>(10)
const search = ref<string>('')
const sortBy = ref<SortItem[]>([])
const filters = ref<Record<string, any>>({})

const items = ref<any[]>([])
const totalItems = ref<number>(0)
const loading = ref<boolean>(false)

// Handle fetch
const loadData = async () => {
  loading.value = true
  try {
    const sort = sortBy.value[0]
    const sortKey = sort?.key
    const sortDesc = sort?.order === 'desc'

    const { data, total } = await props.fetchData({
      page: !props.pagination ? undefined : page.value,
      limit: !props.pagination ? undefined : itemsPerPage.value,
      search: search.value,
      sortBy: sortKey,
      sortDesc,
      filters: filters.value,
    })

    items.value = data
    totalItems.value = total

    console.log('Data fetched:', items.value)
    console.log('Total items:', totalItems.value)
  } finally {
    loading.value = false
  }
}

watch([page, itemsPerPage, search, sortBy, filters], loadData, { deep: true })
onMounted(loadData)

// External update to filters
function updateFilters(newFilters: Record<string, any>) {
  filters.value = newFilters
  emit('update:filters', newFilters)
}

const renderColumn = (key: any, item: any) => {
  const keys = key.split('.'); // Split untuk menangani nested properties (misal 'branch.name')
  let value = item;
  keys.forEach((k: any) => {
    if (value) {
      value = value[k];
    }
  });
  return value || '-'; // Jika tidak ada nilai, return tanda "-"
};
</script>

<template>
  <div>
    <v-row class="mb-2 align-center">
      <v-col>
        <!-- Search -->
        <v-text-field
          v-if="searchable"
          v-model="search"
          placeholder="Cari"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          style="min-width: 14rem;"
        />
      </v-col>
      <v-col class="ml-auto" cols="auto">
        <slot name="append" />
      </v-col>

      <v-col>
        <span class="d-flex align-center justify-end ga-2">
          <!-- Filters slot -->
          <slot name="filters" :filters="filters" :update="updateFilters" />
        </span>
      </v-col>
    </v-row>
    <!-- Data Table -->
    <v-data-table-server
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-per-page="pagination === false ? totalItems : itemsPerPage"
      :page="pagination === false ? 1 : page"
      :sort-by="sortBy"
      :items-length="totalItems"
      :show-select="false"
      class="elevation-1 px-2"
      @click:row="(row: any) => emit('row-click', row)"
      @update:page="val => page = val"
      @update:items-per-page="val => { if (val === -1) itemsPerPage = totalItems; else itemsPerPage = val }"
      @update:sort-by="val => sortBy = val"
    >
      <template v-slot:item="{ item }">
        <tr class="cursor-pointer" @click="emit('row-click', item)">
          <td v-for="header in headers" :key="header.key">
            <slot :name="header.key" :item="item">{{ renderColumn(header.key, item) }}</slot>
          </td>
        </tr>
      </template>
    </v-data-table-server>
  </div>
</template>