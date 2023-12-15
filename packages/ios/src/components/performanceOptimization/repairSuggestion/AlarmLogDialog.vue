<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="70%"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-2">
      <v-card class="rounded-lg">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title primary-title>
          <span>
            {{
              this.$t('repairSuggestion.alarmlog')
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
          <v-data-table
            fixed-header
            :headers="headers"
            :items-per-page="5"
            :items="items"
            :height="clientheight * 0.4"
          >
            <!-- eslint-disable-next-line -->
            <template #item.eventtype="{ item }">
              <span v-if="item.eventtype === 1" class="warning--text">
                {{$t('repairSuggestion.upperwarning')}}
              </span>
              <span v-if="item.eventtype === 2" class="error--text">
                {{$t('repairSuggestion.upperlimitwarning')}}
              </span>
              <span v-if="item.eventtype === 3" class="warning--text">
                {{$t('repairSuggestion.lowerwarning')}}
              </span>
              <span v-if="item.eventtype === 4" class="error--text">
                {{$t('repairSuggestion.lowerlimitwarning')}}
              </span>
            </template>
            <!-- eslint-disable-next-line -->
            <template #item.monitorvalue="{ item }">
              <span class="primary--text">
                {{item.monitorvalue}}
              </span>
            </template>
            <!-- eslint-disable-next-line -->
            <template #item.reportType="{ item }">
              <!-- 值为 'error' 或 'warning' -- 后端已确认 郑 -->
              <span v-if="item?.alarmDge === 'ERROR'" class="error--text">
                {{item.reportType}}
              </span>
              <span v-else class="warning--text">
                {{item.reportType}}
              </span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

import moment from 'moment';

export default {
  data() {
    return {
      moment,
      items: [],
      clientheight: document.body.clientHeight,
    };
  },
  props: {
    alarmLogDialog: {
      type: Boolean,
      required: true,
    },
  },
  components: {
  },
  computed: {
    ...mapState('repairSuggestion', ['andonTriggerRecordList']),
    dialog: {
      get() {
        return this.alarmLogDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    headers() {
      return [
        {
          text: this.$t('repairSuggestion.time'),
          value: 'create_time',
          width: 100,
          sortable: true,
        },
        {
          text: '测量项',
          value: 'testItem',
          width: 120,
          sortable: true,
        },
        {
          text: this.$t('repairSuggestion.parametername'),
          value: 'paramsName',
          width: 120,
          sortable: true,
        },
        {
          text: this.$t('repairSuggestion.upperlimitvalue'),
          value: 'upLimit',
          width: 80,
          sortable: false,
        },
        {
          text: this.$t('repairSuggestion.upperwarningvalue'),
          value: 'upWarning',
          width: 100,
          sortable: false,
        },
        {
          text: this.$t('repairSuggestion.lowerlimitvalue'),
          value: 'downLimit',
          width: 80,
          sortable: false,
        },
        {
          text: this.$t('repairSuggestion.lowerwarningvalue'),
          value: 'downWarning',
          width: 100,
          sortable: false,
        },
        {
          text: this.$t('repairSuggestion.monitorvalue'),
          value: 'stdValue',
          width: 80,
          sortable: false,
          cellClass: 'primary--text',
        },
        {
          text: this.$t('repairSuggestion.type'),
          value: 'reportType',
          width: 80,
          sortable: false,
        },
      ];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('maintenanceTask', [
      'getTableRecords',
    ]),
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const list = await this.getTableRecords({
        API_ROUTE_PATH: 'GET_WARNING_ERROR_LIST',
      });
      console.log(list, 'GET_WARNING_ERROR_LIST');
      if (list?.length) {
        this.items = list.map((item) => {
          const obj = {
            ...item,
          };
          if (item.create_time) {
            obj.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
          }
          return obj;
        });
      } else {
        this.items = [];
      }
    },
  },
};
</script>
