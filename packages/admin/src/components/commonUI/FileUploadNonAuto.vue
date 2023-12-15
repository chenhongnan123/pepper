<template>
  <div :style="`width:${width};height:${height};`">
    <el-upload
      class="upload"
      :class="$vuetify.theme.dark ? 'upload-dark' : 'upload-light'"
      drag
      :action="''"
      :multiple="multiple"
      :accept="accept"
      :auto-upload="false"
      :file-list="fileList"
      :limit="fileNumLimit"
      :on-exceed="handleExceed"
      ref="fileUploadNonAuto"
    >
      <i class="el-icon-upload" style="font-size: 40px;line-height: 40px;"></i>
      <div class="el-upload__text" style="top: calc(50% + 10px);">
        {{ $t('upload.uploaddrag') }}
        <em>{{ $t('upload.uploadclick') }}</em>
      </div>
      <div class="el-upload__tip align-center" slot="tip">
        {{ uploadTips }}
      </div>
    </el-upload>
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';
import { Upload } from 'element-ui';

export default {
  name: 'FileUploadNonAuto',
  data() {
    return {
      fileList: [], // 上传的文件列表
      headers: [
        {
          text: this.$t('upload.table.fileName'),
          align: 'start',
          sortable: false,
          value: 'fileName',
          width: '50%',
        },
        {
          text: this.$t('upload.table.fileType'),
          align: 'start',
          sortable: false,
          value: 'suffix',
          width: '24%',
        },
        {
          text: this.$t('upload.table.action'),
          align: 'start',
          sortable: false,
          value: 'action',
          width: '20%',
        },
      ],
      // accept: '.pdf, .mp4, .jpg, .png, .jpeg, .mov',
    };
  },
  components: {
    [Upload.name]: Upload,
  }, // 引入element-ui的Upload组件
  props: {
    multiple: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    tips: {
      type: String,
      default: '',
    },
    accept: {
      type: String,
      default: '.pdf, .mp4, .jpg, .png, .jpeg, .mov',
    },
    fileNumLimit: {
      type: Number,
      default: 1000,
    },
  },
  computed: {
    ...mapGetters('helper', ['locale']),
    tableHeight() {
      if (this.uploadTips.length > 0) {
        return (this.height.replace('px', '') - 24) / 2;
      }
      return (this.height.replace('px', '') - 8) / 2;
    },
    fileNameMaxWidth() {
      return Number(this.width.replace('px', '')) * 0.5;
    }, // 限制文件名宽度
    uploadTips() {
      if (this.tips.length > 0) {
        return this.tips;
      }
      return this.$t('upload.tips', { type: 'pdf、jpg、jpeg、png、mp4、mov' });
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('file', ['uploadFile', 'createFile']),
    // 监听上传文件变更
    // handleChange(file, fileList) {
    //   console.log(file, fileList, 'handleChange');
    // },
    showInput(item) {
      this.fileList = this.fileList.map((i) => {
        const obj = i;
        if (obj.uid === item.uid) {
          obj.showInput = true;
        } else {
          obj.showInput = false;
        }
        return obj;
      });
    },
    // 修改附件名称
    handleModify(item) {
      this.fileList = this.fileList.map((i) => {
        const obj = i;
        if (obj.uid === item.uid) {
          obj.showInput = false;
        }
        return obj;
      });
    },
    // 监听删除文件
    async beforeRemove(file) {
      // console.log(file, 'beforeRemove');
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
      }
    },
    // 超出文件上传限制触发
    handleExceed(file, fileList) {
      console.log(file, 'file');
      console.log(fileList, 'fileList');
      this.setAlert({
        show: true,
        type: 'error',
        message: 'fileListLimit',
      });
      return false;
    },
    checkFileList() {
      if (this.fileList.length === 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'fileListEmpty',
        });
        return false;
      }
      const emptyIndex = this.fileList.find((item) => !item.fileName || item.fileName === '');
      if (emptyIndex) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'fileNameEmpty',
        });
        return false;
      }
      return true;
    },
    clear() {
      this.fileList = [];
    },
    getFileList() {
      return this.$refs.fileUploadNonAuto.uploadFiles;
    },
  },
};
</script>

<style lang="scss" scoped>
  .upload {
    width: 100%;
    height: 50%;
    ::v-deep .el-upload {
      width: 100%;
      height: 100%;
    }
    ::v-deep .el-upload-dragger {
      position: relative;
      width: 100%!important;
      height: 100%!important;
    }
    ::v-deep .el-icon-upload {
      position: absolute;
      display: block;
      margin: 0;
      top: calc(50% - 33px);
      left: calc(50% - 33px);
    }
    ::v-deep .el-upload__text{
      position: absolute;
      top: calc(50% + 33px);
      left: calc(50% - 100px);
    }
    ::v-deep .el-upload__tip {
      margin-top: 0px;
    }
    .align-center {
      text-align: center;
    }
  }

  .upload-light {
    ::v-deep .el-upload-dragger {
      border: 2px dashed #d9d9d9;
    }
    ::v-deep .el-upload-dragger:hover {
      border-color: var(--v-primary-base);
    }
    ::v-deep .el-upload__text {
      em {
        color: var(--v-primary-base);
        font-weight: 600;
      }
    }
  }

  .upload-dark {
    ::v-deep .el-upload-dragger {
      border: 2px dashed #d9d9d9;
      background: #1E1E1E;
      color: #FFFFFF;
    }
    ::v-deep .el-upload-dragger:hover {
      border-color: var(--v-primary-base);
    }
    ::v-deep .el-upload__text {
      color: rgba(255, 255, 255, 0.7);
      em {
        color: var(--v-primary-base);
        font-weight: 600;
      }
    }
  }
</style>
