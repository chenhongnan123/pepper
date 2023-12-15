<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'420px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>{{ $t('machineBom.dialog.addAttachment') }}</span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          @click="dialog = false"
          color="primary"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <!-- <v-form ref="form" lazy-validation> -->
          <!-- 高宽默认100% -->
          <file-upload
            class="mt-2"
            ref="fileUpload"
            :multiple="true"
            :width="'370px'"
            :height="'400px'"
          />
        <!-- </v-form> -->
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
          :disabled="loading"
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
  mapActions,
} from 'vuex';
import FileUpload from '@/components/commonUI/FileUpload.vue';

export default {
  name: 'AddDialog',
  data() {
    return {
      loading: false,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    device: {
      type: Object,
    },
  },
  components: {
    FileUpload,
  },
  computed: {
    ...mapState('machineBom', ['fileTypeList']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getCommonRules();
    },
    fileTypes() {
      return this.fileTypeList || [];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('file', ['createFile']),
    async handleSave() {
      this.loading = true;
      const type = 'DeviceDoc'; // 设备单独的docType
      // if (!this.$refs.form.validate()) {
      //   this.loading = false;
      //   return;
      // }
      if (this.$refs.fileUpload) {
        const filelist = this.$refs.fileUpload.fileList;
        if (!this.$refs.fileUpload.checkFileList()) {
          this.loading = false;
          return;
        }
        // console.log(filelist, 'filelist');
        if (filelist?.length) {
          const uploadList = filelist.map((item) => {
            const obj = {
              outsideId: this.device.deviceId,
              module: type,
              fileId: item.fileId,
              fileName: item.fileName,
              fileExtension: item.fileExtension,
              filePath: item.uploadPath,
            };
            return obj;
          });
          const payload = uploadList;
          const result = await this.createFile(payload);
          if (result) {
            this.dialog = false;
            this.$emit('refresh');
          }
        }
        this.loading = false;
      }
    },
    reset() {
      if (this.$refs.fileUpload) {
        this.$refs.fileUpload.clear();
      }
      // this.$refs.form.reset();
    },
  },
};
</script>
