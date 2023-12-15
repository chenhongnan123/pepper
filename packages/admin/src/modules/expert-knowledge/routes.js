const routes = [
  {
    path: 'expert-knowledge',
    name: 'expertKnowledge',
    component: () => import(/* webpackChunkName: "expertKnowledge" */ '@/modules/expert-knowledge/Index.vue'),
    children: [
      {
        path: '',
        name: 'expertKnowledge',
        component: () => import(/* webpackChunkName: "expertKnowledge" */ '@/modules/expert-knowledge/views/Main.vue'),
      },
      {
        path: 'expert-knowledge-detail/:id/:page',
        name: 'expertKnowledgeDetail',
        component: () => import(/* webpackChunkName: "expertKnowledge" */ '@/modules/expert-knowledge/views/Detail.vue'),
      },
      {
        path: 'expert-knowledge-setting',
        name: 'expertKnowledgeSetting',
        component: () => import(/* webpackChunkName: "expertKnowledge" */ '@/modules/expert-knowledge/views/Setting.vue'),
      },
    ],
  },
];

export default routes;
