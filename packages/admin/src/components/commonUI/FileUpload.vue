<template>
  <div :style="`width:${width};height:${height};`">
    <el-upload
      class="upload"
      :class="$vuetify.theme.dark ? 'upload-dark' : 'upload-light'"
      drag
      :action="''"
      :multiple="multiple"
      :show-file-list="false"
      :accept="accept"
      :before-upload="handleBeforeUpload"
      :disabled="uploadDisabled"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t('upload.uploaddrag') }}
        <em>{{ $t('upload.uploadclick') }}</em>
      </div>
      <div class="el-upload__tip align-center" slot="tip">
        {{ uploadTips }}
      </div>
    </el-upload>
    <v-data-table
      dense
      :height="tableHeight"
      :headers="headers"
      :items="fileList"
      disable-pagination
      hide-default-footer
      fixed-header
      item-key="uid"
      class="noborder"
      :class="`${uploadTips.length > 0 ? 'mt-7' : 'mt-2'}`"
    >
      <!-- eslint-disable-next-line -->
      <template #item.fileName="{ item }">
        <div
          v-if="!item.showInput"
          :style="`width: ${fileNameMaxWidth}px;word-wrap:break-word;`"
        >
          {{item.fileName}}
          <span>
            <v-icon
              small
              @click="showInput(item)"
              color="primary"
            >
              mdi-pencil
            </v-icon>
          </span>
        </div>
        <div v-else>
          <v-text-field
            v-model="item.fileName"
            dense
            hide-details
            clearable
            @keyup.enter="handleModify(item)"
            @blur="handleModify(item)"
          />
        </div>
      </template>
      <!-- eslint-disable-next-line -->
      <template #item.action="{ item }">
        <span
          style="color: var(--v-error-base); cursor: pointer;"
          @click.enter="beforeRemove(item)"
          role="button"
          tabindex="0"
          @click="beforeRemove(item)"
          @keyup.enter="beforeRemove(item)"
        >
          {{$t('btn.delete')}}
        </span>
      </template>
    </v-data-table>
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
  name: 'FileUpload',
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
    },
  },
  computed: {
    ...mapGetters('helper', ['locale']),
    tableHeight() {
      const tableheight = (this.height.replace('px', '') - 8) / 2;
      if (this.uploadTips.length > 0) {
        return (this.height.replace('px', '') - 24) / 2;
      }
      return tableheight;
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
    uploadDisabled() {
      const { fileNumLimit, fileList } = this;
      return fileNumLimit && fileList.length >= fileNumLimit;
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
    // 文件上传前自定义上传行为
    handleBeforeUpload(file) {
      if (this.uploadDisabled) { return false; }
      // console.log(file, 'file');
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2); // 计算上传文件的大小，单位是Mb
      if (fileSizeInMB > 50) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'FILE_SIZE_OVER50',
        });
        return false;
      }
      return new Promise((reslove, reject) => {
        const payload = new FormData();
        payload.append('file', file);
        this.uploadFile(payload).then((result) => {
          if (result) {
            this.fileList.push({
              fileName: result.name,
              suffix: result.fileExtension.split('.').pop().toLowerCase(),
              fileExtension: result.fileExtension,
              uploadPath: result.url,
              status: 'success',
              fileId: result.fileId,
              uid: file.uid, // uid唯一标识，用来区分不同文件
              raw: file,
              size: file.size,
            });
          }
          // file.cancel();
          // reslove(false); // return false阻止默认的上传行为
        });
        reject();
      });
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
    // 确认按钮提交事件，包含要绑定的id和类型
    async handleSubmit(id, type) {
      if (this.checkFileList()) {
        const { fileList } = this;
        const uploadList = fileList.map((item) => {
          const obj = {
            outsideId: +id,
            module: type,
            fileName: item.fileName,
            fileExtension: item.fileExtension,
            filePath: item.uploadPath,
            fileId: +item.fileId,
          };
          return obj;
        });
        const payload = uploadList;
        const result = await this.createFile(payload);
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.$emit('uploadsuccess');
        }
      }
    },
    clear() {
      this.fileList = [];
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
