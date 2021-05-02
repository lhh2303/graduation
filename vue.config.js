const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: '/',
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@components', resolve('src/components'))
      .set('@assets', resolve('src/assets'))
      .set('@picture', resolve('src/assets/picture'))
      .set('@common', resolve('src/common'))
      .set('@store', resolve('src/store'))
      .set('@router', resolve('src/router'))
      .set('@', resolve('src'));
  },

};
