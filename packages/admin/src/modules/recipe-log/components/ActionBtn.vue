<template>
  <div>
    <v-btn
      class="mt-1"
      text
      small
      style="color: #0055c2; cursor: pointer"
      @click="showDialog"
    >
      {{ $t('btn.information') }}
    </v-btn>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'ActionBtn',
  data() {
    return {};
  },
  computed: {
    infoObj() {
      return this.params;
    },
  },
  methods: {
    ...mapMutations('eaLog', ['openDialog']),
    showDialog() {
      this.infoObj.currentRowInfo.showDialog(this.infoObj.data);
    },
  },
};
</script>
