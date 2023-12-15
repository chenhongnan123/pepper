const routes = [
  {
    path: 'ea-log',
    name: 'eaLog',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "eaLog" */ '@/modules/ea-log/Index.vue'),
    children: [
      {
        path: '',
        name: 'eaLog',
        component: () => import(/* webpackChunkName: "eaLog" */ '@/modules/ea-log/views/Main.vue'),
      },
    ],
  },
];

export default routes;
