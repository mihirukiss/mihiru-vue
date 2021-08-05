module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    if (process.env.npm_config_report) {
      config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end()
    }
  },
  publicPath: process.env.NODE_ENV === 'production' ? 'https://cdn.mihiru.com/' : '/',
  productionSourceMap: false
}
