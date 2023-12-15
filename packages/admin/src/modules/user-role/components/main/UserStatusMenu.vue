<template>
  <div>
    <v-switch
      v-model="status"
      color="primary"
      @click="handleSwitch"
      class="mt-2"
      readonly
      :disabled="!isBtnAccess('userRole')"
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
    this.status = params && (params.value === 0);
  },
  components: {
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
  },
  methods: {
    ...mapActions('userRole', [
      'updateUserStatus',
    ]),
    async handleSwitch() {
      if (!this.isBtnAccess('userRole')) { return; }
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t(`userRole.dialog.${!this.status ? 'userEnableConfirm' : 'userDisableConfirm'}`),
      )) {
        const { params, status } = this;
        const payload = {
          // status为0是启用状态，switch值为true，为1是停用状态，switch值为false
          // switch设置了readonly属性，所以赋值要反着来
          status: status ? 1 : 0,
          id: params.data.id,
        };
        const result = await this.updateUserStatus({ payload });
        if (result) {
          params.that.getTableList();
        }
      }
    },
  },
};
</script>
