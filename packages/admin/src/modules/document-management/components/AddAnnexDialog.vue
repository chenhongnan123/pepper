<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    :max-width="'550px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-card-title primary-title>
        <span>
          {{ $t('documentManagement.dialog.addAnnex') }}
        </span>
        <v-spacer />
        <v-btn
          icon
          small
          color="primary"
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <!-- 高宽默认100% -->
        <file-upload
          ref="fileUpload"
          :multiple="true"
          :width="'500px'"
          :height="'400px'"
          @uploadsuccess="uploadsuccess"
        />
      </v-card-text>
      <v-card-actions class="">
        <v-spacer />
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
        >
          {{ $t('btn.eliminate') }}
        </v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >
          {{ $t('btn.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import FileUpload from '@/components/commonUI/FileUpload.vue';

export default {
  name: 'AddAnnexDialog',
  components: {
    FileUpload,
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    activefloder: {
      required: true,
    },
  },
  data() {
    return {
      tabledataobj: {},
    };
  },
  computed: {
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
  },
  watch: {},
  methods: {
    async handleSave() {
      if (this.$refs.fileUpload) {
        const { activefloder } = this;
        const { folderId } = activefloder;
        const type = 'folder';
        // // 触发上传组件的绑定文件方法
        this.$refs.fileUpload.handleSubmit(folderId, type);
      }
    },
    uploadsuccess() {
      this.$emit('getTableList');
      this.dialog = false;
    },
    reset() {
      if (this.$refs.fileUpload) {
        this.$refs.fileUpload.clear();
      }
      if (this.$refs.picUploadComponent) {
        this.$refs.picUploadComponent.clearPic();
      }
    },
  },
};
</script>
