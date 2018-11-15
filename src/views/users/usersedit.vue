<template>
	<div>
		<div class="tabs">
			<div class="breadcrumb">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item>用户管理</el-breadcrumb-item>
					<el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
					<el-breadcrumb-item>编辑用户</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<!-- 检索 -->
			<div class="users" v-loading='tableLoading1'>
				<div class="userTop">
					<div class="left">
						<div class="inputs">
							<label>姓名：</label>
							<el-input size='mini' :maxlength='15' v-model="realName" placeholder="请输入姓名"></el-input>
						</div>
						<div class="inputs">
							<label>电话：</label>
							<el-input size='mini' :maxlength='11' v-model="mobile" placeholder="请输入电话"></el-input>
						</div>
						<div class="inputs">
							<label>身份证：</label>
							<el-input size='mini' :maxlength='18' v-model="idNumber" placeholder="请输入标身份证"></el-input>
						</div>
						<div class="inputs">
							<label>昵称：</label>
							<el-input size='mini' :maxlength='16' v-model="wechatName" placeholder="请输入昵称"></el-input>
						</div>
						<div class="inputs">
							<label>工号：</label>
							<el-input disabled size='mini' v-model="workNumber" placeholder="暂无数据"></el-input>
						</div>
						<div class="inputs">
							<label>职务：</label>
							<el-input disabled size='mini' v-model="identityDes" placeholder="暂无数据"></el-input>
						</div>
						<div class="inputs">
							<label>上级id：</label>
							<el-input disabled size='mini' v-model="parentId" placeholder="暂无数据"></el-input>
						</div>
						<div class="inputs">
							<label>上级工号：</label>
							<el-input disabled size='mini' v-model="parentWorkNumber" placeholder="暂无数据"></el-input>
						</div>
						<div class="inputs">
							<label>直推会员数：</label>
							<el-input disabled size='mini' v-model="membersCount" placeholder="暂无数据"></el-input>
						</div>
						<div class="inputs">
							<label>直推办卡数：</label>
							<el-input disabled size='mini' v-model="bankCardSuccessCount" placeholder="暂无数据"></el-input>
						</div>
						<div class="inputs">
							<label>状态：</label>
							<el-radio v-model="status" :label="0">正常</el-radio>
							<el-radio v-model="status" :label="1">限制</el-radio>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*备注：<el-input size='mini' v-model="modifyDesc" placeholder="请输入昵称"></el-input>
						</div>
						<div class="inputs">
							<label>限制提现：</label>
							<el-switch v-model="limitCash" active-text="限制" inactive-text="正常" :active-value="true"
							           :inactive-value="false" @change="limitCashMethod">
							</el-switch>
						</div>
						<div class="inputs">
							<label>锁粉状态：</label>
							<el-button type="primary" size="small" @click="unlock">解除锁粉</el-button>
						</div>
					</div>
					<div class="right">
						<div class="item">
							<div class="tit">头像</div>
							<div class="img">
								<img :src="wechatAvatar" alt="">
							</div>
						</div>
						<div class="item">
							<div class="tit">二维码</div>
							<div class="img">
								<img :src="wechatQrcode" alt="">
							</div>
						</div>
					</div>
				</div>
				<div class="submit">
					<el-button type='primary' @click='submit'>保存</el-button>
				</div>
				<div class="logs">修改记录</div>
				<!-- 列表 -->
				<el-table ref="multipleTable" :data="modifyLogs" key="table1" @selection-change="handleSelectionChange">
					<el-table-column type="index" width="50"></el-table-column>
					<el-table-column prop="filedName" label="修改字段"></el-table-column>
					<el-table-column prop="oldValue" label="旧值"></el-table-column>
					<el-table-column prop="newValue" label="新值"></el-table-column>
					<el-table-column prop="modifierName" label="修改人"></el-table-column>
					<el-table-column prop="modifyDesc" label="备注"></el-table-column>
					<el-table-column prop="createdTime" label="修改时间"></el-table-column>
				</el-table>

			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				step: 1,
				activeName: "1",
				searchID: "",
				keyword: "",
				status: 0,
				oldStatus: '',
				modifyDesc: '',
				limitCash: 0,
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
					getCustomer: "customer/getCustomer",
					limitCash: "customer/limitCash",
					unLockFans: "customer/unLockFans",
					modify: "customer/modify"
				},
				// 多选
				multipleSelection: []
			};
		},
		mounted() {
			this.getList();
		},
		methods: {
			// 限制提现
			limitCashMethod() {
				this.tableLoading1 = true;
				let body = {
					url: this.urls.limitCash,
					data: {
						id: this.$route.query.id,
						limitCash: this.limitCash
					}
				};
				this.axios(body).then(res => {
					let d = res.data;
					if (d.code === 0) {
						this.notify("操作成功");
					}
					// 表格数据
					this.tableLoading1 = false;
				});
			},
			// 删除
			del(row) {
				let body = {
					url: this.urls.delete,
					method: "delete",
					data: {
						id: row.id
					}
				};
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					this.tableLoading1 = 1;
					this.axios(body).then(res => {
						if (res.data.code === 0) {
							this.getList();
							this.$notify({
								title: `删除成功`,
								type: "success",
								position: "bottom-right"
							});
						}
					});
				});
			},
			//获取身份审核列表
			getList(opt = {}) {
				this.tableLoading1 = true;
				let that = this;
				let body = {
					url: this.urls.getCustomer,
					data: {
						id: this.$route.query.id
					}
				};
				this.axios(body).then(res => {
					let d = res.data;
					if (d.code === 0) {
						Object.keys(d.data).map(key => (this[key] = d.data[key]));
						this.oldStatus = this.status  //存储页面加载时status的状态，当状态改变时不更改old的值以作为比较
						this.pageTotal1 = d.data.modifyLogs.length;
					}
					// 表格数据
					this.tableLoading1 = false;
				});
			},
			unlock() {
				this.tableLoading1 = true;
				let body = {
					url: this.urls.unLockFans,
					// method:'delete',
					data: {
						id: this.$route.query.id
					}
				};
				this.axios(body).then(res => {
					let d = res.data;
					if (d.code === 0) {
						this.notify("操作成功");
					}
					// 表格数据
					this.tableLoading1 = false;
				});
				// 已确认该用户原专属客服同意解除锁粉
			},
			submit() {
				if((this.oldStatus != this.status) && !this.modifyDesc) {
					this.$notify.error({
						title: '错误',
						message: '状态备注不能为空！'
					})
					return
				}
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
						idNumber: this.idNumber,
						modifyDesc: this.modifyDesc  //限制备注说明
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
				this.getList({pagesize: v});
			},
			handleCurrentChange1(v) {
				this.currentPage1 = v;
				this.getList({pagesize: v});
			}
		},
		created() {
			// 页码数
			let storagePageSize = localStorage.getItem("pageSize");
			if (storagePageSize) this.pageSize = Number(storagePageSize);
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
		.el-radio + .el-radio
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
