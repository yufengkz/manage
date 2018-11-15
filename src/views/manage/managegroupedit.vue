<template>
  <div>
    <div class="tabs">
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: 'managegroup' }">管理组</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 用户角色管理 -->
      <div class="manage" v-loading='tableLoading1'>
        <div class="input">
          <label>用户组名称:</label>
          <el-input v-model="name" placeholder="请输入内容" size='mini'></el-input>
        </div>
        <!-- 功能点选择 -->
        <el-tree :data="tree" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps" @check-change="handleCheckChange">
        </el-tree>
        <div class="btns">
          <el-button size='small' @click="setAll">全选</el-button>
          <el-button size='small' @click="reset">重置</el-button>
          <el-button type='primary' size='small' @click="create">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tree: [],
      name: null,
      tableLoading1: 0,
      defaultProps: {
        children: "rightList",
        label: "name"
      },
      urls: {
        detail: "roles/detail",
        create: "roles/create",
        modify: "roles/modify",
        rights: "rights/"
      }
    };
  },

  computed: {
    modify() {
      return !!this.$route.query.id;
    }
  },

  methods: {
    handleCheckChange(d, on) {
      console.log(
        "⬇️️️️️️️️️️️️️⬇️️️️️️️️️️️️️⬇️️️️️️️️️️️️️⬇️️️️️️️️️️️️️⬇️️️️️️️️️️️️️⬇️️️️️️️️️️️️️⬇️️️️️️️️️️️️️⬇️️️️️️️️️️️️️⬇️️️️️️️️️️️️️⬇️️️️️️️️️️️️️"
      );
      console.log(`${on ? "选中" : "删除"}id: ${d.id}`);
      console.log(`当前选中功能点：${this.$refs.tree.getCheckedKeys()}`);
      console.log("⬆️️️⬆️️️⬆️️️⬆️️️⬆️️️⬆️️️⬆️️️⬆️️️⬆️️️⬆️️️");
    },
    reset() {
      this.$refs.tree.setCheckedKeys([]);
    },
    setAll() {
      this.$refs.tree.setCheckedKeys([0]);
    },
    create() {
      this.tableLoading1 = 1;
      let body = {
        url: this.modify ? this.urls.modify : this.urls.create,
        method: this.modify ? "PATCH" : "PUT",
        data: {
          name: this.name || "",
          rightIds: this.$refs.tree
            .getCheckedKeys()
            .filter(i => !String(i).match("hack"))
            .join(",")
        }
      };
      this.modify ? (body.data.id = this.$route.query.id) : "";

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.$router.push('/managegroup')
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    //获取身份审核列表
    getInfo() {
      let body = {
        url: this.urls.detail,
        data: {
          id: this.$route.query.id
        }
      };

      this.axios(body).then(res => {
        let d = res.data;
        if (d.code === 0) {
          this.$refs.tree.setCheckedKeys(d.data.rightIds.split(","));
          this.name = d.data.name;
        }
        // 表格数据
        this.tableLoading1 = false;
      });
    },
    getRights() {
      this.tableLoading1 = true;
      let that = this;
      let body = {
        url: this.urls.rights
      };
      this.axios(body).then(res => {
        if (res.data.code === 0) {
          res.data.data.map(i => (i.id += "hack"));
          this.tree = [{ id: 0, name: "全选", rightList: [...res.data.data] }];
          this.$route.query.id ? this.getInfo() : (this.tableLoading1 = false);
        }
      });
    }
  },
  mounted() {},
  created() {
    this.getRights();
  }
};
</script>

<style scoped lang="stylus">
.breadcrumb
  margin 10px 0 20px
  padding-bottom 10px
  border-bottom 1px solid #eee
.manage
  background #fff
  padding 10px 20px 20px
  border 1px solid #e4e5e7
  min-height 800px
  .input
    display flex
    align-items center
    position relative
    width 500px
    .el-input
      width auto
      margin 0 20px 0 10px
  .el-tree
    margin-top 20px
  .btns
    margin-top 20px
</style>
