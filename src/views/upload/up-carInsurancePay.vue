<template>
  <div class="ad" v-loading='tableLoading1'>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>上传数据管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '' }">车险</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="inputs">
      <label>被保人姓名：</label>
      <el-input size='mini' v-model="name" placeholder="请输入姓名"></el-input>
    </div>

    <div class="inputs">
      <label>车牌号：</label>
      <el-input size='mini' v-model="plateNumber" placeholder="请输入车牌号"></el-input>
    </div>

    <div class="inputs">
      <label>佣金金额（分）：</label>
      <el-input size='mini' v-model="commission" placeholder="请输入佣金金额"></el-input>
    </div>

    <div class="btns">
      <el-button type='primary' @click='match'>匹配订单</el-button>
      <el-button type='primary' @click='pay'>支付</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      commission: null,
      plateNumber: null,
      name: null,
      tableLoading1: 0,
      urls: {
        // 支付
        orderPayMoneyTemp: "carInsurances/orderPayMoneyTemp",
        // 匹配
        excelActionTemp: "carInsurances/excelActionTemp"
      }
    };
  },
  created() {},
  methods: {
    // 匹配
    match() {
      this.tableLoading1 = 1;
      let body = {
        url: this.urls.excelActionTemp,
        data: {
          commission: this.commission,
          plateNumber: this.plateNumber,
          name: this.name
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        if (d.data.data === true) {          
          this.$notify({
            title: `匹配成功`,
            type: "success",
            position: "bottom-right",
            duration: 5000
          });
        }
        if (d.data.data === false) {
          this.$notify({
            title: "匹配失败",
            type: "warning",
            position: "bottom-right",
            duration: 5000
          });
        }
        // 表格数据
        this.tableLoading1 = 0;
      });
    },
    pay(id) {
      let pay = () => {
        this.tableLoading1 = 1;
        let body = {
          url: this.urls.orderPayMoneyTemp,
          data: {
            commission: this.commission,
            plateNumber: this.plateNumber,
            name: this.name
          }
        };
        this.axios(body).then(res => {
          let d = res.data;
          if (d.data.data === true) {            
            this.$notify({
              title: "支付成功",
              type: "success",
              position: "bottom-right",
              duration: 5000
            });
          }
          if (d.data.data === false) {
            this.$notify({
              title: "支付失败",
              type: "warning",
              position: "bottom-right",
              duration: 5000
            });
          }
          // 表格数据
          this.tableLoading1 = 0;
        });
      };
      this.$confirm("确定支付?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(pay);
    }
  }
};
</script>

<style scoped lang="stylus">
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
    border-bottom 1px solid #eee
  .inputs
    display flex
    align-items center
    margin-bottom 20px
    label
      width 120px
      font-size 14px
      text-align right
    .el-input
      width 500px
</style>
