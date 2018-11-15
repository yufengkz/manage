<template>
  <div class="setting" v-loading='tableLoading1'>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>页面配置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '' }">信用卡推广页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="module botm_line">
      <div class="tit">
        <div class="con">信用卡推广配置 <span>{{spreadBanks.length}}个</span></div>
      </div>
      <div class="box" v-for="(i,k) in spreadBanks" :key="i.id">
        <!-- <div class="left">{{i.spreadName}}：</div> -->
        <div class="right">
          <div class="input edit">
            <label>选择银行：</label>
            <el-select v-model="i.relatedBankId" placeholder="请选择" @change="search">
              <el-option v-for="item in banks" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div class="btns">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(i.id)">删除</el-button>
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="add(k)">添加</el-button>
            </div>
          </div>
          <div class="input">
            <label>名称：</label>
            <el-input size="mini" v-model="i.spreadName" placeholder="请输入名称"></el-input>
          </div>
          <div class="input">
            <label>排序：</label>
            <el-input size="mini" v-model="i.orderNum" placeholder="请输入排序"></el-input>
          </div>
          <div class="input">
            <label>icon：</label>
            <el-input size="mini" v-model="i.spreadLogo" placeholder="请输入icon"></el-input>
          </div>
          <div class="input">
            <label>文案：</label>
            <div class="input_box">
              <el-input v-for="(j,k2) in i.spreadDesc" :key="k2" size="mini" v-model="j.txt" :placeholder="'请输入文案'+(k2+1)"></el-input>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="module botm_line">
      <div class="tit">
        <div class="con">说明文案编辑</div>
      </div>
      <div class="input" v-for="(i,k) in spreadDescs" :key="k">
        <label>文案{{i.orderNum}}：</label>
        <el-input size="mini" v-model="i.content" :placeholder="'请输入文案'+i.orderNum"></el-input>
      </div>
    </div>

    <div class="save">
      <el-button type="primary" @click="save">保存</el-button>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      spreadBanks: [],
      spreadDescs: [],
      banks: [],
      bankId: null,
      tableLoading1: 1,
      urls: {
        // 列表
        creditCardPromotion: "creditCardPromotion/get",
        publishPromotion: "creditCardPromotion/publish",
        removeBankCards: "creditCardPromotion/removeBankCards",
        cards: "cards/"
      }
    };
  },
  created() {
    this.getInfo();
    this.getBank();
  },
  methods: {
    save() {
      this.tableLoading1 = true;
      // 数据处理
      let spreadBanks = this.spreadBanks.map(({ spreadDesc, ...rest }) => ({
        spreadDesc: spreadDesc.map(i => i.txt).join("|"),
        ...rest
      }));
      let body = {
        url: this.urls.publishPromotion,
        method: "put",
        data: {
          spreadBanks: spreadBanks,
          spreadDescs: this.spreadDescs
        }
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.notify("保存成功");
          this.getInfo();
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    del(id) {
      this.tableLoading1 = true;
      let body = {
        url: this.urls.removeBankCards,
        method:'delete',
        data:{
          datas:[id]
        }
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.getInfo()
          this.notify('删除成功')
        }
        // 表格数据
        this.tableLoading1 = false;
      }).catch(this.tableLoading1 = false);
    },
    add(k) {
      let i = 4,
        j = [];
      while (i--) j.push({ txt: "" });
      this.spreadBanks.splice(k + 1, 0, {
        orderNum: null,
        relatedBankId: null,
        spreadDesc: j,
        spreadLogo: null,
        spreadName: null
      });
    },
    getInfo() {
      let body = {
        url: this.urls.creditCardPromotion
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          // 将数组中spreadDesc改为：核卡成功|通过率30%|100元|每周自动结算 => [{txt:核卡成功},{txt:通过率30%}...]
          this.spreadBanks = d.data.spreadBanks.map(
            ({ spreadDesc, ...rest }) => ({
              spreadDesc: spreadDesc.split("|").map(i => ({ txt: i })),
              ...rest
            })
          );

          this.spreadDescs = d.data.spreadDescs;
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    //获取银行列表
    getBank() {
      let body = {
        url: this.urls.cards,
        data: {
          pageSize: 666
        }
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          // 将数组改为：[{value: id,label: name}...]
          this.banks = d.data.dataList.map(({ id, name }) => ({value: id,label: name}));

        }
        this.tableLoading1 = false;
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.setting
  background #fff
  padding 10px 20px 20px
  border 1px solid #e4e5e7
  min-height 800px
  color #444
  .breadcrumb
    margin 10px 0 20px
    padding-bottom 10px
    border-bottom 1px solid #eee
  .botm_line
    padding-bottom 20px
    border-bottom 1px solid #eeeeee
  .box
    display flex
    margin-top 16px
    padding-bottom 16px
    width 888px
    border-bottom 1px dotted #ccc
    .left
      font-size 14px
      padding-top 14px
      width 88px
      word-break break-all
  .module
    padding 15px 0
    .tit
      display flex
      width 800px
      .con
        flex 1
        font-size 20px
        margin-bottom 6px
        span
          padding-left 10px
          font-size 12px
      .btns
        flex 1
        display flex
        align-items flex-end
        justify-content flex-end
        .el-button
          padding-left 10px
          font-size 12px
    .notify
      width 800px
      margin-top 15px
    .input
      width 800px
      display flex
      align-items center
      margin-top 10px
      position relative
      label
        width 80px
        text-align right
        font-size 14px
        &.start
          align-self flex-start
      .el-input
        flex 1
      .btns
        position absolute
        right 0
        top 0
      .input_box
        flex 1
        display flex
        .el-input
          margin-right 6px
    .avatar-uploader >>> img
      max-height 266px
      min-width auto
  .save
    width 800px
    text-align center
    margin-top 20px
    font-size 16px
</style>
