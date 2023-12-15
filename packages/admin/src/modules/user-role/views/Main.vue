<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.userRole">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <portal to="page-header">
    </portal>
    <tab-layout
      :items="[
        {tabName: $t('userRole.role')},
        {tabName: $t('userRole.user')},
      ]"
      :tab="tab"
      @changeTab="handleChangeTab"
    />
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <role-list
          @getTableList="getTableList"
        />
      </v-tab-item>
      <v-tab-item>
        <user-list
           @getTableList="getTableList"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import TabLayout from '@/components/commonUI/TabLayout.vue';
import RoleList from '../components/main/RoleList.vue';
import UserList from '../components/main/UserList.vue';

export default {
  name: 'userRole',
  components: {
    TabLayout,
    RoleList,
    UserList,
  },
  data() {
    return {
      tab: 0,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    moduleName() {
      return this.$route.name;
    },
  },
  mounted() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
    // this.getTableList();
  },
  beforeDestroy() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapActions('userRole', ['getRoleList', 'getUserList']),
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
    },
    async handleUpdatePassword() {
      if (!this.$refs.userPassword.validate()) {
        return;
      }
      const { oldPassword, newPassword } = this;
      const payload = {
        oldPassword,
        newPassword,
      };
      const updated = await this.updatePassword(payload);
      if (updated) {
        this.oldPassword = '';
        this.newPassword = '';
        this.$refs.userPassword.reset();
      }
    },
    async getTableList() {
      console.log(this.tab, 'tab');
      if (!this.tab) {
        await this.getRoleList(true);
      } else {
        await this.getUserList();
      }
    },
    handleChangeTab(tab) {
      this.tab = tab;
    },
  },
};
</script>
