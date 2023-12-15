<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="isNew ? '1300px' : '600px'"
  >
    <v-card
      style="overflow: hidden"
      max-height="800"
    >
      <v-card-title primary-title>
        <span  class="text-h5 font-weight-bold">
          {{
            isNew
            ? $t('dataSource.dialog.add')
            : $t('dataSource.dialog.edit')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          @click="dialog = false"
          v-if="!tabledataobj.connectionType"
          :disabled="upLoading"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-row class="px-4">
        <v-col :cols="isNew ? 5 : 12">
          <v-card-text class="py-0">
            <v-form ref="formleft" v-model="valid" lazy-validation>
              <v-text-field
                clearable
                :label="`${$t('dataSource.table.dataSourceNumber')}*`"
                v-model="tabledataobj.dataSourceNumber"
                :rules="rules.name"
                :counter="50"
                :disabled="!isNew"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                clearable
                :label="`${$t('dataSource.table.dataSourceName')}*`"
                v-model="tabledataobj.dataSourceName"
                :rules="rules.name"
                :counter="50"
              ></v-text-field>
              <v-autocomplete
                class="mt-3"
                item-text="text"
                item-value="value"
                :label="`${$t('dataSource.label.storageMode')}*`"
                :items="storageModes"
                :rules="rules.isRequired"
                v-model="tabledataobj.storageMode"
                :disabled="!isNew"
                @change="handleTypeChange"
              ></v-autocomplete>
              <div class="text-h6 mt-3">
                {{ $t('dataSource.label.trigger') }}
              </div>
              <v-row dense v-if="tabledataobj.storageMode !== '4'">
                <v-col :cols="6">
                  <v-checkbox
                    v-model="tabledataobj.triggerOrNot"
                    :label="`${$t('dataSource.label.triggerOrNot')}`"
                    hide-details
                    dense
                    :disabled="(!isNew && tabledataobj.active === '1')
                      || tabledataobj.storageMode === '2'"
                  ></v-checkbox>
                </v-col>
                <v-col :cols="6" v-if="tabledataobj.triggerOrNot">
                  <v-checkbox
                    v-model="tabledataobj.triggerSingle"
                    :label="`${$t('dataSource.label.triggerSingle')}`"
                    hide-details
                    dense
                    :disabled="(!isNew && tabledataobj.active === '1')
                      || tabledataobj.storageMode === '2'"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-row dense align="center" v-if="tabledataobj.triggerOrNot">
                <v-col :cols="3">
                  <div class="text-subtitle-1 font-weight-bold">
                    {{$t('dataSource.label.triggerStart')}}
                  </div>
                </v-col>
                <v-col :cols="6">
                  <v-autocomplete
                    class="mt-3"
                    clearable
                    item-text="parameterName"
                    item-value="parameterId"
                    :label="`${$t('dataSource.label.parameter')}*`"
                    :items="parameterList"
                    :rules="rules.isRequired"
                    v-model="tabledataobj.triggerStartParamId"
                    :disabled="!isNew && tabledataobj.active === '1'"
                  >
                    <template v-slot:item="{ item }">
                    <div
                      class="d-flex justify-space-between custom-autocomplete"
                      style="width:100%"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.parameterName }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.parameterNumber }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          {{ item.parameterDescription }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          {{ item.connectionName }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-icon v-if="item.disabled">mdi-cancel</v-icon>
                    </div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col :cols="3">
                  <v-text-field
                    class="mt-3"
                    clearable
                    :label="`${$t('dataSource.label.value')}*`"
                    v-model="tabledataobj.triggerStartValue"
                    :rules="rules.isRequired"
                    :disabled="!isNew && tabledataobj.active === '1'"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row
                dense
                align="center"
                v-if="!tabledataobj.triggerSingle && tabledataobj.triggerOrNot"
              >
                <v-col :cols="3">
                  <div  class="text-subtitle-1 font-weight-bold">
                    {{$t('dataSource.label.triggerEnd')}}
                  </div>
                </v-col>
                <v-col :cols="6">
                  <v-autocomplete
                    class="mt-3"
                    clearable
                    item-text="parameterName"
                    item-value="parameterId"
                    :label="`${$t('dataSource.label.parameter')}*`"
                    :items="parameterList"
                    :rules="rules.isRequired"
                    v-model="tabledataobj.triggerEndParamId"
                    :disabled="!isNew && tabledataobj.active === '1'"
                  >
                    <template v-slot:item="{ item }">
                    <div
                      class="d-flex justify-space-between custom-autocomplete"
                      style="width:100%"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.parameterName }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.parameterNumber }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          {{ item.parameterDescription }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          {{ item.connectionName }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-icon v-if="item.disabled">mdi-cancel</v-icon>
                    </div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col :cols="3">
                  <v-text-field
                    class="mt-3"
                    clearable
                    :label="`${$t('dataSource.label.value')}*`"
                    v-model="tabledataobj.triggerEndValue"
                    :rules="rules.isRequired"
                    :disabled="!isNew && tabledataobj.active === '1'"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- 记录更新数据时显示 -->
              <v-row dense align="center" v-if="tabledataobj.storageMode === '4'">
                <v-col :cols="3">
                  <div class="text-subtitle-1 font-weight-bold">
                    {{$t('dataSource.label.triggerStart')}}
                  </div>
                </v-col>
                <v-col :cols="9">
                  <v-autocomplete
                    class="mt-3"
                    clearable
                    item-text="parameterName"
                    item-value="parameterId"
                    :label="`${$t('dataSource.label.parameter')}*`"
                    :items="parameterList"
                    :rules="rules.isRequired"
                    v-model="tabledataobj.triggerStartParamId"
                    :disabled="!isNew && tabledataobj.active === '1'"
                  >
                    <template v-slot:item="{ item }">
                    <div
                      class="d-flex justify-space-between custom-autocomplete"
                      style="width:100%"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.parameterName }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.parameterNumber }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          {{ item.parameterDescription }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          {{ item.connectionName }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-icon v-if="item.disabled">mdi-cancel</v-icon>
                    </div>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
              <div class="text-h6 mt-3">
                {{ $t('dataSource.table.storageRule') }}
              </div>
              <v-row dense align="center">
                <v-col
                  :cols="6"
                  v-if="
                    (!tabledataobj.triggerSingle || !tabledataobj.triggerOrNot)
                    && tabledataobj.storageMode !== '2'
                    && tabledataobj.storageMode !== '4'"
                >
                  <v-autocomplete
                    class="mt-3"
                    clearable
                    item-text="text"
                    item-value="value"
                    :label="`${$t('dataSource.table.storageFrequency')}*`"
                    :items="storageFrequencyList"
                    :rules="rules.isRequired"
                    v-model="tabledataobj.storageFrequency"
                    :disabled="!isNew && tabledataobj.active === '1'"
                  ></v-autocomplete>
                </v-col>
                <v-col :cols="6">
                  <v-autocomplete
                    class="mt-3"
                    clearable
                    item-text="text"
                    item-value="value"
                    :label="`${$t('dataSource.table.storageDuration')}*`"
                    :items="filterStorageDurationList"
                    :rules="rules.isRequired"
                    v-model="tabledataobj.storageDuration"
                    :disabled="!isNew && tabledataobj.active === '1'"
                  ></v-autocomplete>
                </v-col>
                <v-col :cols="6">
                  <v-checkbox
                    v-model="tabledataobj.needBackup"
                    :label="`${$t('dataSource.table.needBackup')}`"
                    hide-details
                    dense
                    :disabled="!isNew && tabledataobj.active === '1'"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-col>
        <v-col cols="7" v-if="isNew">
          <div class="text-h6">
            {{ subTitle }}
          </div>
          <v-form ref="formright" v-model="valid" lazy-validation>
            <!-- 记录PLC参数 -->
            <v-card-text
              v-if="tabledataobj.storageMode === '1' || tabledataobj.storageMode === '4'"
            >
              <v-row dense>
                <v-col :cols="12">
                  <base-grid
                    ref="paramsGrid"
                    elementName="paramsForSelect"
                    :restoreColumn="true"
                    :options="options"
                    v-model="selectedParams"
                  />
                </v-col>
              </v-row>
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
                         {{ $t('connectionConfiguration.table.number') }}
                        </th>
                        <th class="text-left" style="min-width:240px!important">
                         {{ $t('dataSource.label.columnName') }}
                        </th>
                        <th class="text-left" style="min-width:85px!important">
                         {{ $t('connectionConfiguration.table.deviceName') }}
                        </th>
                        <th class="text-left" style="min-width:250px!important">
                         {{ $t('connectionConfiguration.parameterTable.parameterNumber') }}
                        </th>
                        <th class="text-left" style="min-width:250px!important">
                         {{ $t('connectionConfiguration.parameterTable.parameterName') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, key) in plcParams"
                        :key="key"
                      >
                        <td>{{ key + 1 }}</td>
                        <td>
                          <v-text-field
                            outlined
                            clearable
                            dense
                            class="mt-2"
                            v-model="plcParams[key].columnName"
                            :rules="rules.name"
                          ></v-text-field>
                        </td>
                        <td>
                          <span
                            class="d-inline-block text-truncate"
                            style="max-width: 85px;"
                            :title="item.connectionName"
                          >{{item.connectionName}}</span>
                        </td>
                        <td>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <div
                                class="d-flex justify-space-between"
                              >
                                <span
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                {{item.parameterNumber}}
                                </span>
                              </div>
                            </template>
                            <span>{{item.parameterNumber}}</span>
                          </v-tooltip>
                        </td>
                        <td>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <div
                                class="d-flex justify-space-between"
                              >
                                <span
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                {{item.parameterName}}
                                </span>
                              </div>
                            </template>
                            <span>{{item.parameterName}}</span>
                          </v-tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-card-text>
            <!-- 记录触发间隔时间 -->
            <v-card-text v-if="tabledataobj.storageMode === '2'">
              <v-text-field
                clearable
                :label="`${$t('dataSource.label.columnName')}*`"
                v-model="tabledataobj.columnName"
                :rules="rules.name"
              ></v-text-field>
            </v-card-text>
            <!-- 参数特征提取 -->
            <v-card-text v-if="tabledataobj.storageMode === '3'">
              <v-autocomplete
                class="mt-3"
                clearable
                item-text="parameterName"
                item-value="parameterId"
                :label="`${$t('dataSource.label.parameter')}*`"
                :items="parameterList"
                :rules="rules.isRequired"
                v-model="tabledataobj.parameter"
                return-object
              >
                <template v-slot:item="{ item }">
                <div
                  class="d-flex justify-space-between custom-autocomplete"
                  style="width:100%"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.parameterName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.parameterNumber }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ item.parameterDescription }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ item.connectionName }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-icon v-if="item.disabled">mdi-cancel</v-icon>
                </div>
                </template>
              </v-autocomplete>
              <div class="text-h6 mt-3">
                {{ $t('dataSource.label.file') }}
              </div>
              <div
                class="rounded-lg grey-thin-border mx-3 pa-3"
              >
                <file-upload-non-auto
                  ref="fileUpload"
                  :multiple="true"
                  :accept="'.json, .tar'"
                  :tips="$t('dataSource.label.uploadTips')"
                  :width="'647px'"
                  :height="'180px'"
                  :fileNumLimit="2"
                />
              </div>
              <v-btn
                color="primary"
                small
                :width="647 + 24"
                class="text-none mx-3 mt-2"
                @click="handleUpload"
              >
                {{$t('btn.upload')}}
              </v-btn>
              <div
                class="rounded-lg grey-thin-border mx-3 mt-2"
              >
                <v-simple-table
                  :height="192"
                  fixed-header
                  dense
                  class="rounded-lg"
                >
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                         {{ $t('algorithmConstruction.dialog.step') }}
                        </th>
                        <th class="text-center" style="min-width:240px!important">
                         {{ $t('algorithmConstruction.dialog.content') }}
                        </th>
                        <th class="text-left">
                         {{ $t('algorithmConstruction.dialog.status') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(step, key) in stepList"
                        :key="key"
                      >
                        <td>{{ key + 1 }}</td>
                        <td class="text-center">
                          {{ $t(`algorithmConstruction.dialog.steplist.${key}`) }}
                        </td>
                        <td>
                          <!-- 进行中 -->
                          <v-progress-circular
                            indeterminate
                            size="16"
                            color="info"
                            width="2"
                            v-if="stepList[key].status === 1"
                          ></v-progress-circular>
                          <!-- 成功 -->
                          <v-icon
                            size="16"
                            color="success"
                            v-if="stepList[key].status === 2"
                          >mdi-check-circle-outline</v-icon>
                          <!-- 失败 -->
                          <v-icon
                            size="16"
                            color="error"
                            v-if="stepList[key].status === -1"
                          >mdi-close-circle-outline</v-icon>
                          <!-- 重试 -->
                           <v-btn
                            v-if="stepList[key].status === -1 && key === 4"
                            icon
                            small
                            @click="handleStep5"
                          >
                            <v-icon>mdi-refresh</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-card-text>
          </v-form>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
          :disabled="!isNew || tabledataobj.active === '1' || upLoading"
        >{{ $t('btn.eliminate') }}</v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
          :disabled="!isNew && tabledataobj.active === '1' || upLoading"
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
import FileUploadNonAuto from '@/components/commonUI/FileUploadNonAuto.vue';

let timer = null;
export default {
  name: 'addDataSource',
  data() {
    return {
      valid: true,
      tabledataobj: {
        storageMode: '1',
      },
      options: {
        headers: [
          {
            field: 'no',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            maxWidth: 100,
            headerName: 'dataSource.table.no',
            filter: 'agTextColumnFilter',
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'connectionName',
            headerName: 'connectionConfiguration.table.deviceName',
            filter: 'agTextColumnFilter',
            // eslint-disable-next-line
          },
          {
            field: 'connectionTypeName',
            headerName: 'connectionConfiguration.table.deviceCommunicateType',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'parameterNumber',
            headerName: 'connectionConfiguration.parameterTable.parameterNumber',
            filter: 'agTextColumnFilter',
            minWidth: 250,
          },
          {
            field: 'parameterName',
            headerName: 'connectionConfiguration.parameterTable.parameterName',
            filter: 'agTextColumnFilter',
            minWidth: 250,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: 320,
        pagination: false,
        rowHeight: 30, // 行高过小时若出现滚动条会影响最后一行的选中
      },
      selectedParams: [],
      plcParams: [],
      // 0未开始 1进行中 2成功 -1失败
      stepList: [
        {
          status: 0,
        },
        {
          status: 0,
        },
        {
          status: 0,
        },
        {
          status: 0,
        },
        {
          status: 0,
        },
      ],
      upLoading: false,
      fileList: [],
      apiUrl: '',
      loadJson: null,
      dataKey: [],
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    selecteditem: {
      type: Object,
    },
    isNew: {
      type: Boolean,
    },
  },
  components: {
    BaseGrid,
    FileUploadNonAuto,
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('dataSource', ['storageModeList', 'storageDurationList', 'storageFrequencyList', 'parameterList']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getDataSourceRules();
    },
    subTitle() {
      const { storageMode } = this.tabledataobj;
      if (storageMode) {
        return this.$t(`dataSource.label.storageModeList.${storageMode}`);
      }
      return '-';
    },
    storageModes() {
      return this.storageModeList.map((item) => {
        const obj = {
          ...item,
          text: this.$t(`dataSource.label.storageModeList.${item.value}`),
        };
        return obj;
      });
    },
    rightWidth() {
      return (1300 / 12) * 7 - 60;
    },
    filterStorageDurationList() {
      const { storageFrequencyList, storageDurationList, tabledataobj } = this;
      const { storageFrequency } = tabledataobj;
      const selectFrequency = storageFrequencyList.find((f) => f.value === storageFrequency);
      if (selectFrequency && tabledataobj.storageMode !== '2' && tabledataobj.storageMode !== '4') {
        return selectFrequency.storageDurationList.map((item) => {
          const obj = {
            ...item,
            text: this.$t(`dataSource.label.storageDurationList.${item.value}`),
          };
          return obj;
        });
      }
      return storageDurationList.map((item) => {
        const obj = {
          ...item,
          text: this.$t(`dataSource.label.storageDurationList.${item.value}`),
        };
        return obj;
      });
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dataSource', [
      'addSource',
      'updateSource',
      'getParameterList',
    ]),
    fileCheck() {
      const fileList = this.$refs.fileUpload.getFileList();
      if (!fileList.some((file) => {
        const arr = file.name.split('.');
        return arr[arr.length - 1] === 'json';
      })) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'jsonLack',
        });
        return false;
      }
      if (!fileList.some((file) => {
        const arr = file.name.split('.');
        return arr[arr.length - 1] === 'tar';
      })) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'tarLack',
        });
        return false;
      }
      return fileList;
    },
    handleUpload() {
      const fileList = this.fileCheck();
      if (!fileList) {
        return;
      }
      this.fileList = fileList;
      this.stepList = [
        {
          status: 0,
        },
        {
          status: 0,
        },
        {
          status: 0,
        },
        {
          status: 0,
        },
        {
          status: 0,
        },
      ];
      this.uploading = true;
      // Step 1
      console.log('step1start');
      this.stepList[0].status = 1;
      const jsonFile = fileList.find((file) => {
        const arr = file.name.split('.');
        return arr[arr.length - 1] === 'json';
      });
      if (!jsonFile) {
        this.stepList[0].status = -1;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'jsonLack',
        });
        this.uploading = false;
        return;
      }
      const reader = new FileReader();
      reader.readAsText(jsonFile.raw);
      const that = this;
      // eslint-disable-next-line
      reader.onload = async function () {
        const loadJson = this.result;
        console.log(this.result);
        if (!that.$getIsJson(loadJson)) {
          that.stepList[0].status = -1;
          that.setAlert({
            show: true,
            type: 'error',
            message: 'jsonFormatError',
          });
          that.uploading = false;
          return;
        }
        const {
          innerPort, hostPort, statusCheck, dataProcess, imageName, dataKey,
        } = JSON.parse(loadJson);
        if (!innerPort || !hostPort || !statusCheck || !dataProcess || !imageName || !dataKey) {
          that.stepList[0].status = -1;
          that.setAlert({
            show: true,
            type: 'error',
            message: 'jsonKeyLack',
          });
          that.uploading = false;
          return;
        }
        that.loadJson = JSON.parse(loadJson);
        that.dataKey = dataKey;
        that.stepList[0].status = 2;
        // Step 2
        console.log('step2start');
        that.stepList[1].status = 1;
        const tarFile = that.fileList.find((file) => {
          const arr = file.name.split('.');
          return arr[arr.length - 1] === 'tar';
        });
        const step2reader = new FileReader();
        step2reader.readAsArrayBuffer(tarFile.raw);
        step2reader.onload = async (e) => {
          console.log(e.target.result, 'e');
          console.log(tarFile, 'tarFile');
          const step2result = await that.$dockerPost('images/load', e.target.result, true);
          console.log(step2result, 'step2result');
          if (!step2result) {
            that.stepList[1].status = -1;
            that.uploading = false;
            return;
          }
          that.stepList[1].status = 2;
          // Step 3
          console.log('step3start');
          that.stepList[2].status = 1;
          const fileName = tarFile.name.split('.')[0];
          const step3payload = {
            Image: imageName,
            HostConfig: {
              PortBindings: {},
              Privileged: true,
              RestartPolicy: {
                Name: 'always',
                MaximumRetryCount: 0,
              },
            },
          };
          step3payload.HostConfig.PortBindings[`${innerPort}/tcp`] = [
            {
              HostPort: String(hostPort),
            },
          ];
          console.log(step3payload, 'step3payload');
          const step3result = await that.$dockerPost(`containers/create?name=${fileName}`, step3payload, false);
          console.log(step3result, 'step3result');
          if (!step3result) {
            that.stepList[2].status = -1;
            that.uploading = false;
            return;
          }
          that.stepList[2].status = 2;
          // Step 4
          console.log('step4start');
          that.stepList[3].status = 1;
          const step4result = await that.$dockerPost(`containers/${fileName}/start`, {}, false);
          console.log(step4result, 'step4result');
          if (step4result !== 204) {
            that.stepList[3].status = -1;
            that.uploading = false;
            return;
          }
          that.stepList[3].status = 2;
          // Step 5
          console.log('step5start');
          that.stepList[4].status = 1;
          timer = setTimeout(async () => {
            const step5result = await that.$statusCheck(hostPort, statusCheck, false);
            console.log(step5result, 'step5result');
            if (!step5result || step5result.status !== 1) {
              that.stepList[4].status = -1;
              that.uploading = false;
              return;
            }
            that.stepList[4].status = 2;
            that.apiUrl = dataProcess;
            that.uploading = false;
          }, 1000);
        };
      };
    },
    async handleStep5() {
      if (!this.loadJson) {
        return;
      }
      this.uploading = true;
      this.stepList[4].status = 1;
      const { hostPort, statusCheck, dataProcess } = this.loadJson;
      const step5result = await this.$statusCheck(hostPort, statusCheck, false);
      console.log(step5result, 'step5result');
      if (!step5result || step5result.status !== 1) {
        this.stepList[4].status = -1;
        this.uploading = false;
        return;
      }
      this.stepList[4].status = 2;
      this.apiUrl = dataProcess;
      this.uploading = false;
    },
    async handleSave() {
      if (!this.$refs.formleft.validate()
        || (this.$refs.formright && !this.$refs.formright.validate())) {
        return;
      }
      if (
        this.isNew
        && (this.tabledataobj.storageMode === '1' || this.tabledataobj.storageMode === '4')
        && this.plcParams.length === 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PLCParamsError',
        });
        return;
      }
      if (this.isNew && this.tabledataobj.storageMode === '3' && this.stepList.some((step) => step.status !== 2)) {
        return;
      }
      const {
        tabledataobj, plcParams, isNew, dataKey,
      } = this;
      const {
        dataSourceId,
        dataSourceName,
        dataSourceNumber,
        needBackup,
        storageDuration,
        storageFrequency,
        storageMode,
        triggerOrNot,
        triggerSingle,
        triggerEndParamId,
        triggerEndValue,
        triggerStartParamId,
        triggerStartValue,
        parameter,
        columnName,
      } = tabledataobj;
      let payload = {
        dataSourceName,
        dataSourceNumber,
        needBackup: needBackup ? '1' : '0',
        storageDuration,
        storageFrequency,
        storageMode,
        triggerOrNot: triggerOrNot ? '1' : '0',
        triggerSingle: triggerSingle ? '1' : '0',
        triggerEndParamId,
        triggerEndValue,
        triggerStartParamId,
        triggerStartValue,
      };
      let result = null;
      if (isNew) {
        let basicDataSourceParamDtoList = [];
        let fileList = [];
        if (storageMode === '1' || storageMode === '4') {
          basicDataSourceParamDtoList = plcParams.map((item) => {
            const obj = {
              connectionParameterNumber: `${item.connectionNumber}_${item.parameterNumber}`,
              columnName: item.columnName,
              parameterId: item.parameterId,
              parameterDataType: item.parameterDataType,
            };
            return obj;
          });
        }
        if (storageMode === '2') {
          basicDataSourceParamDtoList = [{
            columnName,
            connectionParameterNumber: 'record_trigger_interval_time',
          }];
        }
        if (storageMode === '3') {
          basicDataSourceParamDtoList = dataKey.map((item) => {
            const obj = {
              connectionParameterNumber: item.name,
              columnName: item.name,
              parameterDataType: item.type,
            };
            return obj;
          });
          basicDataSourceParamDtoList.push({
            columnName: '',
            connectionParameterNumber: `${parameter.connectionNumber}_${parameter.parameterNumber}`,
            parameterId: parameter.parameterId,
            parameterDataType: parameter.parameterDataType,
          });
          fileList = this.$refs.fileUpload.fileList.map((file) => {
            const obj = {
              docType: 'dataSourceDoc',
              fileId: file.fileId,
              fileName: file.fileName,
              fileExtension: file.fileExtension,
              filePath: file.uploadPath,
            };
            return obj;
          });
        }
        payload = {
          ...payload,
          basicDataSourceParamDtoList,
          fileList,
          active: '0',
          modelRequestAddress: this.apiUrl,
        };
        result = await this.addSource(payload);
      } else {
        payload = {
          ...payload,
          dataSourceId,
        };
        result = await this.updateSource(payload);
      }
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.reset();
        this.dialog = false;
        this.$emit('getTableList');
      }
    },
    handleTypeChange() {
      const { storageMode } = this.tabledataobj;
      if (storageMode === '2') {
        this.tabledataobj.triggerOrNot = true;
        this.tabledataobj.triggerSingle = false;
      }
    },
    reset() {
      if (this.$refs.formleft) {
        this.$refs.formleft.reset();
      }
      if (this.$refs.formright) {
        this.$refs.formright.reset();
      }
      this.$nextTick(() => {
        this.tabledataobj = {
          storageMode: '1',
        };
        this.selectedParams = [];
        this.plcParams = [];
        this.apiUrl = '';
        this.stepList = [
          {
            status: 0,
          },
          {
            status: 0,
          },
          {
            status: 0,
          },
          {
            status: 0,
          },
          {
            status: 0,
          },
        ];
        this.loadJson = null;
        this.dataKey = [];
      });
    },
  },
  watch: {
    async dialog() {
      await this.getParameterList();
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      const { selecteditem, isNew } = this;
      if (!selecteditem || isNew) {
        this.options.rowData = this.parameterList;
        this.reset();
        return;
      }
      const {
        dataSourceId,
        dataSourceName,
        dataSourceNumber,
        needBackup,
        storageDuration,
        storageFrequency,
        storageMode,
        triggerOrNot,
        triggerSingle,
        triggerEndParamId,
        triggerEndValue,
        triggerStartParamId,
        triggerStartValue,
        active,
      } = selecteditem;
      this.$nextTick(async () => {
        this.tabledataobj = {
          dataSourceId,
          dataSourceName,
          dataSourceNumber,
          needBackup: needBackup === '1',
          storageDuration,
          storageFrequency,
          storageMode,
          triggerOrNot: triggerOrNot === '1',
          triggerSingle: triggerSingle === '1',
          triggerEndParamId,
          triggerEndValue,
          triggerStartParamId,
          triggerStartValue,
          active,
        };
      });
    },
    selectedParams(val) {
      const { plcParams } = this;
      const filterList = val.filter((v) => !plcParams.some((p) => p.parameterId === v.parameterId))
        .map((f) => {
          const obj = {
            ...f,
            columnName: f.parameterName,
          };
          return obj;
        });
      this.plcParams.push(...filterList);
      this.plcParams = this.plcParams
        .filter((p) => val.some((v) => p.parameterId === v.parameterId));
    },
  },
};
</script>
