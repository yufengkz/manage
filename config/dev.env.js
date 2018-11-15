'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const testEnv = require('./test.env')
const moment = require('moment')
const nowTime = moment().format('YYYYMMDDHHmmss')+''

// 本地开发环境
module.exports = merge(prodEnv,testEnv, {
  NODE_ENV: '"development"',
  // API_ROOT: '"http://api.kajingling.com.cn/lanjinrong-website-manager/manager/api/v1/"',
  // 高昂
  // API_ROOT: '"http://192.168.1.198:8090/lanjinrong-website-manager/manager/api/v1/"',
  // 李伟
  // API_ROOT: '"http://192.168.30.14:8090/lanjinrong-website-manager/manager/api/v1/"',
  // 测试
  API_ROOT: '"http://192.168.1.161:8040/lanjinrong-website-manager/manager/api/v1/"',
  // API_ROOT: '"http://api.kakahui.net/lanjinrong-website-manager/manager/api/v1/"',

  // 春明
  // API_ROOT: '"http://192.168.1.106:8080/lanjinrong-website-manager/manager/api/v1/"',
  // 闫实
  // API_ROOT: '"http://192.168.1.55:8090/admin/manager/api/v1/"',
  // 谢辉
  // API_ROOT: '"http://192.168.1.43:8080/lanjinrong-website-manager/manager/api/v1/"',
  QN_IMG_DOMAIN: '"http://qiniu.lanjinrong.com/"',
  // 七牛上传凭证获取接口
  imgToken:'"http://api.kajingling.com.cn/lanjinrong-web-customer/api/v1/systems/getUploadToken"',
  BUILD_TIME:nowTime
})
