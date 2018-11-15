<template>
  <div id="app">
    <!-- 如果在登录页面 不显示头部和侧边栏 -->
    <vheader v-if="!$route.path.match('login')"></vheader>
    <div :class="[isCollapse ? 'router-view hide' : 'router-view']">
      <router-view></router-view>
    </div>
    <vsidebar v-if="!$route.path.match('login')" @hide='hide'></vsidebar>
  </div>
</template>

<script>
import vheader from "./components/header/index.vue";
import vsidebar from "./components/sidebar/index.vue";
export default {
  name: "App",
  data() {
    return {
      isCollapse: false,
      user:localStorage.getItem('user')
    };
  },
  methods: {
    hide(e) {
      this.isCollapse = e;
    }
  },
  components: {
    vheader,
    vsidebar
  },
  mounted(){
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  width: 100%;
  overflow-x: hidden;
}
.router-view {
  min-width: 1080px;
  padding: 50px 0 0 180px;
  transition: 0.5s 0.3s;
  will-change: padding-left;
}
.router-view.hide {
  padding-left: 48px;
}
</style>
