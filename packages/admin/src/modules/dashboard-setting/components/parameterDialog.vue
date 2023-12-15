<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'600px'"
  >
    <v-card
      style="overflow: hidden"
      max-height="800"
    >
      <v-card-title primary-title>
        <span  class="text-h5 font-weight-bold">
          {{$t('dashboardSetting.dialog.syncParameters')}}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div>
          <base-grid
            ref="paramsGrid"
            elementName="paramsForSelect"
            :restoreColumn="true"
            :options="options"
            v-model="selectedParams"
          />
        </div>
        <v-form ref="form" lazy-validation>
          <div class="rounded grey-thin-border mt-3">
            <v-simple-table
              :height="220"
              fixed-header
              dense
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                    {{ $t('dashboardSetting.detailTable.no') }}
                    </th>
                    <th class="text-left" style="min-width:240px!important">
                    {{ $t('dashboardSetting.detailTable.adverseCauses') }}
                    </th>
                    <th class="text-left" style="min-width:85px!important">
                    {{ $t('dashboardSetting.detailTable.connectionName') }}
                    </th>
                    <th class="text-left" style="min-width:120px!important">
                    {{ $t('dashboardSetting.detailTable.parameterCode') }}
                    </th>
                    <th class="text-left" style="min-width:120px!important">
                    {{ $t('dashboardSetting.detailTable.parameterName') }}
                    </th>
                    <th class="text-left" style="min-width:200px!important">
                      {{ $t('dashboardSetting.detailTable.parameterDescription') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, key) in saveParams"
                    :key="key"
                  >
                    <td>{{ key + 1 }}</td>
                    <td>
                      <v-text-field
                        outlined
                        clearable
                        dense
                        class="mt-2"
                        v-model="saveParams[key].columnName"
                        :rules="rules.isRequired"
                      ></v-text-field>
                    </td>
                    <td>{{ item.connectionName }}</td>
                    <td>{{ item.parameterNumber }}</td>
                    <td>{{ item.parameterName }}</td>
                    <td>{{ item.parameterDescription }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
        >{{ $t('btn.eliminate') }}</v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >{{ $t('btn.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';

export default {
  name: 'parameterDialog',
  data() {
    return {
      options: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            maxWidth: 100,
            filter: false,
            headerName: 'dashboardSetting.detailTable.no',
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'connectionName',
            headerName: 'dashboardSetting.detailTable.connectionName',
            filter: 'agTextColumnFilter',
            maxWidth: 110,
          },
          {
            field: 'connectionTypeName',
            headerName: 'dashboardSetting.detailTable.connectionType',
            filter: 'agTextColumnFilter',
            maxWidth: 110,
          },
          {
            field: 'parameterNumber',
            headerName: 'dashboardSetting.detailTable.parameterCode',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'parameterName',
            headerName: 'dashboardSetting.detailTable.parameterName',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'parameterDescription',
            headerName: 'dashboardSetting.detailTable.parameterDescription',
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: 300,
        pagination: false,
        rowHeight: 30,
      },
      selectedParams: [], // 表格中勾选的数据
      saveParams: [], // 待存储的列表（包含columnName）
    };
  },
  props: {
    paramDialog: {
      type: Boolean,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    selectedTableList: {
      type: Array,
      required: true,
    },
  },
  components: {
    BaseGrid,
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('dashboardSetting', ['parameterList']),
    dialog: {
      get() {
        return this.paramDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    // 看板卡片id
    boardId() {
      return Number(this.$route.params.id);
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dashboardSetting', [
      'getParameterList',
      'batchUpdateDetail',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        selectedTableList,
        saveParams,
        boardId,
      } = this;
      const selected = selectedTableList.map((it) => {
        const obj = {
          boardId,
          parameterCode: it.parameterCode,
          parameterId: it.parameterId,
        };
        return obj;
      });
      const toSaved = saveParams.map((item) => {
        const obj = {
          boardId, // 看板卡片id
          parameterCode: item.columnName, // 详情代码，用户输入
          parameterId: item.parameterId, // 参数id
        };
        return obj;
      });
      const payload = [...selected, ...toSaved];
      // console.log(payload, 'payload');
      const result = await this.batchUpdateDetail({
        payload,
        boardId,
      });
      if (result) {
        this.$emit('getTableList');
        this.$emit('closeDialog');
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.$nextTick(() => {
        // 清空已选参数列表
        this.selectedParams = [];
      });
    },
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.reset();
        // 获取参数列表
        await this.getParameterList();
        this.options.rowData = this.parameterList;
      }
    },
    selectedParams(val) {
      const { saveParams } = this;
      const filterList = val.filter((v) => !saveParams.some((p) => p.parameterId === v.parameterId))
        .map((f) => {
          const obj = {
            ...f,
            columnName: f.parameterName,
          };
          return obj;
        });
      this.saveParams.push(...filterList);
      this.saveParams = this.saveParams
        .filter((p) => val.some((v) => p.parameterId === v.parameterId));
    },
  },
};
</script>
