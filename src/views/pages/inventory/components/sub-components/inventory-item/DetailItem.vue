<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';

import Blank from '@/components/shared/Blank.vue';
import { useInventoryItems } from '@/composables/useInventoryItems';
import type { CreateInventoryItemPayload, InventoryItem, UpdateInventoryItemPayload } from '@/types/inventory';
import type { IdName } from '@/types/common';
import { formatDate } from '@/utils/helpers/format-date';
import { formatRupiah, formatRupiahInput, formatRupiahInputR } from '@/utils/helpers/currency';

const { openOverlay } = useOverlayManager()
const { createItem, updateItem, deleteItem, loading: lm } = useInventoryItems()
const emit = defineEmits(['close'])

const props = defineProps<{
  data?: InventoryItem;
  categories: IdName[]
  is_create: boolean

  refresh: () => void

  isChanged?: boolean 
  onIsChangedUpdate?: (val: boolean) => void
}>()

const payload = ref<{[K in keyof CreateInventoryItemPayload]: CreateInventoryItemPayload[K] | null}>({
  name: props.is_create ? null : props.data?.name ?? null,
  description: props.is_create ? null : props.data?.description ?? null,
  unit: props.is_create ? null : props.data?.unit ?? null,
  purchase_price: props.is_create ? null : props.data?.purchase_price ?? null,
  threshold: props.is_create ? null : props.data?.threshold ?? null,
  category_id: props.is_create ? null : props.data?.category.id ?? null,
})

const formRef = ref()
const isFormValid = ref(false)

const purchase_price_raw = ref<string | null>(props.data ? formatRupiahInput(props.data.purchase_price) : null)

const inputDate = ref<Date | null>(props.data ? props.data.expired_date : null)
const expModal = ref(false)
const formattedDate = computed(() => inputDate.value ? formatDate(inputDate.value).split(' pukul')[0] : '')

const rules = {
  required_text: [(v: string) => !!v || 'Data tidak boleh kosong'],
  required_number: [(v: number) => !!v || 'Data tidak boleh kosong'],
  desc: [(v: string) => v.length <= 100 || 'Deskripsi maksimal 100 karakter'],
}

const isChanged = computed(() => {
  if (props.is_create) {
    return (
      !!payload.value.name ||
      !!payload.value.description ||
      !!payload.value.unit ||
      !!payload.value.purchase_price ||
      !!payload.value.threshold ||
      !!payload.value.category_id ||
      !!inputDate.value ||
      !!purchase_price_raw.value
    )
  } else {
    return (
      payload.value.name !== props.data?.name ||
      payload.value.description !== props.data?.description ||
      payload.value.unit !== props.data?.unit ||
      payload.value.purchase_price !== props.data?.purchase_price ||
      payload.value.threshold !== props.data?.threshold ||
      payload.value.category_id !== props.data?.category.id ||
      inputDate.value !== props.data?.expired_date
    )
  }
})

watchEffect(() => {
  const val = isChanged.value
  if (typeof props.onIsChangedUpdate === 'function') {
    props.onIsChangedUpdate(!!val)
  }
})

function submitForm() {
  formRef.value?.validate().then((res: boolean) => {
    if (!res) return
    processSubmit()
  })
}

async function processSubmit() {
  try {
    if (props.is_create) {
      await createItem(payload.value as CreateInventoryItemPayload)
      props.refresh()
    }
    else {
      const updatePayload: UpdateInventoryItemPayload = {
        id: props.data!.id,
        expired_date: inputDate.value,
        ...payload.value as CreateInventoryItemPayload
      }
      await updateItem(updatePayload)
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
    await deleteItem(props.data!.id)
    props.refresh()
    handleClose()
  } catch (error) {
    props.refresh()
    console.log(error)
    handleClose()
  }
}

function handleClose() {
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
    <v-btn
      icon
      class="position-absolute"
      variant="text"
      style="top: 8px; right: 12px;" 
      :disabled="lm"
      @click="handleClose()"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div class="d-flex align-center">
      <h4 class="text-h4 mt-1"> {{ is_create ? 'Tambah Item' : 'Detail Item' }} </h4>
    </div>
    <i class="text-subtitle-2 text-disabled"> {{ is_create ? '' : props.data?.id }} </i>

    <v-divider class="my-3" />

    <v-form ref="formRef" v-model="isFormValid">
      <v-row class="justify-center">
          <v-col :cols="(props.data && !props.data.is_new) ? 6 : 12">
            <v-select
              variant="underlined"
              v-model="payload.category_id"
              :items="props.categories.length > 0 ? props.categories : []"
              item-title="name"
              item-value="id"
              label="Kategori"
              prepend-icon="mdi-format-list-bulleted-type"
              :rules="rules.required_text"
              :return-object="false"
              hide-details
            />
          </v-col>
          <!-- expired date -->
          <v-col cols="6" v-if="props.data && !props.data.is_new">
            <v-text-field
              v-model="formattedDate"
              label="Tanggal Expired"
              prepend-icon="mdi-calendar"
              readonly
              :active="expModal"
              :focused="expModal"
              variant="underlined"
              :rules="rules.required_text"
            />
            <v-dialog
              v-model="expModal"
              activator="parent"
              transition="scale-transition"
              offset-y
              max-width="290"
              min-width="290"
            >
              <v-date-picker
                v-model="inputDate"
                @update:model-value="expModal = false"
                :min="new Date().toISOString().split('T')[0]"
                no-title
                scrollable
              />
            </v-dialog>
          </v-col>
          <v-col cols="6">
            <v-text-field
              variant="underlined"
              v-model="payload.name"
              label="Nama Barang"
              :rules="rules.required_text"
              prepend-icon="mdi-form-textbox"
            />
          </v-col>  
          <v-col cols="6">
            <v-text-field
              variant="underlined"
              v-model="purchase_price_raw"
              label="Harga Beli"
              :min="0"
              prefix="Rp"
              :rules="rules.required_number"
              prepend-icon="mdi-cash"
              @input="
                purchase_price_raw = formatRupiahInput(purchase_price_raw!),
                payload.purchase_price = formatRupiahInputR(purchase_price_raw)
              "
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="5">
            <v-combobox
              v-model="payload.unit"
              variant="underlined"
              :items="['pcs', 'kg', 'ltr', 'box']"
              label="Satuan"
              :rules="rules.required_text"
              prepend-icon="mdi-scale-balance"
            />
          </v-col>
          <v-col cols="7">
            <v-number-input
              v-model="payload.threshold"
              control-variant="split"
              variant="plain"
              label="Threshold"
              :min="0"
              :rules="rules.required_number"
              prepend-icon="mdi-alert"
              inset
            />
          </v-col>
        </v-row>

        <!-- quantity -->

        <v-row class="text-caption text-medium-emphasis">
          <v-col>
            <v-textarea
              v-model="payload.description"
              label="Deskripsi Barang: "
              :rules="rules.desc && rules.required_text"
              variant="underlined"
              prepend-icon="mdi-text-box"
              rows="2"
              auto-grow
              clearable
              counter
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
            variant="plain"
            class="mr-1 text-error"
            density="compact"
            :loading="lm"
            prepend-icon="mdi-delete"
            @click="
              openOverlay({
                component: Blank,
                props: {
                  confirmToContinue: true,
                  confirmMessage: 'Apakah anda yakin ingin menghapus item ini?',
                  onConfirm: () => {
                    processDelete()
                  }
                }
              })
            "
          >
            Hapus
          </v-btn>

          <span>
            <v-btn
              class="ms-2"
              color="primary"
              :loading="lm"
              :disabled="!isFormValid || !isChanged || lm"
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