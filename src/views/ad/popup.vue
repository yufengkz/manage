<template>
	<div>
		<div class="tabs">
			<div class="breadcrumb">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item>弹窗管理</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<!-- 检索 -->
			<div class="media-manage-table material">
				<div class="search">
					<el-select v-model="type" placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-button type="primary" size="mini" @click="search">检索</el-button>

					<el-button class='addArticle' type='success' size='mini' @click="$router.push('/popup-edit')">创建弹窗</el-button>
				</div>
				<!-- 列表 -->
				<el-table ref="multipleTable" v-loading='tableLoading1' :data="tableData1" key="table1"
				          @selection-change="handleSelectionChange">
					<el-table-column type="index" width="36"></el-table-column>
					<el-table-column prop="alertGroup" label="用户"></el-table-column>
					<el-table-column prop="alertPosition" label="弹窗位置"></el-table-column>
					<el-table-column prop="alertRate" label="弹窗频率"></el-table-column>
					<el-table-column prop="level" label="优先级"></el-table-column>
					<el-table-column prop="imageUrl" label="弹窗图片">
						<template slot-scope='scope'>
							<a :href="scope.row.imageUrl" target="_blank">
								<img :src="scope.row.imageUrl" width="60" alt="">
							</a>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态">
						<template slot-scope='scope'>
							<span>{{scope.row.status}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="createdTime" label="创建时间">
						<!-- <template slot-scope='scope'>
						  {{scope.row.identity + ' - ' + scope.row.identityDes}}
						</template> -->
					</el-table-column>

					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="$router.push('/popup-edit?id=' + scope.row.id)">
								编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--分页-->
				<div class="tab-page">
					<el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
					               :current-page="currentPage1" :page-sizes="$root.globalData.pageSizes"
					               :page-size='pageSize' layout="total, sizes, ->, prev, pager, next"
					               :total='pageTotal1'>
					</el-pagination>
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
				type: 0,
				status: '',
				options: [
					{value: 0, label: '全部'},
					{value: 1, label: '启用'},
					{value: 2, label: '禁止'},
				],
				activeName: "1",
				searchID: "",
				keyword: "",
				mobile: "",
				workNumberS: "",
				tableData1: [],
				tableLoading1: false,
				wechatName: '',
				//消息
				msg: {
					// 大于99显示99+
					msg1: "",
					msg2: 2,
					msg3: "99+"
				},
				// 分页
				pageSize: 40,
				pageTotal1: 0,
				currentPage1: 1,
				urls: {
					// 列表
					articles: "alertManage/getAlertList",
					// 删除
					delete: "customer/delete"
				},
				// 多选
				multipleSelection: []
			};
		},
		mounted() {
			this.getList();
		},
		methods: {
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
			search() {
				let body = {
					title: this.keyword,
					id: this.searchID,
					workNumber: this.workNumberS,
					mobile: this.mobile,
					wechatName: this.wechatName,
				};
				this.getList(body);
			},
			//获取身份审核列表
			getList(opt = {}) {
				this.tableLoading1 = true;
				let that = this;
				let body = {
					url: this.urls.articles,
					data: {
						pageSize: this.pageSize,
						pageNo: this.currentPage1,
						status: this.type == 0 ? '' : this.type - 1
					}
				};
				Object.keys(opt).map(i => {
					console.log(opt);
					console.log(i);
					if (opt[i]) body.data[i] = opt[i];
				});

				this.axios(body).then(res => {
					let d = res.data;
					if (d.code === 0) {
						this.tableData1 = d.data.dataList;
						this.pageTotal1 = Number(d.data.totalCount);
					}
					// 表格数据
					this.tableLoading1 = false;
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
				console.log(this.multipleSelection);
			},
			//  分页
			handleSizeChange1(v) {
				this.pageSize = v;
				localStorage.setItem("pageSize", v);
				this.search();
			},
			handleCurrentChange1(v) {
				this.currentPage1 = v;
				this.search();
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
	.el-button + .el-button
		margin-left 0

	.el-select
		width 130px
		margin-right 10px

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
			.el-button
				margin-right 20px
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
