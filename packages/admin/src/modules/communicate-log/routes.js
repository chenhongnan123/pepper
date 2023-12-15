const routes = [
  {
    path: 'communicate-log',
    name: 'communicateLog',
    component: () => import(/* webpackChunkName: "communicateLog" */ '@/modules/communicate-log/Index.vue'),
    meta: {
      // permissionRequired: true,
    },
  },
];

export default routes;
