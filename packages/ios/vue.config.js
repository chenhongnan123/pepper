require('events').EventEmitter.defaultMaxListeners = 0;

module.exports = {
  publicPath: './',
  devServer: {
    // watchOptions: {
    //   ignored: ['**/node_modules', '**/public/model'],
    // },
    proxy: {
      // '/socket.io': {
      //   target: 'http://192.168.1.230/socket.io',
      //   changeOrigin: false
      // },
      '/prod-api': {
        target: 'http://47.98.238.55:8080/',
        // target: 'http://nordisk.natapp1.cc/prod-api/', // 正式服ip
        changeOrigin: true,
        pathRewrite: {
          '^/prod-api': '',
        },
      },
      '/server': {
        target: 'http://10.50.16.26/server',
        changeOrigin: true,
        pathRewrite: {
          '^/server': '',
        },
      },
      '/mdo': {
        target: 'http://10.50.16.26/mdo',
        changeOrigin: true,
        pathRewrite: {
          '^/mdo': '',
        },
      },
      '/commonlogin': {
        target: 'http://10.50.16.26/commonlogin',
        changeOrigin: true,
        pathRewrite: {
          '^/commonlogin': '',
        },
      },
      '/document': {
        target: 'http://10.50.16.26/document',
        changeOrigin: true,
        pathRewrite: {
          '^/document': '',
        },
      },
      '/sse': {
        target: 'http://10.50.16.26/sse',
        changeOrigin: true,
        pathRewrite: {
          '^/sse': '',
        },
      },
      '/websocket': {
        target: 'http://10.50.16.26/websocket',
        changeOrigin: true,
        pathRewrite: {
          '^/websocket': '',
        },
      },
      '/statics': {
        target: 'http://47.98.238.55/statics',
        changeOrigin: true,
        pathRewrite: {
          '^/statics': '',
        },
      },
    },
  },
  transpileDependencies: [
    'vuetify', 'socket.io-client',
  ],
  chainWebpack: (config) => {
    config.plugin('copy').tap((options) => {
      options[0].patterns[0].globOptions.ignore.push('**/model/**');
      return options;
    });
  },
};
