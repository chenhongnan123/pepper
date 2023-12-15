<template>
  <div>
    <v-btn
      small
      text
      dense
      class="text-none"
      color="primary"
      @click="showDraw"
    >
      {{ $t('eventLog.btn.moreinfo') }}
    </v-btn>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'ActionBtn',
  data() {
    return {
      moreInfo: {},
    };
  },
  computed: {
    infoObj() {
      return this.params;
    },
  },
  methods: {
    ...mapMutations('eventLog', ['toggleDrawer']),
    showDraw() {
      this.infoObj.currowinfo.showInfo(this.infoObj.data);
    },
  },
};
</script>
