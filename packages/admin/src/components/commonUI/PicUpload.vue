<template>
  <div
    class="uploadContainer"
    :style="`width:${width};height:${height};`"
  >
    <v-card
      outlined
      :height="height"
      :width="width"
    >
      <div
        v-show="imgUrl"
        class="hoverBtn"
      >
        <v-img
          :src="imgUrl"
          alt=""
          height="100%"
          max-width="100%"
          width="auto"
          :contain="true"
        ></v-img>
        <v-fab-transition>
          <v-btn
            color="primary"
            absolute
            fab
            x-small
            class="actionBtns previewbtn"
            @click="handlePicPreview()"
          >
            <v-icon>mdi-eye-outline</v-icon>
          </v-btn>
        </v-fab-transition>
        <v-fab-transition>
          <v-btn
            v-show="!disabled"
            color="primary"
            absolute
            fab
            x-small
            class="actionBtns editbtn"
            @click="handleEdit()"
          >
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </v-fab-transition>
        <v-fab-transition>
          <v-btn
            v-show="!disabled"
            color="primary"
            absolute
            fab
            x-small
            class="actionBtns toprightbtn"
            @click="handleRemove()"
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-fab-transition>
      </div>
      <div
        class="fill-height custom-uploader"
        style="width: 100%;"
      >
        <el-upload
          v-show="(imgUrl===''||imgUrl===null) && !disabled"
          ref="uploadInput"
          :action="''"
          :multiple="false"
          :show-file-list="false"
          :accept="accept"
          :before-upload="beforeUpload"
          class="fill-height"
          style="width: 100%;"
        >
          <v-icon
            id="picinput"
            large
            class="centerbtn fill-height"
          >mdi-plus</v-icon>
          <div class="uploadtips" slot="tip">
            {{ tips }}
          </div>
        </el-upload>
      </div>
    </v-card>
    <v-dialog
      persistent
      scrollable
      v-model="dialogVisible"
      :width="previewWidth"
      :height="previewHeight"
      transition="dialog-transition"
    >
      <v-card
        :height="previewHeight"
      >
        <v-card-title primary-title>
          <span>{{ $t('upload.dialog.preview') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="dialogVisible = false" color="primary">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text :style="`height: ${previewHeight - 90}px;overflow: auto;`">
          <img
            :height="previewHeight - 90"
            style="margin: 0 auto;display: block;"
            :src="imgUrl"
            alt=""
          />
        </v-card-text>
      </v-card>
    </v-dialog>
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
  name: 'PicUpload',
  data() {
    return {
      dialogVisible: false,
      previewWidth: 900,
      previewHeight: 500,
      // accept: 'image/*',
      accept: 'image/jpg, image/png, image/jpeg',
    };
  },
  components: {
    [Upload.name]: Upload,
  }, // 引入element-ui的Upload组件
  props: {
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
    url: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('helper', ['locale']),
    imgUrl: {
      get() {
        return this.url;
      },
      set(val) {
        this.setImgUrl(val); // 更新父组件的url
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('file', ['uploadFile', 'createFile']),
    // 编辑图片
    handleEdit() {
      document.querySelector('#picinput').click();
    },
    setImgUrl(val) {
      this.$emit('updateUrl', val);
    },
    // 删除图片
    async handleRemove() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        this.setImgUrl('');
      }
    },
    // 图片上传接口
    beforeUpload(file) {
      return new Promise((reslove, reject) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          this.setAlert({
            type: 'error',
            message: 'fileTypeError',
          });
          reject();
        }
        const payload = new FormData();
        payload.append('file', file);
        this.uploadFile(payload).then((result) => {
          console.log(result, 'result');
          if (result?.url) {
            this.imgUrl = result.url;
          } else {
            this.imgUrl = '';
          }
          // file.cancel();
          // reslove(false); // return false阻止默认的上传行为
        });
        reject();
      });
    },
    // 图片预览
    handlePicPreview() {
      this.dialogVisible = true;
    },
    // 清除图片
    clearPic() {
      this.imgUrl = '';
    },
  },
};
</script>

<style lang="scss" scoped>
  .uploadContainer {
    ::v-deep .v-card {
      border: 2px dashed #d9d9d9;
      background: transparent;
    }
    .pointer {
      text-align: center;
      cursor: pointer;
    }
    .actionBtns {
      display: none;
    }
    ::v-deep .v-btn--fab.v-size--x-small {
      width: 28px;
      height: 28px;
    }
    .custom-uploader {
      ::v-deep .el-upload {
        width: 100%!important;
        height: 100%!important;
      }
      .centerbtn {
        text-align: center;
      }
    }
    .previewbtn {
      position: absolute;
      bottom: -14px;
      left: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
    }
    .editbtn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
    }
    .toprightbtn {
      position: absolute;
      top: 0;
      right: 0;
    }
    .hoverBtn {
      width: auto;
      height: 100%;
      max-width: 100%;
    }
    .hoverBtn:hover > .actionBtns {
      display: inline-block;
      opacity: 0.75;
    }
    .uploadtips {
      font-size: 12px;
      position: absolute;
      bottom: 0;
      text-align: center;
      width: 100%;
    }
  }
</style>
