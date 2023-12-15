<template>
  <v-responsive :max-width="250" class="custom-switch">
    <v-switch
      v-model="value"
      class="ml-4 mt-1"
      hide-details
      :readonly="isBtnAccess('system:post:edit')"
      dense
      @click="handleChangeValue"
      :disabled="!isBtnAccess('system:post:edit')"
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
        this.value = this.curRowinfo[this.field] === '0';
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('positionManagement', ['updatePosition']),
    async handleChangeValue() {
      if (!this.isBtnAccess('system:post:edit')) {
        return;
      }
      if (
        !(await this.$root.$confirm.open(
          this.$t('dialog.tips'),
          this.$t(`positionManagement.dialog.${this.value ? 'postDisabledConfirm' : 'postEnabledConfirm'}`),
        ))
      ) {
        return;
      }
      const detailObj = {
        ...this.curRowinfo,
      };
      delete detailObj.no;
      delete detailObj.id;
      const payload = {
        ...detailObj,
        [this.field]: this.value ? '1' : '0', // 是否启用
      };
      const result = await this.updatePosition(payload);
      if (result) {
        this.value = !this.value;
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.init();
      }
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
