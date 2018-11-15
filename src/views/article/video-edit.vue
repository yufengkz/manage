<template>
  <div>
    <div class="add" v-loading='loading'>
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>文章管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/video' }">视频列表</el-breadcrumb-item>
          <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 检索 -->
      <div class="article">
        <div class="inputs">
          <label>标题：</label>
          <el-input size='mini' v-model="title" placeholder="请输入标题"></el-input>
        </div>
        <div class="inputs">
          <label>信息属性：</label>
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="推荐"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="inputs">
          <label>样式：</label>
          <el-radio v-model="styleType" :label="1">左右</el-radio>
          <el-radio v-model="styleType" :label="2">上下</el-radio>
        </div>
        <div class="inputs">
          <label>视频地址：</label>
          <el-input size='mini' v-model="linkUrl" placeholder="请输入视频地址"></el-input>
        </div>
        <div class="inputs">
          <label>封面图地址：</label>
          <el-input size='mini' v-model="imageUrl" placeholder="请输入封面图地址"></el-input>
        </div>
        <el-tooltip class="tooltip" effect="dark" :content="linkUrl" placement="bottom">
          <a :href="linkUrl" target="_blank">查看视频</a>
        </el-tooltip>

        <div class="submit">
          <el-button type='primary' @click='submit'>提交</el-button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import editor from "components/editor/Quilleditor.vue";

export default {
  data() {
    return {
      title: "",
      linkUrl: null,
      imageUrl: null,
      checkList: [],
      businessType: 1,
      styleType: 1,
      content: "",
      urls: {
        // 查询文章
        getArticle: "articles/getArticle",
        // 修改文章接口
        modifyAbility: "articles/modifyVideo"
      },
      token: { token: null },
      loading: 1,
      canCrop: false,
      /*测试上传图片的接口，返回结构为{url:''}*/
      uploadUrl: "http://up.qiniu.com",
      content: ""
    };
  },
  components: {
    editor
  },
  created() {
    this.getArticle();
    // 页码数
    let storagePageSize = localStorage.getItem("pageSize");
    if (storagePageSize) this.pageSize = Number(storagePageSize);
  },
  methods: {
    // 查询文章详情
    getArticle() {
      let body = {
        url: this.urls.getArticle,
        data: {
          articleId: this.$route.query.id
        }
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          Object.keys(d.data.data).map(key => (this[key] = d.data.data[key]));
          this.isRecommend === 1 ? (this.checkList = ["推荐"]) : "";
          this.loading = 0;
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    submit() {
      this.loading = 1;
      if (!this.reg()) return;
      let body = {
        url: this.urls.modifyAbility,
        method: "PATCH",
        data: {
          id: this.$route.query.id,
          isRecommend: this.checkList.includes("推荐") ? 1 : 0,
          title: this.title,
          styleType: this.styleType,
          imageUrl: this.imageUrl,
          linkUrl: this.linkUrl
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        this.loading = 0;
        if (d.code === 0) {
          this.$notify({
            title: `修改成功`,
            type: "success",
            position: "bottom-right"
          });
          this.$router.push("video");
        }
      });
    },
    reg() {
      if (!this.title) {
        this.$notify({
          title: `标题呢？`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.linkUrl) {
        this.$notify({
          title: `视频地址呢？`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if(!/^(http|ftp|https):\/\//.test(this.linkUrl)){
        this.$notify({
            title: `视频地址协议头错了！`,
            type: "warning",
            position: "bottom-right"
          }); 
          this.loading = 0  
        return false
      }
      return true;
    },
    // 预览图片
    handleRemove(file, fileList) {
      this.imageUrl = "";
      fileList=[]
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleChecked() {
      console.log(this.checkList);
    },
    search() {
      console.log("检索");
    },
    ban(row) {
      let body = {
        url: this.urls.disable,
        method: "PATCH",
        data: {
          id: row.id,
          status: row.status === 0 ? 1 : 0
        }
      };
      this.axios(body).then(res => {
        if (res.data.code === 0) {           this.getList();           this.$notify({             title: `操作成功`,             type: "success",             position: "bottom-right"           });         }
      });
    },
    //获取身份审核列表
    getList(opt = {}) {
      console.log("getlist");
      this.tableLoading1 = true;
      let that = this;
      let body = {
        url: this.urls.articles,
        data: {
          classification: 1,
          pageSize: this.pageSize,
          pageNo: this.currentPage1
        }
      };
      if (opt.title) body.data.title = opt.title;
      if (opt.id) body.data.id = opt.id;

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
.add .article .inputs .el-radio
  width auto
.tooltip
  display block
  width 86px
  text-align right 
  font-size 14px
  color #409EFF
  transition .5s
  outline 0
  &:hover
    color blue
.avatar-uploader111 >>> .el-upload
  visibility visible
  opacity 1
.imgOK >>> .el-upload
  visibility hidden
  opacity 0
.breadcrumb
  margin 10px 0 20px
  padding-bottom 10px
  border-bottom 1px solid #eee
.add
  margin2 50px 20px 0 180px
  background #fff
  padding 10px 20px 20px
  border 1px solid #e4e5e7
  min-height 800px
  color #666
  .article
    .inputs
      display flex
      align-items center
      margin-bottom 20px
      label
        width 100px
        font-size 14px
        text-align right
      .el-input
        width 500px
    .click
      .el-input
        width 174px
    .el-checkbox-group label
      text-align left
    .desc
      align-items flex-start
  .submit
    text-align center
    .el-button
      width 100px
      margin 50px auto 20px
</style>
