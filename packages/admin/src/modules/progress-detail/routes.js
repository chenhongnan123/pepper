const routes = [
  {
    path: 'progress-detail',
    name: 'progressDetail',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "progressDetail" */ '@/modules/progress-detail/Index.vue'),
    children: [
      {
        path: '',
        name: 'progressDetail',
        component: () => import(/* webpackChunkName: "progressDetail" */ '@/modules/progress-detail/views/Main.vue'),
      },
    ],
  },
];

export default routes;
