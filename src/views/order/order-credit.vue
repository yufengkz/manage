<template>
  <div class="ad" v-loading='tableLoading1'>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '' }">信用卡</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="upFile">
      <label>银行：</label>
      <el-select v-model="bankId" placeholder="请选择" @change="change" v-loading='tableLoading2'>
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
      <el-input v-model="mobile" :maxlength='11' @keyup.enter.native='search' placeholder="请输入手机号" size="mini"></el-input>
      <el-button type="primary" size="mini" @click="search">检索</el-button>
    </div>

    <el-radio-group v-model="orderStatus" size="small" @change='change'>
      <el-radio-button label="">全部</el-radio-button>
      <el-radio-button :label="0">生成订单</el-radio-button>
      <el-radio-button :label="1">审核中</el-radio-button>
      <el-radio-button :label="2">审核通过</el-radio-button>
      <el-radio-button :label="3">审核被拒</el-radio-button>
      <el-radio-button :label="4">初审通过</el-radio-button>
      <el-radio-button :label="5">没有首刷(兴业)</el-radio-button>
      <el-radio-button :label="6">首刷(兴业)</el-radio-button>
      <el-radio-button :label="7">待人工审核(花旗，中国)</el-radio-button>
    </el-radio-group>
    <el-button class="reset" type="primary" size="small" @click="reset">重置搜索条件</el-button>
    <div class="views">
      <!-- 列表 -->
      <el-table class="credit" ref="multipleTable" :data="tableData1" key="table1" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="35">
        </el-table-column>
        <el-table-column prop="id" label="订单ID">
        </el-table-column>
        <el-table-column v-if="bankId===''" label="银行">
          <template slot-scope='scope'>
            {{scope.row.bankName}}
          </template>
        </el-table-column>
        <el-table-column prop="workNumber" label="工号" width="88">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="60">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="idCard" label="身份证" width="150"></el-table-column>
        <el-table-column prop="createdTime" label="订单创建时间">
          <template slot-scope="scope">
            {{scope.row.createdTime|timeClip}}
          </template>
        </el-table-column>
        <el-table-column label="查询上游申请时间">
          <template slot-scope="scope">
            {{scope.row.actualTime|timeClip}}
          </template>
        </el-table-column>

        <el-table-column prop="statusDes" label="订单状态" width="80">
        </el-table-column>
        <el-table-column label="上传上游申请时间">
          <template slot-scope="scope">
            {{scope.row.uploadActualTime|timeClip}}
          </template>
        </el-table-column>
        <el-table-column label="上传上游通过时间">
          <template slot-scope="scope">
            {{scope.row.uploadPassedTime|timeClip}}
          </template>
        </el-table-column>
        <el-table-column label="数据来源">
          <template slot-scope="scope">
            {{scope.row.dataFrom|creditDataFrom}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isShow===1" type="text" size="small" @click="pay(scope.row.id)">支付</el-button>
            <div v-else>-</div>
            <el-button type="text" size="small" @click="$router.push('/ordercreditdetail?id='+scope.row.id)">分佣明细</el-button>
            <el-button type="text" size="small" @click="editPhone(scope.row)">修改电话</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pay" v-if="bankId==='13'||bankId==='14'">
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
      bankId: '',
      banks: null,
      tableLoading1: 1,
      tableLoading2: 1,
      tableData1: [],
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
      mobile: "",
      urls: {
        // 列表
        getCardOrderList: "cards/getCardOrderList",
        // 支付
        orderPayMoney: "cards/orderPayMoney",
        // 修改电话
        modifyOrderPhone: "cards/modifyOrderPhone",
        // 下拉框银行列表
        cards: "cards/",
      },
      // 多选
      multipleSelection: []
    };
  },
  created() {
    // 页码数
    let storagePageSize = localStorage.getItem("pageSize");
    if (storagePageSize) this.pageSize = Number(storagePageSize);
    this.getBankList().then(this.getList);
  },
  methods: {
    editPhone(row) {
      this.$prompt(`原电话 ${row.mobile} 改为：`, `修改 ' ${row.name} ' 的电话`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
          inputPattern: /^1[0-9]{10}$/,
          inputErrorMessage: '请正确输入11位手机号'
      }).then(edit);
      let that = this;
      function edit(val) {
        that.tableLoading1 = 1;
        let body = {
          url: that.urls.modifyOrderPhone,
          method:'PATCH',
          data: {
            orderId: row.id,
            mobile: val.value
          }
        };
        that.axios(body).then(res => {
          let d = res.data;
          d.code === 0 && that.notify('修改成功')
          d.code === 0 && that.getList()
        });
      }
    },
    getBankList() {
      this.tableLoading2 = true;
      let body = {
        url: this.urls.cards,
        data: {
          classification: 1,
          pageSize: 666,
          pageNo: 1
        }
      };
      return new Promise(resolve => {
        this.axios(body).then(res => {
          res.data.code === 0 && (this.banks = res.data.data.dataList.map(i=>({label:i.name,value:i.id})))
          resolve()
          this.tableLoading2 = false;
        });
      });
    },
    change(e) {
      this.search();
    },
    reset() {
      this.bankId = 13;
      this.name = null;
      this.idCard = null;
      this.mobile = null;
      this.workNumber = null;
      this.id = null;
      this.orderCreatedTime = null;
      this.orderStatus = "";
      this.getList();
    },
    payBatch() {
      this.tableLoading1 = 1;
      let pay = () => {
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
            this.getList();
            this.notify(d.data);
          }
          // 表格数据
          this.tableLoading1 = 0;
        });
      };
      if (this.multipleSelection.length === 0) {
        this.warn(`您未选择任何订单`);
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
      this.tableLoading1 = 1;
      let pay = () => {
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
            this.getList();
            this.notify(d.data);
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
        url: this.urls.getCardOrderList,
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
          d.data.dataList.map(i=>i.bankName=this.banks.reduce((a,b) => (i.bankId === b.value ? b.label : a)))
          this.tableData1 = d.data.dataList;
          this.tableData1.map(i => (i.bankId = Number(i.bankId)));
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
.el-button+.el-button
  margin-left 0
.pay
  text-align right
  padding-right 20px
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
