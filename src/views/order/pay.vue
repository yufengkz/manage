<template>
  <div class="ad" v-loading='tableLoading1'>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '' }">人工支付</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="inputs">
      <label>用户标识：</label>
      <el-input v-model="customerId" placeholder="请输入用户标识"></el-input>
    </div>
    <div class="inputs">
      <label>金额（分）：</label>
      <el-input v-model="money" placeholder="请输入金额（分）"></el-input>
    </div>
    <div class="inputs">
      <label>发钱类型：</label>
      <el-input v-model="type" placeholder="请输入发钱类型"></el-input>
    </div>
    <el-button class="pay" type="primary" @click="pay">支付</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {      
      customerId: '',
      money: '',
      type: '',
      urls: {
        // 列表
        payFor: "artificialPayment/payFor",
      }
    };
  },
  created() {    
  },
  methods: {
    pay() {
      this.tableLoading1 = true;
      let body = {
        url: this.urls.payFor,
        data: {
          customerId: this.customerId,
          money: this.money,
          type: this.type,
        }
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.$notify({
            title: `支付成功`,
            type: "success",
            position: "bottom-right"
          })
          this.money=0
        }
        this.tableLoading1 = false;
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.pay
  width 100px
  margin-left 100px
.ad
  margin2 50px 20px 0 180px
  background #fff
  padding 10px 20px 20px
  border 1px solid #e4e5e7
  min-height 800px
  color #444
  .breadcrumb
    margin 10px 0 20px
    padding-bottom 10px
    border-bottom 1px solid #eeeeee
  .inputs
      display flex
      align-items center
      margin-bottom 20px
      label
        width 100px
        font-size 14px
        text-align right
      .el-input
        width 500px
</style>
