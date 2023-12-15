<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.dashboardSettingDetail"
    >
      <v-btn
        class="mb-1"
        icon
        small
        @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ boardName }}
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
          v-if="boardNumber !== 'C0008'"
        >
          <div
            class="d-flex align-center px-4"
            style="height:100%"
          >
            <v-spacer></v-spacer>
            <v-btn
              v-if="boardNumber === 'C0005' && isBtnAccess('basic:boarddetail:add')"
              small
              class="mr-2"
              outlined
              color="error"
              @click="handleDelete"
              :disabled="selectedTableList?.length === 0"
            >
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              v-if="boardNumber === 'C0005' && isBtnAccess('basic:boarddetail:add')"
              small
              class="text-none"
              :class="boardNumber === 'C0005' ? '' : 'mr-2'"
              color="primary"
              @click="paramDialog = true"
            >
              {{ $t('dashboardSetting.dialog.syncParameters') }}
            </v-btn>
            <v-btn
              v-else-if="isBtnAccess('basic:boarddetail:add')"
              small
              class="text-none"
              color="primary"
              @click="handleSave"
              :disabled="saveDisabled"
            >
              {{ $t('btn.save') }}
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="contentHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row
            dense
            no-gutters
            class="pa-4 fill-height overflow-y-auto"
          >
            <v-col cols="12">
              <div
                :style="`height: ${topHeight}px;`"
                class="picContainer card-border pa-2"
              >
                <div
                  :style="`height: ${titleHeight}px;`"
                  class="title-text"
                >
                  {{ $t('dashboardSetting.label.classExample') }}
                </div>
                <v-img
                  :height="picHeight"
                  :src="require(`@/assets/imgs/dashboardSetting/${boardNumber}.png`)"
                  :alt="boardName"
                  contain
                ></v-img>
              </div>
            </v-col>
            <v-col cols="12">
              <!-- 生产不良原因 -->
              <div
                v-if="boardNumber === 'C0005'"
                class="fill-height"
              >
                <base-grid
                  ref="settingDetailGrid"
                  :elementName="elementName"
                  :restoreColumn="true"
                  :options="options"
                  v-model="selectedTableList"
                />
              </div>
              <!-- 宕机原因分析 -->
              <div v-else-if="boardNumber === 'C0008'"></div>
              <!-- 其他 -->
              <div
                v-else
              >
                <v-form
                  ref="form"
                  lazy-validation
                >
                  <v-row dense class="fill-height">
                    <v-col
                      cols="6"
                      v-for="(item, index) in currentParamInfo.items"
                      :key="`param_selection_${index}`"
                    >
                      <div class="card-border">
                        <!-- 卡片标题 -->
                        <div class="param-title pa-3">
                          {{$t(`dashboardSetting.title.${currentParamInfo.boardNumber}.${item}`)}}
                        </div>
                        <v-divider />
                        <!-- 参数选择 -->
                        <div class="pa-3">
                          <v-autocomplete
                            class="mt-3"
                            dense
                            clearable
                            :label="`${$t('dashboardSetting.label.connectionParameter')}*`"
                            :items="parameterList"
                            item-text="parameterName"
                            item-value="parameterId"
                            v-model="tabledataobj[item]"
                            :rules="rules.isRequired"
                            @change="handleParamChange"
                            :filter="filterFunc"
                            :disabled="!isBtnAccess('basic:boarddetail:add')"
                          >
                            <template v-slot:item="{ item }">
                              <div
                                class="d-flex justify-space-between"
                                style="width: 100%"
                              >
                                <v-list-item-content>
                                  <v-list-item-title>
                                    {{item.parameterDescription}}
                                  </v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{item.parameterName}}
                                  </v-list-item-subtitle>
                                  <v-list-item-subtitle>
                                    {{item.connectionName}}
                                  </v-list-item-subtitle>
                                </v-list-item-content>
                              </div>
                            </template>
                          </v-autocomplete>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <parameter-dialog
      :paramDialog="paramDialog"
      :selectedTableList="dashboardSettingDetailList"
      @closeDialog="paramDialog = false"
      @getTableList="refresh"
      :rules="rules"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import moment from 'moment';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import ParameterDialog from '../components/parameterDialog.vue';

export default {
  name: 'dashboardSettingDetail',
  data() {
    return {
      moment,
      elementName: 'dashboardSettingDetail',
      clientHeight: document.body.clientHeight,
      titleHeight: 24, // 图片示例标题高度
      // 此处定义每个详情页的parameterCode，与后端约定好写死
      paramCodeList: [
        {
          boardNumber: 'C0001', // 订单信息
          // 批号、工单、产品型号、订单数量、合格数量、不合格数量
          items: ['batchNumber', 'workOrder', 'productCode', 'orderQuantity', 'passCode', 'failCode'],
        },
        {
          boardNumber: 'C0002', // 生产状态
          // 计划产量、良品产出、总产出
          items: ['orderQuantity', 'passCode', 'totalProducts'],
        },
        {
          boardNumber: 'C0003', // 日产量
          // 计划产量、良品产出、不良产出、总产出
          items: ['orderQuantity', 'passCode', 'failCode', 'totalProducts'],
        },
        {
          boardNumber: 'C0004', // 激活力
          // 激活力1、激活力上限、激活力2、激活力下限
          items: ['normal1_current', 'USL', 'normal2_current', 'UCL'],
        },
        {
          boardNumber: 'C0005', // 生产不良原因
          items: [],
        },
        {
          boardNumber: 'C0006', // 破坏力
          // 破坏力1、破坏力上限、破坏力2、破坏力下限、Cpk预警值、当前Cpk
          items: ['destructiveForce1_current', 'USL', 'destructiveForce2_current', 'UCL', 'CBK', 'CBKQuantity'],
        },
        {
          boardNumber: 'C0007', // 胶量值
          // 胶量值1、胶量值上限、胶量值2、胶量值下限
          items: ['jl1_current', 'USL', 'jl2_current', 'UCL'],
        },
        {
          boardNumber: 'C0008', // 宕机原因分析
          items: [],
        },
        {
          boardNumber: 'C0009', // IPC取样数
          // IPC当前取样数、IPC取样数
          items: ['sampling_current', 'sampling'],
        },
      ],
      tabledataobj: {},
      settingDetailGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'No.',
            filter: false,
            index: 0,
            maxWidth: 100,
            checkboxSelection: true,
            headerCheckboxSelection: true,
          },
          {
            field: 'parameterCode',
            headerName: 'dashboardSetting.detailTable.adverseCauses',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'connectionName',
            headerName: 'dashboardSetting.detailTable.connectionName',
            filter: 'agTextColumnFilter',
            maxWidth: 120,
            index: 2,
          },
          {
            field: 'parameterNumber',
            headerName: 'dashboardSetting.detailTable.parameterCode',
            filter: 'agTextColumnFilter',
            index: 3,
          },
          {
            field: 'parameterName',
            headerName: 'dashboardSetting.detailTable.parameterName',
            filter: 'agTextColumnFilter',
            index: 4,
          },
          {
            field: 'parameterDescription',
            headerName: 'dashboardSetting.detailTable.parameterDescription',
            filter: 'agTextColumnFilter',
            index: 5,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: 300,
      },
      selectedTableList: [], // 选中的表格数据
      saveDisabled: true,
      paramDialog: false,
    };
  },
  components: {
    BaseGrid,
    ParameterDialog,
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  created() {
    this.options.height = this.bottomHeight;
  },
  mounted() {
    if (this.$refs.settingDetailGrid) {
      this.settingDetailGridApi = this.$refs.settingDetailGrid.gridApi;
    }
    this.init();
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('dashboardSetting', [
      'getDashboardSettingDetail',
      'getParameterList',
      'batchUpdateDetail',
    ]),
    goBack() {
      this.$router.push({ name: 'dashboardSetting' });
    },
    refresh() {
      this.resetSelect();
      this.init();
    },
    async init() {
      // 获取参数列表
      await this.getParameterList();
      if (this.boardId) {
        await this.getDashboardSettingDetail(this.boardId);
        // 生产不良原因详情表格赋值
        if (this.boardNumber === 'C0005') {
          this.options.rowData = this.dashboardSettingDetailList;
        }
        this.dashboardSettingDetailList.forEach((item) => {
          this.tabledataobj = {
            ...this.tabledataobj,
            [item.parameterCode]: item.parameterId,
          };
        });
      }
    },
    resetSelect() {
      if (this.settingDetailGridApi) {
        this.settingDetailGridApi.deselectAll();
      }
    },
    // 重新定义过滤器，支持多字段过滤
    filterFunc(item, queryText, itemText) {
      if (!queryText || !itemText) {
        return true;
      }
      if (!item.parameterName || !item.parameterDescription) {
        return false;
      }
      return itemText.toString().toLowerCase().indexOf(queryText.toLowerCase()) > -1
      || item.parameterName.toString().toLowerCase().indexOf(queryText.toLowerCase()) > -1
      || item.parameterDescription.toString().toLowerCase().indexOf(queryText.toLowerCase()) > -1;
    },
    // 参数变更后保存按钮高亮
    handleParamChange() {
      this.saveDisabled = false;
    },
    // 获取选中的参数
    getSelectedParameters(paramList) {
      this.options.rowData = paramList;
    },
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        tabledataobj,
        boardId,
      } = this;
      const parameterCodeList = Object.keys(tabledataobj);
      if (parameterCodeList.length === 0) {
        return;
      }
      const payload = parameterCodeList.map((item) => {
        const obj = {
          boardId, // 看板卡片id
          parameterCode: item, // 参数编码， 与后端约定的参数编码
          parameterId: tabledataobj[item], // 参数id
        };
        return obj;
      });
      // console.log(payload, 'payload');
      const result = await this.batchUpdateDetail({
        payload,
        boardId,
      });
      if (result) {
        this.refresh();
      }
    },
    async handleDelete() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        const {
          selectedTableList,
          dashboardSettingDetailList,
          boardId,
        } = this;
        if (selectedTableList?.length) {
          const toSaveList = this.dashboardSettingDetailList.concat();
          for (let i = 0; i < selectedTableList.length; i += 1) {
            const item = selectedTableList[i];
            const index = dashboardSettingDetailList.findIndex((it) =>
              it.parameterId === item.parameterId);
            if (index > -1) {
              // 删除该条数据
              toSaveList.splice(index, 1);
            }
          }
          const result = await this.batchUpdateDetail({
            payload: toSaveList,
            boardId,
          });
          if (result) {
            this.refresh();
          }
        }
      }
    },
  },
  computed: {
    ...mapState('dashboardSetting', ['dashboardSettingDetailList', 'parameterList']),
    ...mapState('helper', ['currentLocale', 'pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    // 看板卡片id
    boardId() {
      return Number(this.$route.params.id);
    },
    // 看板卡片编号， 用作区分不同详情页
    boardNumber() {
      return this.$route.params.code;
    },
    // 看板卡片名称
    boardName() {
      return this.$route.params.name || '-';
    },
    // 当前卡片数据
    currentParamInfo() {
      if (this.boardNumber) {
        return this.paramCodeList.find((item) => item.boardNumber === this.boardNumber);
      }
      return {};
    },
    rules() {
      return this.$getCommonRules();
    },
    contentHeight() {
      // 宕机原因分析详情页没有顶部保存按钮卡片
      if (this.boardNumber === 'C0008') {
        return this.clientHeight - 121;
      }
      return this.clientHeight - 210;
    },
    // 顶部示例卡片高度
    topHeight() {
      return (this.contentHeight - 32) * 0.4;
    },
    // 底部表格高度
    bottomHeight() {
      return (this.contentHeight - 32) * 0.6;
    },
    // 图片高度
    picHeight() {
      return this.topHeight - 24 - this.titleHeight;
    },
  },
};
</script>
<style lang="scss" scoped>
  .picContainer {
    width: 100%;
    .title-text {
      font-weight: 700;
      color: #404040;
      text-align: left;
    }
  }
  .card-border {
    border: 1px solid #E0E0E0;
    border-radius: 6px;
  }
  .param-title {
    font-size: 18px;
    color: #404040;
    font-weight: 700;
    text-align: left;
  }
</style>
