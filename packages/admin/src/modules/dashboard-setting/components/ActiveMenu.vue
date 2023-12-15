<template>
  <div>
    <v-switch
      v-model="status"
      color="primary"
      @click="handleSwitch"
      class="mt-0"
      readonly
      hide-details
      :disabled="!isBtnAccess('basic:board:active')"
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
    // 1-启用 0-停用
    this.status = params && (params.value === '1');
  },
  components: {
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
    id() {
      const { params } = this;
      return params.data.id;
    },
  },
  methods: {
    ...mapActions('dashboardSetting', ['changeStatus']),
    async handleSwitch() {
      if (!this.isBtnAccess('basic:board:active')) { return; }
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t(`dashboardSetting.dialog.${!this.status ? 'boardEnableConfirm' : 'boardDisableConfirm'}`),
      )) {
        const { params, status, id } = this;
        const payload = {
          id,
          active: status ? '0' : '1', // 1-启用 0-停用
        };
        const result = await this.changeStatus(payload);
        if (result) {
          params.that.refresh();
        }
      }
    },
  },
};
</script>
