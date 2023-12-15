<template>
  <div
    :style="`width: ${width}px;`"
  >
    <div class="mb-2 tab-container">
      <v-row
        dense
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col :cols="5">
          <div class="model-tab float-end">
            <v-tabs
              v-if="bomInfoOptional"
              color="primary"
              v-model="bomKey"
              centered
              class="blackTabs"
              :optional="true"
              @change="bomTabChange"
            >
              <v-tab
                v-for="(item, index) in bomTabItems"
                :key="`model_tab_${index}`"
              >
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-tabs
              v-else
              color="primary"
              v-model="bomKey"
              centered
              class="blackTabs"
              @change="bomTabChange"
            >
              <v-tab
                v-for="(item, index) in bomTabItems"
                :key="`model_tab_${index}`"
              >
                {{ item }}
              </v-tab>
            </v-tabs>
          </div>
        </v-col>
        <v-col :cols="7">
          <div class="file-tab float-start">
            <v-tabs
              v-if="fileOptional"
              color="primary"
              v-model="fileKey"
              show-arrows
              centered
              class="blackTabs"
              :optional="true"
              @change="fileTabChange"
            >
              <v-tab
                v-for="(item, index) in fileTabItems"
                :key="`file_tab_${index}`"
              >
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-tabs
              v-else
              color="primary"
              v-model="fileKey"
              show-arrows
              centered
              class="blackTabs"
              @change="fileTabChange"
            >
              <v-tab
                v-for="(item, index) in fileTabItems"
                :key="`file_tab_${index}`"
              >
                {{ item }}
              </v-tab>
            </v-tabs>
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- 视频图片文件 -->
    <div
      v-if="!fileOptional && bomInfoOptional"
      :style="`height: ${cardHeight}px;`"
    >
      <v-row>
        <v-col
          :cols="1"
          class="switchBtn"
          align="center"
        >
          <v-btn
            icon
            rounded
            class="leftbtn"
            @click="prevClick()"
            :disabled="prevDisabled"
            :ripple="false"
          >
            <v-icon color="primary">mdi-menu-left</v-icon>
          </v-btn>
        </v-col>
        <v-col :cols="10">
          <div class="custom-card">
            <v-card
              class="gradient-card rounded-lg"
              :style="`height: ${cardHeight}px;`"
            >
              <div class="rectangle-1"></div>
              <div class="rectangle-2"></div>
              <div class="rectangle-3"></div>
              <div class="rectangle-4"></div>
              <div class="rectangle-5"></div>
              <div class="rectangle-6"></div>
              <div class="rectangle-7"></div>
              <div class="rectangle-8"></div>
              <v-card-title>
                <span class="card-title">
                  {{ currentFile.fileName || '' }}
                  {{ currentFile.fileExtension || '' }}
                </span>
              </v-card-title>
              <v-card-text
                :style="`height: ${fileHeight}px;`"
              >
                <div
                  v-if="fileKey === 0"
                  class="fill-height"
                >
                  <video
                    v-if="currentFile.filePath"
                    ref="video"
                    width="90%"
                    height="100%"
                    controls
                    style="margin: 0 auto;display: block;"
                  >
                    <track kind="captions" />
                    <source
                      :src="currentFile.filePath"
                      type="video/mp4"
                    >
                  </video>
                </div>
                <v-row
                  v-if="fileKey === 1"
                  class="fill-height"
                  align-content="center"
                  justify="center"
                >
                  <v-col
                    :cols="12"
                    class="text-center pa-0"
                  >
                    <img
                      :src="currentFile.filePath"
                      alt=""
                      :style="`max-height: ${fileHeight - 16}px;height: auto;width:100%;`"
                    />
                  </v-col>
                </v-row>
                <div
                  v-if="fileKey === 2"
                  class="fill-height"
                >
                  <div id="pdfView" class="fill-height"></div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
        <v-col
          :cols="1"
          class="switchBtn"
          align="center"
        >
          <v-btn
            icon
            rounded
            class="rightbtn"
            @click="nextClick()"
            :disabled="nextDisabled"
            :ripple="false"
          >
            <v-icon color="primary">mdi-menu-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <!-- 设备bom -->
    <div v-else>
      <!-- 零件图片 -->
      <div
        class="deviceImgContainer"
        :style="`width: ${width}px;`"
      >
        <img
          class="device-img"
          :style="`width: ${width}px;`"
          alt=""
          :src="imgUrl"
        />
      </div>
      <!-- 零件信息卡片 -->
      <div class="custom-card">
        <v-card
          class="cardContainer bluecard rounded-lg rightcard my-2"
          :style="`height: ${cardHeight}px`"
          style="background: transparent;border: none!important;"
          rounded
        >
          <v-card-text
            :style="`height: ${cardHeight}px`"
          >
            <v-row no-gutters>
              <v-col :cols="12">
                <div
                  class="mb-2"
                  :style="`height: ${materialPicHeight}px;`"
                ></div>
                <div
                  :style="`height: ${infoHeight}px;`"
                >
                  <div class="d-flex">
                    <div
                      class="primary--text numbertitle text-hidden-overflow"
                    >
                      {{ bomDetail?.bomName }}
                    </div>
                    <div
                      class="ml-auto"
                    >
                      <div
                        class="label-chip"
                        :class="`${getAlarmColor(bomDetail.alarmTag)}--text`"
                        :style="`background-color: ${getAlarmBgColor(bomDetail.alarmTag)};`"
                      >
                        <img
                          v-if="bomDetail.alarmTag === '0'"
                          class="alarm-img mr-1"
                          :src="require('@/assets/icons/img/fault-diagnosis/normalalarm.png')"
                          alt=""
                        />
                        <img
                          v-if="bomDetail.alarmTag === '1'"
                          class="alarm-img mr-1"
                          :src="require('@/assets/icons/img/fault-diagnosis/dataalarm.svg')"
                          alt=""
                        />
                        <img
                          v-if="bomDetail.alarmTag === '2'"
                          class="alarm-img mr-1"
                          :src="require('@/assets/icons/img/fault-diagnosis/plcalarm.png')"
                          alt=""
                        />
                        <img
                          v-if="bomDetail.alarmTag === '3'"
                          class="alarm-img mr-1"
                          :src="require('@/assets/icons/img/fault-diagnosis/nonalarm.png')"
                          alt=""
                        />
                        {{ getAlarmText(bomDetail.alarmTag) }}
                      </div>
                    </div>
                  </div>
                  <div class="mt-4">
                    <div class="leftdivider ml-1">
                      <div>
                        <span
                          class="label info--text pl-2"
                          style="font-size: 10px;"
                        >
                          {{ $t('digitalarchives.materialname') }}
                        </span>
                        <span
                          class="infotext icon--text ml-4"
                          style="font-size: 16px;"
                        >{{ bomDetail?.partName || '-' }}</span>
                      </div>
                      <div>
                        <span
                          class="label info--text pl-2"
                          style="font-size: 10px;"
                        >
                          {{ $t('digitalarchives.materialdescription') }}
                        </span>
                        <span
                          class="infotext icon--text ml-4"
                          style="font-size: 16px;"
                        >{{ bomDetail?.partDescription || '-' }}</span>
                      </div>
                      <div>
                        <span
                          class="label info--text pl-2"
                          style="font-size: 10px;"
                        >
                          {{ $t('digitalarchives.materialtype') }}
                        </span>
                        <span
                          class="infotext icon--text ml-4"
                          style="font-size: 16px;"
                        >{{ getPartTypeName(bomDetail?.partType) || '-' }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4">
                    <v-row dense :gutter="2">
                      <v-col :cols="5">
                        <div
                          class="icon--text bgcolorgrey2 tableline pl-2"
                        >{{ $t('digitalarchives.title') }}</div>
                      </v-col>
                      <v-col :cols="7">
                        <div
                          class="icon--text bgcolorgrey tableline pl-2"
                        >{{ $t('digitalarchives.contents') }}</div>
                      </v-col>
                      <v-col :cols="5">
                        <div
                          class="info--text tableline pl-2"
                        >{{ $t('digitalarchives.specification') }}</div>
                        <div
                          class="info--text bgcolorgrey3 tableline pl-2"
                        >{{ $t('digitalarchives.supplier') }}</div>
                        <div
                          class="info--text bgcolorgrey3 tableline pl-2"
                        >{{ $t('digitalarchives.electricalSymbol') }}</div>
                        <div
                          class="info--text tableline pl-2"
                        >{{ $t('digitalarchives.changeDate') }}</div>
                        <div
                          class="info--text bgcolorgrey3 tableline pl-2"
                        >{{ $t('digitalarchives.maintenanceDate') }}</div>
                      </v-col>
                      <v-col :cols="7">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <div
                              v-bind="attrs"
                              v-on="on"
                              class="info--text tableline pl-2 text-truncate"
                            >
                              {{ bomDetail.model || '-' }}
                            </div>
                          </template>
                          <div>{{ bomDetail.model || '-' }}</div>
                        </v-tooltip>
                        <div
                          class="info--text tableline pl-2 text-truncate"
                        >{{ bomDetail?.supplier || '-' }}</div>
                        <div
                          class="info--text bgcolorgrey3 tableline pl-2 text-truncate"
                        >{{ bomDetail?.electricSymbol || '-' }}</div>
                        <div
                          class="info--text tableline pl-2 text-truncate"
                        >
                          {{ bomDetail?.lastReplaceTime || '-' }}
                        </div>
                        <div
                          class="info--text bgcolorgrey3 tableline pl-2 text-truncate"
                        >
                          {{ bomDetail?.lastMaintenanceTime || '-' }}
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import PDFObject from 'pdfobject';

export default {
  name: 'AssemblyDetail',
  data() {
    return {
      moment,
      clientheight: document.body.clientHeight,
      clientwidth: document.body.clientWidth,
      bomKey: 0,
      fileKey: -1,
      bomInfoOptional: false,
      fileOptional: true,
      selectedFileList: [],
      currentPage: 1,
      supportFileType: {
        image: ['.jpg', '.jpeg', '.png'],
        video: ['.mp4', '.mov'],
        files: ['.pdf'],
      },
    };
  },
  components: {
  },
  props: {
    bomId: {
      type: [String, Number],
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    cardHeight: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState('faultDiagnosis', ['itemTypeList', 'bomDetail', 'fileList']),
    infoHeight() {
      return this.cardHeight - 56 - this.materialPicHeight;
    },
    materialPicHeight() {
      return (this.cardHeight - 64) / 1.65 - 64;
    },
    // 模型展示区域高度
    modelHeight() {
      return this.clientheight - 300;
    },
    // 文件预览区域高度
    fileHeight() {
      return this.cardHeight - 64;
    },
    bomTabItems() {
      return [
        this.$t('digitalarchives.devicediagram'),
        // this.$t('digitalarchives.materialboom'),
      ];
    },
    fileTabItems() {
      return [
        this.$t('digitalarchives.video'),
        this.$t('digitalarchives.picture'),
        this.$t('digitalarchives.file'),
      ];
    },
    // 当前视频/图片/pdf文件对象
    currentFile() {
      if (this.selectedFileList?.length) {
        return this.selectedFileList[this.currentPage - 1];
      }
      return {};
    },
    prevDisabled() {
      if (this.selectedFileList.length === 0 || this.currentPage === 1) {
        return true;
      }
      return false;
    },
    nextDisabled() {
      if (this.selectedFileList.length === 0
      || this.currentPage >= this.selectedFileList.length) {
        return true;
      }
      return false;
    },
    imgUrl() {
      return this.bomDetail.partPic;
    },
  },
  watch: {
    bomId: {
      handler(val) {
        // 重置选项和页码
        this.resetTab();
        if (val) {
          this.init();
        } else {
          // 清空bom信息和文件列表
          this.setBomDetail({});
          this.setFileList([]);
        }
      },
      immediate: true,
    },
    currentFile: {
      handler(val) {
        // 视频tab页下
        if (this.fileKey === 0) {
          // 解决url切换，video标签仍播放原url视频问题
          if (val?.filePath && this.$refs.video) {
            const videos = this.$refs.video;
            videos.src = val.filePath;
          }
        } else if (this.fileKey === 2) {
          // pdf预览，当前页变化时，重新加载pdf
          if (val?.filePath) {
            this.initPDF();
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapMutations('faultDiagnosis', ['setBomDetail', 'setFileList']),
    ...mapActions('faultDiagnosis', ['getItemTypes', 'getBomDetail', 'getFileList']),
    async init() {
      this.resetTab();
      await this.getItemTypes();
      if (this.bomId) {
        await this.getBomDetail(Number(this.bomId));
        await this.getFileList({
          module: 'partManagementDetail',
          bomId: Number(this.bomId),
        });
      }
    },
    // 重置tab页选项和页码
    resetTab() {
      this.bomKey = 0;
      this.fileKey = -1;
      this.bomInfoOptional = false;
      this.fileOptional = true;
      this.currentPage = 1;
    },
    getPartTypeName(type) {
      const { itemTypeList } = this;
      const itemType = itemTypeList.find((item) => item.dictValue === type);
      if (itemType) {
        return itemType.dictLabel;
      }
      return '';
    },
    getAlarmColor(alarmTag) {
      switch (alarmTag) {
        case '0':
          return 'primary';
        case '1':
          return 'warning';
        case '2':
          return 'error';
        default:
          return '';
      }
    },
    getAlarmBgColor(alarmTag) {
      switch (alarmTag) {
        case '0':
          return 'rgba(52, 211, 243, 0.2)';
        case '1':
          return 'rgba(245, 154, 35, 0.2)';
        case '2':
          return 'rgba(217, 0, 27, 0.2)';
        default:
          return 'rgba(255, 255, 255, 0.4)';
      }
    },
    getAlarmText(alarmTag) {
      switch (alarmTag) {
        case '0':
          return this.$t('dataAlarmDetail.normal');
        case '1':
          return this.$t('dataAlarmDetail.dataalarm');
        case '2':
          return this.$t('dataAlarmDetail.plcalarm');
        default:
          return this.$t('dataAlarmDetail.nonalarm');
      }
    },
    bomTabChange() {
      if (Number(this.bomKey) >= 0) {
        this.fileOptional = true;
        this.bomInfoOptional = false;
        this.fileKey = -1; // 重置fileKey
      }
    },
    fileTabChange() {
      if (Number(this.fileKey) >= 0) {
        this.bomInfoOptional = true;
        this.fileOptional = false;
        this.bomKey = -1; // 重置modelKey
        this.currentPage = 1; // 重置页码
        // 获取当前tab页下的文档列表
        this.selectedFileList = this.getFileListByType(this.fileKey);
        // 文档tab页下，加载pdf文档
        if (this.fileKey === 2) {
          this.initPDF();
        } else {
          this.resetPDF(); // 非文档tab页下重置删除pdf
        }
      }
    },
    // 获取当前选择类型的文档列表：视频、图片、pdf
    getFileListByType(type) {
      if (type === 0) {
        return this.fileList.filter(
          (item) => this.supportFileType.video.indexOf(item.fileExtension.toLowerCase()) > -1,
        );
      }
      if (type === 1) {
        return this.fileList.filter(
          (item) => this.supportFileType.image.indexOf(item.fileExtension.toLowerCase()) > -1,
        );
      }
      if (type === 2) {
        return this.fileList.filter(
          (item) => this.supportFileType.files.indexOf(item.fileExtension.toLowerCase()) > -1,
        );
      }
      return [];
    },
    // 重置pdf预览
    resetPDF() {
      const element = document.getElementById('pdfView');
      if (element?.children?.length) {
        element.children[0].remove();
      }
    },
    // 加载pdf预览
    initPDF() {
      this.resetPDF();
      const { filePath } = this.currentFile;
      this.$nextTick(() => {
        PDFObject.embed(filePath, '#pdfView', { page: 1, height: `${this.fileHeight - 16}px` });
      });
    },
    prevClick() {
      if (this.selectedFileList?.length && this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextClick() {
      if (this.selectedFileList?.length && this.currentPage < this.selectedFileList.length) {
        this.currentPage += 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .tab-container {
    width: 100%;
    .model-tab {
      // width: 35%;
      min-width: 128px;
    }
    .file-tab {
      // width: 35%;
      width: 313px;
    }
  }

  .deviceImgContainer {
    position: relative;
    z-index: 1;
    .device-img {
      position: absolute;
      top: 0;
      max-width: 100%;
      max-height: 310px;
      object-fit: contain;
      // border: 1px solid #797979;
    }
  }

  .label-chip {
    font-size: 14px;
    height: 32px;
    display: inline-flex;
    line-height: 20px;
    border-radius: 4px;
    align-items: center;
    cursor: default;
    max-width: 100%;
    outline: none;
    overflow: hidden;
    padding: 0 12px;
    position: relative;
    text-decoration: none;
    transition-duration: 0.28s;
    transition-property: box-shadow, opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    vertical-align: middle;
    white-space: nowrap;
    .alarm-img {
      width: 16px;
      height: 16px;
    }
  }

  .cardContainer{
    z-index: 2;
    .cardtitle {
      text-align: center;
      font-size: 30px;
    }
    .numbertitle {
      font-size: 34px;
      text-align: left;
      text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
      line-height: 32px;
      height: 40px;
    }

    .leftdivider {
      border-left: 2px solid;
      border-color: var(--v-info-base);
      .label {
        font-weight: 500;
        text-align: left;
      }
      .infotext {
        font-weight: 700;
        text-align: left;
        vertical-align: bottom;
      }
    }

    .tableline {
      line-height: 30px;
    }

    .bgcolorgrey {
      background-color: rgba(144, 141, 141, 0.49);
    }

    .bgcolorgrey2 {
      background-color: rgba(70, 70, 70, 0.35);
    }

    .bgcolorgrey3 {
      background-color: rgba(48, 48, 48, 0.4);
    }
  }

  .switchBtn {
    ::v-deep() .v-btn--icon{
      height: 196px;
      width: 27px;
      border-radius: 4px;
      border: 1px solid #1565a4;
      background-color: rgba(16, 34, 66, 0.5);
      box-sizing: border-box;
      box-shadow: inset 0px 1px 6px 0px rgba(4, 151, 253, 0.44);
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
    .leftbtn {
      left: 50%;
      top: 50%;
    }

    .rightbtn {
      right: 25%;
      top: 50%;
    }
  }

  .custom-card {
    .v-card {
      position: relative;
      .rectangle-1, .rectangle-2, .rectangle-3, .rectangle-4,
      .rectangle-5, .rectangle-6, .rectangle-7, .rectangle-8 {
        position: absolute;
        border-radius: 7px;
        background-color: var(--v-primary2-base);
        box-sizing: border-box;
      }
      .rectangle-1 {
        top: -2px;
        left: calc(10% + 10px);
        width: 100px;
        height: 2px;
      }
      .rectangle-2 {
        top: 0;
        left: calc(75% - 10px);
        width: 150px;
        height: 2px;
      }
      .rectangle-3 {
        right: -2px;
        top: calc(10% - 10px);
        width: 4px;
        height: 125px;
      }
      .rectangle-4 {
        right: -2px;
        top: calc(60% - 10px);
        width: 4px;
        height: 50px;
      }
      .rectangle-5 {
        bottom: -2px;
        left: calc(85% - 10px);
        width: 100px;
        height: 2px;
      }
      .rectangle-6 {
        bottom: 0;
        left: calc(15% - 10px);
        width: 150px;
        height: 2px;
      }
      .rectangle-7 {
        left: -2px;
        top: calc(80% - 10px);
        width: 4px;
        height: 50px;
      }
      .rectangle-8 {
        left: -2px;
        top: calc(15% + 10px);
        width: 4px;
        height: 125px;
      }
    }
    .card-title {
      color: var(--v-primary-base);
      font-size: 1.25rem;
    }
  }

  .gradient-card {
    border: solid 1px transparent;
    border-radius: 16px!important;
    background-origin: border-box;
    background-clip: content-box, border-box;
    background-image: linear-gradient(#162831, #162831),
      linear-gradient(0deg, #23789a, #e5ecf1 25%, #a5c9db 26%, #23789a);
    ::v-deep .v-card {
      background-color: transparent;
      box-shadow: none;
    }
  }
  .text-hidden-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
