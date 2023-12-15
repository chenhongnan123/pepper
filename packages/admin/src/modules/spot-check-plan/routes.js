const routes = [
  {
    path: 'spot-check-plan',
    name: 'spotCheckPlan',
    component: () => import(/* webpackChunkName: "spotCheckPlan" */ '@/modules/spot-check-plan/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'spotCheckPlan',
        component: () => import(/* webpackChunkName: "spotCheckPlan" */ '@/modules/spot-check-plan/views/Main.vue'),
      },
      {
        path: ':checkId',
        name: 'spotCheckPlanDetail',
        component: () => import(/* webpackChunkName: "spotCheckPlanDetail" */ '@/modules/spot-check-plan/views/Detail.vue'),
      },
    ],
  },
];

export default routes;
