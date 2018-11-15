<template>
  <div>
    <div class="tabs">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: 'managegroup' }">管理人</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '' }">编辑</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 检索 -->
      <div class="manage" v-loading='tableLoading'>
        <div class="input">
          <label>用户名：</label>
          <el-input type="text" v-model="account" size="small" placeholder="请输入用户名"></el-input>
        </div>
        <div class="radio">
          <label class="label">是否禁止：</label>
          <el-radio v-model="status" :label="0">禁用</el-radio>
          <el-radio v-model="status" :label="1">启用</el-radio>
        </div>
        <div class="input">
          <label>密码：</label>
          <el-input type="password" v-model="password" size="small" placeholder="请输入密码（6位以上）"></el-input>
        </div>
        <div class="input">
          <label>重复密码：</label>
          <el-input type="password" v-model="passwordRepeat" size="small" placeholder="请再次输入密码"></el-input>
        </div>
        <div class="input">
          <label>姓名：</label>
          <el-input type="text" v-model="name" size="small" placeholder="请输入姓名"></el-input>
        </div>
        <div class="input">
          <label>邮箱：</label>
          <el-input type="text" v-model="email" size="small" placeholder="请输入邮箱"></el-input>
        </div>
        <div class="input">
          <label>手机：</label>
          <el-input type="text" v-model="phone" size="small" placeholder="请输入手机"></el-input>
        </div>
        <div class="input select">
          <label>用户组：</label>
          <el-select v-model="roleId" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>

        <div class="btns">
          <el-button size='small' @click="reset">重置</el-button>
          <el-button type='primary' size='small' @click="create">提交</el-button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      account:null,
      status:1,
      name:null,
      password:null,
      passwordRepeat:null,
      email:null,
      phone:null,
      tableData1: [],
      tableLoading1: false,
      roleId:null,
      options:null,
      optionsLoading:0,
      tableLoading:0,
      urls: {
        select: "roles/select",
        modify: "users/modify",
        detail: "users/detail",
      }
    };
  },
  
  methods: {
    getDetail() {
      this.tableLoading1 = true;
      let body = {
        url: this.urls.detail,
        data: {
          id: this.$route.query.id
        }
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.account = d.data.account;
          this.status = d.data.status;
          this.name = d.data.name;
          this.password = d.data.password;
          this.passwordRepeat = d.data.password;
          this.email = d.data.email;
          this.phone = d.data.phone;
          this.roleId = d.data.roleId;
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    reset(){
      this.account=null
      this.status=0
      this.name=null
      this.password=null
      this.passwordRepeat=null
      this.email=null
      this.phone=null
      this.roleId = null
    },
    getOptions() {
      this.optionsLoading = true;
      let body = {
        url: this.urls.select
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.options = d.data
        }
        // 表格数据
        this.optionsLoading = false;
      });
    },
    create() {
      if(!this.reg()) return
      this.tableLoading1 = true;

      let body = {
        url: this.urls.modify,
        method:"PATCH",
        data: {
          id:this.$route.query.id,
          account: this.account,
          status: this.status,
          name: this.name,
          password: this.password,
          email: this.email,
          roleId: this.roleId,
          phone: this.phone
        }
      };
      
      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.notify('修改成功')
          this.$router.push('/managesingle')
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    reg(){
      if(!this.account) {
        this.warn('请输入用户名')
        return false
      }
      if(!this.password) {
        this.warn('请输入密码')
        return false
      }
      if(this.password.length<6) {
        this.warn('密码长度小于6位')
        return false
      }
      if(this.password!==this.passwordRepeat) {
        this.warn('两次密码输入不同')
        return false
      }
      if(!this.name) {
        this.warn('请输入姓名')
        return false
      }
      if(!this.email) {
        this.warn('请输入邮箱')
        return false
      }
      if(!this.roleId) {
        this.warn('请选择用户组')
        return false
      }
      return true
    }
  },
  mounted() {
    
  },
  created() {
    this.getOptions();
    this.getDetail();
  }
};
</script>

<style scoped lang="stylus">
.breadcrumb
  margin 10px 0 20px
  padding-bottom 10px
  border-bottom 1px solid #eee
.manage
  background #fff
  padding 20px
  border 1px solid #e4e5e7
  min-height 800px
  .input
    display flex
    align-items center
    width 500px
    margin-bottom 20px
    label 
      width 100px
      text-align right
      margin-right 10px
    &.select
      align-items center
      label 
        width 83px
  .radio
    display flex
    width 500px
    margin-bottom 20px
    .label 
      width 90px
      text-align right
      margin-right 10px
  .btns 
    margin-top 40px
</style>
