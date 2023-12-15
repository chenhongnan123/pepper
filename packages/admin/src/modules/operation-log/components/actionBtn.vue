<template>
  <div>
    <v-btn
      color="primary"
      class="mt-n1"
      x-small
      style="background-color: transparent;"
      outlined
      @click="detailDialog = true"
    >
      {{ $t('btn.information') }}
    </v-btn>
    <log-detail-dialog
      :detailDialog="detailDialog"
      @closeDialog="detailDialog = false"
      :detail="detailObj"
    />
  </div>
</template>

<script>

import logDetailDialog from './logDetailDialog.vue';

export default {
  name: 'actionBtn',
  data() {
    return {
      detailDialog: false,
    };
  },
  components: {
    logDetailDialog,
  },
  computed: {
    detailObj() {
      const { params: { data } } = this;
      return data || {};
    },
  },
  methods: {
  },
};
</script>
