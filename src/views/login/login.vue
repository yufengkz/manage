<template>
  <div class="login">

    <div class="sea-bg" :class="go?'colorgo':''" :style="`background: linear-gradient(-${random*360}deg, rgba(${parseInt(random*255)}, ${parseInt(random*255)}, ${parseInt(random*255)}, 0.8), rgba(102, 193, 62, 0.8));`"></div>
    <div class="sea-bg2" :class="go?'colorgo':''" :style="`background: rgba(65, ${parseInt(random*255)}, 253, 0.8);opacity:${random}`"></div>
    <div class="an" :class="go?'go':''"></div>

    <div class="login_outer" :class="go?'logingo':''">
      <div class="login_box" v-loading="loading">
        <div class="tit">bluesea管理后台</div>
        <el-form label-position="right" label-width="40px" :model="login">
          <el-form-item label="账号">
            <el-input ref="account" @keyup.enter.native="submitForm" v-model="login.account"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input ref="pwd" v-model="login.pwd" @keyup.enter.native="submitForm" type="password"></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { setCookie } from "@/api/index";
export default {
  data() {
    return {
      loading: 0,
      login: {
        account: "",
        pwd: ""
      },
      go: 0,
      urls: {
        login: "systems/login",
        // 左侧列表
        PowerList: "/Main/action/User/Power/PowerList"
      }
    };
  },
  computed: {
    random() {
      return Math.random();
    }
  },
  methods: {
    submitForm() {
      if (this.login.account === "") {
        this.$notify({
          title: `请输入账号`,
          type: "warning",
          position: "bottom-right"
        });
        this.$refs.account.focus();
        return;
      }
      if (this.login.pwd === "") {
        this.$notify({
          title: `请输入密码`,
          type: "warning",
          position: "bottom-right"
        });
        this.$refs.pwd.focus();
        return;
      }
      this.loading = 1;
      let body = {
        url: this.urls.login,
        data: {
          account: this.login.account,
          // password: md5(this.login.pwd)
          password: this.login.pwd,
          deviceId: "1",
          deviceModel: "2",
          osName: "3",
          osVersion: "4",
          appChannel: "5",
          appVersion: "6"
        }
      };
      this.axios(body)
        .then(res => {
          let d = res.data;
          if (d.code !== 0) {
            this.tableLoading = false;
            this.$notify({
              title: `登录失败`,
              type: "warning",
              position: "bottom-right"
            });
            this.loading = 0;
            return;
          }
          this.$notify({
            title: `欢迎您，${this.login.account}`,
            type: "success",
            position: "bottom-right"
          });
          this.loading = 0;
          setCookie("token", d.data.data, 2);
          localStorage.setItem("user", this.login.account);
          // 如果是运营，跳至达人攻略
          this.login.account.match("operate")
            ? this.$router.push("/raiders")
            : this.$router.push("/");
        })
        .catch(res => {
          this.$notify({
            title: `登录失败`,
            type: "warning",
            position: "bottom-right"
          });
          this.loading = 0;
        });
    }
  },
  mounted() {
    this.go = 1;
  }
};
</script>

<style scoped lang="stylus">
.login
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  color #666
  overflow hidden
  .login_outer
    display flex
    height 90%
    align-items center
    justify-content center
    .login_box
      padding 20px 40px 30px
      background #fff
      border-radius 8px
      box-shadow 1px 1px 36px #ccc
      .tit
        line-height 40px
        margin-bottom 20px
        text-align center
        font-size 18px
      .el-button
        margin 40px auto 0
        display block
        width 200px
.login_box >>> .el-form-item__label
  line-height 40px !important
.login_box >>> .el-form-item__content
  width 266px
.sea-bg, .sea-bg2
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  z-index -2
  transition 0.5s
.an
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  background #ffffff
  z-index -1
  box-shadow 0 0 60px rgba(255, 255, 255, 0.6)
.an.go
  animation 1.5s bgMove both cubic-bezier(0.29, 1, 0.29, 1)
.logingo
  animation 1s LoginMove both 0.5s cubic-bezier(0.29, 1, 0.29, 1)
.colorgo
  animation 1s colorgo both 0.3s cubic-bezier(0.29, 1, 0.29, 1)
@keyframes bgMove
  to
    opacity 0.3
    transform translateY(100%)
@keyframes LoginMove
  from
    opacity 0
    transform translateY(10%)
@keyframes colorgo
  from
    opacity 0
</style>
