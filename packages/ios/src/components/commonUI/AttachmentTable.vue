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
    </v-data-table>
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

import ImageView from '../preview2/ImageView.vue';
import VideoView from '../preview2/VideoView.vue';
import PdfView from '../preview2/PdfView.vue';

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
      const { uploadPath, fileName } = file;
      // eslint-disable-next-line no-return-await
      fetch(uploadPath).then(async (res) => await res.blob()).then((blob) => {
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
      // console.log(file, 'file');
      this.filePath = file.filePath;
      switch (file.fileExtension) {
        case '.pdf':
          this.pdfDialog = true;
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
        case '.mov':
        case '.MOV':
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
        const { id } = file;
        const payload = { id };
        const result = await this.deleteFile(payload);
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
        });
      }
      headerlist = [
        ...headerlist,
        {
          text: this.$t('attachment.name'),
          // text: '123',
          value: 'fileName',
        },
        {
          text: this.$t('attachment.filetype'),
          value: 'fileExtension',
        },
        {
          text: this.$t('attachment.uploadby'),
          value: 'createBy',
        },
        {
          text: this.$t('attachment.uploadtime'),
          value: 'createTime',
        },
        {
          text: this.$t('attachment.action'),
          value: 'action',
        },
      ];
      return headerlist;
    },
  },
};
</script>
