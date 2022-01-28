/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-25 20:12:22
 * @LastEditTime: 2022-01-28 12:10:08
 */


// taskip写死 需要重置  在httpUtilFunc.getPluginData
const commonFun = require("../lib/common.js");
const httpUtilFunc = require("../http/httpUtils");
const { reportLog } = require("../network/httpUtil.js");
const proxySettings = require("../vpn/proxySettings.js")
const enums = require("../util/enums")
// const targetApp = require("../app/tiktokApp.js");
const { newThread, randomSleep, taskResultSet, shortSleep, longSleep } = require("../lib/common.js");
const taskDemo = {}
let taskPluginData = null
var FIND_WIDGET_TIMEOUT = 1000
var registerDone = false
var isSuccess = true
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
            if (!httpUtilFunc.getLocalIp() && !commonFun.uninstallApp(kitsunebi_packageName)) { reportLog("设备环境异常") }
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
                log("素材类型: " + type)
                log("文本类型: " + classify)
                log("素材匹配: " + used_times_model)
                log("使用次数: " + used_counter)
                commonFun.taskStepRecordSet(200, null, "获取插件配置信息", "获取插件配置信息:" + JSON.stringify(taskPluginData))
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
                // 以上代码走通

                // 代理获取 需要联调
                proxy_info = null
                let ipInfo = {}
                if (taskPluginData.proxyProvider) {
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
                                // proxy_info = null
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
                            // ip检测
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
                material_gain(keyword_FB, appid, appid_key, type, classify, used_times_model, used_counter)
                // 注册脚本
            } catch (error) {
                throw error
            }
        } catch (error) {
            taskDemo.result = 0
            taskDemo.desc = commonFun.objectToString(error)
            commonFun.taskResultSet(taskDemo.desc, "a")
        }
        try {
            if (register != "") {
                log("选择注册")
                checkFacebookInstall()   // 检测facebook是否安装
                checkTiktokInstall() // 检测tiktok是否安装
                function doSomething() {
                    if (true) {
                        log("脚本执行")
                        One_Key_Login()
                    }
                    // Facebook_Account_Transfer()
                    // sleep(2000)
                    // while (true) {
                    //     log("脚本执行")
                    //     One_Key_Login()
                    //     break
                    // }
                }
                let myThreadResult = commonFun.newThread(doSomething, false, 1000 * 60 * 12, () => { log("时间已超时12分钟,程序退出") })
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
            log("获取素材时捕获到一个错误:" + error)
            throw error
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
            // "used_times": used_counter    // 使用次数  // 上线需要将这个解开
        })
        android_Id = material_gain.text_content
        log("安卓id获取--->>", android_Id)
        material_INFO = material_gain
        log("素材info--->>", material_INFO)
        commonFun.taskStepRecordSet(200, null, "获取素材信息", material_INFO)
        return material_INFO
    } catch (error) {
        log("获取素材时捕获到一个错误:" + error)
        commonFun.taskResultSet("素材获取失败" + error, "w")
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

// 检测Tiktok是否安装对应版本
function checkTiktokInstall() {
    if (!app.getAppName(tiktop_packageName)) {
        log("检测到未安装TikTok")
        httpUtilFunc.downloadFile("http://192.168.91.3:8012/upload/a59d3e2a-1a41-4eb1-8098-2d9a0b524364.xapk", "/storage/emulated/obb/Tiktok_v19.2.4", 1000 * 60, false)
        randomSleep()
        commonFun.installApkNew("/storage/emulated/obb/Tiktok_v19.2.4")

    }
}
// facebook 迁移
function Facebook_Account_Transfer() {
    var androidId = material_gain()
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

function One_Key_Login() {
    commonFun.clearData(tiktop_packageName)
    randomSleep()
    startRegisterTime = new Date().getTime()
    toastLog("开始一键登陆功能")
    randomSleep()
    do {
        if (!packageName(tiktop_packageName).findOne(1)) {
            log("TikTok 启动中..." + "启动次数为:" + launchAppCount)
            launchApp("TikTok")
            sleep(3000)
            launchAppCount++
            if (launchAppCount > 10) {
                fail_register = true
                httpUtilFunc.materialRollback(appid, appid_key, material_INFO)
                break
            }
            checkpop_up()
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
            if (registerDone == true) {
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

// 更新账号信息到8000端口
function updateRegisterResult() {
    log("更新账号信息到8000端口")
    try {
        return commonFun.newThread(() => {
            var data = {
                "forceRecord": true,
                "type": 1,
                "appName": appName,
                "phone": backupTag2 + commonFun.androidId,
                "deviceId": commonFun.deviceId,
                "folderId": commonFun.folderId,
                "androidId": commonFun.androidId,
                "password": null,
                "username": username,
                "tag": backupTag2,
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
                "proxy": proxy_info,
                "proxyProvider": proxyTag,
                "ip": global_ip,
                "isUsed": isUsed,
                "desc": desc,
                "isSuccess": isSuccess,
                "deviceInfo": commonFun.model,
                "nickname": username
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
            httpUtilFunc.materialRollback(appid, appid_key, material_INFO)
        }
    } catch (error) {
        log("该账号需要人脸识别:" + error)
        commonFun.taskResultSet("该账号需要人脸识别" + error, "w")
    }
}

// 进行tiktok备份
function tiktio_backupUplive() {
    commonFun.backupUpApp(tiktop_packageName)
    randomSleep()
    commonFun.backupUpAppInfo(tiktop_packageName, backupTag)
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
                log("检查三横")
                var ThreeAcross = id("com.zhiliaoapp.musically:id/nav_end").findOne(FIND_WIDGET_TIMEOUT)
                if (ThreeAcross != null) {
                    log("点击三横")
                    randomSleep()
                    var ThreeAcrossbounds = ThreeAcross.bounds();
                    click(ThreeAcrossbounds.centerX(), ThreeAcrossbounds.centerY());
                    randomSleep()
                    log("检查设置弹框是否弹出")
                    var Settings = text("Settings and privacy").findOne(FIND_WIDGET_TIMEOUT)
                    if (Settings != null) {
                        log("点击设置弹框")
                        randomSleep()
                        var Settingsbounds = Settings.bounds();
                        click(Settingsbounds.centerX(), Settingsbounds.centerY());
                        randomSleep()
                        log("检查Manage")
                        var Manage = text("Manage account").findOne(FIND_WIDGET_TIMEOUT)
                        if (Manage != null) {
                            log("点击Manage account")
                            randomSleep()
                            var Managebounds = Manage.bounds();
                            click(Managebounds.centerX(), Managebounds.centerY());
                            randomSleep()
                            log("检查生日设置")
                            var birSetting = text("Date of birth").findOne(FIND_WIDGET_TIMEOUT)
                            if (birSetting != null) {
                                log("点击生日设置")
                                randomSleep()
                                var birSettingbounds = birSetting.bounds();
                                click(birSettingbounds.centerX(), birSettingbounds.centerY());
                                randomSleep()
                                checkBirthDayPage()
                            }
                            else {
                                selectBirthDayed()
                                log("该账号已经选择过生日，无需再选")
                            }
                        }
                    }
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
            shell("am force-stop " + tiktop_packageName)
            commonFun.taskResultSet("任务配置-" + url, "a")
            let log_server = commonFun.taskResultSet("-Result-" + desc, "w")
            commonFun.taskResultGet(log_server)
            engines.stopAll();
            toastLog("停止脚本")

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
            httpUtilFunc.materialRollback(appid, appid_key, material_INFO)
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
                httpUtilFunc.materialRollback(appid, appid_key, material_INFO)
            }
        });
    })
    return true;
}


function checkpop_up() {
    log("检查弹窗")
    sleep(7000)
    var TC1 = text("Don't allow").findOne(FIND_WIDGET_TIMEOUT)
    if (TC1 != null) {
        log("点击弹窗1")
        randomSleep()
        while (!click("Don't allow"));
    }
    sleep(3000)
    var TC2 = text("Don't allow").findOne(FIND_WIDGET_TIMEOUT)
    if (TC2 != null) {
        log("点击弹窗2")
        randomSleep()
        while (!click("Don't allow"));
    }
    var swipe_element = text("Swipe up for more").id("com.zhiliaoapp.musically:id/f4r").findOne(FIND_WIDGET_TIMEOUT)
    if (swipe_element != null) {
        log("检测用户引导")
        log("上滑一小截1次");
        commonFunc.swipeUpRandomSpeed()
        commonFunc.swipeUpRandomSpeed()
    }
    log("检测系统写入操作")
    var allow = text("ALLOW").findOne(FIND_WIDGET_TIMEOUT)
    if (allow != null) {
        while (!click("ALLOW"));
    }
}

function checkBirthDayPage() {
    log("检查选择生日年月日页")
    var birthdayText = text("What's your date of birth?").id("com.zhiliaoapp.musically:id/qv").findOne(FIND_WIDGET_TIMEOUT)
    log("已检测到选择生日页")
    if (birthdayText != null) {
        log("检查生日输入框")
        var birthDayEdit = id("com.zhiliaoapp.musically:id/hl").findOne(FIND_WIDGET_TIMEOUT)
        log("已检测到生日输入框")
        if (birthDayEdit != null) {
            var birthDayEditText = birthDayEdit.text()
            toastLog("birthDayEditText = " + birthDayEditText)
            if (birthDayEditText != "") {
                var birthYear = birthDayEditText.split(",")[1]
                if (!(birthYear > 1988 && birthYear < 2005)) {
                    selectBirthDay()
                }
            } else {
                selectBirthDay()
            }
        }
        log("检查Confirm是否存在")
        var nextBt = id("com.zhiliaoapp.musically:id/cfh").text("Confirm").findOne(FIND_WIDGET_TIMEOUT)
        log("已检测到Confirm存在")
        if (nextBt != null) {
            randomSleep()
            var a = nextBt.bounds();
            click(a.centerX(), a.centerY());
            randomSleep()
            log("检查确认年龄页面")
            var CheckYearsOld = text("Edit").findOne(FIND_WIDGET_TIMEOUT)
            log("已经检查到确认年龄页面")
            if (CheckYearsOld != null) {
                randomSleep()
                var confirm = text("Confirm").findOne(FIND_WIDGET_TIMEOUT)
                if (confirm != null) {
                    randomSleep()
                    var b = confirm.bounds();
                    click(b.centerX(), b.centerY());
                    sleep(5000)
                }
            }
        }
    }
}
function selectBirthDay() {
    //月份
    log("检查选择生日月元素")
    var monthList = id("com.zhiliaoapp.musically:id/clb").findOne(FIND_WIDGET_TIMEOUT)
    if (monthList != null) {
        log("已检测到选择生日月存在")
        var b = monthList.bounds()
        var top = b.top
        var bottom = b.bottom
        var left = b.left
        var right = b.right
        var listItemHeight = Math.floor((bottom - top) / 3)
        var randomSwipe = random(1, 5)
        var randomScollDirection = random(0, 6)
        var swipeCount = 0
        var startX = random(left, right)
        var startY = random(bottom - listItemHeight, bottom)
        var endX = random(left, right)
        var endY = random(top, top + listItemHeight)
        var swipeHeight = startY - endY
        if (randomScollDirection > 3) {
            startY = random(top, top + listItemHeight)
            endY = random(bottom - listItemHeight, bottom)
        }
        do {
            log(" swipeHeight " + swipeHeight + " , listItemHeight " + listItemHeight)
            swipe(startX, startY, endX, endY, random(500, 1500))
            swipeCount++
        } while (swipeCount < randomSwipe)
    }
    randomSleep()
    //日期
    var dayList = id("com.zhiliaoapp.musically:id/aho").findOne(FIND_WIDGET_TIMEOUT)
    if (dayList != null) {
        var b = dayList.bounds()
        var top = b.top
        var bottom = b.bottom
        var left = b.left
        var right = b.right
        var listItemHeight = Math.floor((bottom - top) / 3)
        var randomSwipe = random(3, 6)
        var swipeCount = 0
        var randomDayScollDirection = random(0, 6)
        var startX = random(left, right)
        var startY = random(bottom - listItemHeight, bottom)
        var endX = random(left, right)
        var endY = random(top, top + listItemHeight)
        if (randomDayScollDirection > 3) {
            startY = random(top, top + listItemHeight)
            endY = random(bottom - listItemHeight, bottom)
        }
        do {
            var swipeHeight = startY - endY
            log(" swipeHeight " + swipeHeight + " , listItemHeight " + listItemHeight)
            swipe(startX, startY, endX, endY, random(500, 1500))
            swipeCount++
        } while (swipeCount < randomSwipe)
    }
    randomSleep()
    //年份
    var yearList = id("com.zhiliaoapp.musically:id/fk0").findOne(FIND_WIDGET_TIMEOUT)
    if (yearList != null) {
        var b = yearList.bounds()
        var top = b.top
        var bottom = b.bottom
        var left = b.left
        var right = b.right
        var listItemHeight = Math.floor((bottom - top) / 3)
        var randomSwipe = random(12, 15)
        var swipeCount = 0
        do {
            var startX = random(left, right)
            var startY = random(bottom - Math.floor(listItemHeight / 2), bottom)
            var endX = random(left, right)
            var endY = random(top, top + Math.floor(listItemHeight / 2))
            var swipeHeight = startY - endY
            log(" swipeHeight " + swipeHeight + " , listItemHeight " + listItemHeight)
            swipe(endX, endY, startX, startY, random(200, 400))
            sleep(random(300, 500))
            swipeCount++
        } while (swipeCount < randomSwipe)
    }
}
function selectBirthDayed() {
    log("判断是否设置了年龄")
    var setting_Bir = text("Can't change date of birth").id("com.zhiliaoapp.musically:id/title_tv").findOne(FIND_WIDGET_TIMEOUT)
    if (setting_Bir != null) {
        log("点击ok")
        randomSleep()
        var click_ok = text("OK").findOne(FIND_WIDGET_TIMEOUT)
        var click_okbounds = click_ok.bounds();
        sleep(1000)
        click(click_okbounds.centerX(), click_okbounds.centerY());
        sleep(2000)
    }
    Bir_success = true
}

// ---------------------------------写方法区-----------------------

taskDemo.init()
module.exports = taskDemo;