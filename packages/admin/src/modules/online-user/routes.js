const routes = [
  {
    path: 'online-user',
    name: 'onlineUser',
    component: () => import(/* webpackChunkName: "onlineUser" */ '@/modules/online-user/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'onlineUser',
        component: () => import(/* webpackChunkName: "onlineUser" */ '@/modules/online-user/views/Main.vue'),
      },
    ],
  },
];

export default routes;
