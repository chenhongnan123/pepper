<template>
  <div class="custom-checkbox">
    <v-checkbox v-model="value" hide-details dense disabled></v-checkbox>
  </div>
</template>

<script>

export default {
  name: 'CheckBox',
  data() {
    return {};
  },
  computed: {
    curRowinfo() {
      return this.params.data;
    },
    field() {
      return this.params.field;
    },
    value() {
      return this.curRowinfo[this.field] === '1';
    },
  },
};
</script>

<style lang="scss" scoped>
  .custom-checkbox {
    ::v-deep .v-input--selection-controls {
      margin-top: -2px!important;
    }
  }
</style>
