<template>
  <v-app-bar
    absolute
    app
    height="80"
    :width="clientWidth"
    color="dBackground"
    class="app-header"
  >
    <img
      src='@/assets/logo/logo.png'
      :width="smallScreen ? 40 : 70"
      alt=""
      class="ml-2"
    >
    <img
      src='@/assets/imgs/header-background.png'
      width="100%"
      alt=""
      class="header-img"
    >
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <span
          v-bind="attrs"
          v-on="on"
          :class="smallScreen ? 'ml-4' : 'ml-8'"
          class="text-h4 text-truncate font-weight-bold title-width"
        >
          {{ $t('header.title') }}
        </span>
      </template>
      <span>{{ $t('header.title') }}</span>
    </v-tooltip>
    <v-spacer></v-spacer>
    <div
      :class="smallScreen ? 'mx-1' : 'mx-2'"
      class="d-flex flex-column align-center mt-1 justify-center"
    >
      <span class="format-time text-center" style="width: 115px;">{{ timeFormat }}</span>
      <span class="format-date text-center">{{ dateFormat }}</span>
    </div>
    <v-divider vertical></v-divider>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          height="70"
          text
          v-bind="attrs"
          v-on="on"
          class="px-2"
          :class="smallScreen ? 'mx-1' : 'mx-1'"
          @click.prevent="login"
        >
          <v-icon
            color="icon"
            class="text-h3"
          >
            mdi-account-outline
          </v-icon>
          <span
            class="text-h6 text-truncate"
            v-if="operator"
          >
            {{ operator.nickName }}
          </span>
          <span
            class="text-h6"
            v-else
          >
            {{ $t('header.login') }}
          </span>
        </v-btn>
      </template>
      <span
        v-if="operator"
      >
        {{ operator.nickName }}
      </span>
      <span v-else>
        {{ $t('header.login') }}
      </span>
    </v-tooltip>
    <v-divider vertical></v-divider>
    <div
      :class="smallScreen ? 'ml-2 mr-1' : 'ml-6 mr-3'"
      class="d-flex align-center"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-badge
            overlap
            color="error"
            :content="repairCount"
            :value="repairCount"
          >
            <img
              v-bind="attrs"
              v-on="on"
              src='@/assets/icons/img/head-fault-diagnosis-dark.png'
              width="30"
              alt=""
              style="cursor: pointer;"
              role="button"
              tabindex="0"
              @click="jumpPage('repair')"
              @keyup.enter="jumpPage('repair')"
            />
          </v-badge>
        </template>
        <span style="z-index: 1;">{{ $t('header.troubleshooting') }}</span>
      </v-tooltip>
    </div>
    <div
      :class="smallScreen ? 'ml-1 mr-2' : 'ml-3 mr-6'"
      class="d-flex align-center"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-badge
            overlap
            color="error"
            :content="maintenanceCount"
            :value="maintenanceCount"
          >
            <img
              v-bind="attrs"
              v-on="on"
              src='@/assets/icons/img/head-repair-suggestion-dark.png'
              width="28"
              alt=""
              style="cursor: pointer;"
              role="button"
              tabindex="0"
              @click="jumpPage('maintenance')"
              @keyup.enter="jumpPage('maintenance')"
            />
          </v-badge>
        </template>
        <span>{{ $t('header.maintenance') }}</span>
      </v-tooltip>
    </div>
    <v-divider vertical></v-divider>
    <div
      :class="smallScreen ? 'ml-2 mr-1' : 'ml-4 mr-2'"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            color="icon"
            class="text-h3"
            @click="logout"
            :disabled="!operator"
          >
            mdi-power
          </v-icon>
        </template>
        <span>{{ $t('setting.logout') }}</span>
      </v-tooltip>
    </div>
  </v-app-bar>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import moment from 'moment';

let interval = null;
export default {
  name: 'AppHeader',
  data() {
    return {
      moment,
      clientWidth: document.body.clientWidth,
      dateTimeFormat: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      totalCountObj: {}, // 维保任务 故障报修的数量
    };
  },
  computed: {
    ...mapState('helper', ['serverTime']),
    ...mapState('setting', ['mainProduct', 'userInfo', 'me']),
    ...mapState('faultDiagnosis', ['alarmDetail', 'alarmTotalCount']),
    ...mapState('maintenanceTask', ['alarmList']),
    smallScreen() {
      return this.clientWidth <= 1732;
    }, // 小屏幕适应
    // 格式化服务器时间
    // dateTimeFormat() {
    //   // if (this.mainProduct?.serverTime) {
    //   //   return this.mainProduct.serverTime;
    //   // }
    //   return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    // },
    dateFormat() {
      return this.dateTimeFormat.substring(0, 10);
    },
    timeFormat() {
      return this.dateTimeFormat.substring(10);
    },
    // 生产品牌
    brandName() {
      if (this.mainProduct?.brandName) {
        return this.mainProduct.brandName;
      }
      return '-';
    },
    // 批次编号
    batchNumber() {
      if (this.mainProduct?.category) {
        return this.mainProduct.category;
      }
      return '-';
    },
    // 当班计划产量
    planCount() {
      if (this.mainProduct?.planQuantity) {
        return this.mainProduct.planQuantity;
      }
      return 0;
    },
    // 当班实际产量
    realCount() {
      if (this.mainProduct?.realQuantity) {
        return this.mainProduct.realQuantity;
      }
      return 0;
    },
    // 单位
    unit() {
      if (this.mainProduct?.unit) {
        return this.mainProduct.unit;
      }
      return 'kg';
    },
    // 当班产量百分比
    countPercent() {
      if (!this.planCount || !this.realCount) {
        return 0;
      }
      return Math.round((this.realCount / this.planCount) * 100);
    },
    // 手/自动模式
    isAuto() {
      if (this.mainProduct?.isAuto) {
        return true;
      }
      return false;
    },
    // 设备状态码
    deviceStatus() {
      if (this.mainProduct?.deviceStatus) {
        return this.mainProduct.deviceStatus;
      }
      return 'default';
    },
    // 设备状态
    deviceStatusName() {
      if (this.mainProduct?.deviceStatusName) {
        return this.mainProduct.deviceStatusName;
      }
      return '--';
    },
    // 当前登录人员信息
    operator() {
      return this.me;
    },
    // 维保任务报警数量
    maintenanceCount() {
      const maintenanceNum = this.alarmTotalCount.maintenanceNum || 0;
      return maintenanceNum > 99 ? '99+' : maintenanceNum;
    },
    // 故障诊断报警数量
    repairCount() {
      const faultNum = this.alarmTotalCount.faultNum || 0;
      return faultNum > 99 ? '99+' : faultNum;
    },
  },
  created() {
    // this.getCount();
    interval = setInterval(() => {
      this.dateTimeFormat = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(interval);
    interval = null;
  },
  methods: {
    ...mapMutations('setting', ['SET_STTINGDIALOG', 'SET_SCANDIALOG']),
    ...mapMutations('helper', ['SET_ALERT']),
    login() {
      this.SET_STTINGDIALOG(true);
    },
    async logout() {
      if (await this.$root.$confirm.open(
        this.$t('alert.confirminfo'),
        this.$t('alert.confirmlogout'),
      )) {
        const result = await this.$userLogOut('mock1');
        if (result) {
          this.SET_ALERT({
            type: 'success',
            message: this.$t('success.successAction'),
          });
          this.SET_STTINGDIALOG(true);
          if (this.$router.name !== 'home') {
            this.$router.push({ name: 'home' });
          }
        }
      }
    },
    // 获取 维保任务报警数量 故障诊断报警数量
    // async getCount() {
    //   this.getAlarmTotalCount();
    //   await this.$getTimeout(10000);
    //   this.getCount();
    // },
    // 获取设备状态颜色
    getDeviceStatusColor(status) {
      const color = {
        2: 'warning',
        1: 'warning',
        0: 'success',
        9: 'error',
        default: 'primary',
      };
      return color[status];
    },
    jumpPage(type) {
      if (type === 'repair') {
        this.$router.push({ name: 'faultDiagnosis' });
      } else if (type === 'maintenance') {
        this.$router.push({ name: 'maintenanceTask' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .app-header {
    z-index: 1;
    .title-width {
      letter-spacing: 0.2em !important;
      width: auto;
      max-width: 50%;
      min-width: 6%;
    }
    .header-img {
      position: absolute;
      z-index: -1;
      width:100%;
      opacity: 0.8;
      left: -16px
    }
  }
</style>
