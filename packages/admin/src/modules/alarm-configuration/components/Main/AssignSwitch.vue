<template>
  <v-responsive :max-width="250" class="custom-switch">
    <v-switch
      v-model="value"
      class="ml-4 mt-1"
      hide-details
      :readonly="true"
      dense
      :disabled="true"
    ></v-switch>
  </v-responsive>
</template>

<script>
import {
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';

export default {
  name: 'AssignSwitch',
  data() {
    return {
      value: true,
    };
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    curRowinfo() {
      return this.params.data;
    },
    field() {
      return this.params.field;
    },
    init() {
      return this.params.init;
    },
  },
  watch: {
    curRowinfo: {
      handler() {
        this.value = this.curRowinfo[this.field] === 'Y';
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('communicationConnection', []),
  },
};
</script>

<style lang="scss" scoped>
  .custom-switch {
    ::v-deep .v-input--selection-controls {
      margin-top: -2px!important;
    }
  }
</style>
