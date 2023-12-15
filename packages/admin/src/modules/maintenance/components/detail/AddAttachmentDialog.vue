<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'550px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('maintenance.btn.addAttachment')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
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
      <v-card-actions class="mt-4">
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
import FileUpload from '@/components/commonUI/FileUpload.vue';

export default {
  name: 'AttachmentAddDialog',
  data() {
    return {
      tabledataobj: {
      },
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    maintenanceId: {
      type: String,
    },
  },
  components: {
    FileUpload,
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
    // 模块名称
    moduleName() {
      return this.$route.name;
    },
  },
  methods: {
    async handleSave() {
      if (this.$refs.fileUpload) {
        const { maintenanceId } = this;
        // const type = 'operationSchemeLineDoc';
        // 触发上传组件的绑定文件方法
        this.$refs.fileUpload.handleSubmit(maintenanceId, this.moduleName);
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
  watch: {
  },
};
</script>
