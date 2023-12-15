<template>
  <div>
    <v-switch
      v-model="status"
      color="primary"
      @click="handleSwitch"
      class="mt-0"
      readonly
      :disabled="!isBtnAccess('basic:maintenance_schema:edit')"
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
    this.status = params && (params.data.status === '1');
  },
  components: {
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
  },
  methods: {
    ...mapActions('maintenance', [
      'updateMaintenance',
    ]),
    async handleSwitch() {
      if (!this.isBtnAccess('maintenance_main_active')) { return; }
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t(`maintenance.dialog.${!this.status ? 'maintenanceEnableConfirm' : 'maintenanceDisableConfirm'}`),
      )) {
        const { params, status } = this;
        const payload = {
          // status为1是启用状态，switch值为true，为0是停用状态，switch值为false
          status: status ? 0 : 1,
          id: params.data.id,
        };
        const result = await this.updateMaintenance(payload);
        if (result) {
          params.that.getTableList();
        }
      }
    },
  },
};
</script>
