module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    if (process.env.npm_config_report) {
      config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end()
    }
    config.plugin('copy').tap(([options])=> {
      options[0].ignore.push('data/**/*')
      return [options]
    })
  },
  publicPath: process.env.NODE_ENV === 'production' ? 'https://mihiru-1308377841.cos.accelerate.myqcloud.com/' : '/',
  productionSourceMap: false
}
