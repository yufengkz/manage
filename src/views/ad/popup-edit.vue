<template>
	<div>
		<div class="add" v-loading='loading'>
			<div class="breadcrumb">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item>文章管理</el-breadcrumb-item>
					<el-breadcrumb-item :to="{ path: '/popup' }">弹窗列表</el-breadcrumb-item>
					<el-breadcrumb-item>修改</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<!-- 检索 -->
			<div class="article">
				<div class="inputs">
					<label>选择用户：</label>
					<el-select v-model="data.alertGroup" placeholder="请选择">
						<el-option v-for="item in data.alterTypeGroups" :key="item.code" :label="item.name" :value="item.code"></el-option>
					</el-select>
				</div>
				<!--上传文件-->
				<div class="inputs" style="margin-left: 100px;" v-show="data.alertGroup == 101 ? true : false">
					<form>
						<el-upload class="upload-demo" :action='upFileUrl' :on-success='upSuccess' :on-error="upError" :on-remove="handleRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList" :headers='headers'>
							<el-button size="small" type="primary">上传文件</el-button>
							<span slot="tip" class="el-upload__tip"> Excel内字段名称必须与后台字段名称一致</span>
						</el-upload>
					</form>
				</div>
				<div class="inputs">
					<label>弹窗位置：</label>
					<el-select v-model="data.alertPosition" placeholder="请选择">
						<el-option v-for="item in data.alterTypePositions" :key="item.code" :label="item.name" :value="item.code">
						</el-option>
					</el-select>
				</div>
				<div class="inputs">
					<label>弹窗频率：</label>
					<el-select v-model="data.alertRate" placeholder="请选择">
						<el-option v-for="item in data.alterTypeRates" :key="item.code" :label="item.name" :value="item.code">
						</el-option>
					</el-select>
				</div>
				<div class="inputs">
					<label>优先级：</label>
					<el-select v-model="data.level" placeholder="请选择">
						<el-option v-for="item in data.alterTypeLeves" :key="item.code" :label="item.name" :value="item.code">
						</el-option>
					</el-select>
				</div>
				<div class="inputs">
					<label>弹窗图片(必填)：</label>
					<el-input size='mini' v-model="data.imageUrl" placeholder="请输入弹窗图片地址"></el-input>
				</div>
				<div class="inputs">
					<label>状态：</label>
					<el-switch v-model="data.status" active-text="禁用" inactive-text="启用" :active-value="1" :inactive-value="0" @change="limitCashMethod"></el-switch>
				</div>
				<div class="inputs">
					<label>按钮图片：</label>
					<el-input size='mini' v-model="data.jumpUrl.btnUrl" placeholder="请输入按钮图片地址"></el-input>
				</div>
				<div class="inputs">
					<label>跳转类型：</label>
					<el-radio v-model="data.jumpUrl.type" :label="0">原生</el-radio>
					<el-radio v-model="data.jumpUrl.type" :label="1">H5</el-radio>
				</div>
				<div class="inputs">
					<label>弹窗跳转配置：</label>
					<div class="source">
						<div style="border: 1px solid #eaeaea; padding: 20px; border-radius: 6px;">
							<label>IOS</label>
							<br>
							<br>
							<el-input size='mini' v-model="data.jumpUrl.iosUrl" placeholder="请输入弹窗跳转地址"></el-input>
							<br>
							<br>
							<label>标题：</label>
							<br>
							<br>
							<el-input size='mini' v-model="data.jumpUrl.iosTitle" placeholder="请输入title"></el-input>
							<br>
							<br>
							<label>版本控制(必填)：</label>
							<br>
							<br>
							<el-checkbox-group style="width:auto;" v-model="data.iosCheckList" @change="handleChecked">
								<el-checkbox v-for="item in data.versionIoss" :key="item.version" :label="item.version" :value="item.version"></el-checkbox>
							</el-checkbox-group>
							<br>
							<br>
							<label>跳转参数：</label>
							<br>
							<br>
							<el-input v-model="data.jumpUrl.iosPar" type="textarea" placeholder="请输入参数,实例：{a: 1, b: 2}, 符号为英文符号。"></el-input>
						</div>
						<div style="border: 1px solid #eaeaea; padding: 20px; border-radius: 6px;">
							<label>Android</label>
							<br>
							<br>
							<el-input size='mini' v-model="data.jumpUrl.androidUrl" placeholder="请输入弹窗跳转地址"></el-input>
							<br>
							<br>
							<label>标题：</label>
							<br>
							<br>
							<el-input size='mini' v-model="data.jumpUrl.androidTitle" placeholder="请输入title"></el-input>
							<br>
							<br>
							<label>版本控制(必填)：</label>
							<br>
							<br>
							<el-checkbox-group v-model="data.androidCheckList" @change="handleChecked">
								<el-checkbox v-for="item in data.versionAndroids" :key="item.version" :label="item.version" :value="item.version"></el-checkbox>
							</el-checkbox-group>
							<br>
							<br>
							<label>跳转参数：</label>
							<br>
							<br>
							<el-input v-model="data.jumpUrl.androidPar" type="textarea" placeholder="请输入参数,实例：{a: 1, b: 2}, 符号为英文符号。"></el-input>
						</div>
						<div style="border: 1px solid #eaeaea; padding: 20px; border-radius: 6px;">
							<label>H5</label>
							<br>
							<br>
							<el-input size='mini' v-model="data.jumpUrl.h5Url" placeholder="请输入弹窗跳转地址"></el-input>
							<br>
							<br>
							<label>标题：</label>
							<br>
							<br>
							<el-input size='mini' v-model="data.jumpUrl.h5Title" placeholder="请输入title"></el-input>
							<br>
							<br>
							<label>版本控制(必填)：</label>
							<br>
							<br>
							<el-checkbox-group v-model="data.H5CheckList" @change="handleChecked">
								<el-checkbox v-for="item in data.versionH5s" :key="item.version" :label="item.version" :value="item.version"></el-checkbox>
							</el-checkbox-group>

							{{data.jumpUrl.versionH5s}}
						</div>
					</div>
				</div>

				<div class="submit">
					<el-button type='primary' @click='submit'>提交</el-button>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
	import { getCookie } from "../../../src/api/index";
	export default {
		data() {
			return {
				data: {
					alterTypeGroups: [], //用户组
					alterTypePositions: [], //弹窗位置
					alterTypeRates: [], //弹窗频率
					alterTypeLeves: [], //优先级
					id: '', alertGroup: '', alertPosition: '', alertRate: '', level: '', imageUrl: '', status: '', androidFilter: '', iosFilter: '',
					h5Filter: '', tempAlertId: '', androidUrl: '', iosUrl: '', h5Url: '', androidPar: '', iosPar: '', h5Par: '', jumpUrl: {btnUrl: '', type: 1},
					iosCheckList: [], androidCheckList: [], H5CheckList: []
				},
				//
				urls: {
					// 查询
					getArticle: "alertManage/getDetailAndType",
					// 修改
					subUrl: "alertManage/createOrModifyAlert"
				},
				token: {token: null},
				loading: 1,
				/*测试上传图片的接口，返回结构为{url:''}*/
				upFileUrl: `${process.env.API_ROOT}alertManage/upExcel`,
				fileList: [],
				headers: {
					token: getCookie("token")
				},

				//提交数据
				subData: {}
			};
		},
		created() {
			this.getToken();
			this.getArticle();
		},
		methods: {
			// 获取数据
			getArticle() {
				let body = {
					url: this.urls.getArticle,
					data: {
						id: this.$route.query.id || ''
					}
				}
				this.loading = 0

				this.axios(body).then(res => {
					let d = res.data
					if (d.code === 0) {
						Object.keys(d.data).map(key => (this.data[key] = d.data[key]))
						//单独处理版本号
						this.data.iosCheckList = d.data.iosFilter ? d.data.iosFilter.split(',') : []
						this.data.androidCheckList = d.data.androidFilter ? d.data.androidFilter.split(',') : []
						this.data.H5CheckList = d.data.h5Filter ? d.data.h5Filter.split(',') : []
						this.loading = 0
					}
					// 表格数据
					this.tableLoading1 = false
				})
			},
			//提交数据
			submit(){
				let body = {
					url: this.urls.subUrl,
					data: {
						id: this.data.id, alertGroup: this.data.alertGroup, alertPosition: this.data.alertPosition, alertRate: this.data.alertRate, level: this.data.level,
						imageUrl: this.data.imageUrl, status: this.data.status ? 1 : 0,
						androidFilter: this.data.androidCheckList.join(','), iosFilter: this.data.iosCheckList.join(','), h5Filter: this.data.H5CheckList.join(','),  //版本号
						tempAlertId: this.data.tempAlertId,
						btn: {
							androidUrl: this.data.jumpUrl.androidUrl, iosUrl: this.data.jumpUrl.iosUrl,
							h5Url: this.data.jumpUrl.h5Url, type: this.data.jumpUrl.type, androidPar: this.data.jumpUrl.androidPar, iosPar: this.data.jumpUrl.iosPar,
							h5Par: this.data.jumpUrl.h5Par, btnUrl: this.data.jumpUrl.btnUrl,
							iosTitle: this.data.jumpUrl.iosTitle, androidTitle: this.data.jumpUrl.androidTitle, h5Title: this.data.jumpUrl.h5Title,
						}
					},
					method: "put",
				}
				this.loading = 0
				this.axios(body).then(res => {
					let d = res.data
					if (d.code === 0) {
						this.loading = 0
						this.$notify.success({
							title: '成功',
							showClose: false
						})
					}
					this.$router.back()
				})

			},
			//上传文件
			upSuccess(res) {
				if(res.code == 0){
					this.data.tempAlertId = res.data.data
				}else{
					this.fileList = []
					this.data.tempAlertId = ''
					this.warn('上传失败！')
				}
			},
			upError(res) {
				console.log(res);
				//this.data.tempAlertId = res.data.data
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
					}
					// 表格数据
					this.tableLoading1 = false;
				});
			},
			// 移除文件
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			// 上传文件超出限制
			handleExceed(files, fileList) {
				this.$message.warning(
					`最多上传一个文件，共选择了 ${files.length + fileList.length} 个文件`
				);
			},
		}
	};
</script>

<style scoped lang="stylus">
	.add .article .inputs .el-radio
		width auto

	.avatar-uploader111 >>> .el-upload
		visibility visible
		opacity 1

	.imgOK >>> .el-upload
		visibility hidden
		opacity 0

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
		.article
			.inputs
				display flex
				align-items center
				margin-bottom 20px
				label
					width 120px
					font-size 14px
					text-align right

				.el-input
					width 500px

				.source
					display flex
					div
						width 350px
						margin-right 50px

						.el-radio
							text-align left
						label
							width 100px
							font-size 14px
							text-align right

						.el-checkbox-group label
							width auto
						.el-input
							width 100%
			.click
				.el-input
					width 174px
			.el-checkbox-group label
				text-align left
			.desc
				align-items flex-start
		.submit
			text-align center
			.el-button
				width 100px
				margin 50px auto 20px
</style>
