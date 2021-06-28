个人站点[mihiru.com](https://mihiru.com)的前端页面项目, 将原先的纯HTML+JS改造成基于VUE的项目. 部分模块采用了vuetify UI组件库.  
后端接口地址在.env文件中配置, .env.production为生成部署环境文件时采用的接口地址.

# 调试运行
```
npm run serve
```

# 编译生成部署用文件
```
npm run build
```
注意在vue.config.js中修改部署环境访问地址  
部署时需注意将对子页面的访问需重定向到根目录的index.html处理, 否则用户通过地址栏直接访问子页面地址将会404. 请参考[vue router官方文档](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)

# 分析编译文件
```
npm run analyze
```
如果提示cross-env不是可运行程序, 请先安装cross-env
```
npm install -g cross-env
```