const routes = [
  {
    path: 'product-launch',
    name: 'productLaunch',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "productLaunch" */ '@/modules/product-launch/Index.vue'),
    children: [
      {
        path: '',
        name: 'productLaunch',
        component: () => import(/* webpackChunkName: "productLaunch" */ '@/modules/product-launch/views/Main.vue'),
      },
    ],
  },
];

export default routes;
