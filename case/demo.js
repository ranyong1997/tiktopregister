/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-27 11:00:02
 * @LastEditTime: 2022-02-11 17:00:23
 */

// const { longSleep, shortSleep, randomSleep } = require("../lib/common");
// const commonFun = require("../lib/common");
// var FIND_WIDGET_TIMEOUT = 1000
// checkUsersInfoPage()
// function checkUsersInfoPage() {
//     log("检查抖主主页")
//     var SersInfoText = text("Followers").id("com.zhiliaoapp.musically:id/b77").findOne(750)
//     if (SersInfoText != null) {
//         log("点击粉丝列表")
//         shortSleep()
//         commonFunc.clickWidget(SersInfoText)
//         longSleep()
//         log("循环滑动")
//         while (true) {
//             check_last_use()
//             commonFunc.scrollShortUp()

//         }
//     }
// }
// // function check_first_use() {
// //     let tag = [];
// //     let list = selector().find();
// //     for (var i = 0; i < list.length; i++) {
// //         var object = list.get(i);
// //         if (object.text() != "") {
// //             text_ = object.text()
// //             tag.push(text_)
// //         }
// //     }
// //     first_name = tag[5]
// //     log("单页第一个粉丝名为：", first_name)
// // }

// function check_last_use() {
//     let tag = []
//     let list = selector().find();
//     for (var i = 0; i < list.length; i++) {
//         var object = list.get(i);
//         if (object.text() != "") {
//             text_ = object.text()
//             tag.push(text_)
//         }
//     }
//     last_name = tag[tag.length - 3]
//     log("单页最后一个粉丝名为：", last_name)
//     if(last_name >3){
//         log("到底")
//         return true
//     }
// }


// taskip写死 需要重置  在httpUtilFunc.getPluginData
var commonFun = require("../lib/common.js");
var httpUtilFunc = require("../http/httpUtils");
var { reportLog } = require("../network/httpUtil.js");
var proxySettings = require("../vpn/proxySettings.js")
var enums = require("../util/enums")
// const targetApp = require("../app/tiktokApp.js");
var { newThread, randomSleep, taskResultSet, shortSleep, longSleep } = require("../lib/common.js");
var taskDemo = {}
let taskPluginData = null
var FIND_WIDGET_TIMEOUT = 1000
var registerDone = false
var isSuccess = true
var change_picture = false
var desc = ""
var fail_register = false
var isUsed = false
var isProcess = true
var Bir_success = false
var launchAppCount = 1
var resgisterStatus = ""
var tiktop_packageName = "com.zhiliaoapp.musically"
var facebook_packageName = "com.facebook.katana"
var kitsunebi_packageName = "fun.kitsunebi.kitsunebi4android"

// try {   //  获取插件配置
//     taskPluginData = httpUtilFunc.getPluginData()
//     reportLog("插件配置: " + JSON.stringify(taskPluginData))
//     appName = taskPluginData.appName
//     keyword_FB = taskPluginData.keyword_FB
//     systemLanguage = taskPluginData.systemLanguage
//     systemTimezone = taskPluginData.systemTimezone
//     proxyCountry = taskPluginData.proxyCountry
//     proxyProvider = taskPluginData.proxyProvider
//     proxyTag = taskPluginData.proxyTag
//     register = taskPluginData.register == "on" ? true : false
//     updatePhoto = taskPluginData.updatePhoto == "on" ? true : false
//     materialTag = taskPluginData.materialTag
//     backupTag = taskPluginData.backupTag
//     backupTag2 = taskPluginData.backupTag2
//     relevance = taskPluginData.relevance == "on" ? true : false
//     material_username = taskPluginData.material_username
//     appid = taskPluginData.appid
//     appid_key = taskPluginData.appid_key
//     type = taskPluginData.type
//     classify = taskPluginData.classify
//     used_times_model = taskPluginData.used_times_model
//     used_counter = taskPluginData.used_counter
//     commonFun.taskStepRecordSet(200, null, "获取插件配置信息", "获取插件配置信息:" + JSON.stringify(taskPluginData))
// } catch (error) {
//     log("  插件配置 获取失败 " + commonFun.objectToString(error))
//     throw "插件配置 获取失败 " + JSON.stringify(error)
// }

// global_ip = httpUtilFunc.getGlobalIp()
// log("---->", global_ip)


// for (let index = 0; index < 3; index++) {
//     commonFun.showLog("代理IP检测: " + global_ip)
//     global_ip = httpUtilFunc.getGlobalIp()
//     reportLog("检测IP: " + local_ip + " -> " + global_ip)
//     commonFun.showLog("代理IP检测: " + global_ip)
//     if (global_ip) { return true } else { taskDemo.desc = "代理已连接, 但IP检测失败 " + local_ip + " -> " + global_ip }
//     try { if (httpUtilFunc.isUrlAccessable("https://www.tiktok.com", "This page is not available in your area")) { taskDemo.desc = "代理已连接,但 tiktok 网站访问失败: " + "This page is not available in your area"; continue } } catch (error) { }
//     try { if (httpUtilFunc.isUrlAccessable("https://www.tiktok.com", "tiktok")) { return true } } catch (error) { taskDemo.desc = "代理已连接,但 tiktok 网站访问失败: " + commonFun.objectToString(error) }
//     randomSleep(5000)
// }
// try {
//     global_ip = httpUtilFunc.getGlobalIp()
//     log("当前网络ip--->", global_ip)
//     let timestamp = new Date().getTime()
//     log("现在时间---->", timestamp)
//     try {   // 版本检测
//         let happybayVersion = "1.1.40_beta_8_4"
//         if (commonFun.happybayVersion < happybayVersion) { throw "happybayVersion " + commonFun.happybayVersion + " -> " + happybayVersion }
//         let jsengineVersion = "4.1.1 Alpha2-gxl-817"
//         if (commonFun.jsengineVersion < jsengineVersion) { throw "jsengineVersion " + commonFun.jsengineVersion + " -> " + jsengineVersion }
//     } catch (error) {
//         throw "系统应用版本过低,请先升级: " + commonFun.objectToString(error)
//     }
//     try {   //  初始化测试
//         if (!commonFun.server) { throw "未连接到群控后台" }
//         //  业务后台连接检测
//         let lan_test = null
//         for (let index = 0; index < 5; index++) {
//             try { lan_test = httpUtilFunc.testTaskServer() } catch (error) { }
//             commonFun.showLog("局域网测试: " + lan_test)
//             commonFun.taskStepRecordSet(200, null, "局域网测试", "局域网测试" + lan_test)
//             if (lan_test) { break }
//             sleep(5000)
//         }
//         if (!lan_test) {
//             //  业务后台连接检测
//             log("业务后台连接异常")
//             for (let index = 0; index < 90; index++) {
//                 try {
//                     if (httpUtilFunc.testTaskServer()) {
//                         break
//                     }
//                     throw ""
//                 } catch (error) {
//                     if (index > 80) { throw "业务后台连接异常, 请检查网络和服务器状态. " + commonFun.objectToString(error) }
//                     commonFun.showLog("业务后台连接异常, 请检查网络和服务器状态. ")
//                 }
//                 sleep(60000)
//             }
//         }
//         randomSleep(3000)
//     } catch (error) { throw error }
//     try {   //  获取插件配置
//         taskPluginData = httpUtilFunc.getPluginData()
//         reportLog("插件配置: " + JSON.stringify(taskPluginData))
//         appName = taskPluginData.appName
//         keyword_FB = taskPluginData.keyword_FB
//         systemLanguage = taskPluginData.systemLanguage
//         systemTimezone = taskPluginData.systemTimezone
//         proxyCountry = taskPluginData.proxyCountry
//         proxyProvider = taskPluginData.proxyProvider
//         proxyTag = taskPluginData.proxyTag
//         register = taskPluginData.register == "on" ? true : false
//         updatePhoto = taskPluginData.updatePhoto == "on" ? true : false
//         materialTag = taskPluginData.materialTag
//         backupTag = taskPluginData.backupTag
//         backupTag2 = taskPluginData.backupTag2
//         relevance = taskPluginData.relevance == "on" ? true : false
//         material_username = taskPluginData.material_username
//         appid = taskPluginData.appid
//         appid_key = taskPluginData.appid_key
//         type = taskPluginData.type
//         classify = taskPluginData.classify
//         used_times_model = taskPluginData.used_times_model
//         used_counter = taskPluginData.used_counter
//         log("目标应用包名: " + appName)
//         log("facebook关键字: " + keyword_FB)
//         log("系统语言: " + systemLanguage)
//         log("系统时区: " + systemTimezone)
//         log("代理归属国: " + proxyCountry)
//         log("代理来源: " + proxyProvider)
//         log("素材标签: " + materialTag)
//         log("备份标签: " + backupTag)
//         log("备份标签2: " + backupTag2)
//         log("appid: " + appid)
//         log("appid_key: " + appid_key)
//         log("素材匹配: " + used_times_model)
//         log("使用次数: " + used_counter)
//         commonFun.taskStepRecordSet(200, null, "获取插件配置信息", "获取插件配置信息:" + JSON.stringify(taskPluginData))
//     } catch (error) {
//         log("  插件配置 获取失败 " + commonFun.objectToString(error))
//         throw "插件配置 获取失败 " + JSON.stringify(error)
//     }
//     //  执行任务


// }

//     try {
//         // 代理获取 需要联调
//         proxy_info = null
//         let ipInfo = {}
//         if (taskPluginData.proxyProvider) {
//             let is_proxy_on = false
//             is_proxy_on = newThread(() => {
//                 let proxy_loop_max = taskPluginData.proxyProvider == "doveip" ? 5 : 1
//                 for (let proxy_loop = 0; proxy_loop < proxy_loop_max; proxy_loop++) {
//                     // 检测网络是否通畅, 如果网络不通, 则卸载 代理软件
//                     if (!httpUtilFunc.getGlobalIp() && !commonFun.uninstallApp(kitsunebi_packageName)) { reportLog("设备环境异常") }
//                     //  从代理库获取代理信息
//                     try {
//                         let proxy_data = httpUtilFunc.getProxyData(taskPluginData.proxyProvider, taskPluginData.proxyTag)
//                         if (taskPluginData.proxyProvider == "doveip") {
//                             log("deveip代理")
//                             proxy_info = httpUtilFunc.getProxyFromDoveip(proxy_data.proxy, { "geo": taskPluginData.proxyCountry, "timeout": 10 })
//                         }
//                         else if (taskPluginData.proxyProvider == "cloudam") {
//                             log("cloudam代理")
//                             proxy_info = httpUtilFunc.getProxyFromCloudam(proxy_data.proxy, { "regionid": taskPluginData.proxyCountry })
//                         }
//                         else if (taskPluginData.proxyProvider == "connanys") {
//                             log("connanys代理")
//                             proxy_info = httpUtilFunc.getProxyFromConnanys(proxy_data.proxy, { "regionid": taskPluginData.proxyCountry, "timeout": 30 })
//                         }
//                         else if (taskPluginData.proxyProvider == "bytesfly") {
//                             log("bytesfly代理")
//                             proxy_info = httpUtilFunc.getProxyFromBytesfly("SOCKS5", 0, "tiktok", 1, 0, taskPluginData.proxyCountry)
//                         }
//                         else if (taskPluginData.proxyProvider == "sellerip") {// 新增代理sellerip规则
//                             log("sellerip代理")
//                             proxy_info = httpUtilFunc.getProxyFromSellerip(proxy_data.proxy, { "geo": taskPluginData.proxyCountry, "timeout": 10 })
//                         }
//                         else {
//                             proxy_info = proxy_data.proxy
//                         }
//                         reportLog("获取的代理信息: " + JSON.stringify(proxy_info))
//                     } catch (error) {
//                         taskDemo.desc = commonFun.objectToString(error)
//                         reportLog(taskDemo.desc)
//                         randomSleep(30000)
//                         if (taskDemo.desc.match("IP 列表为空")) {
//                             home()
//                             for (let index = 0; index < 18; index++) {
//                                 toast("IP 列表为空")
//                                 sleep(10000)
//                             }
//                         }
//                         else if (taskDemo.desc.match("无可用信息")) {
//                             home()
//                             for (let index = 0; index < 18; index++) {
//                                 toast("无可用代理信息")
//                                 sleep(10000)
//                             }
//                         }
//                     }
//                     if (!proxy_info) { continue }
//                     reportLog("代理配置 " + JSON.stringify(proxy_info))
//                     if (!proxySettings.kitsunebiInstall(taskPluginData.proxyLink)) { throw "未安装 " + "fun.kitsunebi.kitsunebi4android" }
//                     try {
//                         is_proxy_on = proxySettings.kitsunebiSetup(proxy_info)
//                         reportLog("代理连接结果: " + is_proxy_on)
//                     } catch (error) {
//                         taskDemo.desc = "代理连接异常: " + commonFun.objectToString(error)
//                         if (proxy_loop + 1 > proxy_loop_max) { throw taskDemo.desc }
//                         reportLog(taskDemo.desc)
//                         continue
//                     }
//                     //  获取本机ip
//                     local_ip = httpUtilFunc.getLocalIp()
//                     reportLog("本机 IP: " + local_ip)
//                     commonFun.taskStepRecordSet(200, null, "获取本机ip", "获取本机ip：" + local_ip)
//                     // ip检测
//                     global_ip = null
//                     for (let index = 0; index < 3; index++) {
//                         commonFunc.showLog("代理IP检测: " + global_ip)
//                         global_ip = httpUtilFunc.getGlobalIp()
//                         reportLog("检测IP: " + local_ip + " -> " + global_ip)
//                         commonFunc.showLog("代理IP检测: " + global_ip)
//                         if (global_ip) { return true } else { taskDemo.desc = "代理已连接, 但IP检测失败 " + local_ip + " -> " + global_ip }
//                         try { if (httpUtilFunc.isUrlAccessable("https://www.tiktok.com", "This page is not available in your area")) { taskDemo.desc = "代理已连接,但 tiktok 网站访问失败: " + "This page is not available in your area"; continue } } catch (error) { }
//                         try { if (httpUtilFunc.isUrlAccessable("https://www.tiktok.com", "tiktok")) { return true } } catch (error) { taskDemo.desc = "代理已连接,但 tiktok 网站访问失败: " + commonFunc.objectToString(error) }
//                         randomSleep(5000)
//                     }
//                 }
//             }, false, 1000 * 60 * 30, () => { throw "代理连接超时退出 " + taskDemo.desc })
//             if (!is_proxy_on) { throw taskDemo.desc }
//             ipInfo = httpUtilFunc.getIpInfo()
//             reportLog("代理网络 " + JSON.stringify(ipInfo))
//         }
//     } catch (error) {
//         throw error
//     }
// } catch (error) {
//     taskDemo.result = 0
//     taskDemo.desc = commonFun.objectToString(error)
//     commonFun.taskResultSet(taskDemo.desc, "a")
// }



try {
    timeout = typeof (timeout) == "number" ? timeout : 1000 * 30
    ip = newThread(function () {
        let res = http.get("https://www.ip.cn/api/index?ip=&type=0", {
            "headers": {
                'User-Agent': commonFun.getRandomUA()
            }
        })
        res = res.body.json()
        log("当前网络ip为：", res.ip)
        let local_ip = httpUtilFunc.getLocalIp()
        log("本地 IP: " + local_ip)
        throw res.statusCode
    }, null, timeout, () => { throw "超时退出" })
} catch (error) { log("https://www.ip.cn/api/index?ip=&type=0: " + commonFun.objectToString(error)) }
