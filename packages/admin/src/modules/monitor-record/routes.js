const routes = [
  {
    path: 'monitor-record',
    name: 'monitorRecord',
    component: () => import(/* webpackChunkName: "monitorRecord" */ '@/modules/monitor-record/Index.vue'),
    meta: {
      // permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'monitorRecord',
        component: () => import(/* webpackChunkName: "monitorRecord" */ '@/modules/monitor-record/views/Main.vue'),
      },
    ],
  },
];

export default routes;
