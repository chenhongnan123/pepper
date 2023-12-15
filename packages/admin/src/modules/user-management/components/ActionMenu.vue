<template>
  <!-- userId=1管理员账号不允许修改密码和角色 -->
  <div v-if="userId !== 1" class="custom-class">
    <v-btn
      small
      text
      color="primary"
      @click="resetDialog = true"
      v-if="isBtnAccess('system:user:resetPwd')"
    >
      {{ $t('btn.resetPwd') }}
    </v-btn>
    <v-btn
      small
      text
      color="primary"
      @click="roleDialog = true"
      v-if="isBtnAccess('system:user:edit')"
    >
    {{ $t('btn.assignRole') }}
    </v-btn>
    <reset-pwd-dialog
      :resetDialog="resetDialog"
      @closeDialog="resetDialog = false"
      :userId="userId"
      :rules="rules"
    />
    <assign-role-dialog
      :roleDialog="roleDialog"
      @closeDialog="roleDialog = false"
      :userId="userId"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
// eslint-disable-next-line
import ResetPwdDialog from './resetPwdDialog.vue';
// eslint-disable-next-line
import AssignRoleDialog from './assignRoleDialog.vue';

export default {
  data() {
    return {
      resetDialog: false,
      roleDialog: false,
    };
  },
  created() {
  },
  components: {
    ResetPwdDialog,
    AssignRoleDialog,
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
    rules() {
      return this.$getUserRules();
    },
    userId() {
      const { params } = this;
      return params ? params.data.userId : null;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('userManagement', [
      'delPosition',
    ]),
    refresh() {
      this.params.that.init();
    },
  },
};
</script>

<style lang="scss" scoped>
  .custom-class {
    margin-top: 1px;
  }
</style>
