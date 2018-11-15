<template>
  <div class="ad" v-loading='tableLoading1'>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '' }">信用卡</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="upFile">
      <el-select v-model="value" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div class="search">
      <div>姓名：</div>
      <el-input v-model="name" @keyup.enter.native='search' placeholder="请输入姓名" size="mini"></el-input>
      <div>身份证：</div>
      <el-input v-model="idCard" :maxlength='18' @keyup.enter.native='search' placeholder="请输入身份证" size="mini"></el-input>
      <div>工号：</div>
      <el-input v-model="workNumber" @keyup.enter.native='search' placeholder="请输入工号(精准匹配)" size="mini"></el-input>
      <div>订单：</div>
      <el-input v-model="id" @keyup.enter.native='search' placeholder="请输入订单(精准匹配)" size="mini"></el-input>
      <div>手机号：</div>
      <el-input v-model="mobile" @keyup.enter.native='search' placeholder="请输入订单ID" size="mini"></el-input>
      <el-button type="primary" size="mini" @click="search">检索</el-button>

    </div>
    <div class="date">
      <div>订单时间：</div>
      <el-date-picker v-model="createdTime" size="mini" type="daterange" range-separator=" ~ " value-format="yyyy/MM/dd" placeholder="请选择" :editable="false" @change="timeChange" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" :picker-options="pickerOpt">
      </el-date-picker>
    </div>
    <el-radio-group v-model="orderStatus" size="medium">
      <el-radio-button :label="0">生成订单</el-radio-button>
      <el-radio-button :label="1">审核中</el-radio-button>
      <el-radio-button :label="2">审核通过</el-radio-button>
      <el-radio-button :label="3">审核被拒</el-radio-button>
      <el-radio-button :label="4">初审通过</el-radio-button>
      <el-radio-button :label="5">没有首刷(兴业)</el-radio-button>
      <el-radio-button :label="6">首刷(兴业)</el-radio-button>
      <el-radio-button :label="7">待人工审核(花旗，中国)</el-radio-button>
    </el-radio-group>
    <div class="views">
      <!-- 列表 -->
      <el-table class="credit" ref="multipleTable" v-loading='tableLoading1' :data="tableData1" key="table1" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="35">
        </el-table-column>
        <el-table-column prop="id" label="订单ID">
        </el-table-column>
        <el-table-column prop="workNumber" label="工号">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="idCard" label="身份证"></el-table-column>
        <el-table-column prop="createdTime" label="订单创建时间"></el-table-column>
        <el-table-column prop="actualTime" label="查询上游申请时间"></el-table-column>

        <el-table-column label="订单状态" width="80">
          <template slot-scope='scope'>
            {{scope.row.status + ' - ' + scope.row.statusDes}}
          </template>
        </el-table-column>
        <el-table-column prop="uploadActualTime" label="上传上游申请时间"></el-table-column>
        <el-table-column prop="uploadPassedTime" label="上传上游通过时间"></el-table-column>
        
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small">支付</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      applyTime: "",
      passedTime: "",
      // 分页
      pageSize: 20,
      pageTotal1: 0,
      currentPage1: 1,
      name: 0,
      idCard: 0,
      mobile: 0,
      workNumber: 0,
      id: 0,
      createdTimeStart: 0,
      createdTimeEnd: 0,
      status: 0,
      orderStatus: 0,
      urls: {
        // 列表
        getCardOrderList: "cards/getCardOrderList",
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
    timeChange(e) {
      console.log(e);
    },
    search() {
      let body = {
        name: this.name,
        idCard: this.idCard,
        mobile: this.mobile,
        workNumber: this.workNumber,
        id: this.id,
        createdTimeStart: this.createdTime[0],
        createdTimeEnd: this.createdTime[1]
      };
      this.getList(body);
    },
    getList(opt = {}) {
      this.tableLoading1 = true;
      let body = {
        url: this.urls.getCardOrderList,
        data: {
          pageSize: this.pageSize,
          pageNo: this.currentPage1,
          status: this.orderStatus,
        }
      };
      if (opt.name) body.data.name = opt.name;
      if (opt.idCard) body.data.idCard = opt.idCard;
      if (opt.mobile) body.data.mobile = opt.mobile;
      if (opt.workNumber) body.data.workNumber = opt.workNumber;
      if (opt.id) body.data.id = opt.id;
      if (opt.createdTimeStart) body.data.createdTimeStart = opt.createdTimeStart;
      if (opt.createdTimeEnd) body.data.createdTimeEnd = opt.createdTimeEnd;

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
    .el-date-editor
      margin-left 10px
    .addArticle
      position absolute
      right 0
      top 0
</style>
