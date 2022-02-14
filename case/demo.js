/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-27 11:00:02
 * @LastEditTime: 2022-02-14 10:44:39
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

try {   //  获取插件配置
    taskPluginData = httpUtilFunc.getPluginData()
    reportLog("插件配置: " + JSON.stringify(taskPluginData))
    appName = taskPluginData.appName
    keyword_FB = taskPluginData.keyword_FB
    systemLanguage = taskPluginData.systemLanguage
    systemTimezone = taskPluginData.systemTimezone
    proxyCountry = taskPluginData.proxyCountry
    proxyProvider = taskPluginData.proxyProvider
    proxyTag = taskPluginData.proxyTag
    register = taskPluginData.register == "on" ? true : false
    updatePhoto = taskPluginData.updatePhoto == "on" ? true : false
    materialTag = taskPluginData.materialTag
    backupTag = taskPluginData.backupTag
    backupTag2 = taskPluginData.backupTag2
    relevance = taskPluginData.relevance == "on" ? true : false
    material_username = taskPluginData.material_username
    appid = taskPluginData.appid
    appid_key = taskPluginData.appid_key
    type = taskPluginData.type
    classify = taskPluginData.classify
    used_times_model = taskPluginData.used_times_model
    used_counter = taskPluginData.used_counter
    commonFun.taskStepRecordSet(200, null, "获取插件配置信息", "获取插件配置信息:" + JSON.stringify(taskPluginData))
} catch (error) {
    log("  插件配置 获取失败 " + commonFun.objectToString(error))
    throw "插件配置 获取失败 " + JSON.stringify(error)
}


try {
    //  本地网络
    local_ip = httpUtilFunc.getLocalIp()
    log("本地 IP: " + local_ip)
    global_ip = null
    if (taskPluginData.proxyProvider  != "none") {
        log("进行vpn设置")
        let is_proxy_on = false
        is_proxy_on = newThread(() => {
            let proxy_loop_max = taskPluginData.proxyProvider == "doveip" ? 5 : 1
            for (let proxy_loop = 0; proxy_loop < proxy_loop_max; proxy_loop++) {
                // 检测网络是否通畅, 如果网络不通, 则卸载 代理软件
                if (!httpUtilFunc.getGlobalIp() && !commonFun.uninstallApp(kitsunebi_packageName)) { reportLog("设备环境异常") }
                //  从代理库获取代理信息
                try {
                    let proxy_data = httpUtilFunc.getProxyData(taskPluginData.proxyProvider, taskPluginData.proxyTag)
                    if (taskPluginData.proxyProvider == "doveip") {
                        log("deveip代理")
                        proxy_info = httpUtilFunc.getProxyFromDoveip(proxy_data.proxy, { "geo": taskPluginData.proxyCountry, "timeout": 10 })
                    }
                    else if (taskPluginData.proxyProvider == "cloudam") {
                        log("cloudam代理")
                        proxy_info = httpUtilFunc.getProxyFromCloudam(proxy_data.proxy, { "regionid": taskPluginData.proxyCountry })
                    }
                    else if (taskPluginData.proxyProvider == "connanys") {
                        log("connanys代理")
                        proxy_info = httpUtilFunc.getProxyFromConnanys(proxy_data.proxy, { "regionid": taskPluginData.proxyCountry, "timeout": 30 })
                    }
                    else if (taskPluginData.proxyProvider == "bytesfly") {
                        log("bytesfly代理")
                        proxy_info = httpUtilFunc.getProxyFromBytesfly("SOCKS5", 0, "tiktok", 1, 0, taskPluginData.proxyCountry)
                    }
                    else if (taskPluginData.proxyProvider == "sellerip") {// 新增代理sellerip规则
                        log("sellerip代理")
                        proxy_info = httpUtilFunc.getProxyFromSellerip(proxy_data.proxy, { "geo": taskPluginData.proxyCountry, "timeout": 10 })
                    }
                    else {
                        proxy_info = proxy_data.proxy
                    }
                    reportLog("获取的代理信息: " + JSON.stringify(proxy_info))
                } catch (error) {
                    taskDemo.desc = commonFun.objectToString(error)
                    reportLog(taskDemo.desc)
                    randomSleep(30000)
                    if (taskDemo.desc.match("IP 列表为空")) {
                        home()
                        for (let index = 0; index < 18; index++) {
                            toast("IP 列表为空")
                            sleep(10000)
                        }
                    }
                    else if (taskDemo.desc.match("无可用信息")) {
                        home()
                        for (let index = 0; index < 18; index++) {
                            toast("无可用代理信息")
                            sleep(10000)
                        }
                    }
                }
                if (!proxy_info) { continue }
                reportLog("代理配置 " + JSON.stringify(proxy_info))
                if (!proxySettings.kitsunebiInstall(taskPluginData.proxyLink)) { throw "未安装 " + "fun.kitsunebi.kitsunebi4android" }
                try {
                    is_proxy_on = proxySettings.kitsunebiSetup(proxy_info)
                    reportLog("代理连接结果: " + is_proxy_on)
                }
                catch (error) {
                    taskDemo.desc = "代理连接异常: " + commonFun.objectToString(error)
                    if (proxy_loop + 1 > proxy_loop_max) { throw taskDemo.desc }
                    reportLog(taskDemo.desc)
                    // continue
                }
                //  3. 检测代理
                for (let index = 0; index < 3; index++) {
                    global_ip = httpUtilFunc.getGlobalIp()
                    reportLog("检测IP: " + local_ip + " -> " + global_ip)
                    commonFun.showLog("代理IP检测: " + global_ip)
                    if (global_ip) { return true } else { taskDemo.desc = "代理已连接, 但IP检测失败 " + local_ip + " -> " + global_ip }
                    try { if (httpUtilFunc.isUrlAccessable("https://www.tiktok.com", "This page is not available in your area")) { taskDemo.desc = "代理已连接,但 tiktok 网站访问失败: " + "This page is not available in your area"; continue } } catch (error) { }
                    try { if (httpUtilFunc.isUrlAccessable("https://www.tiktok.com", "tiktok")) { return true } } catch (error) { taskDemo.desc = "代理已连接,但 tiktok 网站访问失败: " + commonFun.objectToString(error) }
                    randomSleep(5000)
                }
            }
        }, false, 1000 * 60 * 30, () => { throw "代理连接超时退出 " + taskDemo.desc })
    } else (
        log("跳过设置")
    )
} catch (error) {
    throw error
}




// proxy_info = null
// let ipInfo = {}
// if (taskPluginData.proxyProvider) {
//     let is_proxy_on = false
//     is_proxy_on = newThread(() => {
//         let proxy_loop_max = taskPluginData.proxyProvider == "doveip" ? 5 : 1
//         for (let proxy_loop = 0; proxy_loop < proxy_loop_max; proxy_loop++) {
//             // 检测网络是否通畅, 如果网络不通, 则卸载 代理软件
//             if (!httpUtilFunc.getGlobalIp() && !commonFun.uninstallApp(kitsunebi_packageName)) { reportLog("设备环境异常") }
//             //  从代理库获取代理信息
//             try {
//                 let proxy_data = httpUtilFunc.getProxyData(taskPluginData.proxyProvider, taskPluginData.proxyTag)
//                 if (taskPluginData.proxyProvider == "doveip") {
//                     log("deveip代理")
//                     proxy_info = httpUtilFunc.getProxyFromDoveip(proxy_data.proxy, { "geo": taskPluginData.proxyCountry, "timeout": 10 })
//                 }
//                 else if (taskPluginData.proxyProvider == "cloudam") {
//                     log("cloudam代理")
//                     proxy_info = httpUtilFunc.getProxyFromCloudam(proxy_data.proxy, { "regionid": taskPluginData.proxyCountry })
//                 }
//                 else if (taskPluginData.proxyProvider == "connanys") {
//                     log("connanys代理")
//                     proxy_info = httpUtilFunc.getProxyFromConnanys(proxy_data.proxy, { "regionid": taskPluginData.proxyCountry, "timeout": 30 })
//                 }
//                 else if (taskPluginData.proxyProvider == "bytesfly") {
//                     log("bytesfly代理")
//                     proxy_info = httpUtilFunc.getProxyFromBytesfly("SOCKS5", 0, "tiktok", 1, 0, taskPluginData.proxyCountry)
//                 }
//                 else if (taskPluginData.proxyProvider == "sellerip") {// 新增代理sellerip规则
//                     log("sellerip代理")
//                     proxy_info = httpUtilFunc.getProxyFromSellerip(proxy_data.proxy, { "geo": taskPluginData.proxyCountry, "timeout": 10 })
//                 }
//                 else {
//                     proxy_info = proxy_data.proxy
//                 }
//                 reportLog("获取的代理信息: " + JSON.stringify(proxy_info))
//             } catch (error) {
//                 taskDemo.desc = commonFun.objectToString(error)
//                 reportLog(taskDemo.desc)
//                 randomSleep(30000)
//                 if (taskDemo.desc.match("IP 列表为空")) {
//                     home()
//                     for (let index = 0; index < 18; index++) {
//                         toast("IP 列表为空")
//                         sleep(10000)
//                     }
//                 }
//                 else if (taskDemo.desc.match("无可用信息")) {
//                     home()
//                     for (let index = 0; index < 18; index++) {
//                         toast("无可用代理信息")
//                         sleep(10000)
//                     }
//                 }
//             }
//             if (!proxy_info) { continue }
//             reportLog("代理配置 " + JSON.stringify(proxy_info))
//             if (!proxySettings.kitsunebiInstall(taskPluginData.proxyLink)) { throw "未安装 " + "fun.kitsunebi.kitsunebi4android" }
//             try {
//                 is_proxy_on = proxySettings.kitsunebiSetup(proxy_info)
//                 reportLog("代理连接结果: " + is_proxy_on)
//             } catch (error) {
//                 taskDemo.desc = "代理连接异常: " + commonFun.objectToString(error)
//                 if (proxy_loop + 1 > proxy_loop_max) { throw taskDemo.desc }
//                 reportLog(taskDemo.desc)
//                 continue
//             }
//             //  获取本机ip
//             local_ip = httpUtilFunc.getLocalIp()
//             reportLog("本机 IP: " + local_ip)
//             commonFun.taskStepRecordSet(200, null, "获取本机ip", "获取本机ip：" + local_ip)
//             // ip检测
//             if (!is_proxy_on) { continue }
//             randomSleep(3000)
//             for (let index = 0; index < 3; index++) {
//                 is_proxy_on = false
//                 commonFun.showLog("代理IP检测: " + global_ip)
//                 reportLog("检测IP: " + local_ip + " -> " + global_ip)
//             }
//         }
//     }, false, 1000 * 60 * 30, () => { throw "代理连接超时退出 " + taskDemo.desc })
//     if (!is_proxy_on) { throw taskDemo.desc }
//     ipInfo = httpUtilFunc.getIpInfo()
//     reportLog("代理网络 " + JSON.stringify(ipInfo))
// } else (
//     log("跳过设置")
// )