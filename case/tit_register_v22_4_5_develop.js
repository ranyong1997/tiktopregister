/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-25 20:12:22
 * @LastEditTime: 2022-01-28 12:26:19
 */
const commonFun = require("../lib/common");
const httpUtilFunc = require("../http/httpUtils");
const httpUtilFun = require("../network/httpUtil.js");
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
            if (!httpUtilFunc.getGlobalIp() && !commonFun.uninstallApp("fun.kitsunebi.kitsunebi4android")) { reportLog("设备环境异常") }
            randomSleep(3000)

            commonFun.showLog("")
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
                commonFun.taskStepRecordSet(200, null, "获取插件配置信息", "获取插件配置信息:" + JSON.stringify(taskPluginData))
            } catch (error) {
                log("  插件配置 获取失败 " + commonFun.objectToString(error))
                throw "插件配置 获取失败 " + JSON.stringify(error)
            }
            //  执行任务
            try {
                try {   //  ip、语言、时区检测
                    taskDemo.result = 1
                    //  本机ip
                    let local_ip = httpUtilFun.getIpInfo(1000) // ip获取失败
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
                    reportLog("当前系统语言: " + commonFun.systemLanguageGet())
                    reportLog("当前系统时区: " + commonFun.systemTimezoneGet())
                } catch (error) { throw error }
                log("注册脚本or 修改头像脚本")
                // 素材获取
                material_gain(materialTag, appid, appid_key, type, classify, used_times_model, used_counter)
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
                                else if (taskPluginData.proxyProvider == "xxx") {// 新增代理
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
// function material_gain(materialTag, appid, appid_key, type, classify, used_times_model, used_counter) {
//     try {
//         log("正在素材获取")
//         var material_gain = httpUtilFunc.materialGet({
//             "lable": materialTag, // 标签
//             "app_id": appid,   // app_id
//             "app_secret": appid_key,   // 密钥
//             "count": 1, // 取数量 默认1个
//             "type": type, // 素材类型（0:纯文本；1:图片；2:视频；3:音频）
//             "classify": classify,  // 文本类型(0:默认；1:昵称；2:简介；3:外链; 4:对话模板) / 图片类型(0:默认；1:发布内容；2:头像) / 视频类型(0:默认；1:发布内容)
//             "used_times_model": used_times_model,   // 匹配模式
//             "used_times": used_counter    // 使用次数
//         })
//         material_INFO = material_gain
//         log("素材info--->>", material_INFO)
//         commonFun.taskStepRecordSet(200, null, "获取素材信息", "获取素材信息：" + material_INFO)
//         return material_INFO
//     } catch (error) {
//         log("获取素材时捕获到一个错误:" + error)
//         commonFun.taskResultSet("素材获取失败" + error, "w")
//     }
// }

// 回滚素材
function matter_rollback() {
    let app_id = "a01ed8c2a96ef33a28f21043318acf5f"
    let app_secret = "c159d6d44650179ef5498d5081c87bdd"
    httpUtilFunc.materialRollback(app_id, app_secret, material_INFO)
}



// **********************************【注册】方法保护区 勿动**********************************
//  点击VPN连接按钮
function connectVPN() {
    if (!proxySettings.kitsunebiInstall("http://192.168.91.3:8012/upload/e3acddc3-4ce1-4286-8ad6-f2c0e8bac093.apk")) { throw "未安装 " + "fun.kitsunebi.kitsunebi4android" }
    var is_proxy_on = false
    var startVpnConnnectTime = new Date().getTime()
    do {
        var nowTime = new Date().getTime()
        if (nowTime - startVpnConnnectTime > 3 * 60 * 1000) {
            return false
        }
        try {
            is_proxy_on = proxySettings.kitsunebiSetup2(proxy_info)
            httpUtilFunc.reportLog("代理连接结果: " + is_proxy_on)
        } catch (error) {
            log(error)
        }
        if (!is_proxy_on) {
            sleep(2000)
        }
    } while (!is_proxy_on)
    return true
}

//  随机等待
function randomSleep() {
    var randomSleep = random(500, 1500)
    sleep(randomSleep)
}
// **********************************方法保护区 勿动**********************************


// **********************************方法编辑区**********************************
function One_Key_Login() {
    commonFun.clearData(TT_PACKAGE)
    randomSleep()
    startRegisterTime = new Date().getTime()
    toastLog("开始一键登陆功能")
    randomSleep()
    do {
        if (!packageName(TT_PACKAGE).findOne(1)) {
            log("TikTok 启动中..." + "启动次数为:" + launchAppCount)
            launchApp("TikTok")
            sleep(3000)
            launchAppCount++
            if (launchAppCount > 10) {
                fail_register = true
                matter_rollback()
                break
            }
        }
        try {
            sleep(5000)
            checkSignUpPage()
            sleep(2000)
            check_web_fb_login()
            if (fail_register) {
                break
            }
            check_face_recognition()
            if (fail_register) {
                break
            }
            check_error()
            if (fail_register) {
                break
            }
            create_random_name()
            sleep(2000)
            checkinterestsPage()
            checkinterestsPage1()
            sleep(2000)
            checkSwipe_up_Page()
            clickProfile()
            check_allow_cookiesPage()
            checkauthorizationPage()
            if (registerDone) {
                break
            }
        } catch (error) {
            // log("一键登陆时捕获到一个错误:" + error)
        }
    } while (true)
}

function checkSignUpPage() {
    log("检查登陆页")
    var signUpText = text("Sign up for TikTok").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (signUpText != null) {
        var continueFacebook = text("Continue with Facebook").id("com.zhiliaoapp.musically:id/a41").findOne(FIND_WIDGET_TIMEOUT)
        if (continueFacebook != null) {
            commonFun.clickWidget(continueFacebook)
            randomSleep()
        }
    }
}

function checkauthorizationPage() {
    var cancel = text("Cancel").findOne(FIND_WIDGET_TIMEOUT).bounds()
    log("点击授权按钮")
    if (cancel != null) {
        var x = cancel.centerX() - 126
        var y = cancel.centerY() - 126
        click(x, y)
    }
}

// 检查兴趣爱好页面
function checkinterestsPage() {
    log("检查兴趣爱好页面")
    var interests_skip = text("Skip").id("com.zhiliaoapp.musically:id/e1u").findOne(FIND_WIDGET_TIMEOUT)
    log("点击跳过按钮")
    if (interests_skip != null) {
        commonFun.clickWidget(interests_skip)
    }
}

function checkinterestsPage1() {
    var interests_skip1 = text("Skip").id("com.zhiliaoapp.musically:id/em0").findOne(FIND_WIDGET_TIMEOUT)
    log("点击跳过按钮1")
    if (interests_skip1 != null) {
        interests_skip1.click()
    }
}

function checkSwipe_up_Page() {
    log("开始看视频")
    var Start_up = text("Swipe up").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (Start_up != null) {
        log("点击Start watching")
        var start_watching = text("Start watching").id("com.zhiliaoapp.musically:id/e6z").findOne(FIND_WIDGET_TIMEOUT)
        if (start_watching != null) {
            commonFun.clickWidget(start_watching)
        }
    }
    sleep(5000)
    commonFun.scrollShortUp()
    commonFun.scrollShortUp()
}

function Facebook_Account_Transfer() {
    var androidId = material_gain()
    try {
        console.time('迁移耗时');
        log("正在迁移facebook账号")
        commonFun.Facebook_Account_Transfer(facebook_packageName, androidId)
        console.timeEnd('迁移耗时');
    } catch (error) {
        log("迁移fb时捕获到一个错误:", error)
        matter_rollback()
        engines.stopAll();
    }


}

// 检查vpn连接
function checkVPNConnect() {
    do {
        try {
            if (!packageName("fun.kitsunebi.kitsunebi4android").findOne()) {
                log("正在启动vpn .. ")
                launch("fun.kitsunebi.kitsunebi4android")
                sleep(6000)
            }
            //  首页
            if (className("android.widget.TextView").text("Kitsunebi").findOne() && id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne()) {
                if (id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne()) {
                    toastLog("代理正常")
                    return true
                } else {
                    clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/fab").findOne()) && toastLog("启动代理")
                    id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne() || clickIfWidgetClickable(text("OK").findOne())
                    id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne() || clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/fab").findOne()) && toastLog("启动代理")
                }
            }
        } catch (error) {
            log("检查vpn时捕获到一个错误:" + error)
            break
        }
    } while (true)
}

// 检测Tiktok是否安装对应版本
function checkTiktokInstall() {
    if (!app.getAppName(TT_PACKAGE)) {
        log("检测到未安装TikTok")
        httpUtilFunc.downloadFile("http://192.168.91.3:8012/upload/a59d3e2a-1a41-4eb1-8098-2d9a0b524364.xapk", "/storage/emulated/obb/Tiktok_v19.2.4", 1000 * 60, false)
        randomSleep()
        commonFun.installApkNew("/storage/emulated/obb/Tiktok_v19.2.4")

    }
}

// 检测Facebook是否安装对应版本
function checkFacebookInstall() {
    if (!app.getAppName(facebook_packageName)) {
        toastLog("检测到未安装Facebook")
        httpUtilFunc.downloadBigFile("http://192.168.91.3:8012/upload/aefb636d-5f4b-435b-adfc-12734903a05a.apk", "/storage/emulated/0/Facebook_v348_1.apk", 2000 * 60, false)
        randomSleep()
        commonFun.installApkNew("/storage/emulated/0/Facebook_v348_1.apk")
        randomSleep()
        log("正在打开Facebook")
        launch(facebook_packageName);
        randomSleep()
        home()
    }
}

// 检测VPN是否安装对应版本
function checkVPNInstall() {
    if (!app.getAppName(kitsunebi_packageName)) {
        log("检测到未安装VPN")
        httpUtilFunc.downloadBigFile("http://192.168.91.3:8012/upload/e3acddc3-4ce1-4286-8ad6-f2c0e8bac093.apk", "/storage/emulated/0/Kitsunebi_v1.8.0.apk", 2000 * 60, false)
        randomSleep()
        commonFun.installApkNew("/storage/emulated/0/Kitsunebi_v1.8.0.apk")
    }
}

// 创建随机名字
function create_random_name() {
    log("检测创建昵称页面")
    create_username = null
    var creatName = text("Sign up").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (creatName != null) {
        let a = commonFun.randomStr(7)
        let b = commonFun.randomStrInStr(2)
        let create_username = a + b
        log("创建用户名为===>", create_username)
        randomSleep()
        setText(create_username)
        randomSleep()
        log("点击Sign up")
        var sign_up = id("com.zhiliaoapp.musically:id/dwe").findOne(FIND_WIDGET_TIMEOUT)
        if (sign_up != null) {
            randomSleep()
            sign_up.click()
        }
    }
    return create_username
}

// 素材获取
function material_gain(materialTag, appid, appid_key, used_times_model) {
    try {
        log("正在素材获取")
        var material_gain = httpUtilFunc.materialGet({
            "app_id": appid,
            "app_secret": appid_key,
            "count": 1,
            "type": 0,
            "classify": 3,
            "used_times": 0,
            "used_times_model": used_times_model,
            "lable": materialTag
        })
        android_Id = material_gain.text_content
        log("安卓id获取--->>", android_Id)
        material_INFO = material_gain
        log("素材info--->>", material_INFO)
        return android_Id
    } catch (error) {
        log("获取安卓id时捕获到一个错误:" + error)
        commonFun.taskResultSet("素材获取失败" + error, "w")
    }
}

// 更新账号信息到8000端口
function updateRegisterResult() {
    log("更新账号信息到8000端口")
    try {
        return commonFun.newThread(() => {
            var data = {
                "forceRecord": true,
                "type": 1,
                "appName": appName,
                "phone": backupTag2,
                "deviceId": commonFun.deviceId,
                "folderId": commonFun.folderId,
                "androidId": commonFun.androidId,
                "password": null,
                "username": username,
                "tag": "test_20220121(英国)_ran",
                "phoneProvider": "facebook",
                "dialCode": null,
                "countryCode": proxyCountry,
                "email": null,
                "emailPassword": null,
                "smsurl": null,
                "isRegistered": false,
                "isProcess": isProcess,
                "extra": null,
                "city": null,
                "country": null,
                "emailProvider": null,
                "proxy": ipInfo, // 代理
                "proxyProvider": proxyProvider, // 代理供应商
                "ip": local_ip,
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
            return JSON.parse(res.data)
        })
    } catch (error) {
        httpUtilFunc.reportLog("更新注册账号异常: " + JSON.stringify(error))
        commonFun.taskResultSet("更新账号失败" + error, "w")
    }
    return null
}

// 需要人脸验证直接结束并返回
function check_face_recognition() {
    log("检测是否需要人脸识别")
    randomSleep()
    try {
        var face_recognition = text("Your account has been disabled").findOne(FIND_WIDGET_TIMEOUT)
        if (face_recognition != null) {
            toastLog("该账号需要人脸验证")
            randomSleep()
            fail_register = true
            resgisterStatus = enums.REGISTER_STATUS.FACE_RECOGNITION
            isSuccess = false
            desc = resgisterStatus
            let log_server = commonFun.taskResultSet("该账号需要人脸验证", "w")
            commonFun.taskResultGet(log_server)
            matter_rollback()
        }
    } catch (error) {
        log("该账号需要人脸识别:" + error)
        commonFun.taskResultSet("该账号需要人脸识别" + error, "w")
    }
}


// 进行tiktok备份
function tiktio_backupUplive() {
    commonFun.backupUpApp(TT_PACKAGE)
    randomSleep()
    commonFun.backupUpAppInfo(TT_PACKAGE, backupTag)
}

// tiktok登陆成功
function clickProfile() {
    log("登陆成功后点击我的页面")
    try {
        var login_in = text("Home").findOne(FIND_WIDGET_TIMEOUT)
        if (login_in != null) {
            log("该账号已登陆成功")
            commonFun.swipeUpSlowly()
            randomSleep()
            var click_profile = text("Profile").findOne(FIND_WIDGET_TIMEOUT)
            if (click_profile != null) {
                commonFun.swipeUpSlowly()
                log("点击Profile")
                randomSleep()
                commonFun.clickWidget(click_profile)
                var user_name = id("com.zhiliaoapp.musically:id/f_q").findOne(750)
                log("获取昵称")
                if (user_name != null) {
                    username = user_name.text().match(/@(\S+)/)[1]
                    log(username)
                }
            }
            fail_register = true
            resgisterStatus = enums.REGISTER_STATUS.SUCCESS
            registerDone = true
            desc = resgisterStatus
            updateRegisterResult()
            randomSleep()
            tiktio_backupUplive()
            randomSleep()
            commonFun.taskResultSet("任务配置-" + url, "a")
            let log_server = commonFun.taskResultSet("-Result-" + desc, "w")
            commonFun.taskResultGet(log_server)
        }
    } catch (error) {
        commonFun.taskResultSet("创建失败" + error, "w")
    }
}

// 检查允许cookie页面
function check_allow_cookiesPage() {
    log("检测是否为请求页无法显示\n【需要等待页面超时,预计需要等待2分13秒】")
    var content_not_found = text("More Options").findOne(FIND_WIDGET_TIMEOUT)
    if (content_not_found != null) {
        log("点击Allow All Cookies")
        var click_allow_cookies = text("Allow All Cookies").findOne(FIND_WIDGET_TIMEOUT).bounds()
        let x = click_allow_cookies.centerX()
        let y = click_allow_cookies.centerY()
        if (click_allow_cookies != null) {
            randomSleep()
            click(x, y)
        }
    }
}

// 进入fb授权的时候会弹出网页登陆
function check_web_fb_login() {
    log("检查进入fb授权的时候会弹出网页登陆")
    randomSleep()
    try {
        var web_fb_login = text("signup-button").findOne(FIND_WIDGET_TIMEOUT)
        if (web_fb_login != null) {
            fail_register = true
            resgisterStatus = enums.REGISTER_STATUS.WEB_FB_LOGIN
            isSuccess = false
            desc = resgisterStatus
            // updateRegisterResult()
            matter_rollback()
        }
    } catch (error) {
        log("该账号需要web登陆:" + error)
    }

}

function check_error() {   // 点击登陆出现错误toast
    var txt1 = "Couldn't log in"
    var txt = "" //声明一个全局变量
    threads.start(function () {
        events.observeToast()//创建监听
        events.onToast(function (toast) {
            txt = toast.getText()//获取监听内容赋值给全局变量
            while (true) if (txt == txt1) {
                log("检测到不可登陆" + txt + "即将停止该任务")
                home()
                sleep(4000)
                fail_register = true
                matter_rollback()
            }
        });
    })
    return true;
}
// **********************************方法编辑区**********************************


taskDemo.init()
module.exports = taskDemo;