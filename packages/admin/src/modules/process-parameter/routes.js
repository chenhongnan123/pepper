const routes = [
  {
    path: 'process-parameter',
    name: 'processParameter',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "processParameter" */ '@/modules/process-parameter/Index.vue'),
    children: [
      {
        path: '',
        name: 'processParameter',
        component: () => import(/* webpackChunkName: "processParameter" */ '@/modules/process-parameter/views/Main.vue'),
      },
    ],
  },
];

export default routes;
