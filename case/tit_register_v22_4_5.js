var ttpUtilFunc = require("../http/httpUtils")
var tilsFunc = require("../util/utils")
var commonFunc = require("../lib/common")
var enums = require("../util/enums")
var proxySettings = require("../vpn/proxySettings")
const { VPN_TYPE, VPN_PROXY_TIMELINESS, REGISTER_APP_ID, VPN_USE_ACTION_TAG } = require("../util/enums.js");
const { getIpByIpify } = require("../http/httpUtils.js");

var FIND_TIMEOUT = 750 // 设置超时
var FIND_WIDGET_TIMEOUT = 750 // 设置元素超时时间
var firstName = ""  // 首字
var lastName = ""   // 尾字
var birthdayMonth = ""  // 生日(月)
var brithdayDay = ""    // 生日(日)
var brithdayYear = ""   // 生日(年)
var emailAddress = ""   // 电子邮箱账号
var password = ""       // 电子邮箱密码
var hasCheckInfoed = false
var registerDone = false
var registerSignUp = false  // 登记表
var nickName = ""       // 别名
var resgisterStatus = enums.REGISTER_STATUS.DEFAULT
var accountName = ""
var ip = "1"
var isBirthDayDone = false
var isCheckPassword = false
var isVpnConnect = false
//验证邮箱账户和密码
var encrypted_email = ""
var encrypted_email_password = ""
var selectBirthDayValue = ""
var isInputEmail = false;
var inputTime = 0
var emailCheckCount = 0
var startRegisterTime = 0
var mailCodeCount = 0
var lastMailCode = ""
var maxSendEmailCodeCount = 0

// 脚本执行方法
commonFunc.systemTimezoneSet("Asia/Tokyo")
commonFunc.systemTimezoneGet()

