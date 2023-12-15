const routes = [
  {
    path: 'alarm-code',
    name: 'alarmCode',
    component: () => import(/* webpackChunkName: "alarmCode" */ '@/modules/alarm-code/Index.vue'),
    children: [
      {
        path: '',
        name: 'alarmCode',
        component: () => import(/* webpackChunkName: "alarmCode" */ '@/modules/alarm-code/views/Main.vue'),
        meta: {
          // permissionRequired: true,
        },
      },
    ],
  },
];

export default routes;
