export default {
  // 数据来源：1、扫邀请会员码注册,2、扫推广办卡码注册,3、扫推广保险码注册,4、扫推广贷款码注册,5、锁粉注册,6、ios注册,7、安卓注册,8、h5注册,9、微信公众号注册　
  dataFrom(v) {
    switch (v) {
      case 1:
        {
          return '邀请会员码'
        }
      case 2:
        {
          return '推广办卡码'
        }
      case 3:
        {
          return '推广保险码'
        }
      case 4:
        {
          return '推广贷款码'
        }
      case 5:
        {
          return '锁粉'
        }
      case 6:
        {
          return 'iOS'
        }
      case 7:
        {
          return '安卓'
        }
      case 8:
        {
          return 'H5'
        }
      case 9:
        {
          return '微信公众号'
        }
      case 10:
        {
          return '推广还呗码'
        }
      case null:
        {
          return '无'
        }
      default:
        {
          return '接口返回不是约定类型，请联系后台开发人员'
        }
    }
  },
  // 信用卡数据来源：1、ios,2、安卓,3、h5,4、微信-蓝金融,5、微信-卡精灵
  creditDataFrom(v) {
    switch (v) {
      case 1:
        {
          return 'iOS'
        }
      case 2:
        {
          return '安卓'
        }
      case 3:
        {
          return 'H5'
        }
      case 4:
        {
          return '微信-蓝金融'
        }
      case 5:
        {
          return '微信-卡精灵'
        }
      case null:
        {
          return '无'
        }
      default:
        {
          return '接口返回不是约定类型，请联系后台开发人员'
        }
    }
  },
  // 裁剪时间  去掉秒
  timeClip(v) {
    return v ? v.substring(0, 16) : '-'
  }
}
