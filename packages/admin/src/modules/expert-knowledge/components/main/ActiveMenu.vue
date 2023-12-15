<template>
  <div>
    <v-switch
      v-model="status"
      color="primary"
      @click="handleSwitch"
      class="mt-0"
      readonly
      :disabled="!isBtnAccess('basic:expertise:edit')"
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
    ...mapActions('expertKnowledge', [
      'updateExpertKnowledge',
    ]),
    async handleSwitch() {
      if (!this.isBtnAccess('basic:expertise:edit')) { return; }
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t(`expertKnowledge.dialog.${!this.status ? 'expertKnowledgeEnableConfirm' : 'expertKnowledgeDisableConfirm'}`),
      )) {
        const { params, status } = this;
        const payload = {
          // status为0是启用状态，switch值为true，为1是停用状态，switch值为false
          // switch设置了readonly属性，所以赋值要反着来
          active: status ? '0' : '1',
          expertiseId: params.data.expertiseId,
        };
        const result = await this.updateExpertKnowledge(payload);
        if (result) {
          params.that.getTableList();
        }
      }
    },
  },
};
</script>
