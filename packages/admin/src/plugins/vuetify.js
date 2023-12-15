import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import i18n from '@/plugins/i18n';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#0075C2', // 主题色
        secondary: '#0055C2', // dark模式主题色
        subtitle: '#595959', // 灰色
        error: '#FF5733',
        warning: '#FF880D',
        success: '#00B42A',
        info: '#8C8C8C',
        danger: '#FF5733',
        menu: '#0075C2', // 菜单背景
        bg: '#ffffff', // 主背景色
        tag1: '#F7F8FA', // 激活页签包括激活页面背景色
        tag2: '#ECEDF1', // 非激活页签
        active: '#F7F8FA', // 表头颜色
        selected: '#F7FCFF', // 选中行颜色
        pagenav: '#F4F4F5', // 分页标签背景色
        line: '#d7d7d7', // 时间线颜色，淡灰色
        cardbg: '#f9f9f9', // 卡片背景颜色，淡灰色
        bodytext: '#000', // 正文颜色，黑色
      },
      dark: {
        primary: '#5C7BFF', // 主题色
        secondary: '#1B2F8F', // light模式主题色反色
        subtitle: '#BFBFBF', // 灰色
        error: '#FF5733',
        warning: '#FF880D',
        success: '#00B42A',
        info: '#8C8C8C',
        danger: '#FF5733',
        menu: '#1E2436', // 菜单背景
        bg: '#2A3041', // 主背景色
        tag1: '#151B24', // 激活页签包括激活页面背景色
        tag2: '#494F66', // 非激活页签
        active: '#454F6C', // 表头颜色
        selected: '#454F6C', // 选中行颜色
        pagenav: '#3C4661', // 分页标签背景色
        line: '#666c7e', // 时间线颜色，淡灰色
        cardbg: '#424758', // 卡片背景颜色，淡灰色
        bodytext: '#fff', // 正文颜色，白色
      },
    },
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  icons: {
    iconfont: 'mdi',
    values: {
    },
  },
});
