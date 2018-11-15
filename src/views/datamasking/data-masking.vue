<template>
    <div class="ad" v-loading='tableLoading1'>
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>脱敏数据分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="upFile">
            <label style='margin-right:10px'>选择银行</label>
            <el-select v-model="bankId" placeholder="请选择" @change="search" v-loading='tableLoading2'>
                <el-option v-for="item in banks" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="upFile">
            <label style='margin-right:10px'>选择渠道</label>
            <el-select v-model="channelId" placeholder="请选择" @change="search">
                <el-option v-for="item in channelList" :key="item.channelId" :label="item.channelName" :value="item.channelId">
                </el-option>
            </el-select>
        </div>
        <div class="date">
            <div>选择时间：</div>
            <el-date-picker v-model="applyTime" size="mini" type="daterange" range-separator=" ~ " value-format="yyyy-MM-dd" placeholder="请选择" :editable="false" @change="search" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" :picker-options="pickerOpt">
            </el-date-picker>
        </div>
        <el-upload class="upload-demo" :action='urls.upFileUrl' :headers="headers" :before-upload='beforeUoLoad' :on-remove="handleRemove" :file-list="fileList" :data="{channelId:channelId,bankId:bankId,compareBeginTime:applyTime[0]||'',compareEndTime:applyTime[1]||''}" style='margin-top:10px'>
            <el-button size="small" type="primary">上传文件</el-button>
            <div slot="tip" class="el-upload__tip">Excel内字段名称必须与后台字段名称一致</div>
        </el-upload>

        <el-button type="primary" size="small" @click="getResultList">刷新列表</el-button>
        <div class="views">
            <!-- 列表 -->
            <el-table class="credit" ref="multipleTable" :data="tableData1" key="table1" @selection-change="handleSelectionChange">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column prop="fileName" label="文件名称">
                </el-table-column>
                <el-table-column prop="uploadDate" label="上传时间"></el-table-column>
                <el-table-column label="对比结果">
                    <template slot-scope="scope">
                        <!--<a :href="scope.row.statusDetial" style="color:#65a5f6">下载</a>-->
	                    <div>
		                    {{scope.row.statusDetial || '--'}}
	                    </div>
                    </template>
                </el-table-column>
            </el-table>
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
      tableLoading1: 0,
      tableLoading2: 1,
      fileList: [],
      tableData1: [],
      // 选择银行
      bankId: null,
      banks: null,
      channelList: [],
      channelId: "",
      applyTime: "",
      passedTime: "",
      // 分页
      pageSize: 20,
      pageTotal1: 0,
      currentPage1: 1,
      urls: {
        getCreditChanelList: "bankDesensitization/getCreditChanelList",
        getAnalyzeResult: "bankDesensitization/getAnalyzeResult",
        upFileUrl: `${process.env.API_ROOT}bankDesensitization/upExcel`,
        // 下拉框银行列表
        cards: "cards/",
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
    // 渠道列表
    this.getList();
    // 下拉选择银行列表
    this.getBankList();
    // 结果列表
    this.getResultList();
  },
  methods: {
    beforeUoLoad() {
      if (this.applyTime === "") {
        this.$notify({
          title: "请选择时间范围",
          type: "warning",
          position: "bottom-right",
          duration: 5000
        });
        return false;
      }
      return true;
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
    getResultList() {
      this.tableLoading1 = 1;
      let body = {
        url: this.urls.getAnalyzeResult,
        data: {}
      };
      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.tableData1 = d.data.recordList;
        }
        // 表格数据
        this.tableLoading1 = 0;
      });
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
    //获取身份审核列表
    getList(opt = {}) {
      this.tableLoading1 = 1;
      let body = {
        url: this.urls.getCreditChanelList,
        data: {}
      };
      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.channelList = d.data.channelList;
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
