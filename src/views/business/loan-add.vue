<template>
  <div>
    <div class="add" v-loading='loading'>
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>业务管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: 'loan' }">贷款</el-breadcrumb-item>
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

        <div class="inputs">
          <label>*是否热推：</label>
          <el-radio v-model="hotPromotion" :label="1">是</el-radio>
          <el-radio v-model="hotPromotion" :label="0">否</el-radio>
        </div>

        <div class="inputs">
          <label>*按钮文案：</label>
          <el-input size='mini' v-model="buttonDescription" placeholder="请输入按钮文案"></el-input>
        </div>

        <div class="inputs">
          <label>*贷款额度简介：</label>
          <el-input size='mini' v-model="loanQuotaDescription" placeholder="请输入贷款额度简介"></el-input>
        </div>

        <div class="tags">
          <label>*推广文案列表：</label>
          <div class="tag_box">
            <el-tag :key="tag" v-for="tag in dynamicTags" closable @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-if="!inputVisible&&dynamicTags.length<4" class="button-new-tag" size="small" @click="showInput">+</el-button>
          </div>
        </div>

        <div class="inputs desc">
          <label>*列表LOGO：</label>

          <el-upload class="avatar-uploader" action="http://up.qiniu.com" :data='token' :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="logoUrl" :src="logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </div>
        <div class="inputs">
          <label>*项目描述：</label>
          <el-input size='mini' v-model="description" placeholder="请输入项目描述"></el-input>
        </div>
        <div class="inputs">
          <label>申请人数：</label>
          <el-input size='mini' v-model="basicCount" placeholder="请输入申请人基数"></el-input>
        </div>
        <div class="inputs">
          <label>*总申请人数：</label>
          <el-input size='mini' v-model="applyCount" placeholder="请输入总申请人数"></el-input>
        </div>
        <div class="inputs">
          <label>*额度范围：</label>
          <el-input size='mini' v-model="loanQuota" placeholder="请输入保费"></el-input>
        </div>
        <div class="inputs">
          <label>*日利率：</label>
          <el-input size='mini' v-model="dayInterest" placeholder="请输入标准佣金"></el-input>
        </div>
        <div class="inputs">
          <label>*贷款期限：</label>
          <el-input size='mini' v-model="loanTerm" placeholder="请输入标准佣金"></el-input>
        </div>
        <div class="inputs">
          <label>*项目种类：</label>
          <el-radio v-model="type" :label="1">固定金额</el-radio>
          <el-radio v-model="type" :label="2">按比例发</el-radio>
          <el-radio v-model="type" :label="3">金额范围</el-radio>
        </div>
        <div v-if="type===1">
          <div class="inputs">
            <label>*进价：</label>
            <el-input size='mini' type="number" v-model="costMoney" placeholder="请输入进价提成比，如0.2"></el-input>
          </div>
          <div class="inputs">
            <label>*标准佣金：</label>
            <el-input size='mini' type="number" v-model="commission" placeholder="请输入出价提成比，如0.2"></el-input>
          </div>
          
        </div>
        <div v-if="type===2">
          <div class="inputs">
            <label>*出价提成比：</label>
            <el-input size='mini' type="number" v-model="extractBonusRate" placeholder="请输入出价提成比，如0.2"></el-input>
          </div>
          <div class="inputs">
            <label>*进价提成比：</label>
            <el-input size='mini' type="number" v-model="extractCostRate" placeholder="请输入进价提成比，如0.2"></el-input>
          </div>
        </div>
        </div>
        <div v-if="type===3">
          <div class="inputs">
            <label>*标准佣金：</label>
            <el-input size='mini' type="number" v-model="costMoney" placeholder="请输入出价提成比，如0.2"></el-input>
          </div>
        </div>
        <!-- <div class="inputs desc">
          <label>详情页banner：</label>
          <el-upload class="avatar-uploader" action="http://up.qiniu.com" :data='token' :show-file-list="false" :on-success="handleAvatarSuccess2" :before-upload="beforeAvatarUpload2">
            <img v-if="bannerUrl" :src="bannerUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div> -->
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
      hotPromotion: 0,
      buttonDescription: "",
      loanQuotaDescription: "",
      dynamicTags: [],
      inputValue: "",
      inputVisible: 0,
      type: 1,
      name: "",
      orderNumber: "",
      logoUrl: "",
      description: "",
      basicCount: "",
      applyCount: "",
      loanQuota: "",
      dayInterest: "",
      loanTerm: "",
      commission: "",
      costMoney: "",
      extractBonusRate: "",
      extractCostRate: "",
      // 详情页图
      bannerUrl: "",
      applyPosterUrl: "",
      applyUrl: "",
      token: { token: null },
      urls: {
        create: "loans/create"
      }
    };
  },
  methods: {    
    // 删除标签
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
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
          description: this.description,
          hotPromotion: this.hotPromotion,
          buttonDescription: this.buttonDescription,
          promotionDescription:this.dynamicTags.join(','),
          loanQuotaDescription: this.loanQuotaDescription,
          orderNumber: Number(this.orderNumber) || 0,
          loanQuota: this.loanQuota,
          dayInterest: this.dayInterest,
          basicCount: Number(this.basicCount),
          loanTerm: this.loanTerm,
          type: this.type,
          commission: this.commission,
          costMoney: this.costMoney,
          extractBonusRate: Number(this.extractBonusRate),
          extractCostRate: Number(this.extractCostRate),
          bannerUrl: this.bannerUrl,
          applyPosterUrl: this.applyPosterUrl,
          applyCount: Number(this.applyCount),
          applyUrl: this.applyUrl
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
          this.$router.push(`loan`);
        }
      });
    },
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
      if (!this.loanQuota) {
        this.$notify({
          title: `请输入额度范围`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.dayInterest) {
        this.$notify({
          title: `请输入日利率`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.loanTerm) {
        this.$notify({
          title: `请输入贷款期限`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (this.type===1&& (this.commission===''||this.commission===null)) {
        this.$notify({
          title: `请输入标准佣金`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (this.type===1&&(this.costMoney===''||this.costMoney===null)) {
        this.$notify({
          title: `请输入进价`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (this.type===2&&(this.extractBonusRate===''||this.extractBonusRate===null)) {
        this.$notify({
          title: `请输入出价提成比`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (this.type===2&&(this.extractCostRate===''||this.extractCostRate===null)) {
        this.$notify({
          title: `请输入进价提成比`,
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
.el-tag + .el-tag
  margin-left 10px
.button-new-tag
  margin-left 10px
  height 32px
  line-height 30px
  padding-top 0
  padding-bottom 0
.input-new-tag
  width 90px
  margin-left 10px
  vertical-align bottom
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
  .tags
    display flex
    align-items center
    margin-bottom 15px
    margin-top -5px
    .tag_box
      display flex
      width 600px
      flex-flow row wrap
      align-items center
    label
      width 130px
      font-size 14px
      text-align right
    & >>> .el-tag
      margin 5px 10px 5px 0
    .button-new-tag
      position relative
      left -10px
      font-size 22px
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
      margin-left 20px
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
