<template>
  <div>
    <v-btn
      small
      icon
      class="text-none"
      color="primary"
      rounded
      v-if="statusText === 'loading' || statusText === 'finish'"
      :disabled="statusText === 'loading'"
      @click="palyVideo"
    >
      <v-icon>mdi-eye-outline</v-icon>
    </v-btn>
    <v-btn
      small
      icon
      rounded
      class="text-none"
      color="primary"
      v-if="statusText === 'fail' && isBtnAccess('basic:record:reload')"
      @click="refreshVideo"
    >
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    statusText() {
      const {
        params: { data, field },
      } = this;
      const value = data[field];
      if (value === '0') {
        return 'loading';
      }
      if (value === '1') {
        return 'finish';
      }
      if (value === '2') {
        return 'fail';
      }
      return '-';
    },
  },
  methods: {
    palyVideo() {
      const {
        that,
        data,
      } = this.params;
      that.playVideo(data);
    },
    refreshVideo() {
      const {
        that,
        data,
      } = this.params;
      that.refreshVideo(data);
    },
  },
};
</script>
