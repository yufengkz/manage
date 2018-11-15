// 自定义全局方法
import axios from "@/api/axios";
const custom = {};
custom.install = function (Vue, options) {

  Vue.prototype.axios = axios;

  Vue.prototype.noRight = () => {
    Vue.prototype.warn("没有权限，拒绝访问。");
  };
  Vue.prototype.warn = (msg, duration = 4500) => {
    Vue.prototype.$notify({
      title: msg,
      type: "warning",
      position: "bottom-right",
      duration: duration
    });
  };
  Vue.prototype.notify = (msg, duration = 4500) => {
    Vue.prototype.$notify({
      title: msg,
      type: "success",
      position: "bottom-right",
      duration: duration
    });
  };
}
export default custom;
