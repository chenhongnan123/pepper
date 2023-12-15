<template>
  <v-overlay
      :value="loading"
      z-index="1000"
    >
      <v-progress-circular
        :size="100"
        :width="10"
        color="warning"
        indeterminate
        z-index="1000"
      >
      {{ $t('helper.loading') }}
      </v-progress-circular>
    </v-overlay>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PepperLoading',
  data() {
    return {
      // loading: false,
    };
  },
  computed: {
    ...mapState('helper', ['isPepperLoading']),
    loading() {
      return this.isPepperLoading;
    },
  },
};
</script>
