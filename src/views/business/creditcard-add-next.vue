<template>
  <div>
    <div class="add next">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>业务管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: 'creditcard' }">信用卡</el-breadcrumb-item>
          <el-breadcrumb-item>新增</el-breadcrumb-item>
          <el-breadcrumb-item>链接管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 检索 -->
      <div class="item" v-for="i in datasList" :key="i.id">
        <div class="inputs">
          <label>*上游：</label>
          <el-input size='mini' v-model="i.channelId" placeholder="请输入"></el-input>
        </div>
        <div class="inputs">
          <label>*URL：</label>
          <el-input size='mini' v-model="i.applyUrl" placeholder="请输入"></el-input>
        </div>
        <div class="inputs">
          <label>*权重：</label>
          <el-input size='mini' type="number" v-model="i.weight" placeholder="请输入"></el-input>
        </div>
        <div class="inputs">
          <label>*出价（分）：</label>
          <el-input size='mini' type="number" v-model="i.commission" placeholder="请输入"></el-input>
        </div>
        <div class="inputs">
          <label>*进价（分）：</label>
          <el-input size='mini' type="number" v-model="i.dividend" placeholder="请输入"></el-input>
        </div>
        <div class="inputs">
          <label>*显示范围：</label>
          <el-radio v-model="i.launchPosition" label="lanjinrong">蓝金融</el-radio>
          <el-radio v-model="i.launchPosition" label="kalingling">快卡精灵</el-radio>
          <el-radio v-model="i.launchPosition" label="lanjinrong_kalingling">蓝金融和快卡精灵</el-radio>
        </div>
        <div class="inputs">
          <label>*状态：</label>
          <el-radio v-model="i.status" :label="0">正常</el-radio>
          <el-radio v-model="i.status" :label="1">禁用</el-radio>
        </div>
        <el-button class="del" v-if="datas.length>1" type="text" size="small" @click="del(i.id)">删除</el-button>
      </div>
      <el-button class="addbtn" type="text" size="small" @click="add">增加上游</el-button>
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
      datas: [
        {
          channelId: "",
          applyUrl: "",
          weight: 0,
          dividend: "",
          commission: "",
          launchPosition: "lanjinrong",
          status:0
        }
      ],
      urls: {
        saveUrls: "cards/saveUrls/"
      }
    };
  },
  computed: {
    datasList() {
      return this.datas.map((i, key) => {
        i.id = key;
        return i;
      });
    }
  },
  methods: {
    submit() {
      this.loading = 1;
      if (!this.reg()) return;
      let body = {
        url: this.urls.saveUrls,
        method: "put",
        data: {
          bankId: this.$route.query.id,
          datas: this.datas
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
          this.$router.push("creditcard");
        }
      });
    },
    reg() {
      for (let i of this.datas) {
        if (!i.channelId) {
          this.$notify({
            title: `上游呢？`,
            type: "warning",
            position: "bottom-right"
          });
          this.loading = 0;
          return false;
        }
        if (!i.applyUrl) {
          this.$notify({
            title: `URL呢？`,
            type: "warning",
            position: "bottom-right"
          });
          this.loading = 0;
          return false;
        }
        if (i.weight==='') {
          this.$notify({
            title: `权重呢？`,
            type: "warning",
            position: "bottom-right"
          });
          this.loading = 0;
          return false;
        }
        if (!i.dividend) {
          this.$notify({
            title: `进价呢？`,
            type: "warning",
            position: "bottom-right"
          });
          this.loading = 0;
          return false;
        }
        if (!i.commission) {
          this.$notify({
            title: `出价呢？`,
            type: "warning",
            position: "bottom-right"
          });
          this.loading = 0;
          return false;
        }
      }
      return true;
    },
    del(id) {
      this.datas.splice(id, 1);
    },
    add() {
      this.datas.push({
        channelId: "",
        applyUrl: "",
        weight: 0,
        dividend: "",
        commission: "",
        launchPosition: "lanjinrong",
        status:0
      });
    }
  },
  created() {}
};
</script>

<style scoped lang="stylus">
.item
  width 666px
  padding-bottom 10px
  margin-bottom 20px
  border-bottom 1px solid #eee
.next .inputs.range
  margin-bottom 0
.submit
  width 666px
  text-align center
  .el-button
    width 100px
    margin 50px auto 20px
.del, .addbtn
  width 620px
  display block
  text-align right
  position relative
  transition .3s
  &:hover
    width 610px
.del
  margin-bottom 0px
  padding-top 0
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
