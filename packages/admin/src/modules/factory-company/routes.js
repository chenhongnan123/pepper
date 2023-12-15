const routes = [
  {
    path: 'factory-company',
    name: 'factoryAndCompany',
    component: () => import(/* webpackChunkName: "factoryAndCompany" */ '@/modules/factory-company/Index.vue'),
  },
];

export default routes;
