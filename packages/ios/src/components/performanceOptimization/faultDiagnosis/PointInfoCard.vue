<template>
  <div class="pr-2">
    <div
      class="primary--text font-weight-bold bluetitlepart mt-8"
    >
      <div class="title" style="width: 102px">
        测点信息
      </div>
      <div class="bgImg">
        <img
          :src="require('@/assets/icons/img/darkbluesquare-short.svg')"
          alt=""
        />
      </div>
      <div class="cardtop" style="left: 115px">
        <div class="darkbluerectangle"></div>
        <div class="lightbluerectangle"></div>
      </div>
    </div>
    <v-card
      class="bluecard bluecard-decoration-5 rounded-xl"
      rounded
      :style="`height: ${cardHeight}px;overflow:hidden;`"
    >
      <v-card-text
        :style="`height: ${contentHeight}px;overflow-y: auto;`"
        class="overflow-y-auto px-4 pt-8 pb-0"
      >
        <v-row style="font-size: 16px;">
          <v-col :cols="4">
            <div class="text-subtitle-1 primary--text">测点名称</div>
            <div>{{ alarmObj?.pointName }}</div>
          </v-col>
          <v-col :cols="4">
            <div class="text-subtitle-1 primary--text">零件代码</div>
            <div>{{ alarmObj?.pnCode }}</div>
          </v-col>
          <v-col :cols="4">
            <div class="text-subtitle-1 primary--text">零件名称</div>
            <div>{{ alarmObj?.pnName }}</div>
          </v-col>
          <v-col :cols="12" class="pa-0 px-4">
            <!-- 触发条件为单点的测点不显示历史曲线按钮 -->
            <v-btn
              outlined
              color="primary"
              rounded
              v-if="alarmObj?.triggeringCondition !== '单点'"
              @click="isShowHistoryCurve = true"
            >
              查看历史曲线
            </v-btn>
          </v-col>
          <v-col :cols="12">
            <div class="text-subtitle-1 primary--text">上次报（预）警时间</div>
            <div>{{ alarmObj?.lastAlarmTime || '----' }}</div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          outlined
          class="mr-2"
          color="primary"
          rounded
          @click="handleShowElecManual"
        >查看电气原理图</v-btn>
        <v-btn
          outlined
          class="mr-2"
          color="primary"
          rounded
          @click="handleShowDeviceManual"
        >查看设备说明书</v-btn>
      </v-card-actions>
    </v-card>
    <HistoryCurve
      :isShow="isShowHistoryCurve"
      @closeDialog="isShowHistoryCurve = false"
    />
    <PdfView
      :previewDialog="isShowPreviewDialog"
      :filePath="filePath"
      :pageNum="pageNum"
      @closeDialog="isShowPreviewDialog = false"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import PdfView from '@/components/preview2/PdfView.vue';
import HistoryCurve from './HistoryCurve.vue';

export default {
  name: 'FeedStockChart',
  data() {
    return {
      isShowHistoryCurve: false,
      isShowPreviewDialog: false,
      filePath: '',
      pageNum: '1',
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
  },
  components: {
    HistoryCurve,
    PdfView,
  },
  computed: {
    ...mapState('faultDiagnosis', [
      'alarmDetail',
      'fileList',
    ]),
    cardHeight() {
      return this.height - 26;
    },
    contentHeight() {
      return this.cardHeight - 55;
    },
    alarmObj() {
      const alarmId = Number(this.$route.query.alarmId);
      const obj = this.alarmDetail.find((item) => item.alarmId === alarmId) || {};
      return obj;
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapActions('faultDiagnosis', ['getPageNumBySymbol']),
    async handleShowDeviceManual() {
      await this.$store.dispatch('faultDiagnosis/getFileList');
      const fileObj = this.fileList
        ?.filter((item) => item.fileExtension === '.pdf')
        ?.find((item) => item.attTypeName === '设备说明书');
      if (fileObj) {
        // window.open(fileObj.uploadPath);
        this.filePath = fileObj.uploadPath;
        this.isShowPreviewDialog = true;
      } else {
        this.SET_ALERT({
          show: true,
          type: 'error',
          message: this.$t('faultDiagnosis.noFile'),
        });
      }
    },
    async handleShowElecManual() {
      await this.$store.dispatch('faultDiagnosis/getFileList');
      const fileObj = this.fileList
        ?.filter((item) => item.fileExtension === '.pdf')
        ?.find((item) => item.attTypeName === '电气原理图');
      if (fileObj) {
        // 获取文件地址
        this.filePath = fileObj.uploadPath;
        const bomList = await this.$store.dispatch('faultDiagnosis/getBomArray');
        if (bomList.length) {
          const bomObj = bomList.find((item) => item.productId === Number(this.alarmObj.pnId));
          if (bomObj) {
            // 获取电气符号
            const { electricSymbol } = bomObj;
            if (electricSymbol) {
              const payload = {
                electricalSymbol: electricSymbol,
                fileUrl: fileObj.uploadPath,
              };
              const page = await this.getPageNumBySymbol(payload);
              if (page) {
                this.pageNum = page.toString();
              }
            }
          }
        }
        this.isShowPreviewDialog = true;
      } else {
        this.SET_ALERT({
          show: true,
          type: 'error',
          message: this.$t('faultDiagnosis.noFile'),
        });
      }
    },
  },
};
</script>
