const routes = [
  {
    path: 'alarm-records',
    name: 'alarmRecords',
    component: () => import(/* webpackChunkName: "alarmRecords" */ '@/modules/alarm-records/Index.vue'),
    children: [
      {
        path: '',
        name: 'alarmRecords',
        component: () => import(/* webpackChunkName: "alarmRecords" */ '@/modules/alarm-records/views/Main.vue'),
      },
    ],
  },
];

export default routes;
