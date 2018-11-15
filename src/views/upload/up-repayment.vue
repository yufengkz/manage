<template>
  <div class="ad" v-loading='tableLoading1'>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>上传数据管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '' }">信用卡分期</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="upFile">
      <label>选择贷款产品：</label>
      <el-select v-loading='optLoading' @change="getList" v-model="repaymentId" placeholder="请选择">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-upload class="upload-demo" :action='urls.upExcel' :on-success='upOK' :on-remove="handleRemove" :file-list="fileList" :data="{repaymentId:repaymentId}" :headers='headers'>
        <el-button size="small" type="primary">上传数据</el-button>
      </el-upload>
      <el-button size="small" type="primary" @click="excelAction">匹配</el-button>
    </div>
    <div class="date">
      <div>上传时间选择：</div>
      <el-date-picker v-model="applyTime" size="mini" type="datetimerange" range-separator=" ~ " placeholder="请选择" :editable="false" @change="getList" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
      </el-date-picker>
    </div>
    <div class="filter">
      <div class="tit">状态筛选：</div>
      <el-radio-group class="group1" v-model="paymentStatus" size="small" @change='getList'>
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button :label="1">支付成功</el-radio-button>
        <el-radio-button :label="2">支付失败</el-radio-button>
        <el-radio-button :label="0">未支付</el-radio-button>
      </el-radio-group>
      <br>
      <el-radio-group class="group" v-model="status" size="small" @change='getList'>
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button :label="0">未匹配</el-radio-button>
        <el-radio-button :label="1">匹配成功</el-radio-button>
        <el-radio-button :label="21">匹配无记录</el-radio-button>
        <el-radio-button :label="22">匹配到多条记录</el-radio-button>
        <el-radio-button :label="23">匹配的记录已处理或不是申请中</el-radio-button>
      </el-radio-group>
    </div>
    <div class="views">
      <!-- 列表 -->
      <el-table class="credit" ref="multipleTable" :data="tableData1" key="table1" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column prop="loanName" label="产品"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="idCard" label="身份证号"></el-table-column>
        <el-table-column prop="orderId" label="订单ID">
          <template slot-scope="scope">
            {{scope.row.status===1?scope.row.orderId:scope.row.statusDes}}
          </template>
        </el-table-column>
        <el-table-column prop="commission" label="佣金金额"></el-table-column>
        <el-table-column prop="paymentStatusDes" label="支付状态"></el-table-column>
        <el-table-column prop="paymentTime" label="支付时间"></el-table-column>
        <el-table-column prop="createdTime" label="上传时间"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.paymentStatus===0 && scope.row.status===1" type="text" size="small" @click="pay(scope.row.id)">支付</el-button>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pay">
        <el-button type="text" size="small" @click="payBatch">批量支付</el-button>
      </div>
      <!--分页-->
      <div class="tab-page">
        <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-sizes="$root.globalData.pageSizes" :page-size='pageSize' layout="total, sizes, ->, prev, pager, next" :total='pageTotal1'>
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getCookie } from "../../../src/api/index";
export default {
  data() {
    return {
      applyTime: [Date.now() - 3600000 * 24, Date.now() + 3600000 * 2],
      // 分页
      pageSize: 20,
      pageTotal1: 0,
      currentPage1: 1,
      paymentStatus: "",
      status: "",
      repaymentId: null,
      optLoading: 1,
      tableLoading1: 0,
      // 产品列表选择
      options: null,
      urls: {
        // 列表
        getFeedbackList: "repayment/getFeedbackList",
        // 上传数据
        upExcel: `${process.env.API_ROOT}repayment/upExcel`,
        // 支付
        excelPayMoney: "repayment/excelPayMoney",
        // 贷款产品列表
        queryRepaymentList: "repayment/queryRepaymentList",
        // 匹配
        excelAction: "repayment/excelAction"
      },
      headers:{
        token:getCookie('token')
      },
      // 多选
      multipleSelection: []
    };
  },
  created() {
    // 页码数
    let storagePageSize = localStorage.getItem("pageSize");
    if (storagePageSize) this.pageSize = Number(storagePageSize);
    // this.getList();
    this.getOptList();
  },
  methods: {
    // 匹配
    excelAction() {
      this.tableLoading1 = 1;
      let body = {
        url: this.urls.excelAction,
        data: {
          id: this.repaymentId
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.getList();
          this.$notify({
            title: `操作成功`,
            // title: `${d.data.data}条数据。`,
            type: "success",
            position: "bottom-right",
            duration: 5000
          });
        }
        // 表格数据
        this.tableLoading1 = 0;
      });
    },
    upOK(res) {
      if (res.code === 0) {
        this.$notify({
          title: `成功上传${res.data.data}条数据。`,
          type: "success",
          position: "bottom-right",
          duration: 5000
        });
      } else {
        this.$notify({
          title: res.message,
          type: "error",
          position: "bottom-right",
          duration: 5000
        });
      }
    },
    getOptList() {
      this.optLoading = true;
      let body = {
        url: this.urls.queryRepaymentList
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.options = d.data;
        }
        // 表格数据
        this.optLoading = false;
      });
    },
    payBatch() {
      let pay = () => {
        this.tableLoading1 = 1;
        let body = {
          url: this.urls.excelPayMoney,
          data: {
            idStr: String(this.multipleSelection.map(i => i.id).join(",")),
            repaymentId: this.repaymentId
          }
        };
        this.axios(body).then(res => {
          let d = res.data;
          if (d.code === 0) {
            this.getList();
            this.$notify({
              title:`成功支付${d.data.data}个订单。`,
              type: "success",
              position: "bottom-right",
              duration: 5000
            });
          }
          // 表格数据
          this.tableLoading1 = 0;
        });
      };
      if (this.multipleSelection.length === 0) {
        this.$notify({
          title: `您未选择任何订单`,
          type: "warning",
          position: "bottom-right",
          duration: 3000
        });
        return;
      }
      this.$confirm("确定批量支付?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(pay);
    },
    pay(id) {
      let pay = () => {
        this.tableLoading1 = 1;
        let body = {
          url: this.urls.excelPayMoney,
          data: {
            idStr: String(id),
            repaymentId: this.repaymentId
          }
        };
        this.axios(body).then(res => {
          let d = res.data;
          if (d.code === 0) {
            this.getList();
            this.$notify({
              title: '支付成功',
              type: "success",
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
    },
    timeChange(e) {
      console.log(e);
    },
    handleClick(tab, event) {
      this.getList();
    },
    //获取身份审核列表
    getList() {
      this.tableLoading1 = true;
      let body = {
        url: this.urls.getFeedbackList,
        data: {
          pageSize: this.pageSize,
          pageNo: this.currentPage1,
          createdTimeStart: this.applyTime?this.applyTime[0]:'',
          createdTimeEnd: this.applyTime?this.applyTime[1]:'',
          paymentStatus: this.paymentStatus,
          status: this.status,
          repaymentId: this.repaymentId || ""
        }
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.tableData1 = d.data.dataList;
          this.pageTotal1 = Number(d.data.totalCount);
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    // 移除文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 多选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    //  分页
    handleSizeChange1(v) {
      this.pageSize = v;
      localStorage.setItem("pageSize", v);
      this.getList({ pagesize: v });
    },
    handleCurrentChange1(v) {
      this.currentPage1 = v;
      this.getList({ pagesize: v });
    }
  }
};
</script>

<style scoped lang="stylus">
.upload-demo
  width 100px
  height 32px
  overflow hidden
.pay
  text-align right
  padding-right 10px
.filter
  .tit
    margin 10px 0
    font-size 14px
  .group1
    margin-bottom 10px
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
  .search
    display flex
    align-items center
    position relative
    .el-input
      width auto
      margin 0 20px 0 10px
  .el-table
    margin-top 20px
  .upFile
    display flex
    align-items center
    margin 10px 0
    .el-button
      margin-left 20px
    .upTip
      color #888
      margin-left 10px
  .date
    margin-top 10px
    display flex
    align-items center
    position relative
    .pass
      margin-left 20px
    .addArticle
      position absolute
      right 0
      top 0
</style>
