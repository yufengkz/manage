<template>
  <div>
    <div class="add" v-loading='loading'>
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>文章管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/questions' }">问题列表</el-breadcrumb-item>
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
          <label>样式：</label>
          <el-radio v-model="styleType" :label="1">左右</el-radio>
          <el-radio v-model="styleType" :label="2">上下</el-radio>
        </div>
        <div class="inputs desc">
          <label>回答：</label>
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="content" style='width:500px;'></el-input>
        </div>

        <div class="submit">
          <el-button type='primary' @click='submit'>提交</el-button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      title: "",
      content: "",
      styleType: 1,
      urls: {
        // 查询文章
        getArticle: "articles/getArticle",
        // 修改文章接口
        modifyAbility: "articles/modifyProblem"
      },
      loading: 1
    };
  },
  created() {
    this.getArticle();
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
          content: this.content,
          styleType: this.styleType,
          title: this.title
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
          this.$router.push("questions");
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
          title: `请输入回答`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      return true;
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
