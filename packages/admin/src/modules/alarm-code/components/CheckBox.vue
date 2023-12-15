<template>
  <div>
    <template>
      <div class="custom-checkbox">
        <v-checkbox
          v-model="status"
          hide-details
          dense
          readonly
          @click="handleClick"
        ></v-checkbox>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'CheckBox',
  data() {
    return {
      status: false,
    };
  },
  created() {
    const { params } = this;
    this.status = params && params.data.joinScore === '1';
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    item() {
      return this.params.data;
    },
    alarmCodeId() {
      return this.item.alarmCodeId;
    },
  },
  methods: {
    ...mapActions('alarmCode', ['editAlarm']),
    async handleClick() {
      if (!this.isBtnAccess('maintenance_detail_edit')) {
        return;
      }
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.tips'),
          this.$t('maintenance.dialog.detailRequiredConfirm'),
        )
      ) {
        const {
          params: {
            that,
          },
          alarmCodeId,
          status,
        } = this;
        const payload = {
          alarmCodeId,
          joinScore: status ? '0' : '1',
        };
        const result = await this.editAlarm(payload);
        if (result) {
          that.getTableList();
        }
      }
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
