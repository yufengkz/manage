import Vue from 'vue'
import rout from './router'
import {
  SetTitle
} from '../index'
import VueRouter from 'vue-router'
import {
  getCookie
} from '@/api/index'
//路由配置
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  routes: rout
});
router.beforeEach((to, from, next) => {
  // console.log("判断是否登录")
  // 如果前往登录页面 跳出
  if(to.path.indexOf("login")!==-1){
    next()
    return
  }
  // 不存在token、跳到登录页面
  if (!getCookie("token")) {
    // Vue.prototype.warn('用户已失效，请重新登录')
    next("/login")
    return
  }
  // 存在token并且路径为空，跳到index
  if (getCookie("token")&&to.path==='/') {
    if(localStorage.getItem('user').match('operate')){
      next("/raiders")
      return
    }
    next("/home") //users
    return
  }
  next()
})

router.afterEach((transition) => {
  let title = transition.meta.title;
  SetTitle(title)
});
export default router
