const routes = [
  {
    path: 'connection-configuration',
    name: 'connectionConfiguration',
    component: () => import(/* webpackChunkName: "connectionConfiguration" */ '@/modules/connection-configuration/Index.vue'),
    children: [
      {
        path: '',
        name: 'connectionConfiguration',
        component: () => import(/* webpackChunkName: "connectionConfiguration" */ '@/modules/connection-configuration/views/Main.vue'),
      },
      {
        path: 'detail/:id',
        name: 'connectionConfigurationDetail',
        component: () => import(/* webpackChunkName: "connectionConfigurationDetail" */ '@/modules/connection-configuration/views/Detail.vue'),
      },
      {
        path: 'setting',
        name: 'connectionConfigurationSetting',
        component: () => import(/* webpackChunkName: "connectionConfigurationSetting" */ '@/modules/connection-configuration/views/Setting.vue'),
        children: [
          {
            path: 'parameter/:id',
            name: 'parameterTypeSetting',
            component: () => import(/* webpackChunkName: "parameterTypeSetting" */ '@/modules/connection-configuration/components/settings/SettingComponent.vue'),
          },
          {
            path: 'data/:id',
            name: 'dataTypeSetting',
            component: () => import(/* webpackChunkName: "dataTypeSetting" */ '@/modules/connection-configuration/components/settings/SettingComponent.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
