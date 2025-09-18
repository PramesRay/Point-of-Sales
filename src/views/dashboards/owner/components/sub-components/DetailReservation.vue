<script setup lang="ts">
import { defineProps, ref } from 'vue';

import { getTimeDiff } from "@/utils/helpers/time";

import { useOverlayManager } from '@/composables/non-services/useOverlayManager';
import { useUserStore } from '@/stores/authUser';

import Blank from '@/components/shared/Blank.vue';
import type { Reservation } from '@/types/reservation';
import type { IdName } from '@/types/common';
import { formatDate } from '@/utils/helpers/format-date';
import { useReservation } from '@/composables/useReservation';
import UpdateReservation from './UpdateReservation.vue';
import { useAlertStore } from '@/stores/alert';

const userStore = useUserStore();
const alertStore = useAlertStore()
const { openOverlay } = useOverlayManager()
const { approve, loading } = useReservation()

const emit = defineEmits(['close'])
const props = defineProps<{
  data: Reservation;
  branches: IdName[]
  refresh: () => void;
}>();

const copied = ref(false)

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  copied.value = true
}

const handleUpdate = () => {
  // if (userStore.me?.id !== props.data.meta.created_by.id) {
  //   alertStore.showAlert('Data Reservasi hanya dapat diubah oleh yang membuat', 'warning')
  // } else if (props.data.time < new Date()) {
  //   alertStore.showAlert('Data Reservasi sudah tidak dapat diubah', 'warning')
  // } else {
    openOverlay({
      component: UpdateReservation,
      props: {
        data: props.data,
        branches: props.branches,
        refresh: props.refresh
      }
    })
  // }
}
</script>

<template>
  <v-card 
      class="rounded-lg pa-6 mt-8 bg-white height-screen"
      style="width: clamp(340px, 90vw, 340px); overflow-y: auto; max-height: 95dvh; scrollbar-width: none;"
    >
      <!-- Close button -->
      <v-btn
        icon
        variant="text"
        style="position:absolute; top:8px; right:12px;" 
        @click="emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div class="d-flex align-center">
        <h4 class="text-h4">Detail Reservasi</h4>
        <v-btn 
          v-if="props.data?.status === 'Pending'"
          icon
          variant="plain"
          size="x-small"
          @click="handleUpdate"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </div>
      <i class="text-subtitle-2 text-disabled">{{ props.data?.id }}</i>
      <v-divider class="my-2"></v-divider>

      <div v-if="loading" class="text-center my-4">
        <v-progress-circular indeterminate color="primary" height="1"></v-progress-circular>
      </div>
      <div v-else>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <span class="font-weight-medium">
                  <v-icon size="small">mdi-store</v-icon>:
                  <span>{{ props.data?.branch.name }}</span>
                </span>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="7">
                <div class="mb-3">
                  <h4 class="text-secondary text-h4 font-weight-bold">
                    <v-btn
                      icon
                      variant="text"
                      size="x-small"
                    >
                      <v-icon size="x-large">mdi-account</v-icon>: 
                    </v-btn>
                    {{ props.data?.customer.name }}
                  </h4>
                  <div class="text-subtitle-2 text-medium-emphasis" >
                    <v-btn
                      icon
                      variant="text"
                      size="x-small"
                      :href="`https://wa.me/${props.data?.customer.phone}`"
                    >
                      <v-icon size="x-large">mdi-phone</v-icon>: 
                    </v-btn>
                    {{ props.data?.customer.phone }}
                    <v-btn
                      icon
                      variant="text"
                      size="x-small"
                      @click="copyToClipboard(props.data?.customer.phone ?? '')"
                    >
                      <v-icon>{{ copied ? 'mdi-clipboard-check-multiple-outline' : 'mdi-clipboard-multiple-outline'}}</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-col>
              <v-col cols="5">  
                <div class="text-right">
                  <div 
                  class="text-subtitle-2 text-medium-emphasis"
                  :class="{
                    'text-success': props.data?.status === 'Disetujui',
                    'text-error': props.data?.status === 'Ditolak',
                    'text-warning': props.data?.status === 'Pending'
                  }"
                >{{ props.data?.status }}</div>
                <h4 v-if="props.data?.meta.created_at" class="text-h4">{{ getTimeDiff(props.data?.meta.created_at) }}</h4>
                <i v-if="props.data?.meta.updated_at" class="text-subtitle-2 text-disabled">
                  Diubah {{ getTimeDiff(props.data?.meta.updated_at) }}
                </i>
              </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="mb-3">
                  <div class="text-subtitle-2 text-disabled">
                    <v-btn
                      icon
                      variant="text"
                      size="x-small"
                    >
                      <v-icon size="x-large">mdi-calendar</v-icon>: 
                    </v-btn>
                    {{ formatDate(props.data?.time).slice(0, -12) }}
                  </div>
                  <div class="text-subtitle-2 text-disabled">
                    <v-btn
                      icon
                      variant="text"
                      size="x-small"
                    >
                      <v-icon size="x-large">mdi-clock-outline</v-icon>: 
                    </v-btn>
                    {{ formatDate(props.data?.time).slice(-6) }}
                  </div>
                  <div class="text-subtitle-2 text-disabled">
                    <v-btn
                      icon
                      variant="text"
                      size="x-small"
                    >
                      <v-icon size="x-large">mdi-account-group</v-icon>: 
                    </v-btn>
                    {{ props.data?.people }} orang
                  </div>
                  <div class="mb-3">
                    <div class="text-subtitle-2 text-disabled">
                      <v-btn
                        icon
                        variant="text"
                        size="x-small"
                      >
                        <v-icon size="x-large">mdi-text</v-icon>: 
                      </v-btn>
                      {{ props.data?.notes }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        
        <div v-if="(userStore.hasRole(['admin', 'pemilik'])) && props.data?.status === 'Pending'">
          <v-divider class="my-3"></v-divider>
          <v-row class="d-flex justify-space-between align-center">
            <v-col>
              <v-btn 
                v-if="userStore.hasRole(['admin', 'pemilik'])"
                color="error"
                block
                prepend-icon="mdi-close-circle"
                :disabled="loading"
                :loading="loading"
                @click="
                  openOverlay({
                    component: Blank,
                    props: {
                      confirmToContinue: true,
                      confirmMessage: 'Apakah anda yakin ingin menolak reservasi ini?',
                      onConfirm: async () => {
                        await approve({
                          id: props.data?.id!,
                          approved: false,
                        }),
                        props.refresh()
                        emit('close')
                      }
                    },
                  })"
              >
                Tolak
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                v-if="userStore.hasRole(['admin', 'pemilik'])"
                color="success"
                block
                prepend-icon="mdi-check-circle"
                :disabled="loading"
                :loading="loading"
                @click="
                  openOverlay({
                    component: Blank,
                    props: {
                      confirmToContinue: true,
                      confirmMessage: 'Apakah anda yakin ingin menyetujui reservasi ini?',
                      onConfirm: async () => {
                        await approve({
                          id: props.data?.id!,
                          approved: true,
                        }),
                        props.refresh()
                        emit('close')
                      }
                    },
                  })
                "
              >
                Terima
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
</template>

<!-- styling untuk mengecilkan ukuran text dalam input -->
 <style>
.small-font {
  font-size: 0.7rem !important;
}

.small-font .v-icon {
  font-size: 1rem;
  align-self: center;
}

.small-font .v-label {
  font-size: 0.8rem;
}

.small-font .v-text-field input {
  font-size: 0.8rem;
}

.small-font .v-field__input {
  font-size: 0.8rem;
}

.table-number-input  {
  margin-top: -14px;
}

.text-area-custom .v-field__input{
  padding-top: 0 ;
  min-height: 0.7rem;
  mask-image: none;
}
</style>