<template>
  <div
    class="mt-2"
    :style="`height: ${contentHeight}px;overflow-y: auto;width: 100%;`">
    <div
      class="cardContainer mb-2"
    >
      <v-row dense style="width: 100%;">
        <v-col
          :cols="6"
          v-for="(doc, index) in fileCardList"
          :key="`file_${index}`"
        >
          <v-card
            class="darkbluecard elevation-4"
            style="height: 76px;cursor: pointer;"
            @click.stop="handleView(doc)"
          >
            <v-card-title class="pa-2">
              <v-icon
                default
                color="secondary"
              >
                {{ getIcon(doc) }}
              </v-icon>
              <v-spacer />
              <v-chip
                style="max-width: 80px"
                small
                outlined
                class="text-truncate"
                color="secondary"
              >
                <span class="primary--text">{{ doc.extension }}</span>
              </v-chip>
            </v-card-title>
            <v-card-text class="mt-1">
                <v-row dense>
                  <v-col :cols="6">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          v-bind="attrs"
                          v-on="on"
                          style="text-align: left;"
                          class="font-weight-black text-truncate icon--text"
                          >
                            {{ doc.fileName }}
                          </div>
                      </template>
                      <div>{{ doc.fileName }}</div>
                    </v-tooltip>
                  </v-col>
                  <v-spacer />
                  <v-col :cols="6">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          v-bind="attrs"
                          v-on="on"
                          style="text-align: right;"
                          class="text-truncate"
                        >
                          {{ doc.createTime ? doc.createTime : '' }}
                        </div>
                      </template>
                      <div>{{ doc.createTime ? doc.createTime : '' }}</div>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <image-view
      :previewDialog="imageDialog"
      :filePath="filePath"
      @closeDialog="imageDialog = false"
    />
    <video-view
      :previewDialog="videoDialog"
      :filePath="filePath"
      @closeDialog="videoDialog = false"
    />
    <pdf-view
      :previewDialog="pdfDialog"
      :filePath="filePath"
      @closeDialog="pdfDialog = false"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ImageView from '@/components/preview2/ImageView.vue';
import VideoView from '@/components/preview2/VideoView.vue';
import PdfView from '@/components/preview2/PdfView.vue';

export default {
  name: 'RelateDocument',
  data() {
    return {
      clientheight: document.body.clientHeight,
      clientwidth: document.body.clientWidth,
      imageDialog: false,
      videoDialog: false,
      pdfDialog: false,
      filePath: '',
    };
  },
  components: {
    ImageView,
    PdfView,
    VideoView,
  },
  props: {
    height: {
      type: Number,
    },
    details: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('digitalArchives', ['deviceDetail', 'bomDetail', 'fileList']),
    contentHeight() {
      return this.height - 10;
    },
    // 模块，区分设备层二级bom层
    module() {
      if (this.details?.bomLevel === '0') {
        return 'DeviceDoc';
      }
      if (this.details?.bomLevel === '2') {
        return 'partManagementDetail';
      }
      return '';
    },
    // bomId或设备id
    bomId() {
      if (this.module === 'DeviceDoc') {
        return Number(this.deviceDetail.deviceId);
      }
      if (this.module === 'partManagementDetail') {
        if (this.details?.bomId) {
          return Number(this.details.bomId);
        }
      }
      return '';
    },
    fileCardList() {
      const { fileList } = this;
      if (fileList?.length) {
        return fileList.map((item) => ({
          ...item,
          extension: this.getExtension(item.fileExtension),
        }));
      }
      return [];
    },
  },
  watch: {
    bomId: {
      handler(val) {
        if (val) {
          this.init();
        } else {
          this.setFileList([]);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapMutations('digitalArchives', ['setFileList']),
    ...mapActions('digitalArchives', ['getFileList']),
    async init() {
      await this.getFileList({
        module: this.module,
        bomId: this.bomId,
      });
    },
    getExtension(extension) {
      const result = extension.indexOf('.') > -1 ? extension.split('.')[1] : extension;
      return result.toLowerCase();
    },
    getIcon(document) {
      // eslint-disable-next-line
      if (document.extension === 'png' || document.extension === 'jpg' || document.extension === 'jpeg') {
        return 'mdi-file-image-outline';
      }
      if (document.extension === 'pdf') {
        return 'mdi-file-pdf-outline';
      }
      if (document.extension === 'mp4') {
        return 'mdi-file-video-outline';
      }
      if (document.extension === 'doc' || document.extension === 'docx') {
        return 'mdi-file-word';
      }
      if (document.extension === 'ppt' || document.extension === 'pptx') {
        return 'mdi-file-powerpoint-outline';
      }
      if (document.extension === 'xls' || document.extension === 'xlsx') {
        return 'mdi-microsoft-excel';
      }
      return 'mdi-file-delimited-outline';
    },
    async handleView(file) {
      this.filePath = file.filePath;
      switch (file.extension) {
        case 'pdf':
        case '.pdf':
          this.pdfDialog = true;
          break;
        case 'img':
        case 'png':
        case 'jpg':
        case 'jpeg':
        case '.img':
        case '.png':
        case '.jpg':
        case '.jpeg':
        {
          this.imageDialog = true;
          break;
        }
        case 'mp4':
        case 'mov':
        case '.mp4':
        case '.mov':
        {
          this.videoDialog = true;
          break;
        }
        default:
        {
          this.imageDialog = true;
          break;
        }
      }
    },
  },
};
</script>

<style scoped>
</style>
