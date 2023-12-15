const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: './',
  devServer: {
    proxy: {
      // '/system': {
      //   target: 'http://121.43.56.225/system',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/system': '',
      //   },
      // },
      '/mock': {
        target: 'http://120.55.127.124:3000/mock',
        changeOrigin: true,
        pathRewrite: {
          '^/mock': '',
        },
      },
      '/m1': {
        target: 'http://127.0.0.1:4523/m1',
        changeOrigin: true,
        pathRewrite: {
          '^/m1': '',
        },
      },
      '/prod-api': {
        target: 'http://47.98.238.55:8080/',
        // target: 'http://nordisk.natapp1.cc/prod-api/', // 正式服ip
        changeOrigin: true,
        pathRewrite: {
          '^/prod-api': '',
        },
      },
      '/docker': {
        target: 'http://47.98.238.55/docker',
        // target: 'http://10.50.16.21:8080/', // 测服ip
        changeOrigin: true,
        pathRewrite: {
          '^/docker': '',
        },
      },
      '/statusCheck': {
        target: 'http://47.98.238.55:7012/statusCheck',
        changeOrigin: true,
        pathRewrite: {
          '^/statusCheck': '',
        },
      },
      '/linemes': {
        target: 'http://121.43.56.225:10190/linemes',
        changeOrigin: true,
        pathRewrite: {
          '^/linemes': '',
        },
      },
      '/spc': {
        target: 'http://bms.kojet.com.cn:8091/MesTest/RuhApi_nvo/spc',
        changeOrigin: true,
        pathRewrite: {
          '^/spc': '',
        },
      },
      '/capab': {
        target: 'http://bms.kojet.com.cn:8091/MesTest/RuhApi_nvo/capab',
        changeOrigin: true,
        pathRewrite: {
          '^/capab': '',
        },
      },
      '/statics': {
        target: 'http://47.98.238.55/statics',
        changeOrigin: true,
        pathRewrite: {
          '^/statics': '',
        },
      },
      // '/basicConfiguration': {
      //   target: 'http://10.50.16.22:5000/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': '',
      //   },
      // },
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
  chainWebpack: (config) => {
    config.plugin('copy').tap((options) => {
      options[0].patterns[0].globOptions.ignore.push('**/example/**');
      return options;
    });
  },
});
