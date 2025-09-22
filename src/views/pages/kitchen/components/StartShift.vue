<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useDisplay } from 'vuetify'

import { formatRupiahInput, formatRupiahInputR } from '@/utils/helpers/currency'
import { useUserStore } from '@/stores/authUser'
import { useShift } from '@/composables/useShift'

import type { StartShiftKitchenPayload } from '@/types/shift'
import { useMenu } from '@/composables/useMenuItems'
import ScrollContainer from '@/components/shared/ScrollContainer.vue'
import { cloneDeep } from 'lodash'
import { useBranchList } from '@/composables/useBranchList'

const { mdAndUp } = useDisplay()
const userStore = useUserStore()
const { startKitchen, loading: loadingShift } = useShift()
const { load: loadMenu, data: data_menu, categories, loading: loadingMenu } = useMenu()
const { load: loadBranch, data: branches, loading: lb } = useBranchList();

onMounted(() => {
  loadMenu(userStore.me?.assigned_branch?.id)
  loadBranch()
})

const props = defineProps<{
  confirmBeforeClose: boolean
  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
  refresh: () => void
}>()

const emit = defineEmits(['close'])

const payload = ref<{[K in keyof StartShiftKitchenPayload]: StartShiftKitchenPayload[K] | null}>({
  branch_id: userStore.me?.assigned_branch?.id || null,
  initial_menu: null,
})

const formRef = ref()
const isFormValid = ref(false)

const rules = {
  required: [(v: any) => !!v || 'Wajib diisi'],
  positive: [(v: any) => v !== 0 || 'Harus lebih dari 0'],
}

const isChanged = computed(() => {
  return (
    payload.value.initial_menu?.some((item, index) => {
      const originalItem = data_menu.value[index];
      return item.quantity > 0}) ||
    payload.value.branch_id !== userStore.me?.activity?.branch?.id
  )
})

watchEffect(() => {
  console.log('isChanged', isChanged.value)
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})

function clearPayload() {
  payload.value = {
    branch_id: null,
    initial_menu: null,
  }
  formRef.value?.resetValidation()
}

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processSubmit()
  })
}

async function processSubmit() {
  try {
    await startKitchen({
      branch_id: payload.value.branch_id!,
      initial_menu: payload.value.initial_menu!
    })
    if (typeof props.onIsChangedUpdate === 'function') {
      props.onIsChangedUpdate(false)
    }
    props.refresh()
    clearPayload()
    emit('close')
  } catch (error) {
    console.log(error)
  }
}

watch(data_menu, () => {
  if (data_menu.value.length > 0) {
    const data = cloneDeep(data_menu.value)
    payload.value.initial_menu = data.map((item) => ({ id: item.id, quantity: 0 }))
  }
})

watch(
  () => payload.value.branch_id,
  (newVal) => {
    if (newVal) {
      loadMenu(newVal)
    }
  }
)
</script>

<template>
  <v-card 
    class="rounded-lg pa-0 height-screen"
    :style="mdAndUp ? 'width: clamp(0px, 90dvw, 500px)' : 'width: clamp(0px, 90dvw, 320px)'"
    style="overflow-y: auto; max-height: 90vh;"
  >
    <v-card-text>
      <div
        style="position: absolute; top: 8px; right: 12px; font-size: 20px; cursor: pointer;"
        @click="emit('close')"
      >
        ×
      </div>

      <h4 class="text-h4 mt-1 mb-1">Mulai Shift Dapur</h4>
      
      <v-form ref="formRef" v-model="isFormValid" lazy-validation @submit.prevent="submitForm">
        <v-divider class="my-4"></v-divider>
        <v-row>
          <!-- selector branch berdasarkan assigned branch -->
          <v-col cols="12">
            <v-select
              v-model="payload.branch_id"
              :items="branches"
              :disabled="lb || !userStore.hasRole(['admin', 'pemilik'])"
              :loading=lb
              prepend-icon="mdi-home"
              item-title="name"
              item-value="id"
              label="Cabang"
              variant="underlined"
              :rules="[...rules.required]"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <div>
              <h4 class="text-h4 font-weight-medium mb-4">Stok Menu Awal:</h4>
            </div>
            <ScrollContainer :maxHeight="'50dvh'" @scroll.@click.stop @touchend.@click.stop>
              <v-list>
                <div v-if="loadingMenu" class="text-center my-4">
                  <v-progress-circular indeterminate color="warning" height="1"></v-progress-circular>
                </div>
                <div v-else-if="!data_menu.length" class="text-center text-subtitle-2 text-disabled my-4">Data Menu tidak ditemukan</div>
                <v-list-item
                  v-else
                  v-for="(item, index) in data_menu"
                  :key="index"
                  class="pa-0 ps-2"
                >
                  <v-divider v-if="index > 0" class="my-2"></v-divider>
                  <v-row no-gutters class="align-center justify-space-between">
                    <v-col cols="auto">
                      <h4 class="text-h4 font-weight-medium" style="overflow: scroll; scrollbar-width: none; white-space: nowrap;">
                        {{ item.name }}
                      </h4>
                    </v-col>
                    <v-col cols="3">
                      <v-number-input
                        control-variant="hidden"
                        v-model="payload.initial_menu![index].quantity"
                        variant="outlined"
                        :min="0"
                        hide-details
                        single-line
                        inset
                        density="compact"
                      />
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </ScrollContainer>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn class="mr-2" variant="plain" @click="emit('close')">
              Batal
            </v-btn>
            <v-btn
              :loading="loadingShift"
              :disabled="!isFormValid"
              color="warning"
              type="submit"
            >
              Simpan
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>