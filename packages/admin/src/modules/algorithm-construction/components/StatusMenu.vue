<template>
  <div>
    <!-- :disabled="!isBtnAccess('processMonitor_main_active')" -->
    <v-switch
      v-model="status"
      color="primary"
      @click="handleSwitch"
      class="mt-0"
      readonly
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
    ...mapActions('algorithmConstruction', [
      'changeStatus',
    ]),
    async handleSwitch() {
      // if (!this.isBtnAccess('processMonitor_main_active')) { return; }
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t(`algorithmConstruction.dialog.${!this.status ? 'eventEnableConfirm' : 'eventDisableConfirm'}`),
      )) {
        const { params, status } = this;
        const { data } = params;
        if (data?.bomId) {
          const payload = {
            // 1-启用，0-禁用
            active: status ? '0' : '1',
            modelId: data?.id,
          };
          const result = await this.changeStatus(payload);
          if (result) {
            params.that.getTableList();
          }
        }
      }
    },
  },
};
</script>
