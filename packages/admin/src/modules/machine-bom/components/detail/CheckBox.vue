<template>
  <div>
    <template>
      <div class="custom-checkbox">
        <v-checkbox
          v-model="checked"
          hide-details
          dense
          disabled
        ></v-checkbox>
      </div>
    </template>
  </div>
</template>

<script>

export default {
  name: 'CheckBox',
  data() {
    return {
    };
  },
  computed: {
    item() {
      return this.params.data;
    },
    field() {
      return this.params.field;
    },
    checked() {
      return this.item[this.field] === '1';
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
