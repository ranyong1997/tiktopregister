/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-25 20:12:22
 * @LastEditTime: 2022-01-26 17:12:41
 */
const commonFunc = require("../lib/common");
const httpUtilFunc = require("../http/httpUtils");
const httpUtilFun = require("../network/httpUtil.js");
const proxySttings = require("../network/proxySttings.js");
const { reportLog } = require("../network/httpUtil.js");
const { newThread, randomSleep, taskResultSet, shortSleep, longSleep } = require("../lib/common.js");
const taskDemo = {}
var FIND_WIDGET_TIMEOUT = 1000
var TT_PACKAGE = "com.zhiliaoapp.musically"

taskDemo.init = function () {
    commonFunc.showLog("init taskDemo")
    taskDemo.result = 0
    taskDemo.desc = ""
    if (commonFunc.server.length) { return true }
}

taskDemo.runTask = function () {
    new function () {
        try {
        } catch (error) {
            log(commonFunc.objectToString(error))
        }
        try {   //  初始化测试
            if (!commonFunc.server) { throw "未连接到群控后台" }
            //  初始化网络测试                
            if (!httpUtilFunc.getGlobalIp() && !commonFunc.uninstallApp("fun.kitsunebi.kitsunebi4android")) { reportLog("设备环境异常") }
            randomSleep(3000)

            commonFunc.showLog("")
            try { ui.run(function () { commonFunc.statusBox.close() }); } catch (error) { }
        } catch (error) { httpUtilFunc.taskStop(null, error); throw error }

        try {
            let timestamp = new Date().getTime()
            try {   // 版本检测
                let happybayVersion = "1.1.40_beta_8_4"
                if (commonFunc.happybayVersion < happybayVersion) { throw "happybayVersion " + commonFunc.happybayVersion + " -> " + happybayVersion }
                let jsengineVersion = "4.1.1 Alpha2-gxl-817"
                if (commonFunc.jsengineVersion < jsengineVersion) { throw "jsengineVersion " + commonFunc.jsengineVersion + " -> " + jsengineVersion }
            } catch (error) {
                throw "系统应用版本过低,请先升级: " + commonFunc.objectToString(error)
            }
            try {   //  初始化测试
                if (!commonFunc.server) { throw "未连接到群控后台" }
                //  业务后台连接检测
                let lan_test = null
                for (let index = 0; index < 5; index++) {
                    try { lan_test = httpUtilFunc.testTaskServer() } catch (error) { }
                    commonFunc.showLog("局域网测试: " + lan_test)
                    commonFunc.taskStepRecordSet(200, null, "局域网测试", "局域网测试" + lan_test)
                    if (lan_test) { break }
                    sleep(5000)
                }
                if (!lan_test) {
                    //  业务后台连接检测
                    log("业务后台连接异常")
                    for (let index = 0; index < 90; index++) {
                        try {
                            if (httpUtilFunc.testTaskServer()) {
                                break
                            }
                            throw ""
                        } catch (error) {
                            if (index > 80) { throw "业务后台连接异常, 请检查网络和服务器状态. " + commonFunc.objectToString(error) }
                            commonFunc.showLog("业务后台连接异常, 请检查网络和服务器状态. ")
                        }
                        sleep(60000)
                    }
                }
                randomSleep(3000)
            } catch (error) { throw error }
            try {   //  获取插件配置
                taskPluginData = httpUtilFunc.getPluginData()
                reportLog("插件配置: " + JSON.stringify(taskPluginData))
                reportLog("  插件配置New: " + JSON.stringify(taskPluginData))
                keyword_FB = taskPluginData.keyword_FB
                systemLanguage = taskPluginData.systemLanguage
                systemTimezone = taskPluginData.systemTimezone
                proxyCountry = taskPluginData.proxyCountry
                proxyProvider = taskPluginData.proxyProvider
                proxyTag = taskPluginData.proxyTag
                updataBirthday = taskPluginData.updataBirthday == "on" ? true : false
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
                log("Facebook关键字", keyword_FB)
                log("系统语言", systemLanguage)
                log("系统时区", systemTimezone)
                log("代理归属国", proxyCountry)
                log("代理来源", proxyProvider)
                log("代理标签", proxyTag)
                log("修改头像", updatePhoto)
                log("修改生日", updataBirthday)
                log("素材标签", materialTag)
                log("备份标签", backupTag)
                log("备份标签2", backupTag2)
                log("关联", relevance)
                log("素材账号", material_username)
                log("AppId", appid)
                log("密钥", appid_key)
                log("素材类型", type)
                log("文本类型", classify)
                log("匹配模式", used_times_model)
                log("使用次数", used_counter)
                commonFunc.taskStepRecordSet(200, null, "获取插件配置信息", "获取插件配置信息:" + JSON.stringify(taskPluginData))

            } catch (error) {
                log("  插件配置 获取失败 " + commonFunc.objectToString(error))
                throw "插件配置 获取失败 " + JSON.stringify(error)
            }
            //  执行任务
            try {
                try {   //  ip、语言、时区检测
                    taskDemo.result = 1
                    //  本机ip
                    let local_ip = httpUtilFun.getIpInfo(1000) // ip获取失败
                    reportLog("本机 IP: " + local_ip)
                    commonFunc.taskStepRecordSet(200, null, "获取本机ip", "获取本机ip" + local_ip)
                    log("本机 IP: " + local_ip)
                    // 系统语言、时区获取设置
                    if (taskPluginData.systemLanguage != "") {
                        reportLog("检测系统语言: " + commonFunc.systemLanguageGet())
                        commonFunc.systemLanguageSet(systemLanguage)
                        sleep(3000)
                        if (taskPluginData.systemLanguage != commonFunc.systemLanguageGet()) {
                            throw "系统语言错误"
                        }
                    }
                    if (taskPluginData.systemTimezone != "") {
                        reportLog("检测系统时区: " + commonFunc.systemTimezoneGet())
                        commonFunc.systemTimezoneSet_New(systemTimezone)
                        sleep(3000)
                        if (taskPluginData.systemTimezone != commonFunc.systemTimezoneGet()) {
                            throw "系统时区错误"
                        }
                    }
                    reportLog("当前系统语言: " + commonFunc.systemLanguageGet())
                    reportLog("当前系统时区: " + commonFunc.systemTimezoneGet())
                } catch (error) { throw error }
                // 注册脚本or 修改头像脚本
                log("注册脚本or 修改头像脚本")
                // 素材获取
                material_gain(materialTag, appid, appid_key, type, classify, used_times_model, used_counter)

            } catch (error) {
                throw error
            }
        } catch (error) {
            taskDemo.result = 0
            taskDemo.desc = commonFunc.objectToString(error)
            commonFunc.taskResultSet(taskDemo.desc, "a")
        }
        sleep(3000)
        try { threads.shutDownAll() } catch (error) { }
        try { home(); sleep(2000) } catch (error) { }
        let task_result = "任务结果: " + taskDemo.result + " - \n" + commonFunc.taskResultGet()
        commonFunc.taskStepRecordSet(200, null, "任务运行结果", "任务运行结果" + task_result)
        commonFunc.taskResultSet(task_result, "w")
        //  任务结果反馈    
        if (taskDemo.result == 1) {
            reportLog(task_result, 1)
        } else {
            reportLog(task_result, 2)
            throw task_result
        }
    }()
}





// ---------------------------------写方法区-----------------------
// 素材获取
function material_gain(materialTag, appid, appid_key, type, classify, used_times_model, used_counter) {
    try {
        log("正在素材获取")
        var material_gain = httpUtilFunc.materialGet({
            "lable": materialTag, // 标签
            "app_id": appid,   // app_id
            "app_secret": appid_key,   // 密钥
            "count": 1, // 取数量 默认1个
            "type": type, // 素材类型（0:纯文本；1:图片；2:视频；3:音频）
            "classify": classify,  // 文本类型(0:默认；1:昵称；2:简介；3:外链; 4:对话模板) / 图片类型(0:默认；1:发布内容；2:头像) / 视频类型(0:默认；1:发布内容)
            "used_times_model": used_times_model,   // 匹配模式
            "used_times": used_counter    // 使用次数
        })
        material_INFO = material_gain
        log("素材info--->>", material_INFO)
        commonFunc.taskStepRecordSet(200, null, "获取素材信息", "获取素材信息：" + material_INFO)
        return material_INFO
    } catch (error) {
        log("获取素材时捕获到一个错误:" + error)
        commonFunc.taskResultSet("素材获取失败" + error, "w")
    }
}

// ---------------------------------写方法区-----------------------

taskDemo.init()
module.exports = taskDemo;