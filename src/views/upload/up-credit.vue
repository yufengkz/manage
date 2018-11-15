<template>
  <div class="ad" v-loading='tableLoading1'>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>上传数据管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '' }">信用卡</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="upFile">
      <el-select v-model="bankId" placeholder="请选择" @change="search" v-loading='tableLoading2'>
        <el-option v-for="item in banks" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

    </div>
    <form>
      <el-upload class="upload-demo" :action='urls.upFileUrl' :on-success='search' :on-remove="handleRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList" :data="{bankId:bankId}" :headers='headers'>
        <el-button size="small" type="primary">上传文件</el-button>
        <div slot="tip" class="el-upload__tip">Excel内字段名称必须与后台字段名称一致</div>
      </el-upload>
    </form>
    <div class="search">
      <div>姓名：</div>
      <el-input v-model="name" @keyup.enter.native='search' placeholder="请输入姓名" size="mini"></el-input>
      <div>身份证：</div>
      <el-input v-model="idCard" :maxlength='18' @keyup.enter.native='search' placeholder="请输入身份证" size="mini"></el-input>
      <div>手机号：</div>
      <el-input v-model="phone" @keyup.enter.native='search' placeholder="请输入手机号" size="mini"></el-input>
      <el-button type="primary" size="mini" @click="search">检索</el-button>

    </div>
    <div class="date">
      <div>上传时间选择：</div>
      <el-date-picker v-model="applyTime222" size="mini" type="datetimerange" range-separator=" ~ " placeholder="请选择" :editable="false" @change="search" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
      </el-date-picker>
    </div>
    <div class="date">
      <div>上游申请时间：</div>
      <el-date-picker v-model="applyTime" size="mini" type="daterange" range-separator=" ~ " value-format="yyyy/MM/dd" placeholder="请选择" :editable="false" @change="search" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" :picker-options="pickerOpt">
      </el-date-picker>
      <div class="pass">上游通过时间：</div>
      <el-date-picker v-model="passedTime" size="mini" type="daterange" range-separator=" ~ " value-format="yyyy/MM/dd" placeholder="请选择" :editable="false" @change="search" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" :picker-options="pickerOpt">
      </el-date-picker>
    </div>
    <el-radio-group class="group" v-model="status" size="small" @change='search'>
      <el-radio-button label="">全部</el-radio-button>
      <el-radio-button :label="0">未发</el-radio-button>
      <el-radio-button :label="1">已发</el-radio-button>
      <el-radio-button :label="2">查出多条记录</el-radio-button>
      <el-radio-button :label="3">拒绝</el-radio-button>
      <el-radio-button :label="4">时间不匹配</el-radio-button>
      <el-radio-button :label="99">找不到记录</el-radio-button>
    </el-radio-group>
    <el-radio-group class="group" v-model="isFirstCard" size="small" @change='search'>
      <el-radio-button label="">全部</el-radio-button>
      <el-radio-button :label="1">首卡</el-radio-button>
      <el-radio-button :label="0">非首卡</el-radio-button>
    </el-radio-group>
    <el-button class="reset" type="primary" size="small" @click="reset">重置搜索条件</el-button>
    <div class="views">
      <!-- 列表 -->
      <el-table class="credit" ref="multipleTable" :data="tableData1" key="table1" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="35">
        </el-table-column>
        <el-table-column prop="id" label="ID">
        </el-table-column>
        <el-table-column prop="name" label="申请人姓名" width="80">
        </el-table-column>
        <el-table-column prop="phone" label="手机号码">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号码"></el-table-column>
        <el-table-column prop="applyTime" label="上游申请时间"></el-table-column>
        <el-table-column prop="passedTime" label="上游通过时间"></el-table-column>

        <el-table-column prop="statusDes" label="状态" width="100">
        </el-table-column>
        <el-table-column prop="isFirstCardDes" label="是否首卡" width="80">
        </el-table-column>
        <el-table-column prop="createdTime" label="上传时间"></el-table-column>

        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===0" type="text" size="small" @click="pay(scope.row.id)">支付</el-button>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pay">
        <el-button type="text" size="small" @click="payBatch">批量支付</el-button>
      </div>
      <!--分页-->
      <div class="tab-page">
        <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-sizes="[100,200,500,1000,2000]" :page-size='pageSize' layout="total, sizes, ->, prev, pager, next" :total='pageTotal1'>
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
      pickerOpt: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableLoading1: 1,
      status: "",
      isFirstCard: "",
      fileList: [],
      // 选择银行
      bankId: '',
      banks: null,
      applyTime: "",
      applyTime222: [Date.now() - 3600000 * 24, Date.now() + 3600000 * 2],
      passedTime: "",
      // 分页
      pageSize: 200,
      pageTotal1: 0,
      currentPage1: 1,
      urls: {
        // 列表
        articles: "cards/getFeedbackList",
        // 下拉框银行列表
        cards: "cards/",
        excelPayMoney: "cards/excelPayMoney",
        upFileUrl: `${process.env.API_ROOT}cards/upExcel`
      },
      headers: {
        token: getCookie("token")
      },
      // 多选
      multipleSelection: []
    };
  },
  created() {
    // 页码数
    let storagePageSize = localStorage.getItem("payPageSize");
    if (storagePageSize) this.pageSize = Number(storagePageSize);
    this.getList();
    this.getBankList();
  },
  methods: {
    handleClick(tab, event) {
      this.getList();
    },
    payBatch() {
      let pay = () => {
        this.tableLoading1 = 1;
        let body = {
          url: this.urls.excelPayMoney,
          data: {
            idStr: String(this.multipleSelection.map(i => i.id).join(",")),
            bankId: this.bankId
          }
        };
        this.axios(body).then(res => {
          let d = res.data;
          if (d.code === 0) {
            this.getList();
            this.$notify({
              title: "批量操作成功",
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
      }).then(() => {
        pay();
      });
    },
    pay(id) {
      let pay = () => {
        this.tableLoading1 = 1;
        let body = {
          url: this.urls.excelPayMoney,
          data: {
            idStr: String(id),
            bankId: this.bankId
          }
        };
        this.axios(body).then(res => {
          let d = res.data;
          if (d.code === 0) {
            this.getList();
            this.$notify({
              title: d.data,
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
      }).then(() => {
        pay();
      });
    },
    reset() {
      location.reload();
    },
    // 移除文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 上传文件超出限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `最多上传一个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    search() {
      let body = {
        name: this.name,
        idCard: this.idCard,
        phone: this.phone,
        uploadTimeStart: this.applyTime222 ? this.applyTime222[0] : null,
        uploadTimeEnd: this.applyTime222 ? this.applyTime222[1] : null,
        applyTimeStart: this.applyTime ? this.applyTime[0] : null,
        applyTimeEnd: this.applyTime ? this.applyTime[1] : null,
        passedTimeStart: this.passedTime ? this.passedTime[0] : null,
        passedTimeEnd: this.passedTime ? this.passedTime[1] : null
      };
      this.getList(body);
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
    getList(opt = {}) {
      this.tableLoading1 = true;
      let body = {
        url: this.urls.articles,
        data: {
          pageSize: this.pageSize,
          pageNo: this.currentPage1,
          bankId: this.bankId,
          status: this.status,
          isFirstCard: this.isFirstCard
        }
      };
      Object.keys(opt).map(i => {
        if (opt[i]) body.data[i] = opt[i];
      });
      return new Promise((resolve, reject) => {
        this.axios(body).then(res => {
          let d = res.data;
          if (d.code === 0) {
            this.tableData1 = d.data.dataList;
            this.pageTotal1 = Number(d.data.totalCount);
          }
          resolve();
          // 表格数据
          this.tableLoading1 = false;
        });
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
      localStorage.setItem("payPageSize", v);
      this.getList();
    },
    handleCurrentChange1(v) {
      this.currentPage1 = v;
      this.getList();
    }
  }
};
</script>

<style scoped lang="stylus">
.pay
  text-align right
  padding-right 10px
.reset
  margin-top 10px
.group
  display block
  margin-top 10px
.upload-demo
  margin-bottom 10px
  display flex
  width 600px
  align-items center
  .el-upload__tip
    margin 0 20px
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
