<template>
  <div class="ad" v-loading='tableLoading1'>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="首页广告管理" :name="0"></el-tab-pane>
      <el-tab-pane label="信用卡广告管理" :name="1"></el-tab-pane>
      <el-tab-pane label="贷款广告管理" :name="2"></el-tab-pane>
      <el-tab-pane label="保险广告管理" :name="3"></el-tab-pane>
      <el-tab-pane label="推广教程广告管理" :name="4"></el-tab-pane>
    </el-tabs>
    <div class="search">
      <div>关键字：</div>
      <el-input v-model="keyword" @keyup.enter.native='search' placeholder="请输入关键字" size="mini"></el-input>
      <!-- <div>ID：</div>
          <el-input v-model="searchID" placeholder="请输入ID" size="mini"></el-input> -->
      <el-button type="primary" size="mini" @click="search">搜索</el-button>
      <el-button class='addArticle' type='primary' size='mini' @click="$router.push('/adadd?showLocation='+activeName)">添加广告</el-button>
    </div>
    <div class="views">
      <!-- 列表 -->
      <el-table class="credit" ref="multipleTable" v-loading='tableLoading1' :data="tableData1" key="table1" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="35">
        </el-table-column>
        <el-table-column prop="id" label="ID">
        </el-table-column>
        <el-table-column prop="orderNumber" label="排序" width='50'>
        </el-table-column>
        <el-table-column prop="title" label="广告名称">
        </el-table-column>
        <el-table-column label="广告图片">
          <template slot-scope='scope'>
            <a :href="scope.row.bannerUrl" target='_balck'><img :src="scope.row.bannerUrl" :alt="scope.row.bannerUrl" style="max-width:116px"></a>
          </template>
        </el-table-column>
        <el-table-column prop="jupmTypeDes" label="跳转类型">
        </el-table-column>
        <!-- <el-table-column prop="businessTypeDes" label="业务分类"></el-table-column> -->
        <el-table-column prop="creatorName" label="发布者">
          <template slot-scope='scope'>
            {{scope.row.creatorName||'-'}} <br> {{scope.row.createdTime}}
          </template>
        </el-table-column>
        <el-table-column prop="modifierName" label="最后修改">
          <template slot-scope='scope'>
            {{scope.row.modifierName||'-'}} <br> {{scope.row.modifiedTime}}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="80">
          <template slot-scope='scope'>
            {{scope.row.status + ' - ' + scope.row.statusDes}}
          </template>
        </el-table-column>
        <el-table-column label="IOS点击/展示">
          <template slot-scope='scope'>
            {{scope.row.iosClick + ' / ' + scope.row.iosShow + '=' + (scope.row.iosClick*100/scope.row.iosShow||0).toFixed(1)+'%'}}
          </template>
        </el-table-column>
        <el-table-column label="安卓点击/展示">
          <template slot-scope='scope'>
            {{scope.row.androidClick + ' / ' + scope.row.androidShow + '=' + (scope.row.androidClick*100/scope.row.androidShow||0).toFixed(1)+'%'}}
          </template>
        </el-table-column>
        <el-table-column label="H5点击/展示">
          <template slot-scope='scope'>
            {{scope.row.h5Click + ' / ' + scope.row.h5Show + '=' + (scope.row.h5Click*100/scope.row.h5Show||0).toFixed(1)+'%'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="ban(scope.row)">{{scope.row.status===1?'正常':'禁用'}}</el-button>
            <el-button type="text" size="small" @click="$router.push('/adedit?id='+scope.row.id+'&showLocation='+activeName)">编辑</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
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
      activeName: 0,
      searchID: "",
      keyword: "",
      tableLoading1: false,
      // 分页
      pageSize: 80,
      pageTotal1: 0,
      currentPage1: 1,
      urls: {
        // 列表
        articles: "banners/",
        // 删除
        delete: "banners/delete",
        // 禁用
        disable: "banners/disable"
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
    handleClick(tab, event) {
      this.getList();
    },
    // 删除
    del(row) {
      let body = {
        url: this.urls.delete,
        method: "delete",
        data: {
          id: row.id
        }
      };
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      this.tableLoading1 = 1;
        this.axios(body).then(res => {
          if (res.data.code === 0) {
            this.getList();
            this.notify(`删除成功`);
          }
        });
      });
    },
    search() {
      let body = {
        title: this.keyword,
        id: this.searchID
      };
      this.getList(body);
    },
    ban(row) {
      this.tableLoading1 = 1;
      let body = {
        url: this.urls.disable,
        method: "PATCH",
        data: {
          id: row.id,
          status: row.status === 0 ? 1 : 0
        }
      };
      this.axios(body).then(res => {
        if (res.data.code === 0) {
          this.getList();
          this.notify(`操作成功`);
        }
      });
    },
    //获取身份审核列表
    getList(opt = {}) {
      this.tableLoading1 = true;
      let body = {
        url: this.urls.articles,
        data: {
          pageSize: this.pageSize,
          pageNo: this.currentPage1,
          showLocation: Number(this.activeName),
          status: 0
        }
      };
      if (opt.title) body.data.title = opt.title;

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
  .search
    display flex
    align-items center
    position relative
    .el-input
      width auto
      margin 0 20px 0 10px
    .addArticle
      position absolute
      right 0
      top 0
  .el-table
    margin-top 20px
</style>
