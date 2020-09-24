module.exports = {
  // publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  devServer: {
    host: '0.0.0.0',
    port:'8080',
    disableHostCheck: true,
    https:false,
    hotOnly: false,
    //代理
    proxy: {
      '/api': {
        target:'http://tucodec1111.natapp1.cc',
        // target:'http://192.168.1.161:8080',
        changeOrigin: true,
        ws:true,
        //重写路径  需要设置重写的话，要在后面的调用接口前加上/api 来代替target
        pathRewrite:{
          '^/api': ''
        }
      },
      '/ws': {
        target: 'ws://tucodec1111.natapp1.cc',
        // target:'http://192.168.1.161:8080',
        ws:true,
        secure: false
      }
    }
  }
}
