const routes = [
  {
    path: 'hello-world',
    name: 'HelloWorld',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
  {
    path: 'hello-world2',
    name: 'HelloWorld2',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld2.vue'),
  },
  {
    path: 'haha',
    name: 'HaHa',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HaHa.vue'),
    children: [
      {
        path: 'component1',
        name: 'testComponent1',
        component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/Component1.vue'),
        meta: {
          rootRouterName: 'HaHa',
        },
      },
      {
        path: 'component2',
        name: 'testComponent2',
        component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/Component2.vue'),
        meta: {
          rootRouterName: 'HaHa',
        },
      },
    ],
  },
  {
    path: 'test1',
    name: 'test1',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
  {
    path: 'test2',
    name: 'test2',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
  {
    path: 'test3',
    name: 'test3',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
  {
    path: 'test4',
    name: 'test4',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
  {
    path: 'test5',
    name: 'test5',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
  {
    path: 'test6',
    name: 'test6',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
  {
    path: 'test7',
    name: 'test7',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
  {
    path: 'test8',
    name: 'test8',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
  {
    path: 'test9',
    name: 'test9',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
  {
    path: 'test10',
    name: 'test10',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/modules/hello-world/HelloWorld.vue'),
  },
];

export default routes;
