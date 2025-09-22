<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'

import { useBranchList } from '@/composables/useBranchList';
import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import Blank from '@/components/shared/Blank.vue';
import type { CreateMenuPayload, Menu, UpdateMenuPayload } from '@/types/menu';
import { useMenu } from '@/composables/useMenuItems';
import { formatRupiahInput, formatRupiahInputR } from '@/utils/helpers/currency';
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore()

const { openOverlay } = useOverlayManager()

const props = defineProps<{
  data?: Menu;
  is_create: boolean

  refresh: () => void

  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
}>()

const emit = defineEmits(['close'])

const { data: branchData, load: loadBranch, loading: lb } = useBranchList()
const { loadCategory: loadCategory, create, update, remove, categories, loading: lm } = useMenu()

onMounted(() => {
  loadBranch()
  loadCategory()
})

const payload = ref<{[K in keyof CreateMenuPayload]: CreateMenuPayload[K] | null}>({
  name: props.is_create ? null : props.data?.name ?? null,
  description: props.is_create ? null : props.data?.description ?? null,
  threshold: props.is_create ? null : props.data?.threshold ?? null,
  price: props.is_create ? null : props.data?.price ?? null,
  category_id: props.is_create ? null : props.data?.category.id ?? null,
  branch: props.is_create ? null : props.data?.branch.id ? [props.data.branch.id] : null,
})

const formRef = ref()
const isFormValid = ref(false)
const priceRaw = ref(props.data?.price !== undefined ? formatRupiahInput(props.data?.price) : '');

const rules = {
  required: [(v: string) => !!v || 'Data tidak boleh kosing'],
  required_number: [(v: number) => !!v || 'Data tidak boleh kosing'],
  required_array: [(v: any) => v.length > 0 || 'Data tidak boleh kosing'],
  positive: [(v: any) => v > 0 || 'Harus lebih dari 0'],
}

const isChanged = computed(() => {
  if (props.is_create) {
    return (
      payload.value.name !== null ||
      payload.value.description !== null ||
      payload.value.price !== null ||
      payload.value.category_id !== null ||
      payload.value.branch?.length !== null
    )
  } else {
    return (
      payload.value.name !== props.data?.name ||
      payload.value.description !== props.data?.description ||
      payload.value.price !== props.data?.price ||
      payload.value.category_id !== props.data?.category.id ||
      (payload.value.branch && payload.value.branch[0]?.toString() !== props.data?.branch.id)
    )
  }
})

watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})

function clearPayload() {
  if (props.is_create) {
    payload.value = {
      name: null,
      description: null,
      threshold: null,
      price: null,
      category_id: null,
      branch: null
    }
  } else {
    payload.value = {
      name: props.data?.name ?? null,
      description: props.data?.description ?? null,
      threshold: props.data?.threshold ?? null,
      price: props.data?.price ?? null,
      category_id: props.data?.category.id ?? null,
      branch: props.data?.branch.id ? [props.data.branch.id] : null
    }
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
    if (props.is_create) {
      await create(payload.value as CreateMenuPayload)
      alertStore.showAlert('Berhasil menambahkan menu', 'success')
      props.refresh()
    }
    else {
      const updatePayload: UpdateMenuPayload = {
        id: props.data!.id,
        name: payload.value.name!,
        threshold: payload.value.threshold!,
        description: payload.value.description!,
        price: payload.value.price!,
        category_id: payload.value.category_id!,
        branch_id: payload.value.branch![0]
      }
      await update(updatePayload)
      alertStore.showAlert('Berhasil memperbarui menu', 'success')
      props.refresh()
    }
    handleClose()
  } catch (error) {
    props.refresh()
    console.log(error)
    handleClose()
  }
}

async function processDelete() {
  try {
    await remove(props.data!.id)
    props.refresh()
    handleClose()
  } catch (error) {
    props.refresh()
    console.log(error)
    handleClose()
  }
}

function handleClose() {
  clearPayload()
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(false)
  }
  emit('close')
}

</script>

<template>
  <v-card 
    class="rounded-lg pa-6 mt-8 bg-white" 
    style="width: clamp(0px, 90dvw, 400px); overflow-y: auto; max-height: 90vh;"
  >
    <v-btn icon class="position-absolute" variant="text" style="top: 8px; right: 12px;" @click="emit('close')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div class="d-flex align-center">
      <h4 class="text-h4 mt-1"> {{ is_create ? 'Tambah Menu' : 'Detail Menu' }} </h4>
    </div>
    <i class="text-subtitle-2 text-disabled"> {{ is_create ? '' : props.data?.id }} </i>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid">
      <v-row class="justify-center" no-gutters>
        <v-col cols="12">
          <v-text-field
            v-model="payload.name"
            label="Nama"
            variant="underlined"
            prepend-icon="mdi-food"
            :rules="rules.required"
          />
        </v-col>  
        <v-col cols="12">
          <v-text-field
            v-model="payload.description"
            label="Deskripsi"
            variant="underlined"
            prepend-icon="mdi-text"
          />
        </v-col>  
        <v-col cols="6">
          <v-text-field
            v-model="priceRaw"
            label="Harga"
            variant="underlined"
            prepend-icon="mdi-cash"
            prefix="Rp"
            :rules="rules.required"
            @input="
              priceRaw = formatRupiahInput(priceRaw),
              payload.price = formatRupiahInputR(priceRaw)
            "
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="payload.category_id"
            :loading="lm"
            :disabled="lm"
            :items="categories"
            item-title="name"
            item-value="id"
            label="Kategori"
            :return-object="false"
            variant="underlined"
            prepend-icon="mdi-format-list-bulleted-type"
            :rules="rules.required"
          />
        </v-col>
        <v-col cols="7" class="pe-4">
          <v-autocomplete
            v-model="payload.branch"
            label="Cabang"
            variant="underlined"
            prepend-icon="mdi-home"
            :items="branchData"
            :loading="lb"
            :disabled="lb"
            item-title="name"
            item-value="id"
            :multiple="props.data?.branch.id ? false : true"
            :rules="[...rules.required, ...rules.required_array]"
            :return-object="false"
          >
            <template v-slot:selection="{ item, index }" v-if="!props.data?.branch.id">
              <v-chip v-if="index < 2" :text="item.title"></v-chip>

              <span
                v-if="payload.branch && index === 2"
                class="text-grey text-caption align-self-center"
              >
                (+{{ payload.branch?.length - 2 }} lainnya)
              </span>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="5">
          <v-number-input 
            v-model="payload.threshold" 
            label="Threshold"
            control-variant="split"
            variant="plain"
            :min="1" 
            :rules="rules.positive"
            single-line
          />
        </v-col>
      </v-row>

      <v-divider class="my-3" />
      
      <div>
        <div 
          class="d-flex align-center justify-end mt-1"
          :class="is_create ? 'justify-end' : 'justify-space-between'"
        >
          <!-- delete button -->
          <v-btn
            v-if="!is_create"
            icon
            variant="text"
            class="mr-1 text-error"
            density="compact"
            :loading="lm"
            @click="
              openOverlay({
                component: Blank,
                props: {
                  confirmToContinue: true,
                  confirmMessage: 'Apakah anda yakin ingin menghapus akun ini?',
                  onConfirm: () => {
                    processDelete()
                  }
                }
              })
            "
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>

          <span>
            <v-btn
              variant="plain"
              :disabled="lm"
              @click="emit('close')"
            >
              Batal
            </v-btn>
            <v-btn
              class="ms-2"
              color="primary"
              :loading="lm"
              :disabled="!isFormValid || !isChanged"
              @click="submitForm"
            >
              Simpan
            </v-btn>
          </span>
        </div>
      </div>
    </v-form>
  </v-card>
</template>