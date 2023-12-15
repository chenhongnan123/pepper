const routes = [
  {
    path: 'system-setting',
    name: 'systemSetting',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "system-setting" */ '@/modules/system-setting/Index.vue'),
    children: [
      {
        path: '',
        name: 'systemSetting',
        component: () => import(/* webpackChunkName: "system-setting" */ '@/modules/system-setting/views/Main.vue'),
      },
    ],
  },
];

export default routes;
