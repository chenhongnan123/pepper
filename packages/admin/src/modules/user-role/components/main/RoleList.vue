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
        @click="isNew = false;addRoleDialog = true"
        v-if="isBtnAccess('userRole')"
      >
        <v-icon left small>mdi-pencil</v-icon>
        {{ $t('btn.edit') }}
      </v-btn>
      <v-btn
        small
        class="text-none"
        color="primary"
        @click="isNew = true;addRoleDialog = true"
        v-if="isBtnAccess('userRole')"
      >
        <v-icon left small>mdi-plus</v-icon>
        {{ $t('btn.add') }}
      </v-btn>
    </div>
    <v-row no-gutters>
      <v-col>
        <base-grid
          ref="roleGrid"
          :elementName="elementName"
          :restoreColumn="true"
          :options="options"
          v-model="selectedTableList"
        />
      </v-col>
    </v-row>
    <add-role-dialog
      :addDialog="addRoleDialog"
      :selectedTableList="selectedTableList"
      :isNew="isNew"
      @closeDialog="addRoleDialog = false"
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
import RoleActionMenu from './RoleActionMenu.vue';
import AddRoleDialog from './AddRoleDialog.vue';

export default {
  name: 'RoleList',
  data() {
    return {
      elementName: 'roleManagement',
      roleGridApi: null,
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
            field: 'roleNumber',
            headerName: 'userRole.table.roleId',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'roleName',
            headerName: 'userRole.table.roleName',
            filter: 'agTextColumnFilter',
            index: 2,
          },
          {
            field: 'roleTypeName',
            headerName: 'userRole.table.roleType',
            filter: 'agTextColumnFilter',
            index: 3,
          },
          {
            field: 'remark',
            headerName: 'userRole.table.roleDescription',
            filter: 'agTextColumnFilter',
            index: 4,
          },
          {
            field: 'action',
            headerName: 'userRole.table.roleAccess',
            index: 5,
            cellRendererSelector: () => ({
              component: 'RoleActionMenu',
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
      },
      selectedTableList: [],
      addRoleDialog: false,
      isNew: true,
    };
  },
  props: {
  },
  components: {
    BaseGrid,
    RoleActionMenu,
    AddRoleDialog,
  },
  created() {
    this.getTableList();
  },
  mounted() {
    this.roleGridApi = this.$refs.roleGrid.gridApi;
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('userRole', [
      'roleList',
      'roleTypeList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    roleTypes() {
      const { currentLocale, roleTypeList } = this;
      const listByLanguage = roleTypeList.filter((m) => m.type === currentLocale);
      if (listByLanguage.length) {
        const { dictVoList } = listByLanguage[0];
        return dictVoList;
      }
      return [];
    },
  },
  methods: {
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapActions('userRole', [
      'handleRole',
    ]),
    getTableList() {
      this.$emit('getTableList');
      this.getRoleTypeNameByLanguage();
      this.resetSelect();
    },
    getRoleTypeNameByLanguage() {
      const { roleList, roleTypes } = this;
      const dataList = roleList.map((item) => {
        const obj = {
          ...item,
          roleTypeName: '',
        };
        const userType = roleTypes.filter((t) => t.dictCode === item.roleType);
        if (userType.length) {
          obj.roleTypeName = userType[0].languageValue;
        }
        return obj;
      });
      this.options.rowData = dataList;
    },
    resetSelect() {
      if (this.roleGridApi) {
        this.roleGridApi.deselectAll();
      }
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('userRole.dialog.roleDeleteConfirm'),
      )) {
        const idList = [];
        this.selectedTableList.forEach((item) => {
          idList.push(item.id);
        });
        const result = await this.handleRole({
          action: 'delete',
          payload: {
            idList,
          },
        });
        if (result) {
          this.getTableList();
        }
      }
    },
  },
  watch: {
    roleList: {
      handler() {
        this.getRoleTypeNameByLanguage();
      },
      immediate: true,
    },
    currentLocale() {
      // console.log('currentLocale');
      this.getRoleTypeNameByLanguage();
    },
  },
};
</script>
