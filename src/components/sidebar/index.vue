<template>
	<div id="sidebar" :class="[isCollapse ? 'hide' : '']">
		<div class="side-el">
			<el-menu class="el-menu-vertical" :collapse="isCollapse" v-if="menu.length>0" :default-active="defaultOpen"
			         :router='1'>

				<el-menu-item v-for="i in menu" :disabled='i.disabled' :key="i.id" :index="i.skip_link"
				              v-if="i.skip_link!==''&&i.disabled!='true'">
					<template slot="title">
						<i class="menu-icon" :style='`background-image:url(${i.icon})`'></i>
						<span slot="title">{{i.name}}</span>
					</template>
				</el-menu-item>

				<el-submenu v-for="i in menu" :disabled='i.disabled' v-if="i.show&&i.skip_link===''&&i.res.length>0"
				            :key="i.skip_link" :index="i.id">
					<template slot="title">
						<i class="menu-icon" :style='`background-image:url(${i.icon})`'></i>
						<span>{{i.name}}</span>
					</template>
					<el-menu-item v-for="j in i.res" v-if="j.disabled!=='true'" :disabled='j.disabled'
					              :key="j.skip_link" :index='j.skip_link'>{{j.name}}
					</el-menu-item>
				</el-submenu>

			</el-menu>

			<div :class="[isCollapse ? 'control hide' : 'control']" @click="hide">

				<div class="three col">
					<div class="hamburger" id="hamburger-3">
						<span class="line"></span>
						<span class="line"></span>
						<span class="line"></span>
					</div>
				</div>

			</div>

		</div>
	</div>
</template>

<script>
	export default {
		name: "sidebar",
		data() {
			return {
				defaultOpen: "/users",
				isCollapse: false,
				user: localStorage.getItem("user") || "",
				menu: [
					{
						id: "1",
						name: "用户管理",
						skip_link: "",
						allow: "king,admin",
						order: "1",
						icon: "http://admapi.xmadx.net/public/icon/home.png",
						res: [{id: "4", name: "用户列表", skip_link: "users"}]
					},
					{
						id: "2",
						name: "文章管理",
						skip_link: "",
						allow: "king,operate",
						order: "2",
						icon: "http://admapi.xmadx.net/public/icon/check.png",
						res: [
							{id: "4", name: "达人攻略", skip_link: "raiders"},
							{id: "5", name: "推广素材", skip_link: "material"},
							{id: "5", name: "新手指引", skip_link: "guide"},
							{id: "5", name: "优选文章", skip_link: "picked"},
							{id: "5", name: "问题列表", skip_link: "questions"},
							{id: "5", name: "视频列表", skip_link: "video"}
						]
					},
					{
						id: "3",
						name: "上传数据管理",
						skip_link: "",
						allow: "king",
						order: "3",
						icon: "http://admapi.xmadx.net/public/icon/dsp.png",
						res: [
							{id: "41", name: "信用卡", skip_link: "upcredit"},
							{id: "42", name: "贷款", skip_link: "uploan"},
							{id: "43", name: "信用卡分期", skip_link: "uprepayment"},
							{id: "44", name: "保险", skip_link: "upinsurancepay"},
							{id: "45", name: "保险批量发钱", skip_link: "insurancebatchpay"},
							{id: "46", name: "车险", skip_link: "upcarinsurancepay"}
						]
					},
					{
						id: "6",
						name: "订单管理",
						skip_link: "",
						allow: "king,admin",
						order: "4",
						icon: "http://admapi.xmadx.net/public/icon/ssp.png",
						res: [
							{id: "7", name: "信用卡", skip_link: "ordercredit"},
							{disabled: "true", id: "8", name: "贷款", skip_link: "orderloan"},
							{
								disabled: "true",
								id: "9",
								name: "保险",
								skip_link: "orderinsurance"
							},
							{id: "9", name: "人工支付", skip_link: "pay"}
						]
					},
					{
						id: "10",
						name: "广告管理",
						allow: "king,admin", //admin
						skip_link: "",
						order: "5",
						icon: "http://admapi.xmadx.net/public/icon/material.png",
						res: [
							{id: "11", name: "广告列表", skip_link: "ad"},
							{id: "12", name: "弹窗列表", skip_link: "popup"}
						]
					},
					{
						id: "15",
						name: "业务管理",
						allow: "king,operate",
						skip_link: "",
						order: "7",
						icon: "http://admapi.xmadx.net/public/icon/tag.png",
						res: [
							{id: "151", name: "信用卡", skip_link: "creditcard"},
							{id: "152", name: "保险", skip_link: "insurance"},
							{id: "153", name: "贷款", skip_link: "loan"},
							{id: "154", name: "车险", skip_link: "carinsurances"}
						]
					},
					{
						id: "18",
						name: "系统设置",
						// disabled: "true",
						allow: "king",
						skip_link: "",
						order: "8",
						icon: "http://admapi.xmadx.net/public/icon/datarep.png",
						res: [
							{id: "181", name: "管理组", skip_link: "managegroup"},
							{id: "182", name: "管理人", skip_link: "managesingle"}
						]
					},
					{
						id: "22",
						name: "问题反馈",
						allow: "king",
						skip_link: "",
						order: "9",
						icon: "http://admapi.xmadx.net/public/icon/money.png",
						res: [{id: "221", name: "问题列表", skip_link: "feedback"}]
					},
					{
						id: "26",
						name: "脱敏数据分析",
						allow: "king",
						skip_link: "",
						order: "11",
						icon: "http://admapi.xmadx.net/public/icon/datarep.png",
						res: [{id: "26", name: "脱敏数据分析", skip_link: "datamasking"}]
					},
					{
						id: "27",
						name: "活动管理",
						allow: "king",
						skip_link: "",
						order: "11",
						icon: "http://admapi.xmadx.net/public/icon/material.png",
						res: [{id: "271", name: "猜题活动", skip_link: "activity"}, {id: "272", name: "活动金额补发", skip_link: "money"}]
					},
					{
						id: "28",
						name: "页面配置",
						allow: "king",
						disabled: 'true',
						skip_link: "",
						order: "11",
						icon: "http://admapi.xmadx.net/public/icon/check.png",
						res: [
							{id: "281", name: "推广首页配置", skip_link: "settingpromotion"},
							{id: "282", name: "信用卡推广页配置", skip_link: "settingcreditpromotion"}
						]
					}
				],
				limit: [],
				// 这里放入需要修改当前状态（左侧菜单）为父页面的子页面路径
				// 解决bug：有些页面不在左侧菜单列表中，比如点击广告主列表-修改后左侧菜单的当前状态消失
				go: [
					"managegroupedit",
					"managegroupedit",
					"adadd",
					"adedit",
					"popup",
					"activityadd",
					"activityedit",
					"feedbackdetail",
					"managesingleadd",
					"managesingleedit",
					"loanadd",
					"operatecenter",
					"ordercreditdetail",
					"loanedit",
					"insuranceadd",
					"insuranceedit",
					"creditcardbankedit",
					"creditcardedit",
					"creditcardadd",
					"creditcardaddnext",
					"guideedit",
					"guideadd",
					"pickededit",
					"pickedadd",
					"usersedit",
					"questionsedit",
					"questionsadd",
					"materialedit",
					"materialadd",
					"videoadd",
					"videoedit",
					"raidersadd",
					"raidersedit"
				]
			};
		},

		components: {},

		created() {
			// 权限分配
			this.menu.map(
				i => (i.show = i.allow.split(",").some(i => this.user.match(i)))
			);
		},

		mounted() {
			if (localStorage.getItem("navActive")) {
				this.defaultOpen = localStorage.getItem("navActive");
			} else {
				this.menuSel(this.$route.name);
			}
		},

		methods: {
			hide() {
				this.isCollapse = !this.isCollapse;
				this.$emit("hide", this.isCollapse);
			},
			menuSel(index) {
				this.defaultOpen = index;
			}
		},
		computed: {},
		watch: {
			$route(to, from) {
				// 不点击导航菜单时，菜单栏当前状态处理
				let routeName = this.$route.name;
				// 如果跳转页面是子页面，保留当前状态，go里放入将要跳转的子页面路径
				if (this.go.includes(routeName)) {
					localStorage.setItem("navActive", from.name);
					return;
				}
				localStorage.removeItem("navActive");
				this.menuSel(routeName);
			}
		}
	};
</script>
<style scoped lang='stylus'>
	.el-menu-vertical:not(.el-menu--collapse)
		width 165px
		min-height 400px

	.control
		position fixed
		bottom 0px
		left 20px
		transition 0.5s

	.control.hide
		left 0px
		bottom 0

	.control .three
		padding 10px
		box-sizing border-box
		text-align center

	.hamburger .line
		width 30px
		height 3px
		background-color #999
		display block
		margin 6px auto
		transition all 0.3s ease-in-out
		will-change width, transform

	.hamburger:hover
		cursor pointer

	.hamburger:hover .line
		background-color #000

	/* THREE */
	#hamburger-3:hover .line:nth-child(1), #hamburger-3:hover .line:nth-child(3)
		width 16px

	#hamburger-3:hover .line:nth-child(1)
		transform translate3D(-9px, 4px, 0) rotate(-226deg)

	#hamburger-3:hover .line:nth-child(3)
		transform translate3D(-9px, -4px, 0) rotate(226deg)

	/* 隐藏时 */
	.hide #hamburger-3:hover .line:nth-child(1)
		transform translate3D(9px, 4px, 0) rotate(226deg)

	.hide #hamburger-3:hover .line:nth-child(3)
		transform translate3D(9px, -4px, 0) rotate(-226deg)

	#sidebar
		width 159px
		background #fff
		border-right 1px solid #e4e5e7
		position fixed
		top 50px
		left 0
		bottom 0
		z-index 0
		overflow auto
		transition 0.5s

	#sidebar.hide
		width 49px

	#side-home
		height 46px
		font-size 14px
		color #262626
		line-height 46px
		padding-left 17px
		border-left 3px solid transparent
		cursor pointer

	#side-home.siderActive
		color #65a5f6
		border-color #65a5f6
		background-color #f7faff

	.side-loc
		display inline-block
		width 14px
		height 14px
		/* background: url("../../assets/img/icon.png") no-repeat; */
		margin-right 8px
		background-position 0 -14px

	.menu-icon
		display inline-block
		width 17px
		height 14px
		margin-right 6px
		margin-left 3px
		background center 0 no-repeat

	#sidebar .el-menu-item.is-active .menu-icon
		background center -14px no-repeat

	.side-program
		display inline-block
		width 14px
		height 14px
		background url('../../assets/img/program1.png') no-repeat

	#sidebar a
		color #262626
		font-size 12px

	.side-el
		margin-bottom 40px

	#sidebar .el-menu-item
		border-color transparent

	#sidebar .el-menu-item.is-active
		border-left 3px solid #65a5f6

	#sidebar >>> .el-submenu__icon-arrow
		right 14px
</style>
