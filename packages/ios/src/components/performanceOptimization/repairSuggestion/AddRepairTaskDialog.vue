<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="50%"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-1">
      <v-card class="rounded-lg" style="min-height: 600px;">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title primary-title class="mt-2 pb-0">
          <span class="text-h5">
            {{ $t('repairSuggestion.submitmaintenancetask') }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon class="text-h4">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- 标题分割线 -->
        <div class="d-flex align-center px-5">
          <img
            :src="require('@/assets/icons/img/dialog-circle-big-dark.svg')"
            alt=""
            class="mr-2"
          />
          <img
            :src="require('@/assets/icons/img/dialog-circle-small-dark.svg')"
            alt=""
          />
          <v-divider></v-divider>
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
        </div>
        <v-card-text>
          <div class="d-flex justify-center">
            <v-btn
              color="primary"
              outlined
              class="rounded-xl mr-2 primary-oulined-btn2"
              min-width="280px"
              :disabled="false"
            >
              {{$t('common.submitbtn')}}
            </v-btn>
          </div>
          <div>
            <span class="text-h6">
              {{ $t('knowledge.faultsite') }}
            </span>
            <v-autocomplete
              :items="machineBomList"
              outlined
              dense
              item-text="name"
              item-value="number"
              hide-details
              class="my-3 blueinput"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.number"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <span class="text-h6">
              {{ '任务名称' }}
            </span>
            <v-text-field
              class="my-3 blueinput"
              outlined
              dense
              hide-details
            ></v-text-field>
            <span class="text-h6">
              {{ '情况说明' }}
            </span>
            <v-text-field
              class="my-3 blueinput"
              outlined
              dense
              hide-details
              @change="saveDisabled = false"
            ></v-text-field>
            <span class="text-h6">
              {{ '附件' }}
              <v-btn
                small
                icon
                class="text-none"
                @click="clickImportBtn"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </span>
            <v-data-table
              fixed-header
              item-key="_id"
              :headers="attachmentHeaders"
              disable-pagination
              :items="attachmentList"
              hide-default-footer
            >
              <!-- eslint-disable-next-line -->
              <template #item.action="{ item }">
                <v-btn
                  small
                  icon
                  class="text-none"
                  color="primary"
                  @click="handleView(item)"
                >
                  <v-icon>mdi-eye-outline</v-icon>
                </v-btn>
                <v-btn
                  small
                  icon
                  class="text-none"
                  color="error"
                  @click="handleDelete(item._id)"
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <!-- eslint-disable-next-line -->
    <input
    type="file"
    accept=".mp4,.pdf,image/png,image/jpeg"
    ref="uploader"
    class="d-none"
    id="uploadFiles"
    @change="onFilesChanged">
  </v-dialog>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'addRepairTaskDialog',
  data() {
    return {
      machineBomList: [],
      attachmentList: [],
      attachmentHeaders: [
        { text: '文件名', value: 'filename' },
        { text: '文件类型', value: 'filetype' },
        {
          text: '操作',
          value: 'action',
          sortable: false,
          width: '20%',
        },
      ],
    };
  },
  props: {
    addRepairTaskDialog: {
      type: Boolean,
      required: true,
    },
    machineid: {
      type: Number,
    },
    machinebomid: {
      type: Number,
    },
  },
  components: {
  },
  computed: {
    ...mapState('maintenanceTask', ['taskDialog', 'taskInfo']),
    dialog: {
      get() {
        return this.addRepairTaskDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapMutations('maintenanceTask', ['setTaskDialog', 'toggleTaskDialog']),
    clickImportBtn() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(event) {
      // console.log(event, 'event');
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const extension = file.name.split('.').slice(-1).pop();
      // console.log(extension, 'extension');
      const filename = file.name;
      if (!'PNG,JPEG,JPG,PDF,MP4'.includes(extension.toUpperCase())) {
        this.setAlert({
          show: true,
          type: 'error',
          message: this.$t('document.alertdialog.filetypeerror'),
        });
        return;
      }
      if (file.size > 104857600) {
        this.setAlert({
          show: true,
          type: 'error',
          message: this.$t('document.alertdialog.filesizeerror'),
        });
        return;
      }
      const payloadWithFile = new FormData();
      payloadWithFile.append('file', file);
      const uploadResult = await this.uploadFile({
        payload: payloadWithFile,
      });
      if (uploadResult) {
        const payload = {
          moduleid: this.$route.params.id,
          modulename: 'maintenancetaskdetail',
          filepath: uploadResult,
          filetype: extension,
          filename,
        };
        const result = await this.postRecord({
          elementName: 'fileresource',
          payload,
        });
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: this.$t('maintenancetask.alertdialog.successaction'),
          });
          this.getAttachmentList();
        }
      }
      document.getElementById('uploadFiles').value = null;
    },
    async handleSave() {
      // console.log('123');
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      // console.log('111');
    },
  },
};
</script>
