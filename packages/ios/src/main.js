import format from '@/utils/format.helper';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n';
import './plugins/highcharts';
import './assets/font/font.css';
import '@/assets/css/common.css';
import 'vue2-datepicker/index.css';
import '@/assets/css/datepicker.scss';

import mainService from './service/main.service';
import systemService from './service/system.service';
import basicService from './service/basic.service';
import authService from './service/auth.service';
import spcService from './service/spc.service';

Vue.config.productionTip = false;

Vue.use(mainService);
Vue.use(systemService);
Vue.use(basicService);
Vue.use(authService);
Vue.use(spcService);
Vue.use(format);

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
