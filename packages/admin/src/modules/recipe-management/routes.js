const routes = [
  {
    path: 'recipe-management',
    name: 'recipeManagement',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "recipeManagement" */ '@/modules/recipe-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'recipeManagement',
        component: () => import(/* webpackChunkName: "recipeManagement" */ '@/modules/recipe-management/views/Main.vue'),
      },
      {
        path: 'detail/:recipeId',
        name: 'recipeManagementDetail',
        component: () => import(/* webpackChunkName: "recipeManagement" */ '@/modules/recipe-management/views/Detail.vue'),
      },
    ],
  },
];

export default routes;
