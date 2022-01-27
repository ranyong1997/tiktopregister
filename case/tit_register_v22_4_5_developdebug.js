/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-25 20:12:22
 * @LastEditTime: 2022-01-27 16:42:39
 */


// taskip写死 需要重置  在httpUtilFunc.getPluginData
const commonFun = require("../lib/common");
const httpUtilFunc = require("../http/httpUtils");
const proxySttings = require("../network/proxySttings.js");
const { reportLog } = require("../network/httpUtil.js");
const proxySettings = require("../vpn/proxySettings.js")
const enums = require("../util/enums")
const { newThread, randomSleep, taskResultSet, shortSleep, longSleep } = require("../lib/common.js");
const taskDemo = {}
var FIND_WIDGET_TIMEOUT = 1000
var registerDone = false
var isSuccess = true
var desc = ""
var fail_register = false
var isUsed = false
var isProcess = true
var launchAppCount = 1
var resgisterStatus = ""
var TT_PACKAGE = "com.zhiliaoapp.musically"
var facebook_packageName = "com.facebook.katana"
var kitsunebi_packageName = "fun.kitsunebi.kitsunebi4android"


taskDemo.init = function () {
    commonFun.showLog("init taskDemo")
    taskDemo.result = 0
    taskDemo.desc = ""
    if (commonFun.server.length) { return true }
}

taskDemo.runTask = function () {
    new function () {
        try {
        } catch (error) {
            log(commonFun.objectToString(error))
        }
        try {   //  初始化测试
            if (!commonFun.server) { throw "未连接到群控后台" }
            //  初始化网络测试   
            if (!httpUtilFunc.getLocalIp() && !commonFun.uninstallApp("fun.kitsunebi.kitsunebi4android")) { reportLog("设备环境异常") }
            randomSleep(3000)
            try { ui.run(function () { commonFun.statusBox.close() }); } catch (error) { }
        } catch (error) { httpUtilFunc.taskStop(null, error); throw error }
        try {
            let timestamp = new Date().getTime()
            log("现在时间---->", timestamp)
            try {   // 版本检测
                let happybayVersion = "1.1.40_beta_8_4"
                if (commonFun.happybayVersion < happybayVersion) { throw "happybayVersion " + commonFun.happybayVersion + " -> " + happybayVersion }
                let jsengineVersion = "4.1.1 Alpha2-gxl-817"
                if (commonFun.jsengineVersion < jsengineVersion) { throw "jsengineVersion " + commonFun.jsengineVersion + " -> " + jsengineVersion }
            } catch (error) {
                throw "系统应用版本过低,请先升级: " + commonFun.objectToString(error)
            }
            try {   //  初始化测试
                if (!commonFun.server) { throw "未连接到群控后台" }
                //  业务后台连接检测
                let lan_test = null
                for (let index = 0; index < 5; index++) {
                    try { lan_test = httpUtilFunc.testTaskServer() } catch (error) { }
                    commonFun.showLog("局域网测试: " + lan_test)
                    commonFun.taskStepRecordSet(200, null, "局域网测试", "局域网测试" + lan_test)
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
                            if (index > 80) { throw "业务后台连接异常, 请检查网络和服务器状态. " + commonFun.objectToString(error) }
                            commonFun.showLog("业务后台连接异常, 请检查网络和服务器状态. ")
                        }
                        sleep(60000)
                    }
                }
                randomSleep(3000)
            } catch (error) { throw error }
            try {   //  获取插件配置
                taskPluginData = httpUtilFunc.getPluginData()
                reportLog("插件配置: " + JSON.stringify(taskPluginData))
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
                log("facebook关键字: " + keyword_FB)
                log("系统语言: " + systemLanguage)
                log("系统时区: " + systemTimezone)
                log("代理归属国: " + proxyCountry)
                log("代理来源: " + proxyProvider)
                log("素材标签: " + materialTag)
                log("备份标签: " + backupTag)
                log("备份标签2: " + backupTag2)
                log("appid: " + appid)
                log("appid_key: " + appid_key)
                log("素材类型: " + type)
                log("文本类型: " + classify)
                log("素材匹配: " + used_times_model)
                log("使用次数: " + used_counter)
                commonFun.taskStepRecordSet(200, null, "获取插件配置信息", "获取插件配置信息:" + JSON.stringify(taskPluginData))
                material_gain(keyword_FB, appid, appid_key, type, classify, used_times_model, used_counter)
            } catch (error) {
                log("  插件配置 获取失败 " + commonFun.objectToString(error))
                throw "插件配置 获取失败 " + JSON.stringify(error)
            }
            //  执行任务
            try {
                try {   //  ip、语言、时区检测
                    taskDemo.result = 1
                    //  获取本机ip
                    local_ip = httpUtilFunc.getLocalIp()
                    reportLog("本机 IP: " + local_ip)
                    commonFun.taskStepRecordSet(200, null, "获取本机ip", "获取本机ip：" + local_ip)
                    // 系统语言、时区获取设置
                    if (taskPluginData.systemLanguage != "") {
                        reportLog("检测系统语言: " + commonFun.systemLanguageGet())
                        commonFun.systemLanguageSet(systemLanguage)
                        sleep(3000)
                        if (taskPluginData.systemLanguage != commonFun.systemLanguageGet()) {
                            throw "系统语言错误"
                        }
                    }
                    if (taskPluginData.systemTimezone != "") {
                        reportLog("检测系统时区: " + commonFun.systemTimezoneGet())
                        commonFun.systemTimezoneSet_New(systemTimezone)
                        sleep(3000)
                        if (taskPluginData.systemTimezone != commonFun.systemTimezoneGet()) {
                            throw "系统时区错误"
                        }
                    }
                } catch (error) { throw error }
                // 代理获取
                let proxy_info = null
                let ipInfo = {}
                if (taskPluginData.proxyProvider) {
                    let is_proxy_on = false
                    is_proxy_on = newThread(() => {
                        let proxy_loop_max = taskPluginData.proxyProvider == "doveip" ? 5 : 1
                        for (let proxy_loop = 0; proxy_loop < proxy_loop_max; proxy_loop++) {
                            // 检测网络是否通畅, 如果网络不通, 则卸载 代理软件
                            if (!httpUtilFunc.getGlobalIp() && !commonFun.uninstallApp("fun.kitsunebi.kitsunebi4android")) { reportLog("设备环境异常") }
                            //  从代理库获取代理信息
                            try {
                                let proxy_data = httpUtilFunc.getProxyData(taskPluginData.proxyProvider, taskPluginData.proxyTag)
                                if (taskPluginData.proxyProvider == "doveip") {
                                    proxy_info = httpUtilFunc.getProxyFromDoveip(proxy_data.proxy, { "geo": taskPluginData.proxyCountry, "timeout": 10 })
                                }
                                else if (taskPluginData.proxyProvider == "cloudam") {
                                    proxy_info = httpUtilFunc.getProxyFromCloudam(proxy_data.proxy, { "regionid": taskPluginData.proxyCountry })
                                }
                                else if (taskPluginData.proxyProvider == "connanys") {
                                    proxy_info = httpUtilFunc.getProxyFromConnanys(proxy_data.proxy, { "regionid": taskPluginData.proxyCountry, "timeout": 30 })
                                }
                                else if (taskPluginData.proxyProvider == "bytesfly") {
                                    proxy_info = httpUtilFunc.getProxyFromBytesfly("SOCKS5", 0, "tiktok", 1, 0, taskPluginData.proxyCountry)
                                }
                                else if (taskPluginData.proxyProvider == "xxx") {// 新增代理规则
                                    proxy_info = httpUtilFunc.getProxyFromBytesfly("SOCKS5", 0, "tiktok", 1, 0, taskPluginData.proxyCountry)
                                }
                                else {
                                    proxy_info = proxy_data.proxy
                                }
                                reportLog("获取的代理信息: " + JSON.stringify(proxy_info))
                            } catch (error) {
                                taskDemo.desc = commonFun.objectToString(error)
                                reportLog(taskDemo.desc)
                                proxy_info = null
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
                            } catch (error) {
                                taskDemo.desc = "代理连接异常: " + commonFun.objectToString(error)
                                if (proxy_loop + 1 > proxy_loop_max) { throw taskDemo.desc }
                                reportLog(taskDemo.desc)
                                continue
                            }
                            // ip检测出问题
                            if (!is_proxy_on) { continue }
                            randomSleep(3000)
                            global_ip = null
                            for (let index = 0; index < 3; index++) {
                                is_proxy_on = false
                                commonFun.showLog("代理IP检测: " + global_ip)
                                global_ip = httpUtilFunc.getGlobalIp()
                                reportLog("检测IP: " + local_ip + " -> " + global_ip)
                                commonFun.showLog("代理IP检测: " + global_ip)
                                if (global_ip) { is_proxy_on = true; break }
                                try { if (httpUtilFunc.isUrlAccessable("https://www.tiktok.com", "This page is not available in your area")) { taskDemo.desc = "代理已连接,但 tiktok 网站访问失败: " + "This page is not available in your area"; break } } catch (error) { }
                                try {
                                    if (httpUtilFunc.isUrlAccessable("https://www.tiktok.com", "tiktok")) { is_proxy_on = true; break } else { taskDemo.desc = "代理已连接,但 tiktok 网站访问失败: " }
                                } catch (error) { taskDemo.desc = "代理已连接,但 tiktok 网站访问失败: " + commonFun.objectToString(error) }
                                randomSleep(5000)
                            }
                        }
                    }, false, 1000 * 60 * 30, () => { throw "代理连接超时退出 " + taskDemo.desc })
                    if (!is_proxy_on) { throw taskDemo.desc }
                    ipInfo = httpUtilFunc.getIpInfo()
                    reportLog("代理网络 " + JSON.stringify(ipInfo))
                }
                log("注册脚本or 修改头像脚本")
                // 素材获取


                // 注册脚本
                try {
                    if (register != "") {
                        checkFacebookInstall()   // 检测facebook是否安装
                        checkTiktokInstall() // 检测tiktok是否安装
                        checkVPNInstall()   // 检测vpn是否安装
                        function doSomething() {
                            if (connectVPN()) {
                                alaways_running()
                                while (true) {
                                    // 判断是否已连接vpn
                                    log("脚本执行")
                                    One_Key_Login()
                                    break
                                }
                            }
                        }
                        let myThreadResult = commonFun.newThread(doSomething, false, 1000 * 60 * 12, () => { log("时间已超时12分钟,程序退出") })
                        function alaways_running() {
                            Facebook_Account_Transfer()
                        }
                    } else if (updatePhoto != "") {
                        log("选择修改头像")
                    } else if (register == "on" && updatePhoto == "on") {
                        // 没法判断同时开启
                        log("又注册又修改头像")
                    }
                    else {
                        log("你即没有选注册脚本又没有选修改头像")
                        log("即将停止脚本")
                        engines.stopAll();
                        toastLog("停止脚本")
                    }
                } catch (error) {
                    throw error
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            taskDemo.result = 0
            taskDemo.desc = commonFun.objectToString(error)
            commonFun.taskResultSet(taskDemo.desc, "a")
        }
        sleep(3000)
        try { threads.shutDownAll() } catch (error) { }
        try { home(); sleep(2000) } catch (error) { }
        let task_result = "任务结果: " + taskDemo.result + " - \n" + commonFun.taskResultGet()
        commonFun.taskStepRecordSet(200, null, "任务运行结果", "任务运行结果" + task_result)
        commonFun.taskResultSet(task_result, "w")
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
function material_gain(keyword_FB, appid, appid_key, type, classify, used_times_model, used_counter) {
    try {
        log("正在素材获取")
        var material_gain = httpUtilFunc.materialGet({
            "lable": keyword_FB, // FB素材标签
            "app_id": appid,   // app_id
            "app_secret": appid_key,   // 密钥
            "count": 1, // 需要数据条数
            "type": type,   // 类型（0:纯文本；1:图片；2:视频；3:音频）
            "classify": classify,   // 分类（文本类；图片类；视频类）
            "used_times_model": used_times_model,   // 匹配模式
            // "used_times": used_counter    // 使用次数
        })
        android_Id = material_gain.text_content
        log("安卓id获取--->>", android_Id)
        material_INFO = material_gain
        log("素材info--->>", material_INFO)
        commonFun.taskStepRecordSet(200, null, "获取素材信息", "获取素材信息：" + material_INFO)
        return material_INFO
    } catch (error) {
        log("获取素材时捕获到一个错误:" + error)
        commonFun.taskResultSet("素材获取失败" + error, "w")
    }
}
// ---------------------------------写方法区-----------------------

taskDemo.init()
module.exports = taskDemo;