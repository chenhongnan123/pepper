const routes = [
  {
    path: 'login-log',
    name: 'loginLog',
    component: () => import(/* webpackChunkName: "loginLog" */ '@/modules/login-log/Index.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
