const routes = [
  {
    path: 'alarm-monitor',
    name: 'alarmMonitor',
    meta: {
      // permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "alarmMonitor" */ '@/modules/alarm-monitor/Index.vue'),
    children: [
      {
        path: '',
        name: 'alarmMonitor',
        component: () => import(/* webpackChunkName: "alarmMonitor" */ '@/modules/alarm-monitor/views/Main.vue'),
      },
      {
        path: 'expert-knowledge-detail/:id/:page',
        name: 'MonitorExpertKnowledgeDetail',
        component: () => import(/* webpackChunkName: "maintenanceTask" */ '@/modules/alarm-monitor/views/MonitorExpertKnowledgeDetail.vue'),
      },
    ],
  },
];

export default routes;
