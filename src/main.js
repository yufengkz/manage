import Vue from "vue";
import App from "./App.vue";
import router from "./api/router/index";
import store from "./vuex/store";
import globalData from "./config/globalData";
import globalMethods from "./config/globalMethods";
import Filters from "./config/globalFilter";
import "./assets/css/reset.css";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/mod-element.css";
// 编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(globalMethods)

// 压缩图片方法挂载到全局
import imgCompress from '../plugin/img-compress'
Vue.use(imgCompress,{width:1080})
//全局过滤器
Object.keys(Filters).forEach(key => {
  Vue.filter(key, Filters[key]);
});

Vue.config.productionTip = false;
new Vue({
  el: "#app",
  data: {globalData:globalData},
  template: "<App/>",
  components: {
    App
  },
  store,
  router
});


// 版本号
window.version = process.env.NODE_ENV + " - " + process.env.BUILD_TIME
console.info(version);

if (process.env.NODE_ENV === 'development') Vue.config.devtools = true

export default Vue
;
// console.log(`%c
//
//
//   Code is far away from bug with the mythical animal protecting
//   神兽保佑,永无bug
//
//   　　 ┏┓   ┏┓
//   　　┏┛┻━━━┛┻┓
//   　　┃　　　  ┃
//   　　┃   ━   ┃
//   　　┃ ┳┛ ┗┳ ┃
//   　　┃　　　  ┃
//   　　┃　　┻　 ┃
//   　　┃　　　  ┃
//   　　┗━┓   ┏━┛
//   　　  ┃   ┃
//   　　  ┃   ┃
//   　　  ┃   ┗━━━┓
//   　　  ┃       ┣┓
//   　　  ┃       ┏┛
//   　　  ┗┓┓┏━┳┓┏┛
//   　　   ┃┫┫ ┃┫┫
//   　　   ┗┻┛ ┗┻┛
//
//
// `,'color:#ccc;')


/**
 *
 * 　　 ┏┓   ┏┓
 * 　　┏┛┻━━━┛┻┓
 * 　　┃　　　  ┃
 * 　　┃   ━   ┃
 * 　　┃ ┳┛ ┗┳ ┃
 * 　　┃　　　  ┃
 * 　　┃　　┻　 ┃
 * 　　┃　　　  ┃
 * 　　┗━┓   ┏━┛  Code is far away from bug with the mythical animal protecting
 * 　　  ┃   ┃    神兽保佑,代码永无bug
 * 　　  ┃   ┃
 * 　　  ┃   ┗━━━┓
 * 　　  ┃       ┣┓
 * 　　  ┃       ┏┛
 * 　　  ┗┓┓┏━┳┓┏┛
 * 　　   ┃┫┫ ┃┫┫
 * 　　   ┗┻┛ ┗┻┛
 *
 */
