const routes = [
  {
    path: 'state-prediction',
    name: 'statePrediction',
    component: () => import(/* webpackChunkName: "statePrediction" */ '@/modules/state-prediction/Index.vue'),
    meta: {
      // permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'statePrediction',
        component: () => import(/* webpackChunkName: "statePrediction" */ '@/modules/state-prediction/views/Main.vue'),
      },
      {
        path: 'detail/:id/:partId',
        name: 'statePredictionDetail',
        component: () => import(/* webpackChunkName: "statePredictionDetail" */ '@/modules/state-prediction/views/Detail.vue'),
      },
      {
        path: 'partDetail/:id/:page',
        name: 'statePartDetail',
        component: () => import(/* webpackChunkName: "statePartDetail" */ '@/modules/state-prediction/views/StatePartDetail.vue'),
      },
      // 维保任务界面
      {
        path: 'maintenanceTaskDetail/:id/:page/:name',
        name: 'stateMaintenanceTaskDetail',
        component: () => import(/* webpackChunkName: "stateMaintenanceTaskDetail" */ '@/modules/state-prediction/views/StateMainTaskDetail.vue'),
      },
      // 维修任务界面
      {
        path: 'repairTaskDetail/:id/:page/:name',
        name: 'StateRepairTaskDetail',
        component: () => import(/* webpackChunkName: "StateRepairTaskDetail" */ '@/modules/state-prediction/views/StateRepairTaskDetail.vue'),
      },
    ],
  },
];

export default routes;
