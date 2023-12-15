const routes = [
  {
    path: 'roadmap-management',
    name: 'roadmapManagement',
    meta: {
      permissionRequired: true,
    },
    component: () => import(/* webpackChunkName: "roleManagement" */ '@/modules/roadmap-management/Index.vue'),
    children: [
      {
        path: '',
        name: 'roadmapManagement',
        component: () => import(/* webpackChunkName: "roleManagement" */ '@/modules/roadmap-management/views/Main.vue'),
      },
      {
        path: 'detial/:id/:page',
        name: 'roadmapDetail',
        component: () => import(/* webpackChunkName: "roleManagement" */ '@/modules/roadmap-management/views/RoadmapDetail.vue'),
      },
    ],
  },
];

export default routes;
