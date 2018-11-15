'use strict'
// 发布到测试环境

const moment = require('moment')
const nowTime = moment().format('YYYYMMDDHHmmss')+''

module.exports = {  
  NODE_ENV: '"test"',
  API_ROOT: '"http://192.168.1.161:8040/lanjinrong-website-manager/manager/api/v1/"',
  QN_IMG_DOMAIN: '"http://qiniu.lanjinrong.com/"',
  imgToken:'"http://api.kajingling.com.cn/lanjinrong-web-customer/api/v1/systems/getUploadToken"',
  BUILD_TIME:nowTime
}

