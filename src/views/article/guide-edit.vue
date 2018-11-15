<template>
  <div>
    <div class="add" v-loading='loading'>
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>文章管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/guide' }">推广素材</el-breadcrumb-item>
          <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 检索 -->
      <div class="article">
        <div class="inputs">
          <label>标题：</label>
          <el-input size='mini' v-model="title" placeholder="请输入标题"></el-input>
        </div>
        <div class="inputs click">
          <label>点击数：</label>
          <el-input size='mini' type="number" v-model="viewCount" placeholder="请输入点击数"></el-input>
        </div>
        <div class="inputs">
          <label>样式：</label>
          <el-radio v-model="styleType" :label="1">左右</el-radio>
          <el-radio v-model="styleType" :label="2">上下</el-radio>
        </div>
        <div class="inputs">
          <label>分类：</label>
          <el-select v-model="businessType" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="inputs desc">
          <label>摘要：</label>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入内容" v-model="description" style='width:500px;'></el-input>
        </div>
        <div class="inputs desc">
          <label>上传缩略图：</label>
          <el-upload v-loading='uploading' :class="[imageUrl ? 'avatar-uploader111 imgOK' : 'avatar-uploader111']" list-type="picture-card" action="http://up.qiniu.com" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="imageUrl?[{name:'',url:imageUrl}]:[]" :limit='1' :http-request='picUpload' :before-upload='beforeUpload'>
            <i class="el-icon-plus avatar-uploader111-icon"></i>
          </el-upload>

          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

        </div>
        <img :src="imgpressed" alt="">
        <editor ref="myTextEditor" :token="token.token" :fileName="'myFile'" :canCrop="canCrop" :uploadUrl="uploadUrl" v-model="content"></editor>

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
      viewCount: null,
      uploading: 0,
      checkList: [],
      businessType: 1,
      styleType: 1,
      options: this.$root.globalData.article.businessType,
      description: "",
      dialogImageUrl: "",
      dialogVisible: false,
      imageUrl: "",
      content: "",
      imgpressed: null,
      urls: {
        // 查询文章
        getArticle: "articles/getArticle",
        // 修改文章接口
        modifyAbility: "articles/modifySpread"
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
    this.getToken();
    this.getArticle();
    // 页码数
    let storagePageSize = localStorage.getItem("pageSize");
    if (storagePageSize) this.pageSize = Number(storagePageSize);
  },
  methods: {
    picUpload(request) {
      this.uploading = 1;
      let file = request.file;
      this.$imgCompress(file).then(res => {
        let headers = { "Content-Type": "multipart/form-data" };
        let formData = new FormData();
        formData.append("file", res);
        formData.append("token", this.token.token);
        this.axios({ url: this.uploadUrl, data: formData, headers }).then(
          ress => {
            this.imageUrl = process.env.QN_IMG_DOMAIN + ress.data.key;
            this.uploading = 0
          }
        );
      });
    },
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
    getToken() {
      let body = {
        url: process.env.imgToken,
        method: "post"
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.token.token = d.data.data;
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
          businessType: this.businessType,
          styleType: this.styleType,
          content: this.content,
          description: this.description,
          imageUrl: this.imageUrl,
          isRecommend: this.checkList.includes("推荐") ? 1 : 0,
          title: this.title,
          viewCount: this.viewCount ? this.viewCount : 0
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
          this.$router.push("guide");
        }
      });
    },
    reg() {
      if (!this.title) {
        this.$notify({
          title: `请输入标题`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.content) {
        this.$notify({
          title: `请输入文章内容`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!/^\d+$/.test(Number(this.viewCount))) {
        this.$notify({
          title: `请正确输入点击数`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      return true;
    },
    // 预览图片
    handleRemove(file, fileList) {
      this.imageUrl = "";
      fileList = [];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleChecked() {
      console.log(this.checkList);
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
