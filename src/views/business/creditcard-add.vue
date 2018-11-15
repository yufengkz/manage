<template>
  <div>
    <div class="add">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>业务管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: 'creditcard' }">信用卡</el-breadcrumb-item>
          <el-breadcrumb-item>新增</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 检索 -->
      <div>
        <div class="inputs">
          <label>*项目状态：</label>
          <el-radio v-model="status" :label="0">启用</el-radio>
          <el-radio v-model="status" :label="1">禁用</el-radio>
        </div>
        <div class="inputs">
          <label>*项目种类：</label>
          <el-radio v-model="isHotcard" :label="0">银行</el-radio>
          <el-radio v-model="isHotcard" :label="1">单卡</el-radio>
        </div>
        <div class="inputs range" v-if="isHotcard===0">
          <label>*显示范围：</label>
          <el-radio v-model="launchPosition" label="lanjinrong">蓝金融</el-radio>
          <el-radio v-model="launchPosition" label="kalingling">快卡精灵</el-radio>
          <el-radio v-model="launchPosition" label="lanjinrong_kalingling">蓝金融和快卡精灵</el-radio>
        </div>
        <div class="inputs">
          <label>{{isHotcard===0?'*银行名称：':'*卡名称：'}}</label>
          <el-input size='mini' v-model="name" placeholder="请输入名称"></el-input>
        </div>
        <div class="inputs orderby">
          <label>排序：</label>
          <el-input size='mini' type="number" v-model="orderby" placeholder="请输入序号"></el-input>
        </div>
        <div class="inputs desc">
          <label>{{isHotcard===0?'*上传列表LOGO：':'*上传列表图：'}}</label>
          <el-upload :class="[logo ? 'avatar-uploader111 imgOK' : 'avatar-uploader111']" list-type="picture-card" action="http://up.qiniu.com" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="fileList" :limit='1' :data='token' :on-success='upSuccess'>
            <i class="el-icon-plus avatar-uploader111-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
        <div class="inputs">
          <label>{{isHotcard===0?'*银行描述：':'*卡描述：'}}</label>
          <el-input size='mini' v-model="description" placeholder="请输入描述"></el-input>
        </div>
        <div class="inputs">
          <label>*文案说明：</label>
          <el-input size='mini' v-model="officialRemark" placeholder="请输入文案说明"></el-input>
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
          <label>*标准奖金：</label>
          <el-input size='mini' type="number" v-model="moneyStr" placeholder="请输入标准奖金"></el-input>
        </div>
        <div class="inputs" v-if="isHotcard===0">
          <label>角标：</label>
          <el-input size='mini' v-model="superscript" placeholder="请输入列表角标文字"></el-input>
        </div>
        <div class="title">推广政策详情页</div>
        <div class="inputs desc">
          <label>*上传海报：</label>
          <el-upload :class="[promotionPosterUrl ? 'avatar-uploader111 imgOK' : 'avatar-uploader111']" list-type="picture-card" action="http://up.qiniu.com" :on-preview="handlePictureCardPreview" :on-remove="handleRemove2" :file-list="fileList2" :limit='1' :data='token' :on-success='upSuccess2'>
            <i class="el-icon-plus avatar-uploader111-icon"></i>
          </el-upload>
        </div>
        <div class="inputs">
          <label>*公众号指向：</label>
          <el-radio v-model="wxAppid" label="wxfd4014870b6a171d">蓝金融用户中心</el-radio>
          <el-radio v-model="wxAppid" label="wx5d4ef5124850557e">蓝金融中心</el-radio>
          <el-radio v-model="wxAppid" label="wxed6d9589a87438ad">蓝金融服务中心</el-radio>
          <el-radio v-model="wxAppid" label="wx91cfa1fa4a021ce5">蓝金融服务号</el-radio>
          <el-radio v-model="wxAppid" label="wxcfb6ac657a30b286">蓝金融快卡精灵</el-radio>
        </div>
      </div>
      <div class="inputs desc">
        <label>*详情页：</label>
        <el-upload :class="[applyPosterUrl ? 'avatar-uploader111 imgOK' : 'avatar-uploader111']" list-type="picture-card" action="http://up.qiniu.com" :on-preview="handlePictureCardPreview" :on-remove="handleRemove3" :file-list="fileList3" :limit='1' :data='token' :on-success='upSuccess3'>
          <i class="el-icon-plus avatar-uploader111-icon"></i>
        </el-upload>
      </div>

      <div class="title2">特点描述toC:</div>
      <div class="block" v-for='i in descList' :key='i.orderNumber' v-if="i.type===0">
        <div class="block_box">
          <div class="inputs">
            <label>标题：</label>
            <el-input size='mini' v-model="i.title" placeholder="请输入标题"></el-input>
          </div>
          <div class="inputs description">
            <label>描述：</label>
            <el-input size='mini' v-model="i.description" placeholder="请输入描述"></el-input>
          </div>
          <el-button class="del" type="text" size="small" @click="del(i.orderNumber)">删除</el-button>
        </div>
      </div>
      <el-button class="addbtn" type="text" size="small" @click="toCAdd">增加</el-button>
      <div class="title2">特点描述toB:</div>
      <div class="block" v-for='i in descList' :key='i.orderNumber' v-if="i.type===1">
        <div class="block_box">
          <div class="inputs">
            <label>标题：</label>
            <el-input size='mini' v-model="i.title" placeholder="请输入标题"></el-input>
          </div>
          <div class="inputs description">
            <label>描述：</label>
            <el-input size='mini' v-model="i.description" placeholder="请输入描述"></el-input>
          </div>
          <el-button class="del" type="text" size="small" @click="del(i.orderNumber)">删除</el-button>
        </div>

      </div>
      <el-button class="addbtn" type="text" size="small" @click="toBAdd">增加</el-button>
      <div class="submit">
        <el-button type='primary' @click='submit'>下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      loading: 1,
      status: 0,
      isHotcard: 0,
      dialogImageUrl: "",
      launchPosition: "lanjinrong",
      name: "",
      orderby: "",
      description: "",
      wxAppid: "wxfd4014870b6a171d",
      // 申请人基数
      basicCount: "",
      moneyStr: "",
      promotionPosterUrl: "",
      // 详情页图
      applyPosterUrl: "",
      superscript: "",
      dialogVisible: false,
      logo: "",
      token: { token: null },
      descriptionList: [
        {
          title: "",
          description: "",
          type: 0
        },
        {
          title: "",
          description: "",
          type: 1
        }
      ],
      officialRemark: "",
      applyCount: "",
      urls: {
        create: "cards/create"
      }
    };
  },
  computed: {
    toBLen() {
      return this.descriptionList.filter(i => i.type === 1);
    },
    toCLen() {
      return this.descriptionList.filter(i => i.type === 0);
    },
    descList() {
      return this.descriptionList.map((i, key) => {
        i.orderNumber = key;
        return i;
      });
    }
  },
  methods: {
    submit() {
      this.loading = 1;
      if (!this.reg()) return;
      let body = {
        url: this.urls.create,
        method: "put",
        data: {
          status: Number(this.status),
          isHotcard: Number(this.isHotcard),
          launchPosition: this.launchPosition,
          name: this.name,
          orderby: Number(this.orderby) || 0,
          moneyStr: this.moneyStr,
          superscript: this.superscript,
          basicCount: Number(this.basicCount),
          logo: this.logo,
          promotionPosterUrl: this.promotionPosterUrl,
          wxAppid: this.wxAppid,
          applyPosterUrl: this.applyPosterUrl,
          descriptionList: this.descriptionList,
          description: this.description,
          officialRemark: this.officialRemark,
          applyCount: Number(this.applyCount)
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        this.loading = 0;
        if (d.code === 0) {
          this.$notify({
            title: `新建成功`,
            type: "success",
            position: "bottom-right"
          });
          this.$router.push(`creditcardaddnext?id=${d.data.data.id}`);
        }
      });
    },
    reg() {
      if (!this.name) {
        this.$notify({
          title: `银行名称呢？`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.logo) {
        this.$notify({
          title: `列表图没上传！`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.description) {
        this.$notify({
          title: `银行/卡描述呢？`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.officialRemark) {
        this.$notify({
          title: `请输入文案说明~`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.applyCount) {
        this.$notify({
          title: `请输入申请人总数~`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.description) {
        this.$notify({
          title: `奖金呢？`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.promotionPosterUrl) {
        this.$notify({
          title: `海报图还没上传哦`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      if (!this.applyPosterUrl) {
        this.$notify({
          title: `详情页图没上传。。。`,
          type: "warning",
          position: "bottom-right"
        });
        this.loading = 0;
        return false;
      }
      return true;
    },
    del(id) {
      this.descriptionList.splice(id, 1);
    },
    toCAdd() {
      this.descriptionList.push({
        title: "",
        description: "",
        type: 0
      });
    },
    toBAdd() {
      this.descriptionList.push({
        title: "",
        description: "",
        type: 1
      });
    },
    // 上传列表LOGO
    upSuccess(res) {
      this.logo = process.env.QN_IMG_DOMAIN + res.key;
    },
    handleRemove(file, fileList) {
      this.logo = "";
    },
    // 上传海报
    upSuccess2(response, file, fileList) {
      this.promotionPosterUrl = process.env.QN_IMG_DOMAIN + response.key;
    },
    handleRemove2(file, fileList) {
      this.promotionPosterUrl = "";
    },
    // 详情页
    upSuccess3(response, file, fileList) {
      this.applyPosterUrl = process.env.QN_IMG_DOMAIN + response.key;
    },
    handleRemove3(file, fileList) {
      this.applyPosterUrl = "";
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
  transition 0.3s
  &:hover
    width 610px
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
