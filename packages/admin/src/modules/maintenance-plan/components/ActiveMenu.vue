<template>
  <div>
    <v-switch
      v-model="status"
      color="primary"
      @click="handleSwitch"
      class="mt-0"
      readonly
      :disabled="!isBtnAccess('basic:maintenance_plan:edit')"
      hide-details
    ></v-switch>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      status: false,
    };
  },
  created() {
    const { params } = this;
    this.status = params && (params.value === '1');
  },
  components: {
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
  },
  methods: {
    ...mapActions('maintenancePlan', [
      'updateMaintenancePlanStatus',
    ]),
    async handleSwitch() {
      if (!this.isBtnAccess('basic:maintenance_plan:edit')) { return; }
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t(`maintenancePlan.dialog.${!this.status ? 'planEnableConfirm' : 'planDisableConfirm'}`),
      )) {
        const { params, status } = this;
        const payload = {
          // 0-禁用 1-启用
          status: status ? '0' : '1',
          id: params.data.id,
        };
        const result = await this.updateMaintenancePlanStatus(payload);
        if (result) {
          params.that.init();
        }
      }
    },
  },
};
</script>
