module.exports = {
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/public/'
  //   : '/',
  lintOnSave: false,
  runtimeCompiler: true,
  productionSourceMap: false,
  devServer: {
    //proxy: 'https://pdaccess.com/'
    proxy: {
      "^/api": {
        //target: 'http://localhost:8080',
        target: "https://app.pdaccess.com/",
        ws: true,
        //changeOrigin: true
      },
      "/db/maintenanceDate": {
        pathRewrite: {
          "^/db/maintenanceDate": "/maintenanceDate",
        },
        target: "http://localhost:8082",
        ws: true,
      },
      "/term/maintenanceDate": {
        pathRewrite: {
          "^/term/maintenanceDate": "/maintenanceDate",
        },
        target: "http://localhost:8083",
        ws: true,
      },
      "/dtunnelws": {
        pathRewrite: {
          "^/dtunnelws": "/tunnelws",
        },
        target: "http://localhost:8082",
        ws: true,
        changeOrigin: true,
      },
      "/term/wstunnel": {
        pathRewrite: {
          "^/term/wstunnel": "/wstunnel",
        },
        target: "http://localhost:8083",
        ws: true,
      },
      "/ws/notificationtunnel": {
        //pathRewrite: {
        //  '^/ws/notificationtunnel(.*)' : '/ws/notificationtunnel'
        //},
        //target: 'http://localhost:8080',
        target: "https://pdaccess.com/",

        ws: true,
        option: {
          headers: {
            "X-Frame-Options": "sameorigin",
          },
        },
      },
      "/ws/playbooktunnel": {
        //target: 'http://localhost:8080',
        target: "https://pdaccess.com/",
        ws: true,
        option: {
          headers: {
            "X-Frame-Options": "sameorigin",
          },
        },
      },
      "/ws/sessiontunnel": {
        //target: 'http://localhost:8080',
        target: "https://pdaccess.com/",
        ws: true,
        option: {
          headers: {
            "X-Frame-Options": "sameorigin",
          },
        },
      },
      "^/login": {
        //target: 'http://localhost:8080',
        target: "https://dev.pdaccess.com/",
        ws: true,
        changeOrigin: true,
      },
      "/ws/userDownTunnel": {
        //pathRewrite: {
        //  '^/ws/notificationtunnel(.*)' : '/ws/notificationtunnel'
        //},
        target: "http://localhost:8080",
        ws: true,
        option: {
          headers: {
            "X-Frame-Options": "sameorigin",
          },
        },
      },
      "^/monitor": {
        //target: "http://localhost:8080",
        target: "https://vaul.pdaccess.com/",
        ws: true,
        changeOrigin: true,
      },
    },

    //proxy: 'https://pdaccess.com'
    //proxy: 'http://localhost:8080'
  },
  pages: {
    index: {
      // entry for the page
      entry: "src/main.js",
      // the source template
      template: "public/index.html",
      // output as dist/index.html
      filename: "index.html",
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: "PDAccess - Console",
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("md")
      .test(/\.md/)
      .use("vue-loader")
      .loader("vue-loader")
      .end()
      .use("vue-markdown-loader")
      .loader("vue-markdown-loader/lib/markdown-compiler")
      .options({
        raw: true,
      });
  },
};
