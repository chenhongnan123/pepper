<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'900px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('algorithmConstruction.dialog.addEvent')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" :disabled="upLoading">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row
            justify="center"
            dense
          >
            <v-col cols="6">
              <selectable-bom-tree
                class="mx-3 mt-3"
                ref="selectableBomTree"
                :height="bomTreeHeight"
                :placeholder="$t('algorithmConstruction.dialog.searchPart')"
                :bomList="formatBomList(bomTreeList)"
                :isMultiple="false"
                :isErr="!!bomErrMsg"
                :isShowMaintenancePart="false"
                :isShowMainPart="false"
                itemChildren="childrenBomList"
                itemKey="bomId"
                itemText="bomName"
                alarmDisabledKey="isParent"
              />
              <div class="mx-4 error--text">{{bomErrMsg}}</div>
            </v-col>
            <v-col cols="6">
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.name"
                :label="`${$t('algorithmConstruction.table.name')}*`"
                v-model="tabledataobj.eventName"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :label="`${$t('algorithmConstruction.table.description')}`"
                v-model="tabledataobj.eventDescription"
                :counter="500"
                :rules="rules.over500"
              ></v-text-field>
              <v-radio-group
                v-model="tabledataobj.type"
                class="mx-3 mt-1"
                row
              >
                <v-radio
                  :label="$t('algorithmConstruction.dialog.standard')"
                  :value="'0'"
                ></v-radio>
                <v-radio
                  class="ml-2"
                  :label="$t('algorithmConstruction.dialog.custom')"
                  :value="'1'"
                ></v-radio>
              </v-radio-group>
              <div
                v-if="tabledataobj.type === '1'"
                class="rounded-lg grey-thin-border mx-3 pa-3"
              >
                <file-upload-non-auto
                  ref="fileUpload"
                  :multiple="true"
                  :accept="'.json, .tar'"
                  :tips="$t('dataSource.label.uploadTips')"
                  :width="'370px'"
                  :height="'180px'"
                  :fileNumLimit="2"
                />
              </div>
              <v-btn
                color="primary"
                small
                :width="398"
                class="text-none mx-3 mt-2"
                @click="handleUpload"
                v-if="tabledataobj.type === '1'"
              >
                {{$t('btn.upload')}}
              </v-btn>
              <div
                v-if="tabledataobj.type === '1'"
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
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          :disabled="upLoading"
          @click="reset"
        >
          {{$t('btn.eliminate')}}
        </v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          :disabled="upLoading"
          @click="handleSave"
        >
          {{$t('btn.save')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';
import selectableBomTree from '@/components/commonUI/SelectableBomTree.vue';
import FileUploadNonAuto from '@/components/commonUI/FileUploadNonAuto.vue';

let timer = null;
export default {
  name: 'AddDialog',
  data() {
    return {
      tabledataobj: {
        eventName: '',
        eventDescription: '',
        type: '0',
      },
      bomTreeHeight: 630,
      bomErrMsg: '', // 设备bom选择错误提示
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
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    selectableBomTree,
    FileUploadNonAuto,
  },
  computed: {
    ...mapState('algorithmConstruction', ['bomTreeList']),
    ...mapGetters('algorithmConstruction', ['formatBomList']),
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
      return this.$getMaintenanceRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert', 'setPepperLoading']),
    ...mapActions('algorithmConstruction', ['getBomTree', 'addAlgorithmModel', 'editAlgorithmModel']),
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
      console.log(fileList, 'fileList');
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
          innerPort, hostPort, statusCheck, dataProcess, imageName,
        } = JSON.parse(loadJson);
        if (!innerPort || !hostPort || !statusCheck || !dataProcess || !imageName) {
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
      if (!this.$refs.selectableBomTree.selectfloder.length) {
        this.bomErrMsg = this.$t('verification.isrequired');
        return;
      }
      if (!this.$refs.form.validate()) {
        return;
      }
      if (this.tabledataobj.type === '1' && this.stepList.some((step) => step.status !== 2)) {
        return;
      }
      // console.log(this.$refs.selectableBomTree.selectfloder, 'selectfloder');
      const { selectfloder } = this.$refs.selectableBomTree;
      const {
        bomId,
        bomName,
        bomParentId,
        // parentBomName,
      } = selectfloder[0];
      const {
        tabledataobj,
        apiUrl,
      } = this;
      const {
        eventName,
        eventDescription,
        type,
      } = tabledataobj;
      const payload = {
        bomId,
        bomName,
        parentBomId: bomParentId || '',
        // parentBomName,
        eventName,
        apiUrl,
        eventDescription: eventDescription || '',
        type,
        active: 0, // 0-禁用 1-启用
      };
      const result = await this.addAlgorithmModel(payload);
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.fileUpload) {
        this.$refs.fileUpload.clear();
      }
      if (this.$refs.selectableBomTree) {
        this.$refs.selectableBomTree.selectfloder = [];
      }
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {
            eventName: '',
            eventDescription: '',
            type: '0',
          };
        });
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
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getBomTree();
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },
  },
};
</script>
