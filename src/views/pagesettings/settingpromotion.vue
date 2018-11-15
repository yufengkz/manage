<template>
  <div class="setting" v-loading='tableLoading'>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>页面配置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '' }">信用卡推广页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 通知 -->
    <div class="module botm_line" v-loading='tableLoading1'>
      <div class="tit">
        <div class="con">通知<span>该模块配置为空时，前端不显示。</span></div>
        <div class="btns">
          <el-button type="primary" icon="el-icon-check" size="mini" @click="notiesPublic">通知发布</el-button>
        </div>
      </div>
      <el-input class="notify" size='mini' v-model="indexConfig.notieContent" placeholder="请输入通知"></el-input>
    </div>

    <!-- 邀请会员模块 -->
    <div class="module botm_line" v-loading='tableLoading2'>
      <div class="tit">
        <div class="con">邀请会员模块</div>
        <div class="btns">
          <el-button type="primary" icon="el-icon-check" size="mini" @click="invitingMembers">邀请会员发布</el-button>
        </div>
      </div>

      <div class="input">
        <label>模块标题：</label>
        <el-input size="mini" v-model="indexConfig.invitingMemberModuleName" placeholder="请输入模块标题"></el-input>
      </div>
      <div class="input">
        <label>主标题：</label>
        <el-input size="mini" v-model="indexConfig.invitingMemberPromotionMenuName" placeholder="请输入主标题"></el-input>
      </div>
      <div class="input">
        <label>副标题：</label>
        <el-input size="mini" v-model="indexConfig.invitingMemberPromotionMenuDesc" placeholder="请输入副标题"></el-input>
      </div>
      <div class="input">
        <label>H5链接：</label>
        <el-input size="mini" v-model="invitingMemberJumpUrls.url0" placeholder="请输入H5跳转链接"></el-input>
      </div>
      <div class="input">
        <label>Android链接：</label>
        <el-input size="mini" v-model="invitingMemberJumpUrls.url1" placeholder="请输入Android跳转链接"></el-input>
      </div>
      <div class="input">
        <label>iOS链接：</label>
        <el-input size="mini" v-model="invitingMemberJumpUrls.url2" placeholder="请输入iOS跳转链接"></el-input>
      </div>
      <div class="input">
        <label class="start">背景图：</label>
        <el-upload class="avatar-uploader" action="http://up.qiniu.com" :data='token' :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="indexConfig.invitingMemberIconImage" :src="indexConfig.invitingMemberIconImage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="input">
        <label class="start">背景小图标：</label>
        <el-upload class="avatar-uploader" action="http://up.qiniu.com" :data='token' :show-file-list="false" :on-success="handleAvatarSuccess2" :before-upload="beforeAvatarUpload">
          <img v-if="indexConfig.invitingMemberSmallIconImage" :src="indexConfig.invitingMemberSmallIconImage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>

    <!-- 业务推广模块 -->
    <div class="module botm_line" v-loading='tableLoading3'>
      <div class="tit">
        <div class="con">业务推广模块</div>
        <div class="btns">
          <el-button type="primary" icon="el-icon-check" size="mini" @click="businessPromotion">业务推广发布</el-button>
        </div>
      </div>
      <div class="input">
        <label>模块标题：</label>
        <el-input size="mini" v-model="indexConfig.businessPromotionModuleName" placeholder="请输入模块标题"></el-input>
      </div>

      <div class="box" v-for="(i,k) in indexConfig.promotions" :key="k">

        <div class="right">
          <div class="subTit">
            <div class="tit">{{k+1}}. {{i.promotionMenuName}}</div>
            <div class="btns">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(i.ids)">删除</el-button>
            </div>
          </div>
          <div class="input edit">
            <label>主标题：</label>
            <el-input size="mini" v-model="i.promotionMenuName" placeholder="请输入主标题"></el-input>

          </div>
          <div class="input">
            <label>副标题：</label>
            <el-input size="mini" v-model="i.promotionMenuDesc" placeholder="请输入副标题"></el-input>
          </div>
          <div class="input">
            <label>H5链接：</label>
            <el-input size="mini" v-model="i.jumpUrlsCopy.url0" placeholder="请输入副标题"></el-input>
          </div>
          <div class="input">
            <label>Android链接：</label>
            <el-input size="mini" v-model="i.jumpUrlsCopy.url1" placeholder="请输入副标题"></el-input>
          </div>
          <div class="input">
            <label>iOS链接：</label>
            <el-input size="mini" v-model="i.jumpUrlsCopy.url2" placeholder="请输入副标题"></el-input>
          </div>
          <div class="input imgPreview">
            <label>图片：</label>
            <el-input size="mini" v-model="i.iconImage" placeholder="请输入图片链接"></el-input>
            <img class="img" :src="i.iconImage" alt="">
          </div>
          </div>
        </div>

      </div>

      <!-- 会员福利模块 -->
      <div class="module botm_line benefit" v-loading='tableLoading4'>
        <div class="tit">
          <div class="con">会员福利模块</div>
          <div class="btns">
            <el-button type="primary" icon="el-icon-check" size="mini" @click="benefits">会员福利发布</el-button>
          </div>
        </div>·
        <div class="input">
          <label>模块标题：</label>
          <el-input size="mini" v-model="indexConfig.benefitModuleName" placeholder="请输入模块标题"></el-input>
        </div>

        <div class="box" v-for="(i,k) in indexConfig.benefits" :key="k">

          <div class="right">
            <div class="subTit">
              <div class="tit">{{k+1}}. {{i.title}}</div>
              <div class="btns">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="benefitDel(i.ids)">删除</el-button>
              </div>
            </div>
            <div class="input edit">
              <label>主标题：</label>
              <el-input size="mini" v-model="i.title" placeholder="请输入主标题"></el-input>

            </div>
            <div class="input">
              <label>副标题：</label>
              <el-input size="mini" v-model="i.desc" placeholder="请输入副标题"></el-input>
            </div>
            <div class="input">
              <label>右侧文案：</label>
              <el-input size="mini" v-model="i.linkTips" placeholder="请输入右侧文案"></el-input>
            </div>
            <div class="input">
              <label>H5链接：</label>
              <el-input size="mini" v-model="i.jumpUrlsCopy.url0" placeholder="请输入副标题"></el-input>
            </div>
            <div class="input">
              <label>Android链接：</label>
              <el-input size="mini" v-model="i.jumpUrlsCopy.url1" placeholder="请输入副标题"></el-input>
            </div>
            <div class="input">
              <label>iOS链接：</label>
              <el-input size="mini" v-model="i.jumpUrlsCopy.url2" placeholder="请输入副标题"></el-input>
            </div>
            <div class="input imgPreview">
              <label>图标：</label>
              <el-input size="mini" v-model="i.iconUrl" placeholder="请输入图标链接"></el-input>
              <img class="img" :src="i.iconUrl" alt="">
          </div>
            </div>
          </div>

        </div>

        <!-- 会员必读模块 -->
        <div class="module botm_line">
          <div class="tit">
            <div class="con">会员必读模块</div>
            <div class="btns">
              <el-button type="primary" icon="el-icon-check" size="mini" @click="memberMustRead">会员必读发布</el-button>
            </div>
          </div>

          <div class="input">
            <label>模块标题：</label>
            <el-input size="mini" v-model="indexConfig.memberMustReadModuleName" placeholder="请输入模块标题"></el-input>
          </div>

        </div>

      </div>
</template>
<script>
export default {
  data() {
    return {
      // 上传图片凭证
      token: { token: null },
      indexConfig: {},
      tableLoading: 1,
      // 通知
      tableLoading1: 0,
      // 邀请会员发布
      tableLoading2: 0,
      invitingMemberJumpUrls: {},
      // 业务推广
      tableLoading3: 0,
      // 会员福利
      tableLoading4: 0,
      // 会员必读
      read: {
        moduleName: null
      },
      //
      urls: {
        indexConfig: "indexConfig/get",
        noties: "noties/publish",
        invitingMembers: "invitingMembers/modify",
        // 业务推广发布
        businessPromotion: "businessPromotion/modify",
        // 业务推广禁用启用
        isEnabled: "businessPromotion/isEnabled",
        // 会员福利发布
        benefits: "benefits/modify",
        // 会员福利禁用
        benefitsIsEnabled: "benefits/isEnabled",
        memberMustRead: "memberMustRead/modify"
      }
    };
  },
  created() {
    Promise.all([this.getToken(), this.getIndexConfig()])
      .then((this.tableLoading = 0))
      .catch((this.tableLoading = 0));
  },
  methods: {
    // 通知
    notiesPublic() {
      this.tableLoading1 = true;
      let body = {
        url: this.urls.noties,
        method: "PUT",
        data: {
          id: this.indexConfig.notieId || "",
          content: this.indexConfig.notieContent
        }
      };

      this.axios(body)
        .then(res => {
          let d = res.data;
          if (d.code === 0) {
            this.notify("通知发布成功");
          }
          this.tableLoading1 = false;
        })
        .catch((this.tableLoading1 = false));
    },
    // 邀请会员
    invitingMembers() {
      this.tableLoading2 = true;
      let body = {
        url: this.urls.invitingMembers,
        method: "PATCH",
        data: {
          moduleId: this.indexConfig.invitingMemberModuleId,
          moduleName: this.indexConfig.invitingMemberModuleName,
          promotionMenuName: this.indexConfig.invitingMemberPromotionMenuName,
          promotionMenuDesc: this.indexConfig.invitingMemberPromotionMenuDesc,
          iconImage: this.indexConfig.invitingMemberIconImage,
          smallIconImage: this.indexConfig.invitingMemberSmallIconImage,
          jumpUrls: Object.values(this.invitingMemberJumpUrls)
            .filter(i => !!i)
            .join("|")
        }
      };

      this.axios(body)
        .then(res => {
          let d = res.data;
          if (d.code === 0) this.notify("邀请会员发布成功");
          this.tableLoading2 = false;
        })
        .catch((this.tableLoading2 = false));
    },
    // 业务推广
    businessPromotion() {
      this.tableLoading3 = true;
      // 链接处理
      this.indexConfig.promotions.map(
        i => (i.jumpUrls = Object.values(i.jumpUrlsCopy).join("|"))
      );
      let body = {
        url: this.urls.businessPromotion,
        method: "PATCH",
        data: {
          moduleId: this.indexConfig.businessPromotionModuleId,
          moduleName: this.indexConfig.businessPromotionModuleName,
          promotions: this.indexConfig.promotions
        }
      };

      this.axios(body)
        .then(res => {
          let d = res.data;
          if (d.code === 0) this.notify("业务推广发布成功");
          this.tableLoading3 = false;
        })
        .catch((this.tableLoading3 = false));
    },
    // 业务推广禁用
    del(id) {
      let body = {
        url: this.urls.isEnabled,
        method: "PATCH",
        data: {
          ids: id,
          status: 2
        }
      };
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.tableLoading3 = true;
        this.axios(body)
          .then(res => {
            let d = res.data;
            this.getIndexConfig();
            if (d.code === 0) this.notify("删除成功");
            this.tableLoading3 = false;
          })
          .catch((this.tableLoading3 = false));
      });
    },
    // 会员福利发布
    benefits() {
      this.tableLoading4 = true;
      // 链接处理
      this.indexConfig.benefits.map(
        i => (i.jumpUrls = Object.values(i.jumpUrlsCopy).join("|"))
      );
      let body = {
        url: this.urls.benefits,
        method: "PATCH",
        data: {
          moduleId: this.indexConfig.benefitModuleId,
          moduleName: this.indexConfig.benefitModuleName,
          benefits: this.indexConfig.benefits
        }
      };

      this.axios(body)
        .then(res => {
          let d = res.data;
          if (d.code === 0) {
            this.notify("会员福利发布成功");
          }
          this.tableLoading4 = false;
        })
        .catch((this.tableLoading4 = false));
    },
    // 会员福利禁用
    benefitDel(ids) {
      let body = {
        url: this.urls.benefitsIsEnabled,
        method: "PATCH",
        data: {
          moduleId: "3",
          status: 0,
          ids: ids
        }
      };
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.tableLoading4 = true;
        this.axios(body)
          .then(res => {
            let d = res.data;
            this.getIndexConfig();
            if (d.code === 0) this.notify("删除成功");
            this.tableLoading4 = false;
          })
          .catch((this.tableLoading4 = false));
      });
    },
    // 会员必读
    memberMustRead() {
      this.tableLoading4 = true;
      let body = {
        url: this.urls.memberMustRead,
        method: "PATCH",
        data: {
          moduleId: this.indexConfig.memberMustReadModuleId,
          moduleName: this.indexConfig.memberMustReadModuleName
        }
      };

      this.axios(body)
        .then(res => {
          let d = res.data;
          if (d.code === 0) this.notify("会员必读发布成功");
          this.tableLoading4 = false;
        })
        .catch((this.tableLoading4 = false));
    },
    beforeAvatarUpload(res, file) {
      this.tableLoading = 1;
    },
    handleAvatarSuccess(res, file) {
      this.tableLoading2 = 0;
      this.iconImage = process.env.QN_IMG_DOMAIN + res.key;
    },
    handleAvatarSuccess2(res, file) {
      this.tableLoading2 = 0;
      this.smallIconImage = process.env.QN_IMG_DOMAIN + res.key;
    },
    getToken() {
      return new Promise((resolve, reject) => {
        let body = {
          url: process.env.imgToken,
          method: "post"
        };
        this.axios(body)
          .then(res => {
            let d = res.data;
            if (d.code === 0) {
              this.token.token = d.data.data;
              resolve();
            }
          })
          .catch(reject);
      });
    },
    getIndexConfig() {
      return new Promise((resolve, reject) => {
        let body = {
          url: this.urls.indexConfig
        };
        this.axios(body)
          .then(res => {
            let d = res.data;
            if (d.code === 0) {
              this.indexConfig = d.data;
              // 邀请会员跳转链接处理：url0,url1,url2对应：h5,android,ios
              this.indexConfig.invitingMemberJumpUrls
                .split("|")
                .map((i, k) => (this.invitingMemberJumpUrls["url" + k] = i));
              // 业务推广跳转链接处理
              this.indexConfig.promotions.map(i => (i.jumpUrlsCopy = {}));
              this.indexConfig.promotions.map(i =>
                i.jumpUrls
                  .split("|")
                  .map((j, k) => (i.jumpUrlsCopy["url" + k] = j))
              );

              // 会员福利跳转链接处理：url0,url1,url2对应：h5,android,ios
              this.indexConfig.benefits.map(i => (i.jumpUrlsCopy = {}));
              this.indexConfig.benefits.map(i =>
                i.jumpUrls
                  .split("|")
                  .map((j, k) => (i.jumpUrlsCopy["url" + k] = j))
              );
              resolve();
            }
          })
          .catch(reject);
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.imgPreview
  position relative
  .img
    position absolute
    right 0
    bottom 0
    max-width 300px
    transform translateX(110%)
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
    padding-bottom 40px
    // border-bottom 2px solid #666
  .module
    padding-top 30px
    width 800px
    .tit
      display flex
      width 800px
      border-bottom 1px solid #ddd
      padding-bottom 10px
      margin-bottom 10px
      .con
        flex 1
        color #000
        font-size 20px
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
      width 100%
      margin-top 15px
    .input
      width 100%
      display flex
      align-items center
      margin-top 15px
      label
        width 98px
        text-align right
        font-size 14px
        &.start
          align-self flex-start
      .el-input
        flex 1
    .avatar-uploader >>> img
      max-height 266px
      min-width auto
  .box
    display flex
    margin-top 10px
    padding-bottom 26px
    border-bottom 1px dotted #ccc
    position relative
    padding-top 20px
    .subTit
      display flex
      font-size 18px
      .tit
        border 0
    .right
      width 100%
</style>
