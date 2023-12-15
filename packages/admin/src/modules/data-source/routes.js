const routes = [
  {
    path: 'data-source',
    name: 'dataSource',
    component: () => import(/* webpackChunkName: "dataSource" */ '@/modules/data-source/Index.vue'),
    children: [
      {
        path: '',
        name: 'dataSource',
        component: () => import(/* webpackChunkName: "dataSource" */ '@/modules/data-source/views/Main.vue'),
      },
      {
        path: 'detail/:id',
        name: 'dataSourceDetail',
        component: () => import(/* webpackChunkName: "dataSource" */ '@/modules/data-source/views/Detail.vue'),
      },
    ],
  },
];

export default routes;
