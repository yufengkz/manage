<template>
	<div>
		<div class="tabs">
			<div class="breadcrumb">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item>文章管理</el-breadcrumb-item>
					<el-breadcrumb-item :to="{ path: '' }">优选文章</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<!-- 检索 -->
			<div class="media-manage-table material">
				<div class="search">
					<div>关键字：</div>
					<el-input v-model="keyword" @keyup.enter.native='search' placeholder="请输入内容" size="mini"></el-input>
					<div>文章ID：</div>
					<el-input v-model="searchID" @keyup.enter.native='search' placeholder="请输入内容(精准搜索)"
					          size="mini"></el-input>
					<el-button type="primary" size="mini" @click="search">检索</el-button>
					<el-button class='addArticle' type='primary' size='mini' @click="$router.push('/pickedadd')">添加文章
					</el-button>
				</div>
				<!-- 列表 -->
				<el-table ref="multipleTable" v-loading='tableLoading1' :data="tableData1" key="table1"
				          @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="id" label="ID"></el-table-column>
					<el-table-column prop="title" label="标题"></el-table-column>
					<el-table-column prop="creator" label="发布者"></el-table-column>
					<el-table-column prop="createdTime" label="发布时间"></el-table-column>
					<el-table-column prop="viewCount" label="点击"></el-table-column>
					<el-table-column prop="uv" label="uv"></el-table-column>
					<el-table-column prop="shareCount" label="分享次数"></el-table-column>
					<el-table-column prop="friendCircleCount" label="朋友圈分享次数"></el-table-column>
					<el-table-column prop="wechatCount" label="微信分享次数"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="ban(scope.row)">
								{{scope.row.status===1?'正常':'禁用'}}
							</el-button>
							<el-button type="text" size="small" @click="$router.push('/pickededit?id='+scope.row.id)">
								编辑
							</el-button>
							<el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
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
				activeName: "1",
				searchID: "",
				keyword: "",
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
					// 列表
					articles: "articles/",
					// 删除
					delete: "articles/delete",
					// 禁用
					disable: "articles/disable"
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
					id: this.searchID
				};
				this.getList(body);
			},
			ban(row) {
				let body = {
					url: this.urls.disable,
					method: "PATCH",
					data: {
						id: row.id,
						status: row.status === 0 ? 1 : 0
					}
				};
				this.axios(body).then(res => {
					if (res.data.code === 0) {
						this.getList();
						this.$notify({title: `操作成功`, type: "success", position: "bottom-right"});
					}
				});
			},
			//获取身份审核列表
			getList(opt = {}) {
				this.tableLoading1 = true;
				let that = this;
				let body = {
					url: this.urls.articles,
					data: {
						classification: 3, // 优选文章
						pageSize: this.pageSize,
						pageNo: this.currentPage1
					}
				};
				if (opt.title) body.data.title = opt.title;
				if (opt.id) body.data.id = opt.id;

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
