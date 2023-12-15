const routes = [
  {
    path: 'document-management',
    name: 'documentManagement',
    component: () => import(/* webpackChunkName: "documentManagement" */ '@/modules/document-management/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'documentManagement',
        component: () => import(/* webpackChunkName: "documentManagement" */ '@/modules/document-management/views/Main.vue'),
      },
    ],
  },
];

export default routes;
