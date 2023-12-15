const routes = [
  {
    path: 'product-transfer',
    name: 'productTransfer',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "productTransfer" */ '@/modules/product-transfer/Index.vue'),
    children: [
      {
        path: '',
        name: 'productTransfer',
        component: () => import('./views/Main.vue'),
      },
      {
        path: 'add',
        name: 'addProductTransfer',
        component: () => import('./views/AddProductTransfer.vue'),
      },
    ],
  },
];

export default routes;
