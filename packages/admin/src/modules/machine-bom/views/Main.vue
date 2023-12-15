<template>
  <v-container fluid class="darkNoBgColor">
    <portal to="app-header" v-if="pagePortalMode.machineBom">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="init"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="6" class="pr-3">
        <v-card
          :height="picHeight + 48"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:48px">
            <div>{{ $t('machineBom.title.devicePhoto') }}</div>
            <v-spacer></v-spacer>
            <v-btn
              v-if="isBtnAccess('system:deviceFile:download')"
              color="primary"
              class="mr-1"
              icon
              x-small
              @click="handleDownload()"
              :disabled="!saveData.devicePic"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </div>
          <div
            class="pic-upload mx-4"
            :style="`height: ${picHeight - 12}px;`"
          >
            <pic-upload
              ref="picUpload"
              :url="saveData.devicePic"
              :height="`${picHeight - 12}px`"
              @updateUrl="updateUrl"
              :disabled="!isBtnAccess('system:devicePic:upload')"
            />
          </div>
        </v-card>
        <v-card
          :height="detailHeight + 48"
          class=""
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:48px">
            <div>{{ $t('machineBom.title.deviceInfo') }}</div>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              small
              class="mr-2"
              @click="GoToDetail()"
            >
              {{ $t('machineBom.btn.viewDetail') }}
            </v-btn>
            <v-btn
              v-if="isBtnAccess('basic:device:edit')"
              color="primary"
              outlined
              small
              @click="handleSaveBtn()"
              :disabled="saveDisabled"
            >
              {{ $t('btn.save') }}
            </v-btn>
          </div>
          <div
            class="mx-4"
            :style="`height: ${detailHeight}px;`"
          >
            <v-card
              style="overflow: hidden;"
              :height="detailHeight"
              elevation="0"
              color="bg"
            >
              <v-card-text
                :style="`height: ${detailHeight - 56}px;overflow-y: auto;`"
              >
                <v-form
                  ref="form"
                  lazy-validation
                >
                  <v-row
                    class="custom-row mt-2"
                  >
                    <v-col :cols="4">
                      <v-text-field
                        clearable
                        :label="`${$t('machineBom.label.deviceCode')}*`"
                        v-model="saveData.deviceNumber"
                        :rules="rules.name"
                        :counter="50"
                        :disabled="!isBtnAccess('basic:device:edit')"
                        @change="saveDisabled = false"
                      ></v-text-field>
                    </v-col>
                    <v-col :cols="4">
                      <v-text-field
                        clearable
                        :label="`${$t('machineBom.label.deviceName')}*`"
                        v-model="saveData.deviceName"
                        :rules="rules.name"
                        :counter="50"
                        :disabled="!isBtnAccess('basic:device:edit')"
                        @change="saveDisabled = false"
                      ></v-text-field>
                    </v-col>
                    <v-col :cols="4">
                      <v-text-field
                        clearable
                        :label="`${$t('machineBom.label.description')}`"
                        v-model="saveData.deviceDescription"
                        :disabled="!isBtnAccess('basic:device:edit')"
                        @change="saveDisabled = false"
                      ></v-text-field>
                    </v-col>
                    <v-col :cols="4">
                      <v-text-field
                        clearable
                        :label="`${$t('machineBom.label.deviceSpec')}`"
                        v-model="saveData.model"
                        :disabled="!isBtnAccess('basic:device:edit')"
                        @change="saveDisabled = false"
                      ></v-text-field>
                    </v-col>
                    <v-col :cols="4">
                      <v-text-field
                        clearable
                        v-model="saveData.deviceType"
                        :label="`${$t('machineBom.label.deviceType')}`"
                        :disabled="!isBtnAccess('basic:device:edit')"
                        @change="saveDisabled = false"
                      ></v-text-field>
                    </v-col>
                    <v-col :cols="4">
                      <v-menu
                        ref="datePickerMenu"
                        v-model="menuVisiable"
                        :close-on-content-click="false"
                        :return-value.sync="saveData.startDate"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="saveData.activationTime"
                            :label="`${$t('machineBom.label.startDate')}*`"
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="rules.isRequired"
                            :disabled="!isBtnAccess('basic:device:edit')"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="saveData.activationTime"
                          no-title
                          scrollable
                          locale="locale"
                          @input="menuVisiable = false"
                          :disabled="!isBtnAccess('basic:device:edit')"
                          @change="saveDisabled = false"
                        >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col :cols="12">
                      <v-text-field
                        clearable
                        v-model="saveData.remark"
                        :label="`${$t('machineBom.label.remark')}`"
                        :disabled="!isBtnAccess('basic:device:edit')"
                        @change="saveDisabled = false"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6"  class="pl-3">
        <v-card
          :height="contentheight + 48"
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:48px">
            <div>{{ $t('machineBom.title.deviceAttachment') }}</div>
            <v-spacer></v-spacer>
            <v-btn
              v-if="isBtnAccess('system:deviceFile:upload')"
              color="primary"
              small
              dense
              class="mr-2"
              @click="addDialog = true"
              :disabled="!(mainDevice&&mainDevice.deviceId)"
            >
              <v-icon small>mdi-plus</v-icon>
              {{ $t('btn.add') }}
            </v-btn>
          </div>
          <v-row no-gutters class="pa-4">
            <v-col>
              <attachment-table
                :height="contentheight - 32"
                :attachmentList="fileList"
                @getTableList="getAttachmentList"
                :isAccessDownload="isBtnAccess('system:deviceFile:download')"
                :isAccessPreview="isBtnAccess('system:deviceFile:preview')"
                :isAccessDelete="isBtnAccess('system:deviceFile:remove')"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <add-dialog
      :addDialog="addDialog"
      :device="mainDevice"
      @closeDialog="addDialog = false"
      @refresh="getAttachmentList"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
} from 'vuex';
import PicUpload from '@/components/commonUI/PicUpload.vue';
import AttachmentTable from '@/components/commonUI/attachmentTable/AttachmentTable.vue';
import AddDialog from '../components/main/AddDialog.vue';

export default {
  name: 'machineBom',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      saveData: {
      },
      menuVisiable: false,
      addDialog: false,
      saveDisabled: true,
    };
  },
  components: {
    PicUpload,
    AttachmentTable,
    AddDialog,
  },
  created() {
    this.init();
  },
  activated() {
  },
  deactivated() {
  },
  methods: {
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapActions('machineBom', [
      'getDeviceMainItem',
      'updateDevice',
      'getFileList',
    ]),
    updateUrl(val) {
      this.saveData.devicePic = val;
      this.updateMachine('updatePic');
    }, // 更新图片地址
    async init() {
      const result = await this.getDeviceMainItem();
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        await this.getAttachmentList();
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'noMainDevice',
        });
      }
      this.saveData = {
        ...this.saveData,
        ...this.mainDevice,
      }; // 初始化数据
    },
    // 获取附件列表
    async getAttachmentList() {
      const outsideId = this.mainDevice.deviceId;
      if (outsideId) {
        await this.getFileList(outsideId);
      }
    },
    GoToDetail() {
      this.$router.push({
        name: 'machineBomDetail',
        params: {
          id: this.deviceId,
          name: this.deviceName,
        },
      });
    },
    handleSaveBtn() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.updateMachine('updateInfo');
    },
    async updateMachine(type) {
      const { saveData } = this;
      const {
        deviceId,
        deviceNumber,
        deviceName,
        deviceDescription,
        model,
        deviceType,
        activationTime,
        remark,
        devicePic,
      } = saveData;
      const payload = {
        deviceId,
        deviceNumber,
        deviceName,
        deviceDescription,
        model,
        deviceType,
        activationTime,
        remark,
        devicePic,
      };
      const result = await this.updateDevice(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.init();
        this.saveDisabled = true;
      } else if (type === 'updatePic') {
        // 更新失败时，清空图片地址
        this.saveData.devicePic = '';
      }
    },
    // 下载设备图片
    handleDownload() {
      const fileName = this.$t('machineBom.label.headPortraitName');
      const url = this.saveData.devicePic;
      if (!url) {
        return;
      }
      this.$downloadByUrl(url, fileName);
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('machineBom', [
      'mainDevice',
      'deviceDetail',
      'deviceFileList',
      'fileTypeList',
    ]),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('helper', ['locale']),
    rules() {
      return this.$getMachineRules();
    },
    moduleName() {
      return this.$route.name;
    },
    picHeight() {
      return (this.clientHeight - 145 - 48 * 2) * 0.55 + 12;
    },
    detailHeight() {
      return (this.clientHeight - 145 - 48 * 2) * 0.45 - 12;
    },
    contentheight() {
      return this.clientHeight - 145 - 48 + 12;
    },
    deviceId() {
      return this.mainDevice.deviceId || '';
    },
    deviceName() {
      return this.mainDevice.deviceName || '';
    },
    fileList() {
      return this.deviceFileList || [];
    },
  },
};
</script>

<style lang="scss" scoped>
  .content-row {
    ::v-deep .col-6 {
      padding: 0!important;
    }
  }
  .pic-upload {
    width: 95%;
  }
  .custom-row {
    ::v-deep .col-4, .col-12 {
      padding: 4px;
    }
    // ::v-deep input {
    //   font-size: 14px;
    // }
  }
</style>
