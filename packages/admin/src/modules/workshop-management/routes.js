const routes = [
  {
    path: 'workshop-management',
    name: 'workshopManagement',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "workshopManagement" */ '@/modules/workshop-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'workshopManagement',
        component: () => import(/* webpackChunkName: "workshopManagement" */ '@/modules/workshop-management/views/Main.vue'),
      },
    ],
  },
];

export default routes;
