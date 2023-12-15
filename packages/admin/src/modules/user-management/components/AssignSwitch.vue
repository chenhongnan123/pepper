<template>
  <v-responsive :max-width="250" class="custom-switch">
    <v-switch
      v-model="value"
      class="ml-4 mt-1"
      hide-details
      :readonly="isBtnAccess('system:user:edit')"
      dense
      @click="handleChangeValue"
      :disabled="!isBtnAccess('system:user:edit')"
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
    ...mapActions('userManagement', ['changeStatus']),
    async handleChangeValue() {
      if (!this.isBtnAccess('system:user:edit')) {
        return;
      }
      if (
        !(await this.$root.$confirm.open(
          this.$t('dialog.tips'),
          this.$t(`userManagement.dialog.${this.value ? 'userDisabledConfirm' : 'userEnabledConfirm'}`),
        ))
      ) {
        return;
      }
      const { userId } = this.curRowinfo;
      const payload = {
        userId,
        [this.field]: this.value ? '1' : '0', // 是否启用
      };
      const result = await this.changeStatus(payload);
      if (result) {
        // 修改成功后再修改switch状态
        this.value = !this.value;
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        // 成功后刷新列表
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .custom-switch {
    ::v-deep .v-input--selection-controls {
      margin-top: 0px!important;
    }
  }
</style>
