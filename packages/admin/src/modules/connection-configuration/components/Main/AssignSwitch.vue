<template>
  <v-responsive :max-width="250" class="custom-switch">
    <v-switch
      v-model="value"
      class="ml-4 mt-1"
      hide-details
      :readonly="isBtnAccess('basic:connection:edit')"
      dense
      @click="handleChangeValue"
      :disabled="!isBtnAccess('basic:connection:edit')"
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
      return this.params.that.init;
    },
  },
  watch: {
    curRowinfo: {
      handler() {
        this.value = this.curRowinfo[this.field] === '1';
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('connectionConfiguration', ['updateConnection']),
    async handleChangeValue() {
      if (!this.isBtnAccess('basic:connection:edit')) {
        return;
      }
      if (
        !(await this.$root.$confirm.open(
          this.$t('dialog.changerecord'),
          this.$t('dialog.activechangeconfirm'),
        ))
      ) {
        return;
      }
      this.value = !this.value;
      const { connectionId } = this.curRowinfo;
      const payload = {
        connectionId,
        [this.field]: this.value ? '1' : '0', // 是否启用
      };
      const result = await this.updateConnection(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
      this.init();
    },
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
