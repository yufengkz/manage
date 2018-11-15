<template>
    <div>
        <div class="tabs">
            <div class="breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: 'activity' }">猜题活动</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '' }">编辑</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="activity" v-loading='tableLoading1'>
                <div class="inputs">
                    <label>题目时间：</label>
                    <el-date-picker v-model="useTime" type="date" placeholder="选择日期" size="mini"></el-date-picker>
                </div>
                <div class="inputs">
                    <label>题目：</label>
                    <el-input size='mini' v-model="content" placeholder="请输入题目"></el-input>
                </div>
                <div class="inputs">
                    <label>状态：</label>
                    <el-radio v-model="status" :label="0">禁用</el-radio>
                    <el-radio v-model="status" :label="1">启动</el-radio>
                </div>
                <div class="inputs">
                    <label>活动ID：</label>
                    <el-input size='mini' v-model="marketCampaignId" placeholder="请输入活动ID"></el-input>
                </div>
                <div class="inputs">
                    <label>题目类型：</label>
                    <el-input size='mini' v-model="title" placeholder="请输入标题类型"></el-input>
                </div>
                <div class="inputs">
                    <label>答案A：</label>
                    <el-input size='mini' v-model="resultOptionsA" placeholder="请输入答案A"></el-input>
                </div>
                <div class="inputs">
                    <label>答案B：</label>
                    <el-input size='mini' v-model="resultOptionsB" placeholder="请输入答案B"></el-input>
                </div>
                <div class="inputs">
                    <label>答案C：</label>
                    <el-input size='mini' v-model="resultOptionsC" placeholder="请输入答案C"></el-input>
                </div>
                <div class="inputs">
                    <label>答案D：</label>
                    <el-input size='mini' v-model="resultOptionsD" placeholder="请输入答案D"></el-input>
                </div>
                <div class="inputs">
                    <label>正确答案：</label>
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox label="A"></el-checkbox>
                        <el-checkbox label="B"></el-checkbox>
                        <el-checkbox label="C"></el-checkbox>
                        <el-checkbox label="D"></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="inputs">
                    <label>本场展示奖金(分)：</label>
                    <el-input size='mini' v-model="bonusStr" placeholder="请输入本场展示奖金"></el-input>
                </div>
                <div class="inputs">
                    <label>本场实际奖金(分)：</label>
                    <el-input size='mini' v-model="bonus" placeholder="请输入本场实际奖金"></el-input>
                </div>

                <div class="btns">
                    <el-button type='primary' size="small" @click='submit'>提交</el-button>
                    <el-button size="small" @click="$router.push('/activity')">返回</el-button>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      useTime: null,
      marketCampaignId: null,
      content: null,
      status: 1,
      title: null,
      resultOptionsA: null,
      resultOptionsB: null,
      resultOptionsC: null,
      resultOptionsD: null,
      checkList: [],
      bonusStr: null,
      bonus: null,
      tableData1: [],
      tableLoading1: false,
      // 分页
      pageSize: 20,
      pageTotal1: 0,
      currentPage1: 1,
      urls: {
        update: "guessQuestion/update",
        getGuessQuestion: "guessQuestion/getGuessQuestion"
      }
    };
  },
  mounted() {},
  methods: {
    submit() {
      this.tableLoading1 = true;
      let resultOptions=[];
      [
        this.resultOptionsA,
        this.resultOptionsB,
        this.resultOptionsC,
        this.resultOptionsD
      ].map(i => !!i && resultOptions.push(i));
      let body = {
        url: this.urls.update,
        method: "PATCH",
        data: {
          id: this.$route.query.id,
          useTime: this.useTime,
          content: this.content,
          marketCampaignId: this.marketCampaignId,
          status: this.status,
          title: this.title,
          resultOptions: resultOptions.join("|"),
          answer: this.checkList.sort().join(","),
          bonusStr: this.bonusStr,
          bonus: this.bonus
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        if (d.data.data === 1) {
          this.notify("修改成功");
          this.$router.push("/activity");
        }
        if (d.data.data === 0) {
          this.notify("修改失败");
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    getDetail() {
      this.tableLoading1 = true;
      let body = {
        url: this.urls.getGuessQuestion,
        data: {
          id: this.$route.query.id
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.useTime = d.data.data.useTime.substring(0, 10);
          this.content = d.data.data.content;
          this.marketCampaignId = d.data.data.marketCampaignId;
          this.status = d.data.data.status;
          this.title = d.data.data.title;
          let options = d.data.data.resultOptions.split("|");
          if (options[0]) this.resultOptionsA = options[0];
          if (options[1]) this.resultOptionsB = options[1];
          if (options[2]) this.resultOptionsC = options[2];
          if (options[3]) this.resultOptionsD = options[3];
          this.checkList = d.data.data.answer.split(",");
          this.bonusStr = d.data.data.bonusStr;
          this.bonus = d.data.data.bonus;
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style scoped lang="stylus">
.breadcrumb
    margin 10px 0 20px
    padding-bottom 10px
    border-bottom 1px solid #eee
.activity
    background #fff
    padding 10px 20px 20px
    border 1px solid #e4e5e7
    min-height 800px
    .inputs
        display flex
        align-items center
        margin-bottom 20px
        label
            width 120px
            font-size 14px
            text-align right
            color #444
            &.el-radio, &.el-checkbox
                width auto
        .el-input
            width 500px
    .btns
        width 500px
        margin-top 40px
        text-align center
</style>
