<template>
  <div>
    <v-simple-checkbox
      v-model="status"
      color="primary"
      readonly
      @click="handleSwitch"
      class="mt-1"
      :disabled="!isBtnAccess('processMonitor_main_isBoard')"
    ></v-simple-checkbox>
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
    // console.log(this.params);
    const { params } = this;
    this.status = params && (params.value === 'Y');
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
      'handleProcessMonitor',
    ]),
    async handleSwitch() {
      if (!this.isBtnAccess('processMonitor_main_isBoard')) { return; }
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t(`algorithmConstruction.dialog.${!this.status ? 'boardDisableConfirm' : 'boardEnableConfirm'}`),
      )) {
        const { params, status } = this;
        const payload = {
          ...params.data,
          enabledFlag: status ? 'Y' : 'N',
        };
        const result = await this.handleProcessMonitor({
          API_ROUTE_PATH: 'board/UpdateproControl',
          payload,
        });
        if (result) {
          params.that.getTableList();
        } else {
          this.status = !this.status;
        }
      } else {
        this.status = !this.status;
      }
    },
  },
};
</script>
