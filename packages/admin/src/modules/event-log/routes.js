const routes = [
  {
    path: 'event-log',
    name: 'eventLog',
    component: () => import(/* webpackChunkName: "eventLog" */ '@/modules/event-log/Index.vue'),
    meta: {
      // permissionRequired: true,
    },
  },
];

export default routes;
