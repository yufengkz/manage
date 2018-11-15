<template>
  <div>
    <div id="header" :class="login?'logined':''">
      <div class="headerBox">
        <div class="header-left">
          BlueSea 后台管理系统
        </div>
        <div class="header-right">
          <div class="badge" @click="showNotice">
            <el-badge is-dot class="notice"></el-badge>
          </div>
          <div class="header-help"></div>
          <div class="header-userCenter" v-on:mouseenter="userCenterover" v-on:mouseleave="userCenterout">
            <i class="header-userpic"></i>
            <i class="el-icon-arrow-down pos"></i>
            <div class="user-layer" v-show="isShow">
              <h5>
                <i class="user-icon"></i>
                <span>hi, {{user}}</span>
              </h5>
              <div class="header-btn">
                <el-button class="loginOut" @click="loginOut">退出登录</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="notiveDialog">
      <el-dialog title="系统公告" :visible.sync="dialogVisible">
        <el-collapse accordion>
          <el-collapse-item>
            <template slot="title">一致性 Consistency
              <i class="notice-date">2017-1-2</i>
            </template>
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
          </el-collapse-item>
          <el-collapse-item title="反馈 Feedback">
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
          <el-collapse-item title="效率 Efficiency">
            <div>简化流程：设计简洁直观的操作流程；</div>
            <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
            <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
          </el-collapse-item>
          <el-collapse-item title="可控 Controllability">
            <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
          </el-collapse-item>
        </el-collapse>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getCookie } from "../../../src/api/index";
export default {
  name: "homePage",
  data() {
    return {
      login: 0,
      user: "管理员",
      isShow: false,
      dialogVisible: false
    };
  },
  created() {
    // 是否登录
    if (getCookie("token")) {
      this.user = localStorage.getItem("user");
      this.login = 1;
    }
  },
  methods: {
    // 個人中心移入
    userCenterover() {
      this.isShow = true;
    },
    userCenterout() {
      this.isShow = false;
    },
    showNotice() {
      this.dialogVisible = true;
    },
    loginOut() {
      localStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2001;
  transform: translateY(-100%);
  transition: 0.5s 0.2s;
}
#header.logined {
  transform: translateX(0);
}
.headerBox {
  width: 100%;
  height: 50px;
  min-width: 1280px;
  background: #65a5f6;
  line-height: 50px;
  position: relative;
}
.header-left {
  padding-left: 10px;
  height: 50px;
  line-height:50px;
  text-align: center;
  font-size:24px;
  color: #fff;
   /*background: url('../../assets/img/header-logo.svg') no-repeat;*/
   position: absolute;
  /*top: 53%;
  transform: translateY(-50%);
  left: 16px; */
}
.header-right {
  width: 150px;
  position: absolute;
  right: 7px;
  height: 50px;
}
.header-right div {
  float: left;
  cursor: pointer;
}
.badge {
  margin-right: 26px;
  width: 16px;
  padding-top: 17px;
}
.notice {
  width: 12px;
  height: 14px;
  background: url("../../assets/img/header-notice.png") no-repeat;
}
.header-help {
  width: 14px;
  height: 14px;
  background: url("../../assets/img/header-help.png") no-repeat;
  margin-right: 29px;
  margin-top: 17px;
}
.header-userCenter {
  width: 50px;
  height: 50px;
  padding-top: 2px;
  position: relative;
}
.header-userCenter i {
  display: inline-block;
}
.header-userpic {
  width: 14px;
  height: 16px;
  background: url("../../assets/img/header-usercenter.png") no-repeat;
}
.pos {
  position: absolute;
  top: 19px;
  right: 8px;
}
.user-layer {
  position: absolute;
  width: 178px;
  height: 97px;
  background: url("../../assets/img/user-center.png") no-repeat;
  left: -139px;
  top: 36px;
  color: #262626;
}
.user-layer h5 {
  height: 26px;
  border-bottom: 1px solid #edf1f5;
  margin: 14px 8px 0 7px;
  line-height: 26px;
  margin-bottom: 5px;
}
.user-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: url("../../assets/img/user-icon.png") no-repeat;
}
#header .el-button {
  padding: 7px 11px;
  font-size: 12px;
}
.header-right .header-btn {
  margin-right: 8px;
  float: right;
}
.notice-date {
  float: right;
  margin-right: 20px;
}
</style>
