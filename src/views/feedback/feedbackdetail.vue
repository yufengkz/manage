<template>
  <div>
    <div class="tabs">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>问题反馈</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/feedback' }">问题列表</el-breadcrumb-item>
          <el-breadcrumb-item>问题详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 问题基本信息 -->
      <div class="users" v-loading='tableLoading1'>
        <div class="userTop">
          <div class="left">
            <div class="inputs">
              <label>姓名：</label>
              <div class="el-input" :class="[realName?'':'gray']">{{realName||'暂无数据'}}</div>
            </div>
            <div class="inputs">
              <label>电话：</label>
              <div class="el-input" :class="[mobile?'':'gray']">{{mobile||'暂无数据'}}</div>
            </div>
            <div class="inputs">
              <label>身份证：</label>
              <div class="el-input" :class="[idNumber?'':'gray']">{{idNumber||'暂无数据'}}</div>
            </div>
            <div class="inputs">
              <label>昵称：</label>
              <div class="el-input" :class="[wechatName?'':'gray']">{{wechatName||'暂无数据'}}</div>
            </div>
            <div class="inputs">
              <label>工号：</label>
              <div class="el-input" :class="[workNumber?'':'gray']">{{workNumber||'暂无数据'}}</div>
            </div>
            <div class="inputs">
              <label>职务：</label>
              <div class="el-input" :class="[identity?'':'gray']">{{identity||'暂无数据'}}</div>
            </div>
            <div class="inputs">
              <label>上级工号：</label>
              <div class="el-input" :class="[parentId?'':'gray']">{{parentId||'暂无数据'}}</div>
            </div>
          </div>
          <div class="right">
            <div class="item" v-if="wechatAvatar">
              <div class="tit">头像</div>
              <div class="img">
                <img :src="wechatAvatar" alt="">
              </div>
            </div>
            <div class="item" v-if="wechatQrcode">
              <div class="tit">二维码</div>
              <div class="img">
                <img :src="wechatQrcode" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="inputs">
          <label>问题分类：</label>
          <div class="el-input" :class="[feedbackClassification?'':'gray']">{{feedbackClassification||'暂无数据'}}</div>
        </div>
        <div class="inputs">
          <label>问题描述：</label>
          <div class="el-input" :class="[content?'':'gray']">{{content||'暂无数据'}}</div>
        </div>
        <div class="inputs pics">
          <label>问题图片：</label>
          <div class="el-input">
            <div v-if="feedbackPicList.length>0" v-for="i in feedbackPicList" :key='i'>
              <a :href="i" target="_blank"><img :src="i" alt=""></a>
            </div>
            <span v-if="feedbackPicList.length===0" class="gray">暂无数据</span>
          </div>
        </div>
        <div class="inputs">
          <label>备注：</label>

          <div class="remark">
            {{remark}}
            <span class="edit-mark" @click="remarkVisible=true">{{remark?'编辑':' 添加备注'}}</span>
          </div>
          <el-dialog :visible.sync="remarkVisible" @open="remarkOpen" title="备注">
            <div class="remarkPop">
              <el-input class="textarea" :autosize='{minRows:8}' size="mini" v-model="remarkTemp" type="textarea"></el-input>
              <div class="btns">
                <el-button class="confirm" @click="remarkVisible=false">取消</el-button>
                <el-button class="confirm" type="primary" @click="saveRemark" :loading="remarkLoading">确认</el-button>
              </div>

            </div>
          </el-dialog>

        </div>
      </div>
      <div class="title" v-if="messageList.length>0">问题回复历史</div>
      <!-- 问答列表 -->
      <div class="QAs">
        <el-steps direction="vertical">
          <el-step :class="[i.source===1?'service-tit':'user-tit']" :title="i.source===1?'客服回复':'用户追问'" v-for="i in messageList" :key="i.id" icon="none">
            <div slot="icon" v-if="i.source===1"><img width="40" src="http://qiniu.lanjinrong.com/FloUFtw66qT8LhVfT7uhhWFMpO6I" alt=""></div>
            <div slot="icon" v-if="i.source===2"><img width="30" src="http://qiniu.lanjinrong.com/Fn2TZthxSisgLS3aVFUlR1rsRm8q" alt=""></div>
            <div :class="[i.source===1?'service':'user','block']" slot='description'>
              <div class="tit">
                <div class="name">{{i.handlerName||'-'}}</div>
                <div class="time">{{i.createTime}}</div>
              </div>
              <div class="con">
                {{i.content}}
              </div>
              <div class="pics">
                <a :href="j" v-for="(j,k) in i.pictures" :key="k" target="_blank"><img :src="j" alt=""></a>
              </div>
            </div>
          </el-step>
        </el-steps>
        <div>

        </div>
      </div>

      <div class="reply" v-loading='replyLoading'>
        <div class="tit"><img src="http://qiniu.lanjinrong.com/FloUFtw66qT8LhVfT7uhhWFMpO6I" width="40" alt=""> <span>回复</span></div>
        <div class="el-input-box">
          <el-input class="textarea" :maxlength="500" placeholder="最多输入500字哦" :autosize='{minRows:8}' size="mini" v-model="replyContent" type="textarea"></el-input>
          <div class="number" :style="{color:replyContent&&replyContent.length>500?'red':''}">{{replyContent?replyContent.length:0}}/500</div>
        </div>
        <p style="margin-bottom:10px;color:#888">请上传jpg/jpeg/png类型图片，最多上传3张。</p>
        <el-upload :limit='3' multiple list-type="picture-card" action="http://up.qiniu.com" :on-preview="handlePictureCardPreview" :file-list="fileList" :data='token' :on-success='upSuccess' :on-remove='remove' :on-exceed='exceed' :before-upload="beforeAvatarUpload">
          <i class="el-icon-plus avatar-uploader111-icon"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <el-button class="confirm" type="primary" @click="sendReply" icon="el-icon-success">发送</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 图片预览
      dialogVisible: false,
      dialogImageUrl: false,
      // 修改备注
      remarkVisible: false,
      remark: null,
      remarkTemp: null,
      token: { token: null },
      fileList: [],
      tableLoading1: true,
      replyLoading: false,
      remarkLoading: false,
      realName: null,
      mobile: null,
      idNumber: null,
      wechatName: null,
      workNumber: null,
      identity: null,
      parentId: null,
      wechatAvatar: null,
      wechatQrcode: null,
      feedbackClassification: null,
      content: null,
      feedbackPicList: [],
      messageList: [],
      replyContent: null,
      // 分页
      pageSize: 20,
      pageTotal1: 0,
      currentPage1: 1,
      urls: {
        getFeedbackDetail: "feedback/getFeedbackDetailV2",
        sendReply: "feedback/sendReply",
        saveRemark: "feedback/saveRemark"
      },
      // 多选
      multipleSelection: []
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    remove(file, fileList) {
      this.fileList = fileList;
    },
    upSuccess(response, file, fileList) {
      this.fileList = fileList;
    },
    beforeAvatarUpload(file) {},
    remarkOpen() {
      this.remarkTemp = this.remark;
    },
    sendReply() {
      this.replyLoading = true;
      let body = {
        url: this.urls.sendReply,
        data: {
          feedbackId: this.$route.query.id,
          feedbackDate: this.$route.query.date,
          content: this.replyContent,
          picture: this.fileList
            .map(i => process.env.QN_IMG_DOMAIN + i.response.key)
            .join(",")
        }
      };
      this.axios(body)
        .then(({ data }) => {
          if (data.code === 0) {
            this.getDetail().notify("发送成功");
            this.replyContent = "";
            this.fileList = [];
          }
          this.replyLoading = false;
        })
        .catch((this.replyLoading = false));
    },
    saveRemark() {
      this.remarkLoading = true;
      this.remark = this.remarkTemp;
      let body = {
        url: this.urls.saveRemark,
        data: {
          feedbackId: this.$route.query.id,
          date: this.$route.query.date,
          remark: this.remark
        }
      };
      this.axios(body).then(({ data }) => {
        data.code === 0 && this.notify("备注成功");
        this.remarkLoading = false;
        this.remarkVisible = false;
      });
    },
    exceed() {
      this.warn("最多上传3张图片");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getToken() {
      let body = {
        url: process.env.imgToken,
        method: "post"
      };
      return new Promise((reslove, reject) => {
        this.axios(body).then(res => {
          let d = res.data;
          d.code === 0 && (this.token.token = d.data.data);
          reslove();
        });
      });
    },
    getDetail() {
      this.tableLoading1 = true;
      let body = {
        url: this.urls.getFeedbackDetail,
        data: {
          feedbackId: this.$route.query.id,
          date: this.$route.query.date,
          classificationName: this.$route.query.classificationName
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        d.code === 0 &&
          Object.keys(d.data.data).map(key => (this[key] = d.data.data[key]));
        // 表格数据
        this.tableLoading1 = false;
        // 获取token
        this.getToken();
      });
      return this;
    }
  }
};
</script>

<style scoped lang="stylus">
// 输入框计数
.el-input-box
  position relative
  .number
    position absolute
    right 6px
    bottom 22px
    color #888
// 步骤条
.service-tit >>> .el-step__title
  color #f56c6c
.user-tit >>> .el-step__title
  color #444
.el-step >>> .el-step__head
  width 34px
.inputs >>> .el-dialog__body
  padding-top 6px
.remarkPop
  display flex
  flex-direction column
  .confirm
    margin-top 20px
  .btns
    display flex
    .el-button
      flex 1
.remark
  font-size 14px
  max-width 666px
  text-align justify
  word-break break-all
  .edit-mark
    cursor pointer
    color #65a5f6
.title
  font-size 20px
  border-bottom 1px solid #eee
  padding 10px 0
  margin 40px 0 20px
.QAs
  .no-data
    color #999
  .block.service
    color #F56C6C
  .block
    margin-bottom 20px
    font-size 14px
    color #444
  .tit
    margin-bottom 10px
    display flex
    align-items baseline
    .name
      font-size 14px
      margin-right 20px
    .time
      // color #666
      font-size 12px
  .con
    width 766px
    text-align justify
    margin-bottom 10px
  .pics
    display flex
    img
      max-height 200px
      max-width 250px
      margin-right 10px
.pics.inputs
  align-items flex-start
  .el-input
    display flex
    flex-flow row wrap
    width 888px
    align-items flex-start
    img
      margin 0 10px 10px 0
      max-width 300px
.reply
  width 818px
  .tit
    font-size 18px
    color #666
    display flex
    align-items center
    span
      margin-left 6px
  .textarea
    margin-bottom 20px
  .el-button
    margin 20px auto
    display block
.gray
  color #999
.logs
  margin-top 40px
  line-height 50px
  font-size 18px
  font-weight 700
  color #444
  border-bottom 1px solid #eee
.submit
  text-align center
  .el-button
    width 100px
    margin 50px auto 20px
.userTop
  display flex
  .left, .right
    flex 1
  .right
    display flex
    .item
      flex 1
      font-size 14px
      .tit
        margin-bottom 10px
      img
        width 136px
.inputs
  display flex
  align-items baseline
  margin-bottom 20px
  label
    width 88px
    font-size 14px
  .el-input
    width 600px
  .el-radio
    width auto
    margin-left 10px
  .el-radio+.el-radio
    margin-left 10px
  .submit
    text-align center
    .el-button
      width 100px
      margin 50px auto 20px
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
