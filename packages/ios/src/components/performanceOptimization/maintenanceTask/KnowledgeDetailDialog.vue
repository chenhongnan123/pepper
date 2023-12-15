<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="60%"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-1">
      <v-card class="rounded-lg" style="min-height: 600px;">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title primary-title>
          <span>
            {{
              $t('maintenanceTask.knowledge')
            }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
            <v-icon>mdi-close</v-icon>
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
          <v-btn-toggle
            v-model="tabkey"
            tile
            group
            class="group-btn-tab"
          >
            <v-btn
              v-for="(item,index) in tabItems"
              :key="index"
              :width="`${(strLen(item.name) - 6) > 0
                ? 102 + (strLen(item.name) - 6) * 15
                : 102}px`"
              class="tab-item"
              :ripple="false"
            >
              <img
              v-if="index === tabkey"
              :src="require('@/assets/icons/img/tpm-tab-item-active-dark.svg')"
              :width="`${(strLen(item.name) - 6) > 0
                ? 102 + (strLen(item.name) - 6) * 15
                : 102}px`"
              height="35px"
              alt=""
              class="item-background">
              <img
              v-else
              :src="require('@/assets/icons/img/tpm-tab-item-unactive-dark.svg')"
              :width="`${(strLen(item.name) - 6) > 0
                ? 102 + (strLen(item.name) - 6) * 15
                : 102}px`"
              height="35px"
              alt=""
              class="item-background">
              <span
                class="text-h6 font-weight-bold"
                :class="index === tabkey? 'primary--text' : 'info--text'"
              >
              {{ item.name }}
              </span>
            </v-btn>
          </v-btn-toggle>
          <!-- 任务内容 -->
          <div v-if="tabkey === 0">
            <v-row no-gutters class="my-2">
              <v-col cols="4" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.alarmCode') }}
                </span>
                <v-text-field
                  class="blueinput"
                  outlined
                  dense
                  :value="taskDetail.alarmCode"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="8" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.alarmName') }}
                </span>
                <v-text-field
                  class="blueinput"
                  outlined
                  dense
                  :value="taskDetail.alarmName"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters class="my-2">
              <v-col cols="4" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.faultPhenomenon') }}
                </span>
                <v-textarea
                  class="blueinput"
                  outlined
                  dense
                  v-model="taskDetail.faultPhenomenon"
                  disabled
                  auto-grow
                  rows="8"
                ></v-textarea>
              </v-col>
              <v-col cols="4" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.faultreason') }}
                </span>
                <v-textarea
                  class="blueinput"
                  outlined
                  dense
                  v-model="taskDetail.faultCause"
                  auto-grow
                  rows="8"
                  disabled
                ></v-textarea>
              </v-col>
              <v-col cols="4" class="px-2">
                <span class="text-h6 mt-3">
                  {{ $t('maintenanceTask.repairsolution') }}
                </span>
                <v-textarea
                  class="blueinput"
                  outlined
                  dense
                  v-model="taskDetail.solutionMeasures"
                  auto-grow
                  rows="8"
                  disabled
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
          <!-- 零件更换 -->
          <div v-if="tabkey === 1">
            <v-row no-gutters>
              <v-col>
                <v-data-table
                  disable-filtering
                  disable-pagination
                  fixed-header
                  :headers="headers"
                  hide-default-footer
                  :height="400"
                  item-key="id"
                  :items="partList"
                  dense
                  class="mt-2"
                >
                </v-data-table>
              </v-col>
            </v-row>
          </div>
          <!-- 附件 -->
          <div v-if="tabkey === 2">
            <attachment-table
              :height="400"
              :attachmentList="attachmentList"
              :isAccessPreview="true"
            />
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import {
  mapActions,
} from 'vuex';

import AttachmentTable from '@/components/commonUI/AttachmentTable.vue';

export default {
  data() {
    return {
      tabkey: 0,
      taskDetail: {},
      partList: [],
      attachmentList: [],
      docType: 'experience',
      defectContent: '',
      defectDesc: '',
    };
  },
  props: {
    knowledgeDetailDialog: {
      type: Boolean,
      required: true,
    },
    expertknowledge: {
      type: Object,
      required: true,
    },
  },
  components: {
    AttachmentTable,
  },
  computed: {
    dialog: {
      get() {
        return this.knowledgeDetailDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
    tabItems() {
      return [
        {
          name: this.$t('maintenanceTask.taskContent'),
        },
        {
          name: this.$t('maintenanceTask.replacematerial'),
        },
        {
          name: this.$t('maintenanceTask.attachment'),
        },
      ];
    },
    headers() {
      return [
        {
          text: 'No.',
          value: 'no',
        },
        {
          text: this.$t('maintenanceTask.materialnumber'),
          value: 'partId',
        },
        {
          text: this.$t('maintenanceTask.materialname'),
          value: 'partName',
        },
        {
          text: this.$t('maintenanceTask.materialname'),
          value: 'partDescription',
        },
        {
          text: this.$t('maintenanceTask.quantity'),
          value: 'partCount',
        },
      ];
    },
  },
  methods: {
    ...mapActions('maintenanceTask', ['getCurExpertKnowledge', 'getPartList', 'getAttachmentList']),
    strLen(str) {
      let count = 0;
      for (let i = 0; i < str.length; i += 1) {
        count += str.charCodeAt(i) <= 128 ? 1 : 2;
      }
      return count;
    },
    async init() {
      const { expertiseId } = this.expertknowledge;
      this.taskDetail = await this.getCurExpertKnowledge(expertiseId);
      this.partList = await this.getPartList(expertiseId);
      this.attachmentList = await this.getAttachmentList({
        id: expertiseId,
        docType: this.docType,
      });
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      this.init();
    },
  },
};
</script>
