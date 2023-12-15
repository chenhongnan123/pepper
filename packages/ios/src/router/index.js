import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
// import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const routes = [
  {
    // 主页
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
  },
  {
    // 时间回溯
    path: '/time-back',
    name: 'timeBack',
    component: () => import(/* webpackChunkName: "timeBack" */ '../views/TimeBack.vue'),
    children: [
      {
        path: '',
        name: 'timeBackMain',
        component: () => import(/* webpackChunkName: "timeBack" */ '../components/timeBack/TimebackMain.vue'),
      },
      {
        path: 'alarm-detail',
        name: 'timeBackAlarmDetail',
        component: () => import(/* webpackChunkName: "timeBack" */ '../components/timeBack/AlarmDetail.vue'),
      },
      {
        path: 'video-detail',
        name: 'timeBackVideoDetail',
        component: () => import(/* webpackChunkName: "timeBack" */ '../components/timeBack/VideoDetail.vue'),
      },
    ],
  },
  {
    // 故障诊断
    path: '/fault-diagnosis',
    name: 'faultDiagnosis',
    component: () => import(/* webpackChunkName: "faultDiagnosis" */ '../views/FaultDiagnosis.vue'),
  },
  {
    // 故障诊断详情
    path: '/fault-diagnosis-detail',
    name: 'faultDiagnosisDetail',
    component: () => import(/* webpackChunkName: "faultDiagnosisDetail" */ '../views/FaultDiagnosisDetail.vue'),
  },
  {
    // 故障诊断数据告警详情
    path: '/fault-diagnosis-alarm-detail/:eventId/:bomId',
    name: 'faultDiagnosisAlarmDetail',
    component: () => import(/* webpackChunkName: "faultDiagnosisAlarmDetail" */ '../components/performanceOptimization/faultDiagnosis/DataAlarmDetail.vue'),
  },
  {
    // 健康评估
    path: '/repair-suggestion',
    name: 'repairSuggestion',
    component: () => import(/* webpackChunkName: "repairSuggestion" */ '../views/RepairSuggestionView.vue'),
  },
  {
    // 健康详情
    path: '/repair-suggestion-detail/:id/:modelId/:productCode',
    name: 'repairSuggestionDetail',
    component: () => import(/* webpackChunkName: "repairSuggestionDetail" */ '../views/RepairSuggestionDetailView.vue'),
  },
  {
    // 数字档案
    path: '/digital-archives',
    name: 'digitalArchives',
    component: () => import(/* webpackChunkName: "digitalArchives" */ '../views/digitalArchives.vue'),
  },
  {
    // sop
    path: '/sop',
    name: 'sop',
    component: () => import(/* webpackChunkName: "sop" */ '../views/SopView.vue'),
  },
  {
    // 维护保养
    path: '/maintenance-task',
    name: 'maintenanceTask',
    component: () => import(/* webpackChunkName: "maintenanceTask" */ '../views/MaintenanceTaskView.vue'),
  },
  {
    // 诺和诺德（平板端）首页
    path: '/home-page',
    name: 'homePage',
    component: () => import(/* webpackChunkName: "digitalArchives" */ '../views/HomeView.vue'),
  },
  {
    // 健康评估详情
    path: '/health-assessment-detail',
    name: 'healthAssessmentDetail',
    component: () => import(/* webpackChunkName: "digitalArchives" */ '../views/HealthAssessmentDetail.vue'),
  },
];
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  // mode: 'history', // DEBUG
  base: process.env.BASE_URL,
  routes,
});

// let isAcquiredSession = false;
const init = async () => {
  setInterval(() => {
    store.dispatch('helper/GET_SESSIONID');
  }, 3600000);
  router.beforeEach(async (to, from, next) => {
    // console.log('init isAcquiredSession:', isAcquiredSession, 'to', to);
    // if (!isAcquiredSession) await store.dispatch('helper/GET_SESSIONID');
    // isAcquiredSession = true;
    next();
  });
};
init();

router.beforeEach(async (to, from, next) => {
  // console.log('beforeEach', to);
  const { routerPushNum } = store.state.helper;
  store.commit('helper/SET_ROUTERPUSHNUM', routerPushNum + 1);
  next();
});

export default router;
