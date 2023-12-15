<template>
  <div>
    <v-switch
      v-model="status"
      color="primary"
      @click="handleSwitch"
      class="mt-0"
      readonly
      :disabled="!isBtnAccess('system:role:edit')"
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
    // console.log(this.params);
    const { params } = this;
    this.status = params && (params.value === '0');
  },
  components: {
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
  },
  methods: {
    ...mapActions('roleManagement', [
      'changeStatus',
    ]),
    async handleSwitch() {
      if (!this.isBtnAccess('system:role:edit')) { return; }
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t(`roleManagement.dialog.${!this.status ? 'roleEnableConfirm' : 'roleDisableConfirm'}`),
      )) {
        const { params, status } = this;
        const payload = {
          ...params.data,
          // status为0是启用状态，switch值为true，为1是停用状态，switch值为false
          // switch设置了readonly属性，所以赋值要反着来
          status: status ? '1' : '0',
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
