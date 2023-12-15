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
            {{ this.$t('faultDiagnosis.alarmlog') }}
          </span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            small
            @click="dialog = false"
          >
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
            <template #item.time="{ item }">
              <span>
                {{ $getFormatDate(item.time, 'yyyy-MM-DD HH:mm:ss') }}
              </span>
            </template>
            <!-- eslint-disable-next-line -->
            <template #item.alarmType="{ item }">
              <span :class="item.alarmType === '数据警告' ? 'error--text' : 'warning--text'">
                {{ item.alarmType }}
              </span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
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
  components: {},
  computed: {
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
          text: this.$t('faultDiagnosis.time'),
          value: 'time',
          sortable: true,
        },
        {
          text: this.$t('faultDiagnosis.parentBomName'),
          value: 'parentBomName',
          sortable: true,
        },
        {
          text: this.$t('faultDiagnosis.partName'),
          value: 'partName',
          sortable: false,
        },
        {
          text: this.$t('faultDiagnosis.eventName'),
          value: 'eventName',
          sortable: false,
        },
        {
          text: this.$t('faultDiagnosis.alarmCode'),
          value: 'alarmCode',
          sortable: false,
        },
        {
          text: this.$t('faultDiagnosis.alarmContent'),
          value: 'alarmContent',
          sortable: false,
        },
        {
          text: this.$t('faultDiagnosis.alarmType'),
          value: 'alarmType',
          sortable: false,
          // cellClass: '',
        },
      ];
    },
  },
  methods: {
    ...mapActions('faultDiagnosis', ['getAlarmRecordList']),
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const alarmRecordList = await this.getAlarmRecordList();
      this.items = alarmRecordList;
    },
  },
};
</script>
