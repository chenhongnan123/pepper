const routes = [
  {
    path: 'maintenance',
    name: 'maintenanceMain',
    component: () => import(/* webpackChunkName: "maintenance" */ '@/modules/maintenance/Index.vue'),
    children: [
      {
        path: '',
        name: 'maintenanceMain',
        component: () => import(/* webpackChunkName: "maintenance" */ '@/modules/maintenance/views/Main.vue'),
      },
      {
        path: 'maintenance-detail/:id/:page',
        name: 'maintenanceDetail',
        component: () => import(/* webpackChunkName: "maintenance" */ '@/modules/maintenance/views/Detail.vue'),
      },
      {
        path: 'maintenance-setting',
        name: 'maintenanceSetting',
        component: () => import(/* webpackChunkName: "maintenance" */ '@/modules/maintenance/views/Setting.vue'),
      },
    ],
  },
];

export default routes;
