<template>
  <div class="ad" v-loading='tableLoading1'>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'ordercredit' }">信用卡</el-breadcrumb-item>
        <el-breadcrumb-item>分佣明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="views">
      <!-- 列表 -->
      <el-table class="credit" ref="multipleTable" :data="tableData1" key="table1" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="35">
        </el-table-column>
        <el-table-column prop="id" label="ID">
        </el-table-column>
        <el-table-column prop="orderId" label="订单ID">
        </el-table-column>
        <el-table-column prop="workNumber" label="收入人工号">
        </el-table-column>
        <el-table-column prop="amount" label="分佣金额(元)">
        </el-table-column>
        <el-table-column prop="createdTime" label="分佣时间">
        </el-table-column>
        <el-table-column prop="type" label="分佣类型">
        </el-table-column>        
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {      
      tableLoading1:1,
      // 分页
      pageSize: 20,
      pageTotal1: 0,
      currentPage1: 1,
      urls: {
        // 列表
        accountTransaction: "accountTransaction/"
      },
      // 多选
      multipleSelection: []
    };
  },
  created() {
    this.getList();
    // 页码数
    let storagePageSize = localStorage.getItem("pageSize");
    if (storagePageSize) this.pageSize = Number(storagePageSize);
  },
  methods: {
    getList() {
      this.tableLoading1 = 1;
      let body = {
        url: this.urls.accountTransaction,
        data: {
          orderId: this.$route.query.id
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.tableData1 = d.data;
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
