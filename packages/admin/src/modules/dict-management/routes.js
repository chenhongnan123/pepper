const routes = [
  {
    path: 'dict-management',
    name: 'dictManagement',
    component: () => import(/* webpackChunkName: "dictManagement" */ '@/modules/dict-management/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'dictManagement',
        component: () => import(/* webpackChunkName: "dictManagement" */ '@/modules/dict-management/views/Main.vue'),
      },
      {
        path: 'detail/:dictType',
        name: 'dictManagementDetail',
        component: () => import(/* webpackChunkName: "dictManagementDetail" */ '@/modules/dict-management/views/Detail.vue'),
      },
    ],
  },
];

export default routes;
