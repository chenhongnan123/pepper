<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.roleManagement">
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
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          height="77"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:100%">
            <v-spacer></v-spacer>
            <v-btn
              small
              outlined
              class="text-none mr-2"
              color="error"
              @click="handleRevoke"
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('system:role:edit')"
            >
              <v-icon left small>mdi-close-circle-outline</v-icon>
              {{ $t('roleManagement.btn.revoke') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="selectUserDialog = true"
              v-if="isBtnAccess('system:role:edit')"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('roleManagement.btn.addUser') }}
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row no-gutters class="pa-4">
            <v-col>
              <base-grid
                ref="assginUserGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                v-model="selectedTableList"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <select-user-dialog
      :roleId="curRoleId"
      :selectUserDialog="selectUserDialog"
      @closeDialog="selectUserDialog = false"
      @getTableList="refresh"
    />
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import StatusMenu from './StatusMenu.vue';
import SelectUserDialog from './SelectUserDialog.vue';

export default {
  name: 'assignUser',
  components: {
    BaseGrid,
    StatusMenu,
    SelectUserDialog,
  },
  data() {
    return {
      elementName: 'assignUser',
      tableHeight: document.body.clientHeight - 230,
      assginUserGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'roleManagement.table.no',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
          },
          {
            field: 'userName',
            headerName: 'roleManagement.table.userAccount',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'nickName',
            headerName: 'roleManagement.table.userNickname',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'email',
            headerName: 'roleManagement.table.email',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'status',
            headerName: 'roleManagement.table.userStatus',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'StatusMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'createTime',
            headerName: 'roleManagement.table.createTime',
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 260,
        rowHeight: 35,
      },
      selectedTableList: [],
      selectUserDialog: false,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('roleManagement', [
      'assginUserList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    curRoleId() {
      return Number(this.$route.params.id) || null;
    },
    // 父页面名称
    pageName() {
      return this.$route.params.page;
    },
  },
  activated() {
    this.assginUserGridApi = this.$refs.assginUserGrid.gridApi;
  },
  created() {
    this.getTableList();
  },
  deactivated() {
  },
  methods: {
    ...mapActions('roleManagement', [
      'getAssginUserList',
      'getStatusList',
      'cancelAuthUser',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
      this.resetSelect();
    },
    async getTableList() {
      await this.getStatusList();
      await this.getAssginUserList(this.curRoleId);
      this.options.rowData = this.assginUserList;
    },
    resetSelect() {
      if (this.$refs.assginUserGrid) {
        this.$refs.assginUserGrid.gridApi.deselectAll();
      }
    },
    async handleRevoke() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t('roleManagement.dialog.revokeConfirm'),
      )) {
        let userIds = '';
        this.selectedTableList.forEach((item) => {
          userIds += userIds ? `,${item.userId}` : item.userId;
        });
        const result = await this.cancelAuthUser({
          roleId: this.curRoleId,
          userIds,
        });
        if (result) {
          this.refresh();
        }
      }
    },
    goBack() {
      this.$router.push({ name: this.pageName });
    },
  },
};
</script>
