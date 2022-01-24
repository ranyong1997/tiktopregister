/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-12 18:37:47
 * @LastEditTime: 2022-01-24 18:32:37
 */

// const { shortSleep, longSleep } = require("../lib/common.js")
// var commonFun = require("../lib/common.js")
// var FIND_WIDGET_TIMEOUT = 750
// var text_ = "leecocjlouie"

// checkHomePage()
// checkSerchPage()
// checkUsersPage()
// checkUsersInfoPage()
// function checkHomePage() {
//     log("检查主界面")
//     var HomePageText = text("Home").findOne(FIND_WIDGET_TIMEOUT)
//     if (HomePageText != null) {
//         log("检查头像框")
//         var click_head = id("com.zhiliaoapp.musically:id/f__").findOne(FIND_WIDGET_TIMEOUT).bounds()
//         if (click_head != null) {
//             log("获取头像坐标")
//             log(click_head)
//             log("点击搜索按钮")
//             var x = click_head.centerX() - 17
//             var y = click_head.centerY() - 523
//             click(x, y)
//             shortSleep()
//         }
//     }
// }


// function checkSerchPage() {
//     log("检查搜索页面")
//     var SerchText = id("com.zhiliaoapp.musically:id/dsw").findOne(FIND_WIDGET_TIMEOUT)
//     if (SerchText != null) {
//         log("输入素材")
//         setText(text_)
//         shortSleep()
//         log("点击Search")
//         commonFun.clickWidget(SerchText)

//     }
// }

// function checkUsersPage() {
//     log("检查搜索结果页面")
//     var SerchedText = text("Users").findOne(FIND_WIDGET_TIMEOUT)
//     if (SerchedText != null) {
//         log("点击Users")
//         shortSleep()
//         commonFun.clickWidget(SerchedText)
//         shortSleep()
//         log("检查Users页面")
//         var SerchOne = text("Users").findOne(FIND_WIDGET_TIMEOUT).bounds()
//         if (SerchOne != null) {
//             shortSleep()
//             let x = SerchOne.centerX() + 119
//             let y = SerchOne.centerY() + 235
//             click(x, y)
//             log("抖主主页停留3秒")
//             longSleep()
//         }
//     }
// }

// function checkUsersInfoPage() {
//     log("检查抖主主页")
//     var SersInfoText = text("Followers").id("com.zhiliaoapp.musically:id/b77").findOne(FIND_WIDGET_TIMEOUT)
//     if (SersInfoText != null) {
//         log("点击粉丝列表")
//         shortSleep()
//         commonFun.clickWidget(SersInfoText)
//         longSleep()
//         log("循环滑动")
//         do {
//             commonFun.scrollShortUp()
//         } while (true);
//     }
// }

const httpUtilFun = require("../network/httpUtil.js");
let local_ip = httpUtilFun.getIpInfo(1000)
log("ip1---->",local_ip)