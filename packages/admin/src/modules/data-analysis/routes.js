const routes = [
  {
    path: 'data-analysis',
    name: 'dataAnalysis',
    component: () => import(/* webpackChunkName: "dataAnalysis" */ '@/modules/data-analysis/Index.vue'),
    children: [
      {
        path: '',
        name: 'dataAnalysis',
        component: () => import(/* webpackChunkName: "dataAnalysis" */ '@/modules/data-analysis/views/Main.vue'),
        permissionRequired: true,
      },
      {
        path: 'setting',
        name: 'spcSetting',
        component: () => import(/* webpackChunkName: "spcSetting" */ '@/modules/data-analysis/views/Setting.vue'),
        children: [
          {
            path: 'dataTable',
            name: 'dataTableSetting',
            component: () => import(/* webpackChunkName: "dataTableSetting" */ '@/modules/data-analysis/components/settings/SettingComponent.vue'),
            permissionRequired: true,
          },
          {
            path: 'dataSource',
            name: 'dataSourceSetting',
            component: () => import(/* webpackChunkName: "dataSourceSetting" */ '@/modules/data-analysis/components/settings/SettingComponent.vue'),
            permissionRequired: true,
          },
        ],
      },
    ],
  },
];

export default routes;
