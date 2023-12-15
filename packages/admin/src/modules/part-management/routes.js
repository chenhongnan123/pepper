const routes = [
  {
    path: 'part-management',
    name: 'partManagement',
    component: () => import(/* webpackChunkName: "partManagement" */ '@/modules/part-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'partManagement',
        component: () => import(/* webpackChunkName: "partManagement" */ '@/modules/part-management/views/Main.vue'),
      },
      {
        path: 'detail/:id/:page',
        name: 'partManagementDetail',
        component: () => import(/* webpackChunkName: "partManagementDetail" */ '@/modules/part-management/views/Detail.vue'),
      },
      {
        path: 'partTaskDetail/:partId/:partPage/:id/:page',
        name: 'partTaskDetail',
        component: () => import(/* webpackChunkName: "partTaskDetail" */ '@/modules/part-management/views/PartTaskDetail'),
      },
    ],
  },
];

export default routes;
