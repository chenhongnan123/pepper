<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>测试窗口</span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <!-- 高宽默认100% -->
        <file-upload
          ref="uploadComponent"
          :multiple="true"
          :width="'360px'"
          :height="'300px'"
          :tips="tips"
        />
        <pic-upload
          ref="picUploadComponent"
          :url="url"
          :width="'240px'"
          :height="'100px'"
          :tips="tips"
        />
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
        >
          {{$t('btn.eliminate')}}
        </v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >
          {{$t('btn.save')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapMutations,
} from 'vuex';
import FileUpload from '@/components/commonUI/FileUpload.vue';
import PicUpload from '@/components/commonUI/PicUpload.vue';

export default {
  name: 'TestDialog',
  data() {
    return {
      tips: '支持上传图片、视频和文档',
      url: 'http://bms.kojet.com.cn:8091/MesTest/RuhApi/Upload/uploadfile/ea07c4f7-b061-4cbf-acf4-03f847efa29a.JPG',
    };
  },
  props: {
    testDialog: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    FileUpload,
    PicUpload,
  },
  computed: {
    ...mapState('helper', ['numberEmpty']),
    dialog: {
      get() {
        return this.testDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    handleSave() {
      if (this.$refs.picUploadComponent) {
        console.log('imgUrl', this.$refs.picUploadComponent.imgUrl);
      }
      if (this.$refs.uploadComponent) {
        const id = 1;
        const type = 'type01';
        // console.log('fileList', this.$refs.uploadComponent.fileList);
        // 触发上传组件的绑定文件方法
        this.$refs.uploadComponent.handleSubmit(id, type);
      }
    },
    reset() {
      if (this.$refs.uploadComponent) {
        this.$refs.uploadComponent.clear();
      }
      if (this.$refs.picUploadComponent) {
        this.$refs.picUploadComponent.clearPic();
      }
    },
  },
  watch: {
    // dialog(dialog) {
    //   console.log(dialog, 'dialog');
    //   if (!dialog) {
    //     return;
    //   }
    // },
  },
};
</script>
