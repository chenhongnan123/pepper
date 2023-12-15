const routes = [
  {
    path: 'recipe-log',
    name: 'recipeLog',
    meta: {
      permissionRequired: false,
    },
    component: () => import(/* webpackChunkName: "recipeLog" */ '@/modules/recipe-log/Index.vue'),
    children: [
      {
        path: '',
        name: 'recipeLog',
        component: () => import(/* webpackChunkName: "recipeLog" */ '@/modules/recipe-log/views/Main.vue'),
      },
    ],
  },
];

export default routes;
