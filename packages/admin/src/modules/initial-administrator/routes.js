const routes = [
  {
    path: 'initial-administrator',
    name: 'initialAdministrator',
    component: () => import(/* webpackChunkName: "initialAdministrator" */ '@/modules/initial-administrator/Index.vue'),
  },
];

export default routes;
