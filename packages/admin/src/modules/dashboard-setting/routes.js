const routes = [
  {
    path: 'dashboard-setting',
    name: 'dashboardSetting',
    component: () => import(/* webpackChunkName: "dashboardSetting" */ '@/modules/dashboard-setting/Index.vue'),
    children: [
      {
        path: '',
        name: 'dashboardSetting',
        component: () => import(/* webpackChunkName: "dashboardSetting" */ '@/modules/dashboard-setting/views/Main.vue'),
      },
      {
        path: 'detail/:id/:code/:name',
        name: 'dashboardSettingDetail',
        component: () => import(/* webpackChunkName: "dashboardSettingDetail" */ '@/modules/dashboard-setting/views/Detail.vue'),
      },
    ],
  },
];

export default routes;
