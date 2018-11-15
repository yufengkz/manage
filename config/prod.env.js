'use strict'
const moment = require('moment')
const nowTime = moment().format('YYYYMMDDHHmmss')+''
// 发布到线上环境
// 全局访问：process.env.API_ROOT
module.exports = {
  version: '"0.0.1"',
  NODE_ENV: '"production"',
  API_ROOT: '"http://api.kajingling.com.cn/lanjinrong-website-manager/manager/api/v1/"',
  QN_IMG_DOMAIN: '"http://qiniu.lanjinrong.com/"',
  imgToken:'"http://api.kajingling.com.cn/lanjinrong-web-customer/api/v1/systems/getUploadToken"',
  BUILD_TIME:nowTime
}

