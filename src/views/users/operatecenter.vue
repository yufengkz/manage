<template>
  <div>
    <div class="tabs">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
          <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 检索 -->
      <div class="users" v-loading='tableLoading1'>
        <div class="userTop">
          <div class="left">
            <div class="inputs">
              <label>姓名：</label>
              <span>{{name}}</span>
            </div>
            <div class="inputs">
              <label>身份证：</label>
              <span>{{idCard||'-'}}</span>
            </div>
            <el-button type='primary' v-if="$route.query.operationCenter==='0'" @click='update'>升级为运营中心</el-button>
            <div class="logs" v-if="$route.query.operationCenter!=='0'">收入明细</div>
            <!-- 列表 -->
            <el-table ref="multipleTable" v-if="$route.query.operationCenter!=='0'" :data="tableData1" key="table1">
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column prop="id" label="ID">
              </el-table-column>
              <el-table-column prop="statDate" label="时间">
              </el-table-column>
              <el-table-column prop="totalIncome" label="个人收入">
              </el-table-column>
              <el-table-column prop="centerIncome" label="运营中心收入">
              </el-table-column>
              <el-table-column label="发放金额">
                <template slot-scope="scope">
                  <input v-if="scope.row.status===0" type="text" v-model="scope.row.actualSettle">
                  <span v-if="scope.row.status===1">{{scope.row.actualSettle}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="modifierName" label="操作">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.status===0" type="text" size="small" @click="pay(scope.row)">发放运营中心奖励</el-button>
                  <!-- <span v-if="scope.row.status===0">待结算</span> -->
                  <span v-if="scope.row.status===1">运营中心奖励已发放</span>
                  <span v-if="![0,1,2,3].includes(scope.row.status)">{{scope.row.status+'?逗我？没有这个状态'}}</span>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      step: 1,
      name: "1",
      idCard: "",
      tableData1: [],
      tableLoading1: false,
      //消息
      msg: {
        // 大于99显示99+
        msg1: "",
        msg2: 2,
        msg3: "99+"
      },
      // 分页
      pageSize: 20,
      pageTotal1: 0,
      currentPage1: 1,
      urls: {
        queryCenterIncome: "customer/queryCenterIncome",
        upgradeCenter: "customer/upgradeCenter",
        centerSettle: "account/centerSettle"
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 升级为运营中心
    update() {
      let go = () => {
        this.tableLoading1 = true
        let body = {
          url: this.urls.upgradeCenter,
          method: "PATCH",
          data: {
            id: this.$route.query.id,
            centerLevel: 1
          }
        };
        this.axios(body).then(res => {
          if (res.data.code === 0) {
            this.tableLoading1 = false
            let href = window.location.href.split('operationCenter=')
            window.location.href = href[0]+'operationCenter=1'
            this.$notify({
              title: `升级成功`,
              type: "success",
              position: "bottom-right",
              duration: 5000
            });
          }
        });
      };
      const h = this.$createElement;
      this.$msgbox({
        title: `请确认  ${this.$route.query.name} 是否已经符合以下条件？`,
        message: h("div", null, [
          h("p", null, "1. 申请人本人必须为金融家V2"),
          h("p", null, "2. 直推5个以上（含5个）金融家V2"),
          h(
            "p",
            null,
            "3. 加入平台收入累计达到5W元(所有收入，包含红包收入、活动收入等)"
          ),
          h("p", null, "4. 有正规公司或个体户均可(商务线下操作)")
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "none"
      }).then(go);
    },
    // 发放运营中心奖励
    pay(row) {
      let pay = () => {
        let body = {
          url: this.urls.centerSettle,
          data: {
            id: row.id,
            actualSettle: ~~(Number(row.actualSettle) * 100) + ""
          }
        };
        this.axios(body).then(res => {
          if (res.data.code === 0) {
            this.getList()
            this.$notify({
              title: `发放成功`,
              type: "success",
              position: "bottom-right",
              duration: 5000
            });
          }
        });
      };

      this.$confirm(`已将 ${row.actualSettle} 元运营中心奖励转入该用户对公账户？`, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(pay);
    },
    //获取身份审核列表
    getList(opt = {}) {
      this.tableLoading1 = true;
      let that = this;
      let body = {
        url: this.urls.queryCenterIncome,
        data: {
          id: this.$route.query.id
        }
      };
      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          d.data.map(i=>i.actualSettle=i.actualSettle?i.actualSettle:0)
          this.tableData1 = d.data;
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    submit() {
      this.loading = 1;
      let body = {
        url: this.urls.modify,
        method: "PATCH",
        data: {
          id: this.$route.query.id,
          modifierId: this.$route.query.id,
          realName: this.realName,
          mobile: this.mobile,
          wechatName: this.wechatName,
          status: this.status,
          workNumber: this.workNumber,
          idNumber: this.idNumber
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
          this.$router.push(`users`);
        }
      });
    },
    // 多选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //  分页
    handleSizeChange1(v) {
      this.pageSize = v;
      localStorage.setItem("pageSize", v);
      this.getList({ pagesize: v });
    },
    handleCurrentChange1(v) {
      this.currentPage1 = v;
      this.getList({ pagesize: v });
    }
  },
  created() {
    // 页码数
    let storagePageSize = localStorage.getItem("pageSize");
    if (storagePageSize) this.pageSize = Number(storagePageSize);
    this.name = this.$route.query.name;
    this.idCard = this.$route.query.idCard;
  }
};
</script>

<style scoped lang="stylus">
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
    width 200px
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
