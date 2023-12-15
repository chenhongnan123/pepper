import { routerModules } from '@/modules';

// 所有包含children的路由加hasChildren属性，所有子路由加rootRouterName属性
const formatChildrenRouters = (item, rootname) => {
  if (item.children && item.children.length > 0) {
    item.meta = {
      ...item.meta,
      hasChildren: true,
    };
    item.children.map((it) => {
      it.meta = {
        ...it.meta,
        rootRouterName: rootname,
      };
      return formatChildrenRouters(it, rootname);
    });
  }
  return item;
};

// console.log(routerModules['hello-world']('./routes.js').default, 'routerModules');
// routerModules['hello-world'].keys() => ['./routes.js']
const loadRouterMessages = () => {
  let messages = [];
  const modulesKeys = Object.keys(routerModules);
  if (modulesKeys.length > 0) {
    for (let i = 0; i < modulesKeys.length; i += 1) {
      const matched = routerModules[modulesKeys[i]].keys();
      messages = [...messages, ...routerModules[modulesKeys[i]](matched[0]).default];
    }
  }
  const routrMessages = messages.map((item) => {
    const rootname = item.name;
    const obj = {
      ...item,
    };
    const newItem = formatChildrenRouters(obj, rootname);
    return newItem;
  });
  return routrMessages;
};

const routes = [
  {
    path: '*',
    redirect: '/',
    name: 'NotfoundView',
    component: () => import(/* webpackChunkName: "NotfoundView" */ '@/views/NotfoundView.vue'),
    meta: {
      nomultipage: true,
    },
  },
  {
    path: '/',
    name: 'PepperHome',
    component: () => import(/* webpackChunkName: "PepperHome" */ '@/views/PepperHome.vue'),
    children: loadRouterMessages(),
    meta: {
      nomultipage: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
    meta: {
      public: true,
      onlyWhenLoggedOut: true,
      nomultipage: true,
    },
  },
  {
    path: '/forbidden',
    name: '401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/401View.vue'),
    meta: {
      nomultipage: true,
    },
  },
];

export default routes;
