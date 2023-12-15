<template>
  <div class="d-flex justify-center">
    <v-row no-gutters class="mx-2">
      <v-col cols="10" class="pl-3">
        <v-row no-gutters>
          <v-col
            cols="2"
            v-for="(item, key) in menus"
            :key="key"
            class="pt-2"
          >
            <v-card
              class="d-flex align-center justify-center mb-2 mt-2 menu-item"
              @click="goPage(item.path)"
              :ripple="false"
              color="transparent"
              elevation="0"
            >
              <img
              v-if="isMenuActive(item)"
              :src="require('@/assets/icons/img/menu-dark-active.png')"
              :width="iszh?'233px': '250px'"
              height="61px"
              alt=""
              class="menu-background">
              <img
              v-else
              :src="require('@/assets/icons/img/menu-dark.png')"
              :width="iszh?'233px': '250px'"
              height="61px"
              alt=""
              class="menu-background">
              <img
              :src="require(`@/assets/icons/img/${item.icon}`)"
              height="30"
              alt=""
              class="mr-3 mt-3">
              <span
                class="text-h6 mt-3 text-truncate"
                style="max-width:150px"
              > {{ $t(`menu.${item.name}`) }} </span>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2">
        <div class="d-flex align-center justify-space-around submenu submenu-right py-2">
          <div class="rectangle-1"></div>
          <v-btn
            plain
            text
            @click="goBack"
            class="ml-7"
            :ripple="false"
          >
            <img
            src='@/assets/icons/img/return-dark.svg'
            width="38"
            alt="">
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn
            plain
            text
            @click="goPage('/')"
            class="mr-6"
            :ripple="false"
          >
            <img
            src='@/assets/icons/img/home-dark.svg'
            width="40"
            alt="">
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import { mapState, mapMutations } from 'vuex';

export default {
  name: 'AppMenu',
  data() {
    return {
      menus: [
        {
          icon: 'menu-time-back-dark.png',
          title: '时间回溯',
          path: '/time-back',
          name: 'timeBack',
          children: [
            {
              name: 'timeBackMain',
            },
            {
              name: 'timeBackAlarmDetail',
            },
            {
              name: 'timeBackVideoDetail',
            },
          ],
        },
        {
          icon: 'menu-fault-diagnosis-dark.png',
          title: '故障诊断',
          path: '/fault-diagnosis',
          name: 'faultDiagnosis',
          children: [
            {
              name: 'faultDiagnosisDetail',
            },
            {
              name: 'faultDiagnosisAlarmDetail',
            },
          ],
        },
        {
          icon: 'menu-repair-suggestion-dark.png',
          title: '健康评估',
          path: '/repair-suggestion',
          name: 'repairSuggestion',
          children: [
            {
              name: 'repairSuggestionDetail',
            },
          ],
        },
        {
          icon: 'menu-digital-archives-dark.png',
          title: '数字档案',
          path: '/digital-archives',
          name: 'digitalArchives',
        },
        {
          icon: 'menu-sop-dark.png',
          title: 'SOP规范',
          path: '/sop',
          name: 'sop',
        },
        {
          icon: 'menu-maintenance-task-dark.png',
          title: '维护保养',
          path: '/maintenance-task',
          name: 'maintenanceTask',
        },
      ],
    };
  },
  created() {
    // const curname = this.$route.params.parentname;
    // console.log(curname, 'createdcurname');
    // // const curname = 'sop';
  },
  computed: {
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
  },
  methods: {
    isMenuActive(menu) {
      const routerName = this.$route.name;
      return routerName === menu.name
        || (menu.children && menu.children.some((child) => child.name === routerName));
    },
    strLen(str) {
      let count = 0;
      for (let i = 0; i < str.length; i += 1) {
        count += str.charCodeAt(i) <= 128 ? 1 : 2;
      }
      return count;
    },
    goPage(path) {
      // console.log(path, 'path');
      if (!path || path === this.$route.path) {
        return;
      }
      this.$router.push(path);
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  watch: {
  },
};
</script>
