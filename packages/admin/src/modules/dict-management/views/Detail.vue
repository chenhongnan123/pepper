<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.dictManagementDetail">
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t(`modules.${moduleName}`)  }}
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
              outlined
              small
              class="text-none mr-2"
              color="error"
              :disabled="selectedTableList.length === 0"
              @click="handleDelete"
              v-if="isBtnAccess('system:dict:remove')"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              :disabled="selectedTableList.length !== 1"
              outlined
              small
              class="text-none mr-2"
              color="success"
              @click="handleEdit"
              v-if="isBtnAccess('system:dict:edit')"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="isNew = true; addDialog = true"
              v-if="isBtnAccess('system:dict:add')"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('btn.add') }}
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
                ref="dictManagementGrid"
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
    <add-dialog
      :addDialog="addDialog"
      :isNew="isNew"
      :selectedTableList="selectedTableList"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
  </v-container>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/detail/AddDialog.vue';
import SwitchBtn from '../components/main/SwitchBtn.vue';
import TextBtn from '../components/detail/TextBtn.vue';

export default {
  name: 'dictManagementDetail',
  components: {
    BaseGrid,
    AddDialog,
    SwitchBtn,
    TextBtn,
  },
  data() {
    return {
      elementName: 'dictManagementDetail',
      tableHeight: document.body.clientHeight - 210,
      dictTypeHeaders: [
        'dictCode',
        'dictLabel',
        'dictSort',
        'dictValue',
        'status',
        'statusLock',
        'remark',
        'createTime',
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'dictCode', // 传递对象的唯一标识符
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: true,
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('dictManagement', [
      'dictDataList',
    ]),
    moduleName() {
      return this.$route.name;
    },
    dictType() {
      return this.$route.params.dictType;
    },
  },
  created() {
    this.getTableList();
    this.initTableHeaders();
  },
  methods: {
    ...mapActions('dictManagement', [
      'getDictDataList',
      'updateDictData',
      'deleteDictData',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
    },
    goBack() {
      this.$router.push({ name: 'dictManagement' });
    },
    async getTableList() {
      this.selectedTableList = [];
      await this.getDictDataList(this.dictType);
      this.options.rowData = this.dictDataList;
    },
    async handleDelete() {
      const disContinue = this.selectedTableList.some((item) => item.statusLock === '1');
      if (disContinue) {
        this.setAlert({
          show: true,
          type: 'error',
          message: '选中记录中存在系统锁定，不可被删除',
        });
        return;
      }
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const idList = [];
        this.selectedTableList.forEach((item) => {
          idList.push(item.dictCode);
        });
        const result = await this.deleteDictData(idList);
        if (result) {
          this.refresh();
        }
      }
    },
    handleEdit() {
      const disContinue = this.selectedTableList.some((item) => item.statusLock === '1');
      if (!disContinue) {
        this.isNew = false;
        this.addDialog = true;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: '选中记录中存在系统锁定，不可被删除',
        });
      }
    },
    initTableHeaders() {
      let headers = [];
      headers = this.dictTypeHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`dictManagement.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'dictLabel') {
          obj.cellRendererSelector = () => ({
            component: 'TextBtn',
            params: {
              that: this,
            },
          });
        }
        if (item === 'statusLock') {
          obj.valueFormatter = (params) => {
            const { value } = params;
            switch (value) {
              case '0':
                return '否';
              case '1':
                return '是';
              default:
                return '--';
            }
          };
        }
        if (item === 'status') {
          obj.cellRendererSelector = () => ({
            component: 'SwitchBtn',
            params: {
              currowinfo: this, // 当前行的信息
              field: 'status', // 传入的字段
              init: this.refresh, // 重新获取列表
              changeStatus: this.updateDictData, // 返回true或false
            },
          });
        }
        return obj;
      });
      this.options.headers = headers;
    },
  },
};
</script>
