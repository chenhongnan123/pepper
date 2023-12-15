<template>
  <div>
    <v-data-table
      disable-filtering
      disable-pagination
      fixed-header
      :headers="headers"
      :height="height"
      hide-default-footer
      item-key="id"
      :items="attachmentList"
      dense
    >
      <!-- eslint-disable-next-line -->
      <template #item.action="{item}">
        <v-btn
          small
          icon
          class="text-none"
          color="primary"
          @click="handleDownload(item)"
          v-if="isAccessDownload"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-btn
          small
          icon
          class="text-none"
          color="primary"
          @click="handleView(item)"
          v-if="isAccessPreview"
        >
          <v-icon>mdi-eye-outline</v-icon>
        </v-btn>
        <v-btn
          small
          icon
          class="text-none"
          color="error"
          @click="handleDelete(item)"
          v-if="isAccessDelete"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.fileName="{item}">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <div
              class="d-flex justify-space-between"
            >
              <span
                v-bind="attrs"
                v-on="on"
              >
              <span
                class="d-inline-block text-truncate"
                style="max-width: 240px;"
              >{{item.fileName}}</span>
              </span>
            </div>
          </template>
          <span>{{item.fileName}}</span>
        </v-tooltip>
        <!-- <span
          class="d-inline-block text-truncate"
          style="max-width: 240px;"
          :title="item.fileName"
        >{{item.fileName}}</span> -->
      </template>
    </v-data-table>
    <image-view
      :previewDialog="imageDialog"
      :filePath="filePath"
      @closeDialog="imageDialog = false"
    />
    <video-view
      :previewDialog="videoDialog"
      :filePath="filePath"
      @closeDialog="videoDialog = false,filePath = ''"
      />
    <pdf-view
      :previewDialog="pdfDialog"
      :filePath="filePath"
      @closeDialog="pdfDialog = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import ImageView from '../preview/ImageView.vue';
import VideoView from '../preview/VideoView.vue';
import PdfView from '../preview/PdfView.vue';

export default {
  name: 'AttachmentTable',
  data() {
    return {
      imageDialog: false,
      videoDialog: false,
      pdfDialog: false,
      filePath: '',
    };
  },
  props: {
    height: {
      type: Number,
    },
    attachmentList: {
      type: Array,
      required: true,
    },
    isShowAttachmentType: {
      type: Boolean,
    },
    isAccessDownload: {
      type: Boolean,
    },
    isAccessPreview: {
      type: Boolean,
    },
    isAccessDelete: {
      type: Boolean,
    },
  },
  methods: {
    ...mapActions('file', ['deleteFile']),
    handleDownload(file) {
      // console.log(file);
      const { filePath, fileName } = file;
      // eslint-disable-next-line no-return-await
      fetch(filePath).then(async (res) => await res.blob()).then((blob) => {
        // 创建隐藏的可下载链接
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = URL.createObjectURL(blob);
        // 保存下来的文件名
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        // 移除元素
        document.body.removeChild(a);
      });
    },
    handleView(file) {
      this.filePath = file.filePath;
      // this.filePath = `http://47.98.238.55${encodeURI(file.filePath)}`;
      switch (file.fileExtension) {
        case '.pdf':
          if (this.isMobile) {
            window.open(this.filePath);
          } else {
            this.pdfDialog = true;
          }
          break;
        case '.img':
        case '.png':
        case '.jpg':
        case '.jpeg':
        {
          this.imageDialog = true;
          break;
        }
        case '.mp4':
        case '.MOV':
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
    async handleDelete(file) {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const { relationshipId } = file;
        const result = await this.deleteFile(relationshipId);
        if (result) {
          this.$emit('getTableList');
        }
      }
    },
  },
  components: {
    ImageView,
    VideoView,
    PdfView,
  },
  computed: {
    headers() {
      let headerlist = [];
      if (this.isShowAttachmentType) {
        headerlist.push({
          text: this.$t('attachment.type'),
          value: 'attTypeName',
          width: 100,
        });
      }
      headerlist = [
        ...headerlist,
        {
          text: this.$t('attachment.name'),
          value: 'fileName',
          width: 200,
        },
        {
          text: this.$t('attachment.filetype'),
          value: 'fileExtension',
          width: 100,
        },
        {
          text: this.$t('attachment.uploadby'),
          value: 'createBy',
          width: 100,
        },
        {
          text: this.$t('attachment.uploadtime'),
          value: 'createTime',
          width: 100,
        },
        {
          text: this.$t('attachment.action'),
          value: 'action',
          width: 120,
        },
      ];
      return headerlist;
    },
    isMobile() {
      const { userAgentData } = navigator;
      return !userAgentData;
    },
  },
};
</script>
