import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@mdi/font/css/materialdesignicons.css';
import i18n from '@/plugins/i18n';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true, // 默认深色
    options: { customProperties: true },
    themes: {
      light: {
      },
      dark: {
        icon: '#FFFFFF', // 白色
        primary: '#18FEFE', // 淡蓝色
        primary2: '#1685d3', // 浅蓝
        primary3: '#102242', // 深蓝2
        secondary: '#0D589E', // 深蓝色
        purple: '#6c7293', // 淡紫色
        error: '#D9001B', // 红色
        info: '#A5A5A5', // 灰色
        success: '#21C77C', // 绿色
        warning: '#F59A23', // 黄色
        dBackground: '#000000', // 黑色
        wBackground: '3B3B3B', // 深灰色
      },
    },
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
});
