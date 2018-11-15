<template>
    <div class="ad" v-loading='tableLoading1'>
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>问题反馈</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '' }">问题列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search">
            <div>关键字：</div>
            <el-input v-model="content" @keyup.enter.native='search' placeholder="请输入问题关键字" size="mini"></el-input>
            <div>工号：</div>
            <el-input v-model="workNumber" :maxlength='18' @keyup.enter.native='search' placeholder="请输入工号(精确搜索)" size="mini"></el-input>
            <!-- <div>时间：</div>
            <el-date-picker size="mini" v-model="date" type="month" value-format="yyyyMM" placeholder="选择月" @change='dateChange'>
            </el-date-picker> -->
            <el-button type="primary" size="mini" @click="search">检索</el-button>

        </div>
        <el-radio-group class="group" v-model="classification" size="small" @change='search'>
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="1">信用卡</el-radio-button>
            <el-radio-button label="2">保险</el-radio-button>
            <el-radio-button label="3">贷款</el-radio-button>
            <el-radio-button label="4">手续费</el-radio-button>
            <el-radio-button label="6">提款</el-radio-button>
            <el-radio-button label="7">会员</el-radio-button>
            <el-radio-button label="8">活动</el-radio-button>
            <el-radio-button label="5">其他</el-radio-button>
        </el-radio-group>
        <el-radio-group class="group" v-model="status" size="small" @change='search'>
            <el-radio-button :label="7">全部</el-radio-button>
            <el-radio-button :label="1">未回复</el-radio-button>
            <el-radio-button :label="2">已回复</el-radio-button>
            <el-radio-button :label="3">未读</el-radio-button>
            <el-radio-button :label="4">已读</el-radio-button>
            <el-radio-button :label="6">未解决</el-radio-button>
            <el-radio-button :label="5">已解决</el-radio-button>
        </el-radio-group>
        <div class="views">
            <!-- 列表 -->
            <el-table class="credit" ref="multipleTable" :data="tableData1" key="table1" @selection-change="handleSelectionChange">
                <el-table-column type="index" width="40"></el-table-column>
                <!-- <el-table-column prop="id" label="ID" width="160"></el-table-column> -->
                <el-table-column label="问题内容">
                    <template slot-scope="scope">
                        <div class="haha" @click="$router.push(`/feedbackdetail?classificationName=${scope.row.classification}&id=${scope.row.id}&date=${date}`)" style="color:#65a5f6;cursor:pointer">
                        <span :class="[scope.row.systemIfread===1?'no-read':'']">{{scope.row.systemIfread===1?'[new] '+scope.row.content:scope.row.content}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="回复" width="75">
                    <template slot-scope="scope">
                        <span style="color:#F56C6C">{{scope.row.replyStatus===1?'未回复':''}}</span>
                        <span style="color:#888">{{scope.row.replyStatus===2?'已回复':''}}</span>
                        <span style="color:#888">{{![1,2].includes(scope.row.replyStatus)?'API return ' + scope.row.replyStatus:''}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <span style="color:#F56C6C">{{scope.row.status===1?'未解决':''}}</span>
                        <span style="color:#888">{{scope.row.status===2?'已解决':''}}</span>
                        <span style="color:#888">{{![1,2].includes(scope.row.status)?'API return ' + scope.row.status:''}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="classification" label="问题类型" width="90"></el-table-column>
                
                <el-table-column label="用户机型" width="160">
                    <template slot-scope="scope">
                        {{scope.row.deviceModel+' ( '+scope.row.osName+' '+scope.row.osVersion+' )'}}
                    </template>
                </el-table-column>
                <el-table-column prop="appVersion" label="应用版本" width="90"></el-table-column>
                <el-table-column prop="customerName" label="反馈人 - 工号" width="170">
                    <template slot-scope="scope">
                        {{scope.row.customerName+' - '+scope.row.workNumber}}
                    </template>
                </el-table-column>
                <el-table-column label="反馈人电话" width="106">
                    <template slot-scope="scope">
                        {{scope.row.contactTel||'-'}}
                    </template>
                </el-table-column>
                <el-table-column label="反馈时间" width="130">
                    <template slot-scope="scope">
                        {{scope.row.feedbackTime|timeClip}}
                    </template>
                </el-table-column>
                <el-table-column label="最后处理人" width="130">
                    <template slot-scope="scope">
                        {{scope.row.lastHandlerName||'-'}}
                    </template>
                </el-table-column>
                <el-table-column label="最后处理时间" width="130">
                    <template slot-scope="scope">
                        {{scope.row.lastHandlerTime|timeClip}}
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
      tableLoading1: 1,
      popLoading: 0,
      content: "",
      popTitle: "",
      popContent: "加载中...",
      workNumber: "",
      date: null,
      status: 7,
      classification: "",
      // 分页
      pageSize: 80,
      pageTotal1: 0,
      currentPage1: 1,
      urls: {
        // 列表
        feedback: "feedback/queryList",
        getFeedbackDetail: "feedback/getFeedbackDetail"
      },
      // 多选
      multipleSelection: []
    };
  },
  created() {
    //   默认时间处理
    let date = new Date();
    let dateMonth = date.getMonth() + 1;
    date =
      date.getFullYear() + "" + (dateMonth < 10 ? "0" + dateMonth : dateMonth);
    this.date = date;
    // 如果有缓存时间选择，优先使用缓存
    let questionsDate = localStorage.getItem("questionsDate");
    if (questionsDate) this.date = questionsDate;
    // 页码数
    let storagePageSize = localStorage.getItem("payPageSize");
    if (storagePageSize) this.pageSize = Number(storagePageSize);
    this.getList();
  },
  methods: {
    dateChange(time) {
      localStorage.setItem("questionsDate", time);
      this.getList();
    },
    show(row) {
      return;
      this.popLoading = true;
      let body = {
        url: this.urls.getFeedbackDetail,
        data: {
          feedbackId: row.id,
          date: this.date,
          classificationName: row.classificationName
        }
      };
      this.axios(body)
        .then(res => {
          let d = res.data;
          if (d.code === 0) {
            this.popContent = d.data.data.content;
            this.popTitle =
              "姓名：" +
              (d.data.data.realName || "[未知]") +
              " - 电话：" +
              (d.data.data.mobile || "[未知]");
          }
          // 表格数据
          this.popLoading = false;
        })
        .catch(err => {
          this.popTitle = "";
          this.popContent = "加载失败";
        });
    },
    hide(row) {
      this.popTitle = "";
      this.popContent = "加载中...";
    },
    search() {
      this.getList();
    },
    //获取身份审核列表
    getList(opt = {}) {
      this.tableLoading1 = true;

      let body = {
        url: this.urls.feedback,
        data: {
          pageSize: this.pageSize,
          pageNo: this.currentPage1,
          date: this.date,
          status: this.status,
          classification: this.classification
        }
      };
      if (this.content) body.data.content = this.content;
      if (this.workNumber) body.data.workNumber = this.workNumber;

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
.no-read
    color #F56C6C
    font-weight bold
.badge
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;

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
.el-input--mini >>> .el-input__icon
    line-height 30px
    top 0
.ad .search .el-input.el-date-editor
    width 110px
</style>
