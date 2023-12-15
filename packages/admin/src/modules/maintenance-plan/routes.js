const routes = [
  {
    path: 'maintenance-plan',
    name: 'maintenancePlan',
    component: () => import(/* webpackChunkName: "maintenancePlan" */ '@/modules/maintenance-plan/Index.vue'),
    children: [
      {
        path: '',
        name: 'maintenancePlan',
        component: () => import(/* webpackChunkName: "maintenancePlan" */ '@/modules/maintenance-plan/views/Main.vue'),
      },
      {
        path: 'partDetail/:id/:page',
        name: 'planBomPartDetail',
        component: () => import(/* webpackChunkName: "maintenancePlan" */ '@/modules/maintenance-plan/views/PlanBomPartDetail.vue'),
      },
      {
        path: 'maintenanceDetail/:id/:name',
        name: 'planMaintenanceDetail',
        component: () => import(/* webpackChunkName: "maintenancePlan" */ '@/modules/maintenance-plan/views/PlanMaintenanceDetail.vue'),
      },
    ],
  },
];

export default routes;
