const routes = [
  {
    path: 'interface-log',
    name: 'interfaceLog',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "interfaceLog" */ '@/modules/interface-log/Index.vue'),
    children: [
      {
        path: '',
        name: 'interfaceLog',
        component: () => import(/* webpackChunkName: "interfaceLog" */ '@/modules/interface-log/views/Main.vue'),
      },
    ],
  },
];

export default routes;
