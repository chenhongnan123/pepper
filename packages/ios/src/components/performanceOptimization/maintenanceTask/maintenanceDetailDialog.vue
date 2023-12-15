<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="moreInfo?'1600px':'1000px'"
    transition="dialog-transition"
  >
    <v-row no-gutters>
      <v-col :cols="moreInfo?'7':'12'">
        <div class="app-dialog pa-1">
          <v-card class="rounded-lg" style="min-height: 600px;">
            <div
              v-for="i in 5"
              :key="i"
              :class="`rectangle-${i}`"
            ></div>
            <v-card-title primary-title class="mt-2 pb-0">
              <span class="text-h5">
                {{ `${selectedMaintenance?selectedMaintenance.schemaName:''}` }}
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
              <div class="d-flex align-center">
                <v-btn-toggle
                  v-model="tabkey"
                  tile
                  group
                  class="group-btn-tab"
                >
                  <v-btn
                    v-for="(item,index) in leftTab"
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
                <v-spacer></v-spacer>
              </div>
              <v-data-table
                fixed-header
                item-key="_id"
                :headers="headers"
                disable-pagination
                disable-sort
                :items="maintenanceDetailList"
                hide-default-footer
                height="300"
                dense
              >
              </v-data-table>
              <div class="d-flex align-center">
                <span class="">{{$t('maintenanceTask.comment')}}</span>
                <v-spacer></v-spacer>
                <span class="primary--text mr-4">{{$t('maintenanceTask.schemaImg')}}</span>
                <v-btn icon @click="moreInfo = !moreInfo" x-small>
                  <v-icon  v-if="moreInfo" size="22" color="primary">
                    {{'mdi-menu-open'}}
                  </v-icon>
                  <img v-else :src="require('@/assets/icons/img/btn-moreinfo-active.svg')" alt="" />
                </v-btn>
              </div>
              <v-textarea
                class="my-3 blueinput"
                outlined
                dense
                hide-details
                :value="selectedMaintenance?selectedMaintenance.remark:''"
                disabled
                auto-grow
                rows="3"
              ></v-textarea>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
      <v-col v-if="moreInfo" cols="5" class="ml-n1">
        <div class="app-dialog pa-1 ml-n2">
          <v-card class="rounded-lg" style="min-height: 600px;">
            <div
              v-for="i in 5"
              :key="i"
              :class="`rectangle-${i}`"
            ></div>
            <v-card-text>
              <div class="d-flex align-center">
                <v-btn-toggle
                  v-model="tabkey"
                  tile
                  group
                  class="group-btn-tab"
                >
                  <v-btn
                    v-for="(item,index) in rightTab"
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
                <v-spacer></v-spacer>
              </div>
              <template v-if="attachmentList.length">
                <div class="d-flex align-center">
                  <span class="page-text info--text" style="margin-left: 84px !important;">
                    {{
                      `${attachmentList[pageNum].fileName}`
                    }}
                  </span>
                </div>
                <div class="d-flex align-center" style="width: 100%;height: 450px">
                  <v-btn
                    height="196px"
                    width="27px"
                    x-small
                    class="high-blue-btn"
                    :disabled="pageNum <= 0"
                    @click="pageNum -= 1"
                  >
                    <v-icon size="70px" color="primary">mdi-menu-left</v-icon>
                  </v-btn>
                  <div
                    class="d-flex "
                    style="width: 80%"
                  >
                    <img
                      height="auto"
                      width="80%"
                      style="margin: 0 auto;display: block;"
                      :src="attachmentList[pageNum].filePath"
                      alt="Preview image"
                    >
                  </div>
                  <v-btn
                    height="196px"
                    width="27px"
                    x-small
                    class="high-blue-btn"
                    :disabled="pageNum >= attachmentList.length - 1"
                    @click="pageNum += 1"
                  >
                    <v-icon size="70px" color="primary">mdi-menu-right</v-icon>
                  </v-btn>
                </div>
                <div class="d-flex justify-center">
                  <span class="page-text info--text">
                    {{`${pageNum + 1}/${attachmentList.length}`}}
                  </span>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'MaintenanceDetailDialog',
  data() {
    return {
      moreInfo: true,
      tabkey: 0,
      pageNum: 0,
      attachmentList: [],
    };
  },
  components: {
  },
  computed: {
    ...mapState('maintenanceTask', ['maintenanceDetailDialog', 'selectedMaintenance', 'maintenanceDetailList']),
    dialog: {
      get() {
        return this.maintenanceDetailDialog;
      },
      set() {
        this.setMaintenanceDetailDialog(false);
      },
    },
    leftTab() {
      return [
        {
          name: this.$t('maintenanceTask.taskContent'),
        },
      ];
    },
    rightTab() {
      return [
        {
          name: this.$t('maintenanceTask.schemaImg'),
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
          text: this.$t('maintenanceTask.checkitemname'),
          value: 'checkItem',
        },
        {
          text: this.$t('maintenanceTask.checkitemdescription'),
          value: 'checkItemDesc',
        },
        {
          text: this.$t('maintenanceTask.associateBomName'),
          value: 'associateBomName',
        },
        {
          text: this.$t('maintenanceTask.upperLimit'),
          value: 'upperLimitText',
          width: 100,
        },
        {
          text: this.$t('maintenanceTask.lowerLimit'),
          value: 'lowerLimitText',
          width: 100,
        },
      ];
    },
  },
  methods: {
    ...mapMutations('maintenanceTask', ['setMaintenanceDetailDialog', 'setTaskInfo']),
    ...mapActions('maintenanceTask', [
      'getMaintenanceDetailList',
      'getAttachmentList',
    ]),
    async init() {
      const { id } = this.selectedMaintenance;
      await this.getMaintenanceDetailList(id);
      const files = await this.getAttachmentList({
        id,
        docType: 'maintenanceDetail',
      });
      // console.log(files, 'files');
      this.attachmentList = files.filter((file) => file.fileExtension === '.img'
        || file.fileExtension === '.png'
        || file.fileExtension === '.jpg'
        || file.fileExtension === '.jpeg');
    },
    strLen(str) {
      let count = 0;
      for (let i = 0; i < str.length; i += 1) {
        count += str.charCodeAt(i) <= 128 ? 1 : 2;
      }
      return count;
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      this.tabkey = 0;
      this.pageNum = 0;
      this.init();
    },
  },
};
</script>
