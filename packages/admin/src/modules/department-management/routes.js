const routes = [
  {
    path: 'department-management',
    name: 'departmentManagement',
    component: () => import(/* webpackChunkName: "departmentManagement" */ '@/modules/department-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'departmentManagement',
        component: () => import(/* webpackChunkName: "departmentManagement" */ '@/modules/department-management/views/Main.vue'),
        meta: {
          permissionRequired: true,
        },
      },
    ],
  },
];

export default routes;
