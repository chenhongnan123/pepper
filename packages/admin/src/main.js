import Vue from 'vue';

import './registerServiceWorker';
import 'flag-icons/css/flag-icons.min.css';

import { LicenseManager } from 'ag-grid-enterprise';

import directive from '@/directive';
import rules from '@/utils/rules.vertify';
import format from '@/utils/format.helper';
import file from '@/utils/file.helper';
import elementService from '@/services/element.service';
import systemService from '@/services/system.service';
import basicService from '@/services/basic.service';
import fileService from '@/services/file.service';
import authService from '@/services/auth.service';
import spcService from '@/services/spc.service';
import dockerService from '@/services/docker.service';
import eaService from '@/services/ea.service';

import vuetify from './plugins/vuetify';
import './plugins/perfect-scrollbar';
import App from './App.vue';
import router from './router';

import store from './store';
import i18n from './plugins/i18n';
import './plugins/portal';
import '@/assets/css/elementui.css';
import '@/assets/css/common.css';

LicenseManager.setLicenseKey('CompanyName=Suzhou ruhlamat Smart Technologies Co., Ltd.,LicensedApplication=Infinity,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=30,AssetReference=AG-030422,SupportServicesEnd=30_August_2023_[v2]_MTY5MzM1MDAwMDAwMA==28423dd515d527503fc5a257dc86a8ac');

Vue.config.productionTip = false;

Vue.use(rules);
Vue.use(format);
Vue.use(file);
Vue.use(elementService);
Vue.use(systemService);
Vue.use(basicService);
Vue.use(fileService);
Vue.use(authService);
Vue.use(spcService);
Vue.use(dockerService);
Vue.use(eaService);
Vue.use(directive);

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
