<template>
  <div>
    <v-switch
      v-model="status"
      color="primary"
      @click="handleSwitch"
      class="mt-0"
      readonly
      :disabled="!isBtnAccess('basic:roadmap:edit')"
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
    ...mapActions('roadmapManagement', [
      'activeRoadmap',
    ]),
    async handleSwitch() {
      if (!this.isBtnAccess('basic:roadmap:edit')) { return; }
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t(`roadmapManagement.dialog.${!this.status ? 'roadmapEnableConfirm' : 'roadmapDisableConfirm'}`),
      )) {
        const { params, status } = this;
        const payload = {
          ...params.data,
          // 关闭其他工艺路线 0否 1是
          closeOther: 0,
          // status为0是启用状态，switch值为true，为1是停用状态，switch值为false
          // switch设置了readonly属性，所以赋值要反着来
          status: status ? '1' : '0',
        };
        const result = await this.activeRoadmap(payload);
        if (result) {
          // 返回1001，表示有在制品，需要再确一下
          if (result === 1001) {
            if (await this.$root.$confirm.open(
              this.$t('dialog.tips'),
              this.$t('roadmapManagement.dialog.workInProcessConfirm'),
            )) {
              const subpayload = {
                ...params.data,
                // 关闭其他工艺路线 0否 1是
                closeOther: 1,
                // status为0是启用状态，switch值为true，为1是停用状态，switch值为false
                // switch设置了readonly属性，所以赋值要反着来
                status: status ? '1' : '0',
              };
              const subresult = await this.activeRoadmap(subpayload);
              if (subresult) {
                params.that.refresh();
              }
            }
          } else {
            params.that.refresh();
          }
        }
      }
    },
  },
};
</script>
