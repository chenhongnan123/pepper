const routes = [
  {
    path: 'spot-check-result',
    name: 'spotCheckResult',
    component: () => import(/* webpackChunkName: "spotCheckResult" */ '@/modules/spot-check-result/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'spotCheckResult',
        component: () => import(/* webpackChunkName: "spotCheckResult" */ '@/modules/spot-check-result/views/Main.vue'),
      },
      {
        path: 'detail',
        name: 'spotCheckResultDetail',
        component: () => import(/* webpackChunkName: "spotCheckResultDetail" */ '@/modules/spot-check-result/views/Detail.vue'),
      },
    ],
  },
];

export default routes;
