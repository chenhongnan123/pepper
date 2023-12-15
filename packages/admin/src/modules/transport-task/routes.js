const routes = [
  {
    path: 'transport-task',
    name: 'transportTask',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "transportTask" */ '@/modules/transport-task/Index.vue'),
    children: [
      {
        path: '',
        name: 'transportTask',
        component: () => import(/* webpackChunkName: "transportTask" */ '@/modules/transport-task/views/Main.vue'),
      },
    ],
  },
];

export default routes;
