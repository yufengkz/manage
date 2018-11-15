export default [
	{
		// 主页
		path: '/login',
		name: 'login',
		component: () =>
			import ('views/login/login'),
		meta: {
			title: '登录'
		}
	},
	{
		path: '/',
		redirect: '/home'
	},
	{
		// 用户管理
		path: '/home',
		name: 'home',
		component: () =>
			import ('views/home'),
		meta: {
			title: '用户管理'
		}
	},

	// -----------------用户管理--------------------
	{
		// 用户管理
		path: '/users',
		name: 'users',
		component: () =>
			import ('views/users/users'),
		meta: {
			title: '用户管理'
		}
	},
	{
		// 用户管理 - 编辑
		path: '/usersedit',
		name: 'usersedit',
		component: () =>
			import ('views/users/usersedit'),
		meta: {
			title: '用户管理 - 编辑'
		}
	},
	{
		// 用户管理 - 运营中心
		path: '/operatecenter',
		name: 'operatecenter',
		component: () =>
			import ('views/users/operatecenter'),
		meta: {
			title: '用户管理 - 运营中心'
		}
	},
	// -----------------订单管理--------------------
	{
		// 订单管理 - 信用卡
		path: '/ordercredit',
		name: 'ordercredit',
		component: () =>
			import ('views/order/order-credit'),
		meta: {
			title: '订单管理 - 信用卡'
		}
	},
	{
		// 订单管理 - 信用卡 - 分佣明细
		path: '/ordercreditdetail',
		name: 'ordercreditdetail',
		component: () =>
			import ('views/order/order-credit-detail'),
		meta: {
			title: '订单管理 - 信用卡 - 分佣明细'
		}
	},
	{
		// 订单管理 - 贷款
		path: '/orderloan',
		name: 'orderloan',
		component: () =>
			import ('views/order/order-loan'),
		meta: {
			title: '订单管理 - 贷款'
		}
	},
	{
		// 订单管理 - 保险
		path: '/orderinsurance',
		name: 'orderinsurance',
		component: () =>
			import ('views/order/order-insurance'),
		meta: {
			title: '订单管理 - 保险'
		}
	},
	{
		// 订单管理 - 人工支付
		path: '/pay',
		name: 'pay',
		component: () =>
			import ('views/order/pay'),
		meta: {
			title: '订单管理 - 人工支付'
		}
	},
	// -----------------文章管理--------------------

	{
		// 达人攻略
		path: '/raiders',
		name: 'raiders',
		component: () =>
			import ('views/article/raiders'),
		meta: {
			title: '文章管理 - 达人攻略'
		}
	},
	{
		path: '/raidersadd',
		name: 'raidersadd',
		component: () =>
			import ('views/article/raiders-add'),
		meta: {
			title: '文章管理 - 达人攻略 - 新增'
		}
	},
	{
		path: '/raidersedit',
		name: 'raidersedit',
		component: () =>
			import ('views/article/raiders-edit'),
		meta: {
			title: '文章管理 - 达人攻略 - 编辑'
		}
	},
	{
		// 推广素材
		path: '/material',
		name: 'material',
		component: () =>
			import ('views/article/material'),
		meta: {
			title: '文章管理 - 推广素材'
		}
	},
	{
		path: '/materialadd',
		name: 'materialadd',
		component: () =>
			import ('views/article/material-add'),
		meta: {
			title: '文章管理 - 推广素材'
		}
	},
	{
		path: '/materialedit',
		name: 'materialedit',
		component: () =>
			import ('views/article/material-edit'),
		meta: {
			title: '文章管理 - 推广素材'
		}
	},
	{
		// 新手指引
		path: '/guide',
		name: 'guide',
		component: () =>
			import ('views/article/guide'),
		meta: {
			title: '文章管理 - 新手指引'
		}
	},
	{
		// 新手指引 新增
		path: '/guideadd',
		name: 'guideadd',
		component: () =>
			import ('views/article/guide-add'),
		meta: {
			title: '文章管理 - 新手指引 - 新增'
		}
	},
	{
		// 新手指引 编辑
		path: '/guideedit',
		name: 'guideedit',
		component: () =>
			import ('views/article/guide-edit'),
		meta: {
			title: '文章管理 - 新手指引 - 编辑'
		}
	},
	{
		// 优选文章
		path: '/picked',
		name: 'picked',
		component: () =>
			import ('views/article/picked'),
		meta: {
			title: '文章管理 - 优选文章'
		}
	},
	{
		// 优选文章 新增
		path: '/pickedadd',
		name: 'pickedadd',
		component: () =>
			import ('views/article/picked-add'),
		meta: {
			title: '文章管理 - 优选文章 - 新增'
		}
	},
	{
		// 优选文章 编辑
		path: '/pickededit',
		name: 'pickededit',
		component: () =>
			import ('views/article/picked-edit'),
		meta: {
			title: '文章管理 - 优选文章 - 编辑'
		}
	},
	{
		// 问题列表
		path: '/questions',
		name: 'questions',
		component: () =>
			import ('views/article/questions'),
		meta: {
			title: '文章管理 - 问题列表'
		}
	},
	{
		path: '/questionsadd',
		name: 'questionsadd',
		component: () =>
			import ('views/article/questions-add'),
		meta: {
			title: '文章管理 - 问题列表 - 新增'
		}
	},
	{
		path: '/questionsedit',
		name: 'questionsedit',
		component: () =>
			import ('views/article/questions-edit'),
		meta: {
			title: '文章管理 - 问题列表 - 编辑'
		}
	},
	{
		// 视频列表
		path: '/video',
		name: 'video',
		component: () =>
			import ('views/article/video'),
		meta: {
			title: '文章管理 - 视频列表'
		}
	},
	{
		path: '/videoadd',
		name: 'videoadd',
		component: () =>
			import ('views/article/video-add'),
		meta: {
			title: '文章管理 - 视频列表 - 新增'
		}
	},
	{
		path: '/videoedit',
		name: 'videoedit',
		component: () =>
			import ('views/article/video-edit'),
		meta: {
			title: '文章管理 - 视频列表 - 编辑'
		}
	},
	// -----------------业务管理--------------------
	{
		// 信用卡
		path: '/creditcard',
		name: 'creditcard',
		component: () =>
			import ('views/business/creditcard'),
		meta: {
			title: '业务管理 - 信用卡'
		},
	},
	{
		// 信用卡 - 新增
		path: '/creditcardadd',
		name: 'creditcardadd',
		component: () =>
			import ('views/business/creditcard-add'),
		meta: {
			title: '业务管理 - 信用卡'
		},
	},
	{
		// 信用卡 - 新增 - 下一步
		path: '/creditcardaddnext',
		name: 'creditcardaddnext',
		component: () =>
			import ('views/business/creditcard-add-next'),
		meta: {
			title: '业务管理 - 信用卡- 链接管理'
		},
	},
	{
		// 信用卡 - 管理链接
		path: '/creditcardedit',
		name: 'creditcardedit',
		component: () =>
			import ('views/business/creditcard-edit'),
		meta: {
			title: '业务管理 - 信用卡- 链接管理'
		},
	},
	{
		// 信用卡 - 修改银行信息
		path: '/creditcardbankedit',
		name: 'creditcardbankedit',
		component: () =>
			import ('views/business/creditcard-bank-edit'),
		meta: {
			title: '业务管理 - 信用卡- 链接管理'
		},
	},
	{
		// 保险
		path: '/insurance',
		name: 'insurance',
		component: () =>
			import ('views/business/insurance'),
		meta: {
			title: '业务管理 - 保险'
		},
	},
	{
		// 保险 - 新增
		path: '/insuranceadd',
		name: 'insuranceadd',
		component: () =>
			import ('views/business/insurance-add'),
		meta: {
			title: '业务管理 - 保险 - 新增'
		},
	},
	{
		// 保险 - 编辑
		path: '/insuranceedit',
		name: 'insuranceedit',
		component: () =>
			import ('views/business/insurance-edit'),
		meta: {
			title: '业务管理 - 保险 - 编辑'
		},
	},
	{
		// 贷款
		path: '/loan',
		name: 'loan',
		component: () =>
			import ('views/business/loan'),
		meta: {
			title: '业务管理 - 贷款'
		},
	},
	{
		// 贷款 - 新增
		path: '/loanadd',
		name: 'loanadd',
		component: () =>
			import ('views/business/loan-add'),
		meta: {
			title: '业务管理 - 贷款 - 新增'
		},
	},
	{
		// 贷款 - 编辑
		path: '/loanedit',
		name: 'loanedit',
		component: () =>
			import ('views/business/loan-edit'),
		meta: {
			title: '业务管理 - 贷款 - 编辑'
		},
	},
	{
		// 车险
		path: '/carinsurances',
		name: 'carinsurances',
		component: () =>
			import ('views/business/carinsurances'),
		meta: {
			title: '业务管理 - 车险'
		},
	},
	// -----------------广告管理--------------------
	{
		// 广告管理
		path: '/ad',
		name: 'ad',
		component: () =>
			import ('views/ad/ad'),
		meta: {
			title: '广告管理 - 广告列表'
		}
	},
	{
		// 广告管理 - 新增
		path: '/adadd',
		name: 'adadd',
		component: () =>
			import ('views/ad/ad-add'),
		meta: {
			title: '广告管理 - 广告列表'
		}
	},
	{
		// 广告管理 - 编辑
		path: '/adedit',
		name: 'adedit',
		component: () =>
			import ('views/ad/ad-edit'),
		meta: {
			title: '广告管理 - 广告列表'
		}
	},
	{
		// 广告管理 - 推荐位管理
		path: '/recommend',
		name: 'recommend',
		component: () =>
			import ('views/ad/recommend'),
		meta: {
			title: '广告管理 - 广告列表'
		},
	},
	{
		// 广告管理 - 弹窗列表
		path: '/popup',
		name: 'popup',
		component: () =>
			import ('views/ad/popup'),
		meta: {
			title: '广告管理 - 弹窗列表'
		},
	},
	{
		// 广告管理 - 弹窗编辑
		path: '/popup-edit',
		name: 'popup-edit',
		component: () =>
			import ('views/ad/popup-edit'),
		meta: {
			title: '广告管理 - 弹窗列表'
		},
	},
	// -----------------上传数据管理--------------------
	{
		// 上传数据管理 - 信用卡
		path: '/upcredit',
		name: 'upcredit',
		component: () =>
			import ('views/upload/up-credit'),
		meta: {
			title: '上传数据管理 - 信用卡'
		}
	},
	{
		// 上传数据管理 - 贷款
		path: '/uploan',
		name: 'uploan',
		component: () =>
			import ('views/upload/up-loan'),
		meta: {
			title: '上传数据管理 - 贷款'
		}
	},
	{
		// 上传数据管理 - 保险
		path: '/upinsurancepay',
		name: 'upinsurancepay',
		component: () =>
			import ('views/upload/up-insurancePay'),
		meta: {
			title: '上传数据管理 - 保险'
		}
	},
	{
		// 上传数据管理 - 保险批量发钱
		path: '/insurancebatchpay',
		name: 'insurancebatchpay',
		component: () =>
			import ('views/upload/up-insuranceBatchPay'),
		meta: {
			title: '上传数据管理 - 保险批量发钱'
		}
	},
	{
		// 上传数据管理 - 车险
		path: '/upcarinsurancepay',
		name: 'upcarinsurancepay',
		component: () =>
			import ('views/upload/up-carInsurancePay'),
		meta: {
			title: '上传数据管理 - 车险'
		}
	},
	{
		// 上传数据管理 - 信用卡分期
		path: '/uprepayment',
		name: 'uprepayment',
		component: () =>
			import ('views/upload/up-repayment'),
		meta: {
			title: '上传数据管理 - 信用卡分期'
		}
	},
	// -----------------脱敏数据分析--------------------
	{
		// 脱敏数据分析
		path: '/datamasking',
		name: 'datamasking',
		component: () =>
			import ('views/datamasking/data-masking'),
		meta: {
			title: '脱敏数据分析'
		}
	},
	// -----------------系统设置--------------------
	{
		path: '/managegroup',
		name: 'managegroup',
		component: () =>
			import ('views/manage/managegroup'),
		meta: {
			title: '系统设置 - 管理组'
		}
	},
	{
		path: '/managegroupedit',
		name: 'managegroupedit',
		component: () =>
			import ('views/manage/managegroupedit'),
		meta: {
			title: '系统设置 - 管理组 - 编辑'
		}
	},
	{
		path: '/managesingle',
		name: 'managesingle',
		component: () =>
			import ('views/manage/managesingle'),
		meta: {
			title: '系统设置 - 管理人'
		}
	},
	{
		path: '/managesingleedit',
		name: 'managesingleedit',
		component: () =>
			import ('views/manage/managesingleedit'),
		meta: {
			title: '系统设置 - 管理人 - 编辑'
		}
	},
	{
		path: '/managesingleadd',
		name: 'managesingleadd',
		component: () =>
			import ('views/manage/managesingleadd'),
		meta: {
			title: '系统设置 - 管理人 - 新增'
		}
	},
	// -----------------问题反馈--------------------
	{
		path: '/feedback',
		name: 'feedback',
		component: () =>
			import ('views/feedback/feedback'),
		meta: {
			title: '问题列表'
		}
	},
	{
		path: '/feedbackdetail',
		name: 'feedbackdetail',
		component: () =>
			import ('views/feedback/feedbackdetail'),
		meta: {
			title: '问题列表 - 查看详情'
		}
	},
	// -----------------猜题活动--------------------
	{
		path: '/activity',
		name: 'activity',
		component: () =>
			import ('views/activity/activity'),
		meta: {
			title: '猜题活动'
		}
	},
	{
		path: '/activityedit',
		name: 'activityedit',
		component: () =>
			import ('views/activity/activityedit'),
		meta: {
			title: '猜题活动 - 编辑'
		}
	},
	{
		path: '/activityadd',
		name: 'activityadd',
		component: () =>
			import ('views/activity/activityadd'),
		meta: {
			title: '猜题活动 - 新增'
		}
	},
	{
		path: '/money',
		name: 'money',
		component: () =>
			import ('views/activity/money'),
		meta: {
			title: '活动金额补发'
		}
	},
	{
		path: '/settingpromotion',
		name: 'settingpromotion',
		component: () =>
			import ('views/pagesettings/settingpromotion'),
		meta: {
			title: '页面设置 - 推广首页'
		}
	},
	{
		path: '/settingcreditpromotion',
		name: 'settingcreditpromotion',
		component: () =>
			import ('views/pagesettings/settingcreditpromotion'),
		meta: {
			title: '页面设置 - 信用卡推广页'
		}
	},

]
