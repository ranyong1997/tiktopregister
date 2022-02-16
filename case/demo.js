/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-27 11:00:02
 * @LastEditTime: 2022-02-16 15:28:47
 */


const commonFun = require("../lib/common.js");
const httpUtilFunc = require("../http/httpUtils");
const { reportLog } = require("../network/httpUtil.js");
const { randomSleep } = require("../lib/common.js");
const taskDemo = {}
var FIND_WIDGET_TIMEOUT = 1000
var desc = ""
var end = false
var isUsed = false
var isProcess = true
var gmail_package = "com.google.android.gm"

// 获取插件配置
try {   //  获取插件配置
    commonFun.taskStepRecordSet(20, null, "插件配置检测", null)
    taskPluginData = httpUtilFunc.getPluginData()
    reportLog("插件配置: " + JSON.stringify(taskPluginData))
    appName = taskPluginData.appName
    login = taskPluginData.login
    stoptimes = taskPluginData.stoptimes
    stoptimes2 = taskPluginData.stoptimes2
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
    log("stoptimes-->" + stoptimes)
} catch (error) {
    commonFun.taskStepRecordSet(250, null, "任务回滚", null)
    throw "插件配置 获取失败 " + commonFun.objectToString(error)
}


browse_Email()
enter_Email()

// 进入邮件
function browse_Email() {
    log('检查邮件')
    try {
        let check_page = id("com.google.android.gm:id/senders").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击第一封邮件")
            randomSleep()
            commonFun.clickWidget(check_page)
        }
    } catch (error) {
        log("检查邮件界面时捕获到一个错误:", error)
    }
}

// 浏览邮件
function enter_Email() {
    log('浏览邮件')
    try {
        sleep(2000)
        let check_star = id("com.google.android.gm:id/conversation_header_star").findOne(FIND_WIDGET_TIMEOUT)
        if (check_star != null) {
            log("点击收藏")
            commonFun.swipeDownRandomSpeed()
            commonFun.clickWidget(check_star)
            // 传入等待时间
            commonFun.swipeUpRandomSpeed()
            commonFun.swipeUpRandomSpeed()
            sleep(stoptimes * 1000)
            back()
        }
    } catch (error) {
        log("检查邮件界面时捕获到一个错误:", error)
    }
}