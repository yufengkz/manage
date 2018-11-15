import axios from "axios";
import {
  getCookie
} from "../index";
import md5 from "js-md5";
import {
  Base64
} from 'js-base64'

axios.defaults.baseURL = process.env.API_ROOT;

axios.defaults.timeout = 100000;

// header签名
function sign(body, timestamp) {
  let salt = {
    APP: '48119cfa053bb95313b6c4aacbfcffb1728e4e3c',
    H5: '4c77e2945b5bd2cecf8dd983ee7531d98d9565f1',
    wechat: '29fcab89ba4e73a60b50402801070f33c3a3aa1a',
    Manager: 'EqYKiaWy6qBRvX0EUoUXC6O3xEeRhz',
    wechatApp: '263ae9332b1a36c8cd12f907174a016280b67f81'
  }
  let token = getCookie("token") || ''
  let str = ''
  body && Object.keys(body).sort().forEach(key => str += key + body[key])
  let sign = md5(Base64.encode(String(timestamp)) + token + salt.Manager + str)
  return sign
}


const Axios = function (obj) {
  return new Promise((response, reject) => {
    let method = obj.method || "post";
    let timestamp = parseInt(+new Date() / 1000)
    let headers = {
          "X-Requested-With": "XMLHttpRequest",
          "timestamp": timestamp,
          "signature": sign(obj.data || {}, timestamp),
          "token": getCookie("token") || ''
        }
    !!obj.headers && Object.assign(headers,obj.headers)
    axios({
        url: obj.url,
        method: method,
        data: obj.data || {},
        headers: headers
      })
      .then(res => {
        // 令牌失效
        if (res.data.code === 3 && !/qiniu/.test(obj.url)) {
          this.$router.push('/login')
          this.warn(`登陆过期，请重新登陆`,5000);
          return
        }
        if (res.data.code !== 0 && !/qiniu/.test(obj.url)) {
          window.setTimeout(this.warn(res.data.message,5000), 0)
          this.loading = 0
          this.tableLoading1 = 0
          reject(res);
        }
        response(res);
      })
      .catch(rej => {
        reject(rej);
      });
  });
};

export default Axios;
