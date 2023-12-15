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
        <span>{{ $t('partManagement.label.addAttachment') }}</span>
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
        <!-- 高宽默认100% -->
        <file-upload
          ref="fileUpload"
          :multiple="true"
          :width="'360px'"
          :height="'300px'"
          @uploadsuccess="dialog = false;refresh()"
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
  mapMutations,
} from 'vuex';
import FileUpload from '@/components/commonUI/FileUpload.vue';

export default {
  name: 'AddDialog',
  data() {
    return {
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
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
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    async handleSave() {
      if (this.$refs.fileUpload) {
        const { id } = this;
        const type = 'partManagementDetail';
        await this.$getTimeout(300);
        // 触发上传组件的绑定文件方法
        this.$refs.fileUpload.handleSubmit(id, type);
      }
    },
    reset() {
      if (this.$refs.fileUpload) {
        this.$refs.fileUpload.clear();
      }
      if (this.$refs.picUploadComponent) {
        this.$refs.picUploadComponent.clearPic();
      }
    },
    refresh() {
      this.$emit('refresh');
    },
  },
};
</script>
