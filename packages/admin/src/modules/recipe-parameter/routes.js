// 配方通讯参数
const routes = [
  {
    path: 'recipe-parameter',
    name: 'recipeParameter',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "recipeParameter" */ '@/modules/recipe-parameter/Index.vue'),
    children: [
      {
        path: '',
        name: 'recipeParameter',
        component: () => import(/* webpackChunkName: "recipeParameter" */ '@/modules/recipe-parameter/views/Main.vue'),
      },
    ],
  },
];

export default routes;
