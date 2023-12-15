const routes = [
  {
    path: 'maintenance-task',
    name: 'maintenanceTask',
    component: () => import(/* webpackChunkName: "maintenanceTask" */ '@/modules/maintenance-task/Index.vue'),
    children: [
      {
        path: '',
        name: 'maintenanceTask',
        component: () => import(/* webpackChunkName: "maintenanceTask" */ '@/modules/maintenance-task/views/Main.vue'),
      },
      {
        path: 'maintenance-task-detail/:id/:page/:name',
        name: 'maintenanceTaskDetail',
        component: () => import(/* webpackChunkName: "maintenanceTask" */ '@/modules/maintenance-task/views/MaintenanceTaskDetail.vue'),
      },
      {
        path: 'repair-task-detail/:id/:page/:name',
        name: 'repairTaskDetail',
        component: () => import(/* webpackChunkName: "maintenanceTask" */ '@/modules/maintenance-task/views/RepairTaskDetail.vue'),
      },
      {
        path: 'expert-knowledge-detail/:id/:page/:taskId/:taskName/:taskPage',
        name: 'taskExpertKnowledgeDetail',
        component: () => import(/* webpackChunkName: "maintenanceTask" */ '@/modules/maintenance-task/views/ExpertKnowledgeDetail.vue'),
      },
    ],
  },
];

export default routes;
