/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-25 20:12:22
 * @LastEditTime: 2022-02-14 15:15:41
 */


// taskip写死 需要重置  在httpUtilFunc.getPluginData
const commonFun = require("../lib/common.js");
const httpUtilFunc = require("../http/httpUtils");
const targetApp = require("../app/tiktokApp.js");
const { reportLog } = require("../network/httpUtil.js");
const proxySettings = require("../vpn/proxySettings.js")
const enums = require("../util/enums")
const { newThread, randomSleep, clickIfWidgetClickable, taskResultSet, shortSleep, longSleep } = require("../lib/common.js");
const taskDemo = {}
let taskPluginData = null
var FIND_WIDGET_TIMEOUT = 750
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
var gmail_package = "com.google.android.gm"


taskDemo.init = function () {
    commonFun.showLog("init tit_register_v22_4_5")
    taskDemo.result = 0
    taskDemo.desc = ""
    commonFun.forceStopApp(targetApp.bid)
}
taskDemo.init()
taskDemo.runTask = function () {
    new function () {
        try {
            try {   // 版本检测
                let happybayVersion = "1.1.40_beta_8_4"
                if (commonFun.happybayVersion < happybayVersion) { throw "happybayVersion " + commonFun.happybayVersion + " -> " + happybayVersion }
                if (commonFun.happybayVersion < "1.1.50_beta_4_8") { commonFun.taskResultSet("请升级群控系统应用:" + commonFun.happybayVersion + " -> " + "1.1.50_beta_4_8", "w") }
                let jsengineVersion = "4.1.1 Alpha2-gxl-817"
                if (commonFun.jsengineVersion < jsengineVersion) { throw "jsengineVersion " + commonFun.jsengineVersion + " -> " + jsengineVersion }
            } catch (error) {
                throw "系统应用版本过低,请先升级: " + commonFun.objectToString(error)
            }
            let timestamp = new Date().getTime()
            //  初始化测试
            try {
                if (!commonFun.server) { throw "未连接到群控后台" }
                //  业务后台连接检测
                commonFun.taskStepRecordSet(10, null, "业务后台连接检测", null)
                let lan_test = null
                for (let index = 0; index < 6; index++) {
                    try { lan_test = httpUtilFunc.testTaskServer() } catch (error) { }
                    commonFun.showLog("局域网测试: " + lan_test)
                    if (lan_test) { break }
                    sleep(5000)
                }
                if (!lan_test) {
                    log("业务后台连接异常")
                    commonFun.uninstallApp("fun.kitsunebi.kitsunebi4android")
                    //  业务后台连接检测
                    for (let index = 0; index < 90; index++) {
                        try {
                            if (!httpUtilFunc.testTaskServer()) { throw "" }
                            break
                        } catch (error) {
                            if (index > 80) { throw "业务后台连接异常, 请检查网络和服务器状态. " + commonFun.objectToString(error) }
                            commonFun.showLog("业务后台连接异常, 请检查网络和服务器状态. ")
                        }
                        sleep(60000)
                    }
                }
                randomSleep(3000)
                commonFun.showLog("")
            } catch (error) {
                commonFun.taskStepRecordSet(250, null, "任务回滚", null)
                throw error
            }
            try {   //  获取插件配置
                commonFun.taskStepRecordSet(20, null, "插件配置检测", null)
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
                log("目标应用包名: " + appName)
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
                log("素材匹配: " + used_times_model)
                log("使用次数: " + used_counter)
            } catch (error) {
                commonFun.taskStepRecordSet(250, null, "任务回滚", null)
                throw "插件配置 获取失败 " + commonFun.objectToString(error)
            }
            try {   //  ip、语言、时区检测
                taskDemo.result = 1
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
                    reportLog("当前系统时区: " + commonFun.systemTimezoneGet())
                    commonFun.systemTimezoneSet_New(systemTimezone)
                    sleep(3000)
                    if (taskPluginData.systemTimezone != commonFun.systemTimezoneGet()) {
                        throw "系统时区错误"
                    }
                }
            } catch (error) { throw error }
            //  执行任务
            try {
                //  本地网络
                local_ip = httpUtilFunc.getLocalIp()
                log("本地 IP: " + local_ip)
                global_ip = null
                // vpn---> none
                // 获取代理异常: 代理标签为空
                if (taskPluginData.proxyProvider != "none") {
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
            try {
                if (login != "") {
                    log("Gmail一键登录")
                    commonFun.taskStepRecordSet(40, null, "Gmail一键登录任务", null)
                    // 素材获取
                    material_gain(keyword_FB, used_times_model, used_counter)
                    One_Key_Login()
                    commonFun.taskStepRecordSet(40, null, "Gmail一键登录任务结束", null)
                    // checkFacebookInstall()   // 检测facebook是否安装
                    // checkTiktokInstall() // 检测tiktok是否安装
                    // function doSomething() {
                    //     commonFun.taskStepRecordSet(40, null, "TT一键登录任务", null)
                    //     Facebook_Account_Transfer()
                    //     sleep(2000)
                    //     log("脚本执行")
                    //     One_Key_Login()
                    //     commonFun.taskStepRecordSet(40, null, "TT一键登录任务结束", null)
                    // }
                    // let myThreadResult = commonFun.newThread(doSomething, false, 1000 * 60 * 12, () => { log("时间已超时12分钟,程序退出") })
                }
            } catch (error) {
                throw error
            }
            reportLog("运行时间 - " + parseInt((new Date().getTime() - timestamp) / 1000 / 60) + "分钟")
            if (taskDemo.result != 1) { throw taskDemo.desc }
        } catch (error) {
            throw error
        }
    }()
    sleep(3000)
    try { threads.shutDownAll() } catch (error) { }
    try { home(); sleep(2000) } catch (error) { }
    //  清理任务缓存
    try { targetApp.clearTaskCache() } catch (error) { }
    let task_result = commonFun.taskStepRecordGet()
    if (!task_result || typeof (task_result) != "object") { throw "未识别到任务上报日志" }
    let taskStatus = null
    let logsdesc = null
    if (taskDemo.result == 1) {
        taskStatus = 200
        try { logsdesc = "任务完成 " + (task_result.logsdesc || "下载报表查看详情") } catch (error) { log(error) }
        commonFun.taskStepRecordSet(taskStatus, null, null, logsdesc)
    } else {
        if (task_result.taskStatus == 40) {
            taskStatus = 0
            logsdesc = "任务中途异常 " + (task_result.logsdesc || "下载报表查看详情")
            commonFun.taskStepRecordSet(taskStatus, null, null, logsdesc)
        }
        else if (task_result.taskStatus == 250) {
            logsdesc = "任务回滚,因为-" + (task_result.logsdesc || "下载报表查看详情")
            commonFun.taskStepRecordSet(taskStatus, null, null, logsdesc)
            throw task_result.taskStatus + "-" + logsdesc
        }
        else {
            logsdesc = (task_result.logsdesc || "下载报表查看详情")
            commonFun.taskStepRecordSet(taskStatus, null, null, logsdesc)
            throw task_result.taskStatus + "-" + logsdesc
        }
        // try { logsdesc = "任务中途异常 " + (task_result.logsdesc || "下载报表查看详情") } catch (error) { log(error) }
        // commonFun.taskStepRecordSet( taskStatus, null, null, logsdesc )
        // if( task_result.taskStatus > 0 && task_result.taskStatus < 40 ){ throw task_result.taskStatus +"-"+ logsdesc }
    }
}

// ---------------------------------写方法区-----------------------
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
            "used_times_model": used_times_model,   // 匹配模式
            "used_times": used_counter    // 使用次数 
        })
        Gmail_info = material_gain.text_content.split(",")
        log("Gmail邮箱密码获取--->>", Gmail_info)
        username = Gmail_info[0]
        password = Gmail_info[1]
        username1 = Gmail_info[2]
        log("账号为：", username, "密码为：", password, "辅助账号为：", username1)
        material_INFO = material_gain
        return Gmail_info
    } catch (error) {
        log("获取素材时捕获到一个错误:" + error)
        commonFun.taskResultSet("素材获取失败" + error, "w")
    }
}
// 回滚素材库
function matter_rollback() {
    let app_id = taskPluginData.appid
    let appid_key = taskPluginData.appid_key
    httpUtilFunc.materialRollback(app_id, appid_key, material_INFO)
}

// 更新账号信息到8000端口 // TODO:你登录后直接将AndroidID和gmail账号密码等关系上传到服务器就好了
function updateRegisterResult() {
    log("更新账号信息到8000端口")
    try {
        return commonFun.newThread(() => {
            var data = {
                "forceRecord": true,
                "type": 1,
                "appName": "gmail",
                "phone": keyword_Gmail + commonFun.androidId,
                "deviceId": commonFun.deviceId,
                "folderId": commonFun.folderId,
                "androidId": commonFun.androidId,
                "password": null,
                "username": username,
                "password": password,
                "tag": backupTag2,
                "phoneProvider": null,
                "dialCode": null,
                "countryCode": null,
                "email": null,
                "emailPassword": null,
                "smsurl": null,
                "isRegistered": false,
                "isProcess": isProcess,
                "extra": null,
                "city": null,
                "country": null,
                "emailProvider": null,
                "proxy": null,
                "proxyProvider": null,
                "ip": global_ip,
                "isUsed": isUsed,
                "desc": desc,
                "isSuccess": isSuccess,
                "deviceInfo": commonFun.model,
                "nickname": username
            }
            httpUtilFunc.reportLog("更新注册账号: " + JSON.stringify(data))
            url = "http://" + commonFun.server + ":8000/user/registered"
            var res = http.postJson(url, data);
            res = res.body.json()
            httpUtilFunc.reportLog("更新注册账号结果: " + JSON.stringify(res))
            if (res.code != 200) { throw res }
            tiktio_backupUplive()
            return JSON.parse(res.data)
        })
    } catch (error) {
        httpUtilFunc.reportLog("更新注册账号异常: " + JSON.stringify(error))
        commonFun.taskResultSet("更新账号失败" + error, "w")
    }
    return null
}

// 一键登陆Gmail邮箱
function One_Key_Login() {
    toastLog("开始Gmail一键登陆功能")
    openGMSApp(commonFun.userId)
    randomSleep()
    if (!packageName(gmail_package).findOne(1)) {
        log("Gmail启动中...")
        launch(gmail_package)
        sleep(3000)
    } else {
        log("目前还没有此app,请检查改机工具是否被隐藏")
        openGMSApp(commonFun.userId)
        launch(gmail_package)
    }
    do {
        try {
            // 写方法区
            click_GotIt()
            click_Add()
            click_Google()
            click_Signin()
            click_Welcome()
            click_Add_Phone()
            click_SkipBtn()
            click_AgreeBtn()
            click_TakeMeToBtn()
            click_PopUpBtn()
            click_AbnormalTip()
            click_HeadPortrait()
            click_IdInfo()
        } catch (error) {
            log("一键登陆时捕获到一个错误:" + error)
        }
    } while (true);
}

// 杀进程
function kill_tt() {
    shell("am force-stop " + tiktop_packageName)
}

// ------------------------------------------分割线-----------------
// 更新账号信息到8000端口
function updateRegisterResult() {
    log("更新账号信息到8000端口")
    try {
        return commonFun.newThread(() => {
            var data = {
                "forceRecord": true,
                "type": 1,
                "appName": "Gmail",
                "phone": "test_20220117 Ran_" + commonFun.androidId,
                "deviceId": commonFun.deviceId,
                "folderId": commonFun.folderId,
                "androidId": commonFun.androidId,
                "password": null,
                "username": user_name,
                "tag": "test_20220121(Gmail)_ran",
                "phoneProvider": null,
                "dialCode": null,
                "countryCode": "US",
                "email": username,
                "emailPassword": password,
                "smsurl": null,
                "isRegistered": false,
                "isProcess": isProcess,
                "extra": null,
                "city": null,
                "country": null,
                "emailProvider": null,
                "proxy": vpnData,
                "proxyProvider": "connanys",
                "ip": global_ip,
                "isUsed": isUsed,
                "desc": desc,
                "isSuccess": isSuccess,
                "deviceInfo": commonFun.model,
                "nickname": user_name
            }
            httpUtilFunc.reportLog("更新注册账号: " + JSON.stringify(data))
            var url = "http://" + commonFun.server + ":8000/user/registered"
            var res = http.postJson(url, data);
            res = res.body.json()
            httpUtilFunc.reportLog("更新注册账号结果: " + JSON.stringify(res))
            if (res.code != 200) { throw res }
            return JSON.parse(res.data)
        })
    } catch (error) {
        httpUtilFunc.reportLog("更新注册账号异常: " + JSON.stringify(error))
        commonFun.taskResultSet("更新账号失败" + error, "w")
    }
    return null
}

// 进入改机工具
function openGMSApp(userId) {
    try {
        let xtestResult = shell("getprop ro.boot.cltest.xtest").result;

        if (xtestResult != 0x2) {
            throw "google框架未开启";
        }
        log("openGMSApp:enable");
        shell("pm enable --user " + userId + " com.google.android.carriersetup");
        shell("pm enable --user " + userId + " com.google.android.youtube");
        shell("pm enable --user " + userId + " com.google.android.ext.services");
        shell("pm enable --user " + userId + " com.google.android.ext.shared");
        shell("pm enable --user " + userId + " com.google.android.onetimeinitializer");
        shell("pm enable --user " + userId + " com.google.android.configupdater");
        shell("pm enable --user " + userId + " com.google.android.gm");
        shell("pm enable --user " + userId + " com.google.android.apps.maps");
        shell("pm enable --user " + userId + " com.google.android.syncadapters.contacts");
        shell("pm enable --user " + userId + " com.google.android.gms");
        shell("pm enable --user " + userId + " com.google.android.gsf");
        shell("pm enable --user " + userId + " com.google.android.packageinstaller");
        shell("pm enable --user " + userId + " com.google.android.partnersetup");
        shell("pm enable --user " + userId + " com.google.android.feedback");
        shell("pm enable --user " + userId + " com.google.android.backuptransport");
        shell("pm enable --user " + userId + " com.google.android.gms.setup");
        shell("pm enable --user " + userId + " com.android.vending");
        shell("pm enable --user " + userId + " com.android.chrome");
        return true
    } catch (error) {
        throw "google相关app enable失败：" + error;
    }
}

// 从素材库获取账号密码
function material_gain1() {
    try {
        log("正在素材获取")
        var material_gain = httpUtilFunc.materialGet({
            "app_id": "21a5ae2f6168064f2c664056ea56726b",
            "app_secret": "132a34bba2167280f59f4bd249b2ae69",
            "count": 1,
            "type": 0,
            "classify": 3,
            "used_times": 0,
            "used_times_model": "lte",
            "lable": "gmail"
        })
        Gmail_info = material_gain.text_content.split(",")
        log("Gmail邮箱密码获取--->>", Gmail_info)
        username = Gmail_info[0]
        password = Gmail_info[1]
        username1 = Gmail_info[2]
        log("账号为：", username, "密码为：", password, "辅助账号为：", username1)
        material_INFO = material_gain
        return Gmail_info
    } catch (error) {
        log("获取安卓id时捕获到一个错误:" + error)
        commonFun.taskResultSet("素材获取失败" + error, "w")
    }
}

// Gmail第一步:点击GOT IT
function click_GotIt() {
    log("检查GOT IT是否存在")
    try {
        let check_page = text("GOT IT").id("com.google.android.gm:id/welcome_tour_got_it").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击GOT IT")
            randomSleep()
            commonFun.clickWidget(check_page)
        }
    } catch (error) {
        log("检查GOT IT页面时捕获到一个错误:", error)
    }
}
// Gmail第二步:点击Add an email address
function click_Add() {
    log("检查Add an email address是否存在")
    try {
        let check_page = text("Add an email address").id("com.google.android.gm:id/setup_addresses_add_another").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击Add an email address")
            randomSleep()
            commonFun.clickWidget(check_page)
        }
    } catch (error) {
        log("检查Add an email address页面时捕获到一个错误:", error)
    }
}
// Gmail第三步:点击Google
function click_Google() {
    log("检查Google是否存在")
    try {
        let check_page = text("Google").id("com.google.android.gm:id/account_setup_label").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击Google")
            randomSleep()
            commonFun.clickWidget(check_page)
        }
    } catch (error) {
        log("检查Google页面时捕获到一个错误:", error)
    }
}
// Gmail第四步:输入邮箱账号
function click_Signin() {
    log("检查Signin是否存在")
    try {
        let check_page = text("Learn more about Google Accounts").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("输入邮箱")
            setText(username)
            randomSleep()
            log("检查Next是否存在")
            try {
                let check_Next_Btn = text("Next").findOne(FIND_WIDGET_TIMEOUT)
                if (check_Next_Btn != null) {
                    log("点击Next")
                    commonFun.clickWidget(check_Next_Btn)
                    sleep(5000)
                }
            } catch (error) {
                log("检查Next页面时捕获到一个错误:", error)
            }
        }
    } catch (error) {
        log("检查Signin页面时捕获到一个错误:", error)
    }
}
// Gmail第五步:输入邮箱密码
function click_Welcome() {
    log("检查Welcome是否存在")
    try {
        let check_page = text("Welcome").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("输入密码")
            setText(password)
            randomSleep()
            log("检查展示密码")
            try {
                let check_Show_pas = text("Show password").findOne(FIND_WIDGET_TIMEOUT)
                if (check_Show_pas != null) {
                    log("点击展示密码")
                    commonFun.clickWidget(check_Show_pas)
                    sleep(3000)
                }
            } catch (error) {
                log("检查展示密码按钮时捕获到一个错误:", error)
            }
            log("检查Next是否存在")
            try {
                let check_Next_Btn = text("Next").findOne(FIND_WIDGET_TIMEOUT)
                if (check_Next_Btn != null) {
                    log("点击Next")
                    randomSleep()
                    commonFun.clickWidget(check_Next_Btn)
                    sleep(5000)
                }
                log("检查是否需要辅助邮箱验证")
                let check_AssistVerify = text("Confirm your recovery email").findOne(FIND_WIDGET_TIMEOUT)
                if (check_AssistVerify != null) {
                    log("点击辅助邮箱验证")
                    randomSleep()
                    commonFun.clickWidget(check_AssistVerify)
                    sleep(5000)
                    log("检查输入辅助邮箱页面是否存在")
                    let check_AssistVerifyPag = text("Try another way").findOne(FIND_WIDGET_TIMEOUT)
                    if (check_AssistVerifyPag != null) {
                        log("输入对应的辅助邮箱")
                        commonFun.swipeUpRandomSpeed()
                        sleep(2000)
                        setText(username1)
                        randomSleep()
                        log("检查Next是否存在")
                        let check_Next_Btn1 = text("Next").findOne(FIND_WIDGET_TIMEOUT)
                        if (check_Next_Btn1 != null) {
                            log("点击Next")
                            randomSleep()
                            commonFun.clickWidget(check_Next_Btn1)
                            sleep(5000)
                        }
                    }
                }
            } catch (error) {
                log("检查Next页面时捕获到一个错误:", error)
            }
        }
    } catch (error) {
        log("检查Signin页面时捕获到一个错误:", error)
    }
}
// Gmail第六步:添加你的手机号
function click_Add_Phone() {
    log("检查Add phone number是否存在")
    try {
        let check_page = text("Add phone number?").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("上滑2次")
            randomSleep()
            commonFun.swipeUpRandomSpeed()
            commonFun.swipeUpRandomSpeed()
        }
    } catch (error) {
        log("检查Add phone number页面时捕获到一个错误:", error)
    }
}
// Gmail第七步:点击跳过
function click_SkipBtn() {
    log("检查Skip是否存在")
    try {
        let check_page = text("Skip").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击Skip")
            randomSleep()
            commonFun.clickWidget(check_page)
            sleep(3000)
        }
    } catch (error) {
        log("检查Skip页面时捕获到一个错误:", error)
    }
}
// Gmail第八步:点击同意
function click_AgreeBtn() {
    log("检查欢迎界面是否存在")
    try {
        let check_page = text("I agree").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击I Agree")
            randomSleep()
            commonFun.clickWidget(check_page)
            sleep(3000)
        }
    } catch (error) {
        log("检查欢迎界面时捕获到一个错误:", error)
    }
}
// Gmail第九步:点击Take me to gmail
function click_TakeMeToBtn() {
    log("检查Take Me To Gmail是否存在")
    try {
        let check_page = text("TAKE ME TO GMAIL").id("com.google.android.gm:id/action_done").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击Take Me To Gmail")
            sleep(6000)
            commonFun.clickWidget(check_page)
            let check_EmailAddress = text("Pleast add at least one email address").findOne(FIND_WIDGET_TIMEOUT)
            if (check_EmailAddress != null) {
                log("点击ok")
                let click_ok = text("OK").findOne(FIND_WIDGET_TIMEOUT)
                commonFun.clickWidget(click_ok)
            }
            sleep(3000)
        }
    } catch (error) {
        log("检查Take me to gmail页面时捕获到一个错误:", error)
    }
}
// Gmail第十步:点击弹窗关闭按钮
function click_PopUpBtn() {
    log("检查首次登陆是否会有弹窗")
    try {
        let check_page = id("com.google.android.gm:id/dismiss_button").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击弹窗关闭按钮")
            randomSleep()
            commonFun.clickWidget(check_page)
            randomSleep()
        }
    } catch (error) {
        log("检查弹窗时捕获到一个错误:", error)
    }
}
// Gmail第十一步:点击头像查看信息
function click_HeadPortrait() {
    log("检查头像是否存在")
    try {
        let check_page = id("com.google.android.gm:id/og_apd_ring_view").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击头像")
            randomSleep()
            commonFun.clickWidget(check_page)
            randomSleep()
        }
    } catch (error) {
        log("检查Skip页面时捕获到一个错误:", error)
    }
}
// Gmail第十二步:获取账号信息
function click_IdInfo() {
    log("获取账号信息")
    try {
        let check_page = id("com.google.android.gm:id/account_display_name").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("用户名:↓↓↓↓")
            randomSleep()
            user_name = check_page.text()
            log(user_name)
            randomSleep()
            isSuccess = true
            desc = "登陆成功"
            updateRegisterResult()
            if (isSuccess = true) {
                engines.stopAll();
                toastLog("停止脚本")
            }
        }
    } catch (error) {
        log("获取账号信息时捕获到一个错误:", error)
    }
}
// Gmail第十四步:如果没有登陆成功则回退素材
//TODO:待补充

// Gmail异常提示处理
function click_AbnormalTip() {
    log("检查提示框")
    try {
        let check_page = id("com.google.android.gm:id/in_gmail_opt_in_button").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("1.勾选第一个")
            randomSleep()
            commonFun.clickWidget(check_page)
            randomSleep()
            let check_page1 = id("com.google.android.gm:id/in_gmail_next").text("Next").findOne(FIND_WIDGET_TIMEOUT)
            if (check_page1 != null) {
                log("点击Next")
                randomSleep()
                commonFun.clickWidget(check_page1)
                sleep(2000)
                let check_page2 = id("com.google.android.gm:id/cross_products_opt_in_button").findOne(FIND_WIDGET_TIMEOUT)
                if (check_page2 != null) {
                    log("2.勾选第一个")
                    randomSleep()
                    commonFun.clickWidget(check_page2)
                    sleep(2000)
                    let check_page3 = id("com.google.android.gm:id/cross_products_done").text("Done").findOne(FIND_WIDGET_TIMEOUT)
                    if (check_page3 != null) {
                        log("点击Done")
                        randomSleep()
                        commonFun.clickWidget(check_page3)
                        randomSleep()
                    }
                }
            }
        }
    } catch (error) {
        log("检查提示框时捕获到一个错误:", error)
    }
}
// ---------------------------------写方法区-----------------------
module.exports = taskDemo;
