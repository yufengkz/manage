<template>
  <div>
    <div class="add" v-loading='loading'>
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>业务管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: 'insurance' }">保险</el-breadcrumb-item>
          <el-breadcrumb-item>新增</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 检索 -->
      <div>
        <div class="inputs">
          <label>*项目名称：</label>
          <el-input size='mini' v-model="name" placeholder="请输入项目名称"></el-input>
        </div>
        <div class="inputs orderby">
          <label>排序：</label>
          <el-input size='mini' type="number" v-model="orderNumber" placeholder="请输入序号"></el-input>
        </div>
        <div class="inputs desc">
          <label>*列表LOGO：</label>

          <el-upload class="avatar-uploader" action="http://up.qiniu.com" :data='token' :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="logoUrl" :src="logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </div>
        <div class="inputs">
          <label>*项目机构：</label>
          <el-input size='mini' v-model="organization_name" placeholder="请输入项目机构"></el-input>
        </div>
        <div class="inputs">
          <label>*项目描述：</label>
          <el-input size='mini' v-model="description" placeholder="请输入项目描述"></el-input>
        </div>
        <div class="inputs">
          <label>申请人：</label>
          <el-input size='mini' v-model="basicCount" placeholder="请输入申请人基数"></el-input>
        </div>
        <div class="inputs">
          <label>*总申请人数：</label>
          <el-input size='mini' v-model="applyCount" placeholder="请输入总申请人数"></el-input>
        </div>
        <div class="inputs">
          <label>*保费：</label>
          <el-input size='mini' v-model="premiumDesc" placeholder="请输入保费"></el-input>
        </div>
        <div class="inputs">
          <label>*最高保额：</label>
          <el-input size='mini' v-model="maxInsuredAmount" placeholder="请输入最高保额"></el-input>
        </div>
        <div class="inputs">
          <label>*佣金发放类型：</label>
          <el-radio v-model="type" :label="1">固定金额</el-radio>
          <el-radio v-model="type" :label="2">按比例发</el-radio>
        </div>
        <div class="inputs">
          <label>*标准佣金：</label>
          <el-input size='mini' v-model="offerMoney" placeholder="请输入标准佣金"></el-input>
        </div>
        <div class="inputs">
          <label>*出价提成比：</label>
          <el-input size='mini' type="number" v-model="extractBonusRate" placeholder="请输入出价提成比，如0.2"></el-input>
        </div>
        <div class="inputs">
          <label>*进价提成比：</label>
          <el-input size='mini' type="number" v-model="extractCostRate" placeholder="请输入进价提成比，如0.2"></el-input>
        </div>
        <div class="inputs">
          <label>*佣金提成比描述：</label>
          <el-input size='mini' v-model="extractBonusStr" placeholder="请输入佣金提成比描述"></el-input>
        </div>
        <div class="inputs desc">
          <label>详情页banner：</label>
          <el-upload class="avatar-uploader" action="http://up.qiniu.com" :data='token' :show-file-list="false" :on-success="handleAvatarSuccess2" :before-upload="beforeAvatarUpload2">
            <img v-if="bannerUrl" :src="bannerUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="inputs desc">
          <label>*详情页描述：</label>
          <el-upload class="avatar-uploader" action="http://up.qiniu.com" :data='token' :show-file-list="false" :on-success="handleAvatarSuccess3" :before-upload="beforeAvatarUpload3">
            <img v-if="applyPosterUrl" :src="applyPosterUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="inputs">
          <label>*URL：</label>
          <el-input size='mini' v-model="applyUrl" placeholder="请输入URL"></el-input>
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
      name: "",
      orderNumber: "",
      logoUrl: "",
      organization_name: "",
      description: "",
      basicCount: "",
      applyCount: "",
      premiumDesc: "",
      maxInsuredAmount: "",
      offerMoney: "",
      type: 1,
      extractBonusRate: "",
      extractCostRate: "",
      extractBonusStr: "",
      // 详情页图
      bannerUrl: "",
      applyPosterUrl: "",
      applyUrl: "",
      token: { token: null },
      urls: {
        create: "insurances/create"
      }
    };
  },
  methods: {
    beforeAvatarUpload(res, file) {
      this.loading = 1;
    },
    handleAvatarSuccess3(res, file) {
      this.loading = 0;
      this.applyPosterUrl = process.env.QN_IMG_DOMAIN + res.key;
    },
    handleAvatarSuccess2(res, file) {
      this.loading = 0;
      this.bannerUrl = process.env.QN_IMG_DOMAIN + res.key;
    },
    handleAvatarSuccess(res, file) {
      this.loading = 0;
      this.logoUrl = process.env.QN_IMG_DOMAIN + res.key;
    },
    submit() {
      this.loading = 1;
      if (!this.reg()) return;
      let body = {
        url: this.urls.create,
        method: "put",
        data: {
          name: this.name,
          logoUrl: this.logoUrl,
          organization_name: this.organization_name,
          superscript: this.organization_name,
          description: this.description,
          orderNumber: Number(this.orderNumber) || 0,
          moneyStr: this.moneyStr,
          basicCount: Number(this.basicCount),
          premiumDesc: this.premiumDesc,
          maxInsuredAmount: this.maxInsuredAmount,
          offerMoney: this.offerMoney,
          extractBonusRate: this.extractBonusRate,
          extractCostRate: this.extractCostRate,
          extractBonusStr: this.extractBonusStr,
          bannerUrl: this.bannerUrl,
          applyPosterUrl: this.applyPosterUrl,
          applyUrl: this.applyUrl,
          applyCount: this.applyCount,
          type: this.type,
          
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        this.loading = 0;
        if (d.code === 0) {
          this.$notify({
            title: `保存成功`,
            type: "success",
            position: "bottom-right"
          });
          this.$router.push(`insurance`);
        }
      });
    },
    reg() {
      if (!this.name) {
        this.$notify({
          title: `请输入项目名称`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.logoUrl) {
        this.$notify({
          title: `请上传列表LOGO`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.organization_name) {
        this.$notify({
          title: `请输入项目机构`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.description) {
        this.$notify({
          title: `请输入项目描述`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.applyCount) {
        this.$notify({
          title: `请输入总申请人数`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.premiumDesc) {
        this.$notify({
          title: `请输入保费`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.maxInsuredAmount) {
        this.$notify({
          title: `请输入最高保额`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.offerMoney) {
        this.$notify({
          title: `请输入标准佣金`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.extractBonusRate) {
        this.$notify({
          title: `请输入出价提成比`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.extractCostRate) {
        this.$notify({
          title: `请输入进价提成比`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.extractBonusStr) {
        this.$notify({
          title: `请输入佣金提成比描述`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.applyPosterUrl) {
        this.$notify({
          title: `请上传详情页描述`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.applyUrl) {
        this.$notify({
          title: `请输入URL`,
          type: "warning",
          position: "bottom-right"
        });
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
    }
  },
  created() {
    this.getToken();
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
