const routes = [
  {
    path: 'parameter-setting',
    name: 'parameterSetting',
    component: () => import(/* webpackChunkName: "parameterSetting" */ '@/modules/parameter-setting/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'parameterSetting',
        component: () => import(/* webpackChunkName: "parameterSetting" */ '@/modules/parameter-setting/views/Main.vue'),
      },
    ],
  },
];

export default routes;
