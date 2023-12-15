<template>
  <div>
    <v-btn
      class="mt-n1"
      text
      small
      style="color: #0055c2; cursor: pointer;"
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
import LogDetailDialog from './LogDetailDialog.vue';

export default {
  name: 'ActionBtn',
  data() {
    return {
      detailDialog: false,
    };
  },
  computed: {
    detailObj() {
      const { params: { data } } = this;
      return data || {};
    },
  },
  components: {
    LogDetailDialog,
  },
  methods: {
  },
};
</script>
