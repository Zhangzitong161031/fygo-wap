var path = require('path')
module.exports = {
  // 打包后静态资源的加载公共路径(js, css, image)
  // 主要是部署到线上时, 服务器访问可能会有指定路径
  publicPath: '/wap/',
  // cube-ui
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: ['./src/theme']
      }
    }
  },
  // cube-ui
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    },
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './static/css/index.scss')]
    }
  },
  // svg
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    // clear all existing loaders.
    // if you don't do this, the loader below will be appended to
    // existing loaders of the rule.
    svgRule.uses.clear()

    // add replacement loader(s)
    svgRule
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  // devserver 和 qa 必须同源: 同协议, 同域名, 同端口
  // 本地 json-server 不需要 devServer, 但是必须和 qa 同源
  // devServer: {
  //   open: true,
  //   host: 'localhost', // devserver host
  //   port: 8080, // devserver port
  //   https: false,
  //   proxy: {
  //     '/api': {
  //       target: 'http://fygo.chinaeast2.cloudapp.chinacloudapi.cn', // proxy ip
  //       changOrigin: true,
  //       ws: true,
  //       pathRewrite: {
  //         '^/api': '/mobile/index.php'
  //       }
  //     }
  //   }
  // }

  devServer: {
    open: true,
    host: 'localhost', // devserver host
    port: 8080, // devserver port
    https: false,
    proxy: {
      '/mobile': {
        // target: 'http://fygo.chinaeast2.cloudapp.chinacloudapi.cn', // qa proxy ip
        target: 'http://flmall.sovell.com',
        changOrigin: true,
        ws: true
      }
    }
  }
}
/*
'/api': {}, 就是告诉node, 我接口只要是'/api'开头的才用代理.所以你的接口就要这么写 /api/xx/xx. 最后代理的路径就是 http://xxx.xx.com/api/xx/xx.
 pathRewrite 会用 '/mobile/index.php' 去替换 '/api', 最后代理的路径就是 http://xxx.xx.com/mobile/index.php/xx/xx.

 后台要配置 Access-Control-Allow-Origin: * 允许 localhost 跨域请求请求资源
*/
