const routes = [
  {
    path: 'recipe-management-sintering',
    name: 'recipeManagementSintering',
    meta: {
      permissionRequired: false,
    },
    component: () => import(/* webpackChunkName: "recipeManagementSintering" */ '@/modules/recipe-management-sintering/Index.vue'),
    children: [
      {
        path: '',
        name: 'recipeManagementSintering',
        component: () => import(/* webpackChunkName: "recipeManagementSintering" */ '@/modules/recipe-management-sintering/views/Main.vue'),
      },
    ],
  },
];

export default routes;
