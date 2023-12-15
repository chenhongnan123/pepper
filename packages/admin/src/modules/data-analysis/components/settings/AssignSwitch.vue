<template>
  <v-responsive :max-width="250" class="custom-switch">
    <v-switch
      v-model="value"
      class="ml-4 mt-1"
      hide-details
      :readonly="true"
      dense
      @click="handleChangeValue"
      :disabled="false"
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
    ...mapActions('communicationMode', ['updateCommunicationMode']),
    async handleChangeValue() {
      // if (!this.isBtnAccess('connectionConfiguration_main_active')) {
      //   return;
      // }
      if (
        !(await this.$root.$confirm.open(
          this.$t('dialog.changerecord'),
          this.$t('dialog.activechangeconfirm'),
        ))
      ) {
        return;
      }
      this.value = !this.value;
      const detailObj = {
        ...this.curRowinfo,
      };
      delete detailObj.no;
      delete detailObj.id;
      const payload = {
        ...detailObj,
        [this.field]: this.value ? 'Y' : 'N', // 是否启用
      };
      const result = await this.updateCommunicationMode(payload);
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
