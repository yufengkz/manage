<template>
  <div class="ad" v-loading='tableLoading1'>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '' }">保险</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="upFile">
      <label>保险：</label>
      <el-select v-model="bankId" placeholder="请选择" @change="change">
        <el-option v-for="item in banks" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div class="date">
        <div>订单时间：</div>
        <el-date-picker v-model="orderCreatedTime" size="mini" type="daterange" range-separator=" ~ " value-format="yyyy/MM/dd" placeholder="请选择" :editable="false" @change="change" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" :picker-options="pickerOpt">
        </el-date-picker>
      </div>
    </div>

    <div class="search">
      <div>姓名：</div>
      <el-input v-model="name" @keyup.enter.native='search' placeholder="请输入姓名" size="mini"></el-input>
      <div>身份证：</div>
      <el-input v-model="idCard" :maxlength='18' @keyup.enter.native='search' placeholder="请输入身份证" size="mini"></el-input>
      <div>工号：</div>
      <el-input v-model="workNumber" @keyup.enter.native='search' placeholder="请输入工号(精准匹配)" size="mini"></el-input>
      <div>订单ID：</div>
      <el-input v-model="id" @keyup.enter.native='search' placeholder="请输入订单(精准匹配)" size="mini"></el-input>
      <div>手机号：</div>
      <el-input v-model="mobile" @keyup.enter.native='search' placeholder="请输入手机号" size="mini"></el-input>
      <el-button type="primary" size="mini" @click="search">检索</el-button>

    </div>

    <el-radio-group v-model="orderStatus" size="small" @change='change'>
      <el-radio-button label="">全部</el-radio-button>
      <el-radio-button :label="0">申请中</el-radio-button>
      <el-radio-button :label="1">审批中</el-radio-button>
      <el-radio-button :label="2">审批通过</el-radio-button>
      <el-radio-button :label="3">审批拒绝</el-radio-button>
    </el-radio-group>
    <el-button class="reset" type="primary" size="small" @click="reset">重置搜索条件</el-button>
    <div class="views">
      <!-- 列表 -->
      <el-table class="credit" ref="multipleTable" :data="tableData1" key="table1" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="35">
        </el-table-column>
        <el-table-column prop="id" label="订单ID">
        </el-table-column>
        <el-table-column prop="workNumber" label="工号" width="88">
        </el-table-column>
        <el-table-column prop="tName" label="投保人姓名" width="60">
        </el-table-column>
        <el-table-column prop="tMobile" label="投保人电话"></el-table-column>
        <el-table-column prop="tIdCard" label="投保人身份证"></el-table-column>
        <el-table-column prop="name" label="被保人姓名"></el-table-column>
        <el-table-column prop="idCard" label="被保人身份证"></el-table-column>
        <el-table-column prop="insuranceAmount" label="投保金额（分）"></el-table-column>
        <el-table-column prop="insuranceStartTime" label="保险生效日期"></el-table-column>
        <el-table-column prop="insuranceEndTime" label="保险失效日期"></el-table-column>
        <el-table-column prop="singleTime" label="签单时间"></el-table-column>
        <el-table-column prop="organizationName" label="保险公司名称"></el-table-column>
        <el-table-column prop="insuranceName" label="保险名称"></el-table-column>
        <el-table-column prop="insuranceNumber" label="保单号"></el-table-column>
        <el-table-column prop="singleNumber" label="投保单号"></el-table-column>
        <el-table-column prop="statusDes" label="状态"></el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="pay(scope.row.id)">支付</el-button>
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
export default {
  data() {
    return {
      pickerOpt: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 选择银行
      bankId: 1,
      banks: [
        // { label: "全部", value: "" },
        { label: "宜人贷", value: 1 },
        { label: "拍拍贷", value: 2 },
        { label: "平安新一贷", value: 3 },
        { label: "阳光小消", value: 4 },
        { label: "平安i贷", value: 5 },
        { label: "提钱游", value: 6 },
        { label: "中腾信", value: 7 },
        { label: "猎豹贷款", value: 8 },
        { label: "快贷", value: 9 },
        { label: "蛋花花", value: 10 },
        { label: "先花一亿元", value: 11 },
        { label: "及贷", value: 12 },
        { label: "51人品贷", value: 13 },
        { label: "360借条", value: 14 },
        { label: "喜刷刷", value: 15 },
        { label: "功夫贷", value: 16 },
        { label: "优款", value: 17 },
        { label: "借立得", value: 18 },
        { label: "能卡", value: 19 },
        { label: "超人贷", value: 20 }
      ],
      tableLoading1: 1,
      applyTime: "",
      passedTime: "",
      // 分页
      pageSize: 20,
      pageTotal1: 0,
      currentPage1: 1,
      name: null,
      idCard: null,
      mobile: null,
      workNumber: null,
      id: null,
      orderCreatedTime: null,
      status: 0,
      orderStatus: "",
      urls: {
        // 列表
        getApplyOrderList: "insurances/getApplyOrderList",
        // 支付
        orderPayMoney: "cards/orderPayMoney"
      },
      // 多选
      multipleSelection: []
    };
  },
  created() {
    
    // 页码数
    let storagePageSize = localStorage.getItem("pageSize");
    if (storagePageSize) this.pageSize = Number(storagePageSize);
    this.getList();
  },
  methods: {
    change(e) {
      this.search();
    },
    reset() {
      this.bankId = 1;
      this.name = null;
      this.idCard = null;
      this.mobile = null;
      this.workNumber = null;
      this.id = null;
      this.createdTimeStart = null;
      this.orderStatus = "";
      this.getList();
    },
    payBatch() {
      let pay = () => {
        this.tableLoading1 = 1;
        let body = {
          url: this.urls.orderPayMoney,
          data: {
            idStr: String(this.multipleSelection.map(i => i.id).join(",")),
            bankId: this.bankId
          }
        };
        this.axios(body).then(res => {
          let d = res.data;
          if (d.code === 0) {
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
      }).then(() => {
        pay();
      });
    },
    pay(id) {
      
      let pay = () => {
        this.tableLoading1 = 1;
        let body = {
          url: this.urls.orderPayMoney,
          data: {
            idStr: String(id),
            bankId: this.bankId
          }
        };
        this.axios(body).then(res => {
          let d = res.data;
          if (d.code === 0) {
          }
          // 表格数据
          this.tableLoading1 = 0;
        });
      };
      this.$confirm("确定支付?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        pay();
      });
    },
    search() {
      let body = {
        name: this.name,
        idCard: this.idCard,
        mobile: this.mobile,
        workNumber: this.workNumber,
        id: this.id,
        createdTimeStart: this.orderCreatedTime
          ? this.orderCreatedTime[0]
          : null,
        createdTimeEnd: this.orderCreatedTime ? this.orderCreatedTime[1] : null
      };
      this.getList(body);
    },
    getList(opt = {}) {
      this.tableLoading1 = 1;
      let body = {
        url: this.urls.getApplyOrderList,
        data: {
          pageSize: this.pageSize,
          pageNo: this.currentPage1,
          bankId: this.bankId,
          status: this.orderStatus
        }
      };
      Object.keys(opt).map(i => {
        if (opt[i]) body.data[i] = opt[i];
      });

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.tableData1 = d.data.dataList;
          this.pageTotal1 = Number(d.data.totalCount);
        }
        // 表格数据
        this.tableLoading1 = 0;
      });
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
.pay
  text-align right
.reset
  display block
  margin-top 16px
.el-select
  width 160px
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
  .el-radio-group
    margin-top 12px
  .search
    display flex
    align-items center
    position relative
    .el-input
      width auto
      margin-right 15px
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
    margin 0 0 0 15px
    display flex
    align-items center
    position relative
    .pass
      margin-left 20px
    .el-date-editor
      margin-left 10px
    .addArticle
      position absolute
      right 0
      top 0
</style>
