<template>
  <div>
    <template>
      <div class="custom-checkbox">
        <v-checkbox
          v-model="checked"
          hide-details
          :readonly="true"
          dense
          @change="updateAlarm"
          :disabled="false"
        ></v-checkbox>
      </div>
    </template>
  </div>
</template>

<script>
import {
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';

export default {
  name: 'CheckBox',
  data() {
    return {
      checked: true,
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
        this.checked = this.curRowinfo[this.field];
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('alarmConfiguration', [
      'updateParamMonitorAlarm',
    ]),
    async updateAlarm() {
      // if (!this.isBtnAccess('alarmConfiguration_main_active')) {
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
      this.checked = !this.value;
      const detailObj = {
        ...this.curRowinfo,
      };
      delete detailObj.no;
      delete detailObj.id;
      const payload = {
        ...detailObj,
        [this.field]: this.checked,
      };
      const result = await this.updateParamMonitorAlarm(payload);
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
  .custom-checkbox {
    ::v-deep .v-input--selection-controls {
      margin-top: -2px!important;
    }
  }
</style>
