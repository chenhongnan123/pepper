<template>
  <div>
    <v-btn
      small
      icon
      class="text-none"
      color="primary"
      @click="handleDownload()"
    >
      <v-icon>mdi-download</v-icon>
    </v-btn>
    <v-btn
      small
      icon
      class="text-none"
      color="primary"
      @click="handleView()"
    >
      <v-icon>mdi-eye-outline</v-icon>
    </v-btn>
    <v-btn
      small
      icon
      class="text-none"
      color="error"
      @click="handleDelete()"
    >
      <v-icon>mdi-trash-can-outline</v-icon>
    </v-btn>
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
import { mapActions } from 'vuex';

import ImageView from '../preview/ImageView.vue';
import VideoView from '../preview/VideoView.vue';
import PdfView from '../preview/PdfView.vue';

export default {
  data() {
    return {
      imageDialog: false,
      videoDialog: false,
      pdfDialog: false,
      filePath: '',
    };
  },
  mounted() {
    // console.log(this.params);
  },
  components: {
    ImageView,
    VideoView,
    PdfView,
  },
  computed: {
    isAccessDownload() {
      const { params } = this;
      return params && params.isAccessDownload;
    },
    isAccessPreview() {
      const { params } = this;
      return params && params.isAccessPreview;
    },
    isAccessDelete() {
      const { params } = this;
      return params && params.isAccessDelete;
    },
    isMobile() {
      const { userAgentData } = navigator;
      return !userAgentData;
    },
  },
  methods: {
    ...mapActions('file', ['deleteFile']),
    goDetail() {
      const { params } = this;
      // console.log('params', params);
      this.$router.push({ name: 'roleDetail', params: { id: params.data.id } });
    },
    handleDownload() {
      const { params } = this;
      const file = params.data;
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
    handleView() {
      const { params } = this;
      const file = params.data;
      // console.log(file, 'file');
      this.filePath = file.filePath;
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
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const { params } = this;
        const file = params.data;
        const { relationshipId } = file;
        const result = await this.deleteFile(relationshipId);
        if (result) {
          params.that.$emit('getTableList');
        }
      }
    },
  },
};
</script>
