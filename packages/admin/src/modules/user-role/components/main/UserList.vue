<template>
  <div>
    <div class="d-flex mb-2">
      <v-spacer></v-spacer>
      <v-btn
        small
        outlined
        class="text-none mr-2"
        color="error"
        @click="handleDelete"
        :disabled="selectedTableList.length === 0"
        v-if="isBtnAccess('userRole')"
      >
        <v-icon left small>mdi-delete</v-icon>
        {{ $t('btn.delete') }}
      </v-btn>
      <v-btn
        small
        outlined
        class="text-none mr-2"
        color="success"
        :disabled="selectedTableList.length === 0 || selectedTableList.length > 1"
        @click="isNew = false;addUserDialog = true"
        v-if="isBtnAccess('userRole')"
      >
        <v-icon left small>mdi-pencil</v-icon>
        {{ $t('btn.edit') }}
      </v-btn>
      <v-btn
        small
        class="text-none mr-2"
        color="primary"
        :disabled="selectedTableList.length === 0 || selectedTableList.length > 1"
        @click="resetPasswordDialog = true"
        v-if="isBtnAccess('userRole')"
      >
        {{ $t('userRole.btn.resetPassword') }}
      </v-btn>
      <v-btn
        small
        class="text-none"
        color="primary"
        @click="isNew = true;addUserDialog = true"
        v-if="isBtnAccess('userRole')"
      >
        <v-icon left small>mdi-plus</v-icon>
        {{ $t('btn.add') }}
      </v-btn>
    </div>
    <v-row no-gutters>
      <v-col>
        <base-grid
          ref="userGrid"
          :elementName="elementName"
          :restoreColumn="true"
          :options="options"
          v-model="selectedTableList"
        />
      </v-col>
    </v-row>
    <add-user-dialog
      :addDialog="addUserDialog"
      :selectedTableList="selectedTableList"
      :isNew="isNew"
      @closeDialog="addUserDialog = false"
      @getTableList="getTableList"
    />
    <reset-password-dialog
      :addDialog="resetPasswordDialog"
      :selectedTableList="selectedTableList"
      @closeDialog="resetPasswordDialog = false"
      @getTableList="getTableList"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import UserRoleMenu from './UserRoleMenu.vue';
import UserAvatarMenu from './UserAvatarMenu.vue';
import UserStatusMenu from './UserStatusMenu.vue';
import AddUserDialog from './AddUserDialog.vue';
import ResetPasswordDialog from './ResetPasswordDialog.vue';

export default {
  name: 'UserList',
  data() {
    return {
      elementName: 'userManagement',
      userGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'userRole.table.no',
            filter: 'agTextColumnFilter',
            index: 0,
            checkboxSelection: true,
            headerCheckboxSelection: true,
          },
          {
            field: 'userName',
            headerName: 'userRole.table.account',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'roleName',
            headerName: 'userRole.role',
            filter: 'agTextColumnFilter',
            index: 2,
            cellRendererSelector: () => ({
              component: 'UserRoleMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'lastName',
            headerName: 'userRole.table.lastname',
            filter: 'agTextColumnFilter',
            index: 3,
          },
          {
            field: 'firstName',
            headerName: 'userRole.table.firstname',
            filter: 'agTextColumnFilter',
            index: 4,
          },
          {
            field: 'avatar',
            headerName: 'userRole.table.avatar',
            index: 5,
            cellRendererSelector: () => ({
              component: 'UserAvatarMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'email',
            headerName: 'userRole.table.email',
            filter: 'agTextColumnFilter',
            index: 6,
          },
          {
            field: 'phoneNumber',
            headerName: 'userRole.table.phone',
            filter: 'agTextColumnFilter',
            index: 7,
          },
          {
            field: 'status',
            headerName: 'userRole.table.userStatus',
            index: 7,
            cellRendererSelector: () => ({
              component: 'UserStatusMenu',
              params: {
                that: this,
              },
            }),
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: document.body.clientHeight - 220,
        rowHeight: 50,
      },
      selectedTableList: [],
      addUserDialog: false,
      resetPasswordDialog: false,
      isNew: true,
    };
  },
  props: {
  },
  components: {
    BaseGrid,
    UserRoleMenu,
    UserAvatarMenu,
    UserStatusMenu,
    AddUserDialog,
    ResetPasswordDialog,
  },
  created() {
    this.getTableList();
  },
  mounted() {
    this.userGridApi = this.$refs.userGrid.gridApi;
  },
  computed: {
    ...mapState('userRole', [
      'userList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
  },
  methods: {
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapActions('userRole', [
      'deleteUser',
    ]),
    getTableList() {
      this.$emit('getTableList');
      this.resetSelect();
    },
    resetSelect() {
      if (this.userGridApi) {
        this.userGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('userRole.dialog.userDeleteConfirm'),
      )) {
        const ids = [];
        this.selectedTableList.forEach((item) => {
          ids.push(item.id);
        });
        const result = await this.deleteUser({
          ids,
        });
        if (result) {
          this.getTableList();
        }
      }
    },
  },
  watch: {
    userList: {
      handler(userList) {
        this.options.rowData = userList;
      },
      immediate: true,
    },
  },
};
</script>
