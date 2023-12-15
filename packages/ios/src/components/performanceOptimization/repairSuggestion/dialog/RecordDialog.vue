<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="700px"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-1">
      <v-card style="overflow: hidden;" class="rounded-lg">
        <div class="rectangle-1"></div>
        <div class="rectangle-2"></div>
        <div class="rectangle-3"></div>
        <div class="rectangle-4"></div>
        <div class="rectangle-5"></div>
        <v-card-title
          primary-title
          class="mt-2 pb-0"
        >
          <span class="text-h5">
            {{ this.$t('repairSuggestion.switchrecord') }}
          </span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="dialog = false"
          >
            <v-icon class="text-h5">mdi-close</v-icon>
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
          <div>
            <v-data-table
              fixed-header
              :items="tableList"
              :headers="headers"
              item-key="id"
              width="100%"
              :items-per-page="5"
              :page="page"
              dense
              class="mx-2 noborder"
              :no-data-text="`${$t('common.notabledata')}`"
              :height="'250px'"
            >
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
import moment from 'moment';

export default {
  name: 'RecordDialog',
  data() {
    return {
      moment,
      page: 1,
      recordList: [],
      tableList: [],
    };
  },
  props: {
    recordDialog: {
      type: Boolean,
      required: true,
    },
    machineBomDetail: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    dialog: {
      get() {
        return this.recordDialog;
      },
      set() {
        this.page = 1;
        this.$emit('closeDialog');
      },
    },
    headers() {
      return [
        {
          text: this.$t('repairSuggestion.createTime'), // 时间
          value: 'createTime',
          // sortable: true,
        },
        {
          text: this.$t('repairSuggestion.bomParentName'), // 层级名称
          value: 'bomParentName',
          // sortable: true,
        },
        {
          text: this.$t('repairSuggestion.partName'), // 部件名称
          value: 'partName',
          // sortable: true,
        },
        {
          text: this.$t('repairSuggestion.replaceReason'), // 换件原因
          value: 'replaceReason',
          // sortable: true,
        },
        {
          text: this.$t('repairSuggestion.createBy'), // 更换人
          value: 'createBy',
          // sortable: true,
        },
      ];
    },
  },
  methods: {
    ...mapActions('repairSuggestion', ['getReplacePartList']),
    async init() {
      this.page = 1;
      const { bomId } = this.machineBomDetail;
      const tableList = await this.getReplacePartList(bomId);
      this.tableList = tableList;
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      if (this.machineBomDetail) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .app-dialog {
    ::v-deep() .v-card {
      min-height: 400px;
    }
  }

</style>
