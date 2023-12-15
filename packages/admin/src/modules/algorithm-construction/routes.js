const routes = [
  {
    path: 'algorithm-construction',
    name: 'algorithmConstruction',
    component: () => import(/* webpackChunkName: "algorithmConstruction" */ '@/modules/algorithm-construction/Index.vue'),
    children: [
      {
        path: '',
        name: 'algorithmConstruction',
        component: () => import(/* webpackChunkName: "algorithmConstruction" */ '@/modules/algorithm-construction/views/Main.vue'),
      },
      {
        path: 'detail/:id/:type/:name/:active',
        name: 'algorithmConstructionDetail',
        component: () => import(/* webpackChunkName: "algorithmConstruction" */ '@/modules/algorithm-construction/views/Detail.vue'),
      },
    ],
  },
];

export default routes;
