const routes = [
  {
    path: 'reports-management',
    name: 'reportsManagement',
    meta: {
      permissionRequired: false,
    },
    component: () => import(/* webpackChunkName: "reportsManagement" */ '@/modules/reports-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'reportsManagement',
        component: () => import(/* webpackChunkName: "recipeParameter" */ '@/modules/reports-management/views/Main.vue'),
      },
    ],
  },
];

export default routes;
