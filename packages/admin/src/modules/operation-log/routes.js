const routes = [
  {
    path: 'operation-log',
    name: 'operationLog',
    component: () => import(/* webpackChunkName: "operationLog" */ '@/modules/operation-log/Index.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
