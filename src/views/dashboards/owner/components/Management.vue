<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

import { formatRupiah } from '@/utils/helpers/currency'
import { useOverlayManager } from '@/composables/non-services/useOverlayManager'

import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import type { Employee } from '@/types/employee'
import type { IdName } from '@/types/common'
import type { Branch } from '@/types/branch'
import type { Menu } from '@/types/menu'
import DetailAccount from './sub-components/DetailAccount.vue'
import DetailBranch from './sub-components/DetailBranch.vue'
import DetailMenu from './sub-components/DetailMenu.vue'
import DetailCategory from './sub-components/DetailCategory.vue'
import type { Category } from '@/types/inventory'
import { useUserStore } from '@/stores/authUser'

const { mdAndUp } = useDisplay()
const { openOverlay } = useOverlayManager()
const user = useUserStore()

const emit = defineEmits(['menu-updated'])

const props = defineProps<{
  data_user: Employee[]
  data_branch: Branch[] 
  data_menu: Menu[]
  menu_categories: Category[]
  branch: IdName | undefined | null
  loading_user: boolean
  loading_branch: boolean
  loading_menu: boolean

  refresh_user: () => void
  refresh_branch: () => void
  refresh_menu: (id: string) => void
  refresh_category: () => void
}>()

const tab = ref<'user' | 'branch' | 'menu'>('user')
const selectedCtg = ref<string | null>('all')
const isChanged = ref(false)
const showCtg = ref(false)

const currentDataUsers = computed(() => {
  if (!props.branch || props.branch.id === 'all') {
    return props.data_user.filter((tx) => tx.uid !== user.me?.uid);
  } else {
    return props.data_user.filter(
      (tx) => tx.assigned_branch?.id == props.branch?.id && tx.uid !== user.me?.uid
    );
  }
})

const currentDataBranch = computed(() => {
  return props.data_branch;
})

const currentDataMenu = computed(() => {
  return props.data_menu
})

const currentDataCategories = computed(() => {
  return props.menu_categories
})

const categories = computed(() => {
  if (!props.menu_categories.length) return []
  return [{ id: 'all', name: 'Semua' }, ...props.menu_categories]
})

function handleAddNew() {
  if (tab.value === 'branch') {
    openOverlay({
      component: DetailBranch,
      props: {
        is_create: true,
        confirmBeforeClose: true,
        isChanged,
        refresh: props.refresh_branch
      },
    })
  } else if (tab.value === 'menu') {
    if(showCtg.value) {
      openOverlay({
        component: DetailCategory,
        props: {
          is_create: true,
          confirmBeforeClose: true,
          isChanged,
          refresh: props.refresh_category
        },
      })
    } else {
      openOverlay({
        component: DetailMenu,
        props: {
          is_create: true,
          confirmBeforeClose: true,
          isChanged,
          refresh: props.refresh_menu
        },
      })
    }
  }
}

</script>

<template>
  <v-card elevation="0">
    <v-card variant="outlined">
      <v-card-text>
        <v-row class="d-flex align-center">
          <v-col cols="7">
            <div>
              <h4 class="text-h4">Manajemen</h4>
              <span v-if="!props.loading_branch" class="text-subtitle-2 text-medium-emphasis">{{ (props.branch && tab !== 'branch') ? props.branch?.name : (tab === 'menu') ? props.branch?.name || currentDataBranch[0].name  : 'Semua Cabang' }}</span>
            </div>
          </v-col>
          <v-col cols="5" class="d-flex justify-end align-center" v-if="!(props.loading_user || props.loading_branch || props.loading_menu)">
              <v-btn
                v-if="tab === 'menu'"
                icon
                variant="text"
                class="mr-1"
                size="small"
                @click="showCtg = !showCtg"
              >
                <v-icon opacity="0.4" size="large">mdi-format-list-bulleted-type</v-icon>
              </v-btn>
              <v-btn
                v-if="tab !== 'user'"
                :color="tab === 'branch' ? 'success' : showCtg ? 'lightwarning' :'warning'"
                @click="handleAddNew()"
              >
                Tambah
              </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="(props.loading_user && props.loading_branch && props.loading_menu)">
          <v-col cols="12" class="ml-auto">
            <v-skeleton-loader
              type="list-item-two-line"
              :loading="props.loading_user && props.loading_branch && props.loading_menu"
            />
          </v-col>
        </v-row>

        <div v-else>
          <v-row class="justify-center align-center">
            <v-col cols="12" class="text-center my-2">
              <v-btn-toggle
                v-model="tab"
                variant="outlined"
                mandatory
                color="primary"
              >
                <v-btn color="primary" :value="'user'" >
                  Akun
                </v-btn>
                <v-btn color="success" :value="'branch'">
                  Restoran
                </v-btn>
                <v-btn :color="showCtg ? '':'warning'" :value="'menu'">
                  {{ tab === 'menu' && showCtg ? 'Kategori' : 'Menu'}}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
  
          <ScrollContainer :maxHeight="mdAndUp ? '23rem' : '18rem'">
            <v-list lines="two" class="py-0" v-if="tab === 'user'">
              <div v-if="props.loading_user" class="text-center my-4">
                <v-progress-circular indeterminate color="primary" height="1"></v-progress-circular>
              </div>
              <v-list-item 
                v-else
                v-for="(data, i) in currentDataUsers" 
                :key="i" 
                :value="data" 
                rounded="sm" 
                @click="
                  openOverlay({
                    component: DetailAccount,
                    props: { 
                      data: data,
                      confirmBeforeClose: true,
                      isChanged,
                      refresh: props.refresh_user
                    },
                  })
                "
              >
                <v-divider v-if="i > 0" class="mb-4"></v-divider>
                <v-row no-gutters class="align-center">
                  <v-col cols="auto">
                    <div class="d-flex justify-center">
                      <v-btn
                      v-if="!data.role"
                      size="small"
                      variant="outlined"
                      class="text-subtitle-2 text-medium-emphasis"
                      >
                      Perlu Verifikasi
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="auto" class="pr-2">
                  <h6 class="text-h4 text-medium-emphasis font-weight-bold" style="max-width: 150px; overflow: hidden;">
                    {{ data.name }}
                  </h6>
                  <span class="text-subtitle-2 text-medium-emphasis" v-if="data.role">{{ data.role }}</span>
                  <i class="text-subtitle-2 text-medium-emphasis">{{ data?.email }}</i>
                  </v-col>
                </v-row>
              </v-list-item>
              <div v-if="!currentDataUsers.length" class="text-center text-subtitle-2 text-disabled py-4">Tidak ada Akun</div>
            </v-list>
  
            <v-list v-else-if="tab === 'branch'">
              <div v-if="props.loading_branch" class="text-center my-4">
              <v-progress-circular indeterminate color="success" height="1"></v-progress-circular>
              </div>
              <v-list-item 
                v-else
                v-for="(data, index) in currentDataBranch"
                :key="index"
                rounded="sm" 
                @click="
                  openOverlay({
                    component: DetailBranch,
                    props: { 
                      data: data,
                      confirmBeforeClose: true,
                      isChanged,
                      refresh: props.refresh_branch
                    },
                  })
                "
              >
                <v-divider v-if="index > 0" class="mb-1"></v-divider>
                <v-row no-gutters class="py-2 align-center">
                  <v-col cols="7">
                    <h4 class="text-h4 text-medium-emphasis font-weight-bold">
                      {{ data.name }}
                    </h4>
                    <div
                      style="max-height: 3rem; overflow: auto; scrollbar-width: none;"
                    >
                      <i class="text-subtitle-2 text-disabled">
                        {{ data.description || '-' }}
                      </i>
                    </div>
                  </v-col>
                  <v-col cols="5" class="">
                    <div class="text-subtitle-2 font-weight-medium text-medium-emphasis text-right">
                      Buka: {{ data.operational.open_time }}
                    </div>
                    <div class="text-subtitle-2 font-weight-medium text-medium-emphasis text-right">
                      Tutup: {{ data.operational.close_time }}
                    </div>
                  </v-col>
                </v-row>
              </v-list-item>
              <div v-if="!currentDataBranch.length" class="text-center text-subtitle-2 text-disabled py-4">Tidak ada Restoran</div>
            </v-list>
            
            <v-list v-else-if="tab === 'menu'">
              <div v-if="props.loading_menu" class="text-center my-4">
              <v-progress-circular indeterminate color="warning" height="1"></v-progress-circular>
              </div>
              <div v-else-if="!props.loading_menu && !showCtg">
                <v-select
                  v-if="props.menu_categories.length > 0"
                  color="primary"
                  variant="outlined"
                  class="mb-2"
                  hide-details
                  v-model="selectedCtg"
                  :items="categories"
                  item-title="name"
                  item-value="id"
                  label="Pilih Kategori"
                  :return-object="false"
                  single-line
                />
    
                <v-list-item 
                  v-for="(data, index) in (selectedCtg === 'all' ? currentDataMenu : currentDataMenu.filter(menu => menu.category.id === selectedCtg))"
                  :key="index"
                  rounded="sm" 
                  @click="
                    openOverlay({
                      component: DetailMenu,
                      props: { 
                        data: data,
                        confirmBeforeClose: true,
                        isChanged,
                        refresh: props.refresh_menu
                      },
                    })
                  "
                >
                  <v-divider v-if="index > 0" class="mb-1"></v-divider>
                  <v-row no-gutters class="py-2 align-center">
                    <v-col cols="7">
                      <h4 class="text-h4 text-medium-emphasis font-weight-bold">
                        {{ data.name }}
                      </h4>
                      <div
                        style="max-height: 3rem; overflow: auto; scrollbar-width: none;"
                      >
                        <i class="text-subtitle-2 text-disabled">
                          {{ data.description || '-' }}
                        </i>
                      </div>
                    </v-col>
                    <v-col cols="5">
                      <div class="text-subtitle-1 font-weight-medium text-medium-emphasis text-right">
                        {{ formatRupiah(data.price) }}
                      </div>
                    </v-col>
                  </v-row>
                </v-list-item>
                <div v-if="!currentDataMenu.length" class="text-center text-subtitle-2 text-disabled py-4">Tidak ada Menu</div>
              </div>
              <div v-else>
                <v-list-item
                  v-for="(data, i) in currentDataCategories"
                  :key="i"
                  :value="data"
                  rounded="sm"
                  @click="
                    openOverlay({
                      component: DetailCategory,
                      props: { 
                        data: data,
                        confirmBeforeClose: true,
                        isChanged,
                        refresh: props.refresh_category
                      },
                    })
                  "
                >
                  <v-divider v-if="i > 0" class="mb-2"></v-divider>
                  <div class="d-flex justify-space-between w-100">
                    <div class="pe-4" style="flex: 1">
                      <h6 class="text-h4 text-medium-emphasis font-weight-bold">
                        {{ data?.name }}
                      </h6>
                      <div style="height: fit-content; max-height: 3rem; overflow: auto; scrollbar-width: none;" @wheel.stop @touchmove.stop @scroll.stop>
                        <i class="text-subtitle-2 text-disabled">
                          {{ data?.description || '-'}}
                        </i>
                      </div>
                    </div>
                  </div>
                </v-list-item>
                <div v-if="!categories.length" class="text-center text-subtitle-2 text-disabled py-4">Tidak ada Kategori</div>
              </div>
            </v-list>
          </ScrollContainer>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>