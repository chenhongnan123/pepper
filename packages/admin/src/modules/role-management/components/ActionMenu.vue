<template>
  <div>
    <!-- <v-btn
      small
      icon
      color="primary"
      @click="dataScopeDialog = true"
      v-if="isBtnAccess('system:role:edit') && roleKey !== 'admin'"
      :title="$t('roleManagement.label.dataScope')"
    >
      <v-icon>mdi-check-circle-outline</v-icon>
    </v-btn> -->
    <v-btn
      small
      icon
      color="primary"
      class="ml-1"
      @click="goAssignUser"
      v-if="isBtnAccess('system:role:edit') && roleId !== 1"
      :title="$t('roleManagement.btn.assignUser')"
    >
      <v-icon>mdi-account-outline</v-icon>
    </v-btn>
    <data-scope-dialog
      :dataScopeDialog="dataScopeDialog"
      :roleId="roleId"
      @closeDialog="dataScopeDialog = false"
      @getTableList="refresh"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DataScopeDialog from './DataScopeDialog.vue';

export default {
  data() {
    return {
      dataScopeDialog: false,
      roleId: null,
      roleKey: '',
    };
  },
  created() {
    // console.log(this.params);
    const { params } = this;
    this.roleId = params ? params.data.roleId : null;
    this.roleKey = params ? params.data.roleKey : null;
  },
  components: {
    DataScopeDialog,
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
    moduleName() {
      return this.$route.name;
    },
  },
  methods: {
    async refresh() {
      this.params.that.refresh();
    },
    goAssignUser() {
      // console.log('params', params);
      this.$router.push({ name: 'assignUser', params: { id: this.roleId, page: this.moduleName } });
    },
  },
};
</script>
