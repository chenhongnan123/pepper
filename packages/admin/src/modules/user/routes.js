const routes = [
  {
    path: 'user',
    name: 'user',
    component: () => import(/* webpackChunkName: "user" */ '@/modules/user/Index.vue'),
    children: [
      {
        path: 'profile',
        name: 'userProfile',
        component: () => import(/* webpackChunkName: "user" */ '@/modules/user/views/UserProfile.vue'),
      },
      {
        path: 'preferences',
        name: 'userPreferences',
        component: () => import(/* webpackChunkName: "user" */ '@/modules/user/views/UserPreferences.vue'),
      },
      {
        path: 'password',
        name: 'userPassword',
        component: () => import(/* webpackChunkName: "user" */ '@/modules/user/views/UserPassword.vue'),
      },
      {
        path: 'session',
        name: 'userSession',
        component: () => import(/* webpackChunkName: "user" */ '@/modules/user/views/UserSession.vue'),
      },
    ],
  },
];

export default routes;
