import { set, toggle } from '@/utils/store.helper';
import i18n from '@/plugins/i18n';
import AG_GRID_LOCALE_EN from '@/plugins/ag-grid-locale/locale.en';
import AG_GRID_LOCALE_CN from '@/plugins/ag-grid-locale/locale.cn';

export default ({
  state: {
    version: process.env.VUE_APP_VERSION || '0',
    developmentVersion: process.env.VUE_APP_DEVELOPMENTVERSION || '0',
    alert: false,
    locales: [
      {
        languageValue: 'English',
        languageKey: 'en',
      },
      {
        languageValue: '中文',
        languageKey: 'zhHans',
      },
    ],
    currentAvatar: '',
    currentLocale: localStorage.getItem('language'),
    isDark: null,
    insightsDrawer: false,
    pageHeader: false,
    appHeaderHeight: 50,
    isConnected: true,
    servertime: '',
    isPepperLoading: false,
    isSystemBar: false,
    numberEmpty: 2147483647,
    netErorr: false,
    pagePortalMode: {},
    refreshRouteName: null,
    mainProduct: {},
    systemConfigList: [],
  },
  mutations: {
    setLocales: set('locales'),
    setAlert: set('alert'),
    setIsDark: set('isDark'),
    toggleIsDark: toggle('isDark'),
    setCurrentLocale: set('currentLocale'),
    setPageHeader: set('pageHeader'),
    setAppHeaderHeight: set('appHeaderHeight'),
    setPepperLoading: set('isPepperLoading'),
    setSystemBar: set('isSystemBar'),
    setPagePortalMode: set('pagePortalMode'),
    setNetErorr: set('netErorr'),
    setRefreshRouteName: set('refreshRouteName'),
    setMainProduct: set('mainProduct'),
    setSystemConfigList: set('systemConfigList'),
  },
  actions: {
    async getLocales({ commit }) {
      const result = await this.$systemGet('dict/getLanguageList', '');
      if (!result) {
        return;
      }
      const { data } = result;
      commit('setLocales', data);
    },
    async getMainProduct({ commit }) {
      const payload = {
        API_ROUTE_PATH: 'XXCUS_RST_GETDEVICE_MAIN',
        AdvCondition: [{
          param_name: 'lookupType',
          condition: 'XXCUS_RLMT_MAIN_ITEM',
        }],
      };
      const result = await this.$systemQuery(payload, 'mock1');
      if (!result) {
        return;
      }
      if (result.data.length) {
        commit('setMainProduct', result.data[0]);
      } else {
        commit('setMainProduct', {});
      }
    },
    async getSystemConfigList({ commit }) {
      const result = await this.$systemGet('config/list', '');
      if (!result) {
        return;
      }
      commit('setSystemConfigList', result.rows);
    },
  },
  getters: {
    agGridLocaleText: () => {
      const { locale } = i18n;
      switch (locale) {
        case 'zhHans':
          return AG_GRID_LOCALE_CN;
        default:
          return AG_GRID_LOCALE_EN;
      }
    },

    agGridTheme: ({ isDark }) => (isDark
      ? 'ag-theme-balham-dark'
      : 'ag-theme-balham'),
    locale: ({ currentLocale }) => {
      if (currentLocale === 'zhHans') {
        return 'zh';
      }
      return currentLocale;
    },
  },
});
