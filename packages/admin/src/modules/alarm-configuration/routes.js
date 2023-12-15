const routes = [
  {
    path: 'alarm-configuration',
    name: 'alarmConfiguration',
    component: () => import(/* webpackChunkName: "alarmConfiguration" */ '@/modules/alarm-configuration/Index.vue'),
    children: [
      {
        path: '',
        name: 'alarmConfiguration',
        component: () => import(/* webpackChunkName: "alarmConfiguration" */ '@/modules/alarm-configuration/views/Main.vue'),
      },
      {
        path: 'setting',
        name: 'alarmConfigurationSetting',
        component: () => import(/* webpackChunkName: "alarmConfigurationSetting" */ '@/modules/alarm-configuration/views/Setting.vue'),
        children: [
          {
            path: 'alarmType',
            name: 'alarmTypeSetting',
            component: () => import(/* webpackChunkName: "alarmTypeSetting" */ '@/modules/alarm-configuration/components/settings/SettingComponent.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
