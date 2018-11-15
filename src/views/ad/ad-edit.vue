<template>
  <div>
    <div class="add" v-loading='loading'>
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>广告管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: 'ad' }">广告列表</el-breadcrumb-item>
          <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 检索 -->
      <div>
        <div class="inputs">
          <label>*广告名称：</label>
          <el-input size='mini' v-model="title" placeholder="请输入标题"></el-input>
        </div>
        <div class="inputs orderby">
          <label>排序：</label>
          <el-input size='mini' type="number" v-model="orderNumber" placeholder="请输入序号"></el-input>
        </div>
        <div class="inputs">
          <label>*显示范围：</label>
          <el-radio v-model="viewRange" :label="0">普通用户</el-radio>
          <el-radio v-model="viewRange" :label="1">仅会员</el-radio>
        </div>
        <div class="inputs">
          <label>*跳转类型：</label>
          <el-radio v-model="jumpType" :label="0">银行详情</el-radio>
          <el-radio v-model="jumpType" :label="1">文章素材</el-radio>
          <el-radio v-model="jumpType" :label="2">活动H5</el-radio>
        </div>
        <!-- <div class="inputs">
          <label>*业务分类：</label>
          <el-radio v-model="businessType" :label="1">信用卡</el-radio>
          <el-radio v-model="businessType" :label="2">保险</el-radio>
          <el-radio v-model="businessType" :label="3">贷款</el-radio>
          <el-radio v-model="businessType" :label="4">车险</el-radio>
        </div> -->
        <div class="inputs">
          <label>*设备类型：</label>
          <el-radio v-model="deviceModel" :label="0">安卓</el-radio>
          <el-radio v-model="deviceModel" :label="1">IOS</el-radio>
          <el-radio v-model="deviceModel" :label="2">H5</el-radio>
        </div>
        <div class="inputs" v-if="jumpType!==2">
          <label>项目ID：</label>
          <el-input size='mini' v-model="operation_id" placeholder="对应具体业务的ID标识"></el-input>
        </div>
        <div class="inputs desc">
          <label>*广告图片：</label>

          <el-upload class="avatar-uploader" action="http://up.qiniu.com" :data='token' :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="bannerUrl" :src="bannerUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </div>
        <div class="inputs">
          <label>*跳转路径：</label>
          <el-input size='mini' v-model="jumpUrl" placeholder="请输入跳转路径"></el-input>
        </div>
        <div class="inputs">
          <label>参数：</label>
          <el-input size='mini' v-model="parameter" placeholder="请输入参数"></el-input>
        </div>
      </div>
      <div class="submit">
        <el-button type='primary' @click='submit'>保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      loading: 1,
      viewRange: 1,
      showLocation: 1,
      jumpType: 1,
      businessType: 1,
      deviceModel: 1,
      // banner图
      bannerUrl: "",
      token: { token: null },
      urls: {
        modify: "banners/modify",
        getBanner: "banners/getBanner"
      }
    };
  },
  methods: {
    submit() {
      this.loading = 1;
      if (!this.reg()) return;
      let body = {
        url: this.urls.modify,
        method: "PATCH",
        data: {
          id: this.$route.query.id,
          showLocation: this.$route.query.showLocation,
          viewRange: this.viewRange,
          title: this.title,
          orderNumber: Number(this.orderNumber) || 0,
          bannerUrl: this.bannerUrl,
          jumpType: this.jumpType,
          businessType: Number(this.businessType),
          operation_id: this.operation_id || 0,
          jumpUrl: this.jumpUrl,
          parameter: this.parameter,
          deviceModel: this.deviceModel
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        this.loading = 0;
        if (d.code === 0) {
          this.notify(`保存成功`);
          this.$router.push(`ad`);
        }
      });
    },
    beforeAvatarUpload(res, file) {
      this.loading = 1;
    },
    handleAvatarSuccess(res, file) {
      this.loading = 0;
      this.bannerUrl = process.env.QN_IMG_DOMAIN + res.key;
    },
    reg() {
      if (!this.title) {
        this.warn(`请输入广告名称`);
        this.loading = 0;
        return false;
      }
      if (!this.bannerUrl) {
        this.warn(`请上传广告图片`);
        this.loading = 0;
        return false;
      }
      if (!this.jumpUrl) {
        this.warn(`请输入跳转路径`);
        this.loading = 0;
        return false;
      }
      return true;
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
          this.loading = 0;
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    getDetails() {
      this.loading = 1;
      let body = {
        url: this.urls.getBanner,
        data: {
          id: this.$route.query.id
        }
      };
      this.axios(body).then(res => {
        let d = res.data;

        if (d.code === 0) {
          Object.keys(d.data).map(key => (this[key] = d.data[key]));
          this.organization_name = d.data.organizationName;
        }
        this.loading = 0;
      });
    }
  },
  created() {
    this.getToken();
    this.getDetails();
    // 页码数
    let storagePageSize = localStorage.getItem("pageSize");
    if (storagePageSize) this.pageSize = Number(storagePageSize);
  }
};
</script>

<style scoped lang="stylus">
.submit
  text-align center
  .el-button
    width 100px
    margin 50px auto 20px
.del, .addbtn
  width 620px
  display block
  text-align right
.del
  margin-bottom 10px
.add .block .inputs
  margin-bottom 10px
.block .inputs.description
  margin-bottom 0
.title2
  margin 20px 0
  color #333
  font-size 16px
  font-weight 700
  padding-bottom 10px
  padding-left 10px
.title
  width 100%
  border-bottom 1px solid #eee
  margin 20px 0
  color #333
  font-size 18px
  font-weight 700
  padding-bottom 10px
  padding-left 10px
.credit
  .el-button+.el-button
    margin-left 0
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
  .inputs
    display flex
    align-items baseline
    margin-bottom 20px
    label
      width 130px
      font-size 14px
      text-align right
    .el-input
      width 500px
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
  .desc
    align-items flex-start
  .orderby .el-input
    width 160px
</style>
