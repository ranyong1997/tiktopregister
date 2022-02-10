/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-27 11:00:02
 * @LastEditTime: 2022-02-10 12:03:04
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




// facebook 迁移
function Facebook_Account_Transfer() {
    var androidId = material_gain()
    log("androidId---->", androidId)
    try {
        console.time('迁移耗时');
        log("正在迁移facebook账号")
        commonFun.Facebook_Account_Transfer(facebook_packageName, androidId)
        console.timeEnd('迁移耗时');
    } catch (error) {
        log("迁移fb时捕获到一个错误:", error)
        httpUtilFunc.materialRollback(appid, appid_key, material_INFO)
        engines.stopAll();
    }
    return true
}


// 素材获取
function material_gain(keyword_FB, used_times_model, used_counter) {
    try {
        log("正在素材获取")
        let app_id = taskPluginData.appid
        let appid_key = taskPluginData.appid_key
        var material_gain = httpUtilFunc.materialGet({
            "lable": keyword_FB, // FB素材标签
            "app_id": app_id,   // app_id
            "app_secret": appid_key,   // 密钥
            "count": 1, // 需要数据条数
            "type": 0,   // 类型（0:纯文本；1:图片；2:视频；3:音频）
            "classify": 3,   // 分类（文本类；图片类；视频类）
            "used_times_model": "lte",   // 匹配模式
            "used_times": used_counter    // 使用次数  // 上线需要将这个解开
        })
        android_Id = material_gain.text_content
        log("安卓id获取--->>", android_Id)
        material_INFO = material_gain
        log("素材info--->>", material_INFO)
        commonFun.taskStepRecordSet(200, null, "获取素材信息", material_INFO)
        return material_INFO, android_Id
    } catch (error) {
        log("获取素材时捕获到一个错误:" + error)
        commonFun.taskResultSet("素材获取失败" + error, "w")
    }
}


tiktio_backupUplive()
// 进行tiktok备份
function tiktio_backupUplive() {
    console.time('备份耗时');
    commonFun.backupUpApp(tiktop_packageName)
    commonFun.backupUpAppInfo(tiktop_packageName, backupTag)
    console.timeEnd('备份耗时');
}