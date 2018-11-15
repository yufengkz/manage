<template>
	<div>
		<div class="add" v-loading='loading'>
			<div class="breadcrumb">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item>活动管理</el-breadcrumb-item>
					<el-breadcrumb-item>活动金额补发</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<!-- 检索 -->
			<div class="article">
				<div class="inputs">
					<label>customerId(必填)：</label>
					<el-input size='mini' v-model="data.customerId" placeholder="请输入用户id"></el-input>
				</div>
				<div class="inputs">
					<label>sourceCustomerId(必填)：</label>
					<el-input size='mini' v-model="data.sourceCustomerId" placeholder="请输入sourceCustomerId"></el-input>
				</div>
				<div class="inputs">
					<label>amount(必填)：</label>
					<el-input size='mini' v-model="data.amount" placeholder="请输入amount"></el-input>
				</div>
				<div class="inputs">
					<label>type(必填)：</label>
					<el-input size='mini' v-model="data.type" placeholder="请输入type"></el-input>
				</div>
				<div class="inputs">
					<label>orderType(必填)：</label>
					<el-input size='mini' v-model="data.orderType" placeholder="请输入orderType"></el-input>
				</div>
				<div class="inputs">
					<label>orderId：</label>
					<el-input size='mini' v-model="data.orderId" placeholder="请输入orderId"></el-input>
				</div>
				<div class="inputs">
					<label>integralWeight(必填)：</label>
					<el-input size='mini' v-model="data.integralWeight" placeholder="请输入integralWeight"></el-input>
				</div>

				<div class="submit">
					<el-button type='primary' @click='submit'>提交</el-button>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				data: {
					customerId: '',
					sourceCustomerId: '',
					amount: '',
					type: '',
					orderType: '',
					orderId: '',
					integralWeight: '',
				},
				//
				urls: {
					// 修改
					subUrl: "users/payReissue"
				},
				token: {token: null},
				loading: 0,
			};
		},
		created() {

		},
		methods: {
			//提交数据
			submit() {
				this.loading = 1
				// for (let name in this.data) {
				// 	if (! this.data[name] && name !== 'orderId') {
				// 		this.warn(`必填参数${name}不能为空！`)
				// 		this.loading = 0
				// 		return
				// 	}
				// }
				let body = {
					url: this.urls.subUrl,
					data: this.data,
					method: "post",
				}
				this.axios(body).then(res => {
					let d = res.data
					if (d.code === 0) {
						this.loading = 0
						this.$notify.success({
							title: '补发成功',
							showClose: false
						})
						for (let name in this.data) {
							this.data[name] = ''
						}
					}else{
						this.warn(d.message)
					}
				})
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
					width 200px
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
