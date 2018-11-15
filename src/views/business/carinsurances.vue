<template>
  <div>
    <div class="tabs">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>业务管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '' }">车险</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="media-manage-table">
        <el-upload class="upload-demo" :action='urls.upFileUrl' :before-upload='before' :on-success='success' :file-list="fileList" v-loading='tableLoading1' :headers='headers'>
          <el-button size="small" type="primary">上传文件</el-button>
        </el-upload>
      </div>
    </div>
  </div>
</template>
<script>
import { getCookie } from "../../../src/api/index";

export default {
  data() {
    return {
      tableLoading1: 0,
      fileList: [],
      headers:{
        token:getCookie('token')
      },
      urls: {
        upFileUrl: `${process.env.API_ROOT}carInsurances/upExcel`
      }
    };
  },
  methods: {
    before() {
      this.tableLoading1 = 1;
    },
    success(e) {
      this.tableLoading1 = 0;
      console.log(e);
      if (e.code === 0) {
        this.$notify({
          title: `成功上传${e.data.data}条数据`,
          type: "success",
          position: "bottom-right"
        });
      }
    }
  },
  created() {}
};
</script>

<style scoped lang="stylus">
.media-manage-table
  width 500px
.credit
  .el-button+.el-button
    margin-left 0
.breadcrumb
  margin 10px 0 20px
  padding-bottom 10px
  border-bottom 1px solid #eee
.tabs
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
.tab
  border-bottom 2px solid #e4e5e7
  display flex
  margin-bottom 20px
  div
    padding 10px
    font-size 14px
    position relative
    cursor pointer
    transition 0.5s
    &:first-child
      padding-left 0
    &.on, &:hover
      color #409EFF
    i
      position absolute
      left 0
      bottom -2px
      width 60px
      height 2px
      background #409EFF
      transition 0.5s
    em
      position absolute
      font-size 12px
      text-align center
      line-height 28px
      right -5px
      top -6px
      width 26px
      height 26px
      border-radius 20px
      background #F56C6C
      color #fff
      transform scale(0.8)
.tab1 div i
  left 0
  width 56px
.tab2 div i
  left 76px
  width 70px
.tab3 div i
  left 166px
  width 56px
.bl_table_img
  max-width 100px
  max-height 100px
  transition 0.3s
.bl_table_img
  max-width 100px
  max-height 100px
  transition 0.3s
.material /deep/ .big_img
  position fixed
  z-index 9999
  animation img 0.8s both
.material /deep/ .big_img.hide
  animation imgHide 0.5s both
.material /deep/ .big_img_box
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  animation bg 0.5s both
  z-index 9999
.material /deep/ .big_img_box.hide
  animation bgHide 0.5s both
@keyframes img
  0%
    width 0
  100%
    max-width 50%
    max-height 99%
    left 50%
    top 50%
    transform translate3d(-50%, -50%, 0) scale(1)
@keyframes imgHide
  0%
    width 50%
    left 50%
    top 50%
    transform translate3d(-50%, -50%, 0) scale(1)
    opacity 1
  100%
    opacity 0
    transform translate3d(-50%, -50%, 0) scale(0)
@keyframes bg
  100%
    background rgba(0, 0, 0, 0.5)
@keyframes bgHide
  0%
    background rgba(0, 0, 0, 0.5)
  100%
    background rgba(0, 0, 0, 0)
</style>
