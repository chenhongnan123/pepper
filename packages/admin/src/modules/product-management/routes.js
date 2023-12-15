const routes = [
  {
    path: 'product-management',
    name: 'productManagement',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "productManagement" */ '@/modules/product-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'productManagement',
        component: () => import(/* webpackChunkName: "productManagement" */ '@/modules/product-management/views/Main.vue'),
      },
    ],
  },
];

export default routes;
