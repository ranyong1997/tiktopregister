var commonFun = require("../lib/common.js")
var proxySettings = require("../vpn/proxySettings.js")
var httpUtilFunc = require("../http/httpUtils")
var enums = require("../util/enums")
var registerDone = false
var isSuccess = true
var desc = ""
var fail_register = false
var isUsed = false
var isProcess = true
var FIND_WIDGET_TIMEOUT = 750
var launchAppCount = 1
var resgisterStatus = ""
var tiktop_packageName = "com.zhiliaoapp.musically"
var facebook_packageName = "com.facebook.katana"
var androidId = material_gain()
// 获取动态代理
var vpnData = httpUtilFunc.getProxyFromConnanys("connanys", { "regionid": "GB", "timeout": 30 })
// log(vpnData)
// **********************************方法执行区**********************************
commonFun.systemTimezoneSet_New("Europe/London")
commonFun.systemTimezoneGet()   // 获取当前时区
checkFacebookInstall()   // 检测facebook是否安装
checkTiktokInstall() // 检测tiktok是否安装
if (connectVPN()) {  // 判断是否已连接vpn
    randomSleep()
    log("脚本执行")
    alaways_running()
}
function alaways_running() {
    Facebook_Account_Transfer()
    One_Key_Login()
}
// alaways_running()


// **********************************方法执行区**********************************

// **********************************方法保护区 勿动**********************************
//  关闭本地网络
function closeLocation() {
    var startVpnConnnectTime = new Date().getTime()
    do {
        toastLog("closeLocation")
        var nowTime = new Date().getTime()
        if (nowTime - startVpnConnnectTime > 3 * 60 * 1000) {
            return false
        }
        if (!packageName("com.android.settings").findOne(1)) {
            log("正在打开设置关闭网络 .. ")
            launchApp("Settings")
            sleep(5000)
        }
        if (!packageName("com.android.settings").findOne(1)) {
            sleep(3000)
            continue
        }
        var settingPage = id("com.android.settings:id/dashboard_container").findOne(3000)
        if (settingPage != null) {
            var locationSetting = text("Security & location").id("android:id/title").findOne(3000)
            if (locationSetting != null) {
                commonFun.clickWidget(locationSetting)
                sleep(3000)
            } else {
                var locationSetting = text("System").id("android:id/title").findOne(1000)
                if (locationSetting != null) {
                    settingPage.scrollBackward()
                } else {
                    toastLog("scrolldown " + settingPage.scrollable())
                    settingPage.scrollForward()
                }
            }
        } else {
            back()
            sleep(3000)
        }
        var locationSettings = text("Location").id("android:id/title").findOne(3000)
        if (locationSettings != null) {
            commonFun.clickWidget(locationSettings)
            sleep(3000)

        }
        var switchBt = id("com.android.settings:id/switch_widget").findOne(3000)
        if (switchBt != null && switchBt.text() != "OFF") {
            commonFun.clickWidget(switchBt)
            sleep(3000)
            back()
            sleep(3000)
            back()
            sleep(3000)
            back()
            break
        } else if (switchBt != null && switchBt.text() == "OFF") {
            sleep(3000)
            back()
            sleep(3000)
            back()
            sleep(3000)
            back()
            break
        }
    } while (true)
}
//  关闭vpn设置
function closeVPNSettings() {
    randomSleep()
    do {
        if (!packageName("com.android.settings").findOne(1)) {
            log("正在打开设置关闭vpn .. ")
            launchApp("Settings")
            sleep(3000)
        }
        if (!packageName("com.android.settings").findOne(1)) {
            sleep(3000)
            continue
        }
        var settingPage = id("com.android.settings:id/dashboard_container").findOne(3000)
        if (settingPage != null) {
            var networkSetting = text("Network & Internet").findOne(FIND_WIDGET_TIMEOUT)
            if (networkSetting != null) {
                commonFun.clickWidget(networkSetting)
                randomSleep()
            } else {
                settingPage.scrollBackward()
            }
        } else {
            back()
            sleep(3000)
        }
        var vpnSettings = text("VPN").id("android:id/title").findOne(500)
        if (vpnSettings != null) {
            commonFun.clickWidget(vpnSettings)
            randomSleep()

        }
        var KitsunebiSetting = text("Kitsunebi").id("android:id/title").findOne(500)
        if (KitsunebiSetting != null) {
            commonFun.clickWidget(id("com.android.settings:id/settings_button").findOne(500))
            randomSleep()
        }
        var switchBt = id("android:id/switch_widget").findOne(FIND_WIDGET_TIMEOUT)
        if (switchBt != null && switchBt.text() != "OFF") {
            commonFun.clickWidget(switchBt)
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            break
        } else if (switchBt != null && switchBt.text() == "OFF") {
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            break
        }
        var noVPN = text("No VPNs added").findOne(500)
        if (noVPN != null) {
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            back()
            break
        }
    } while (3)

}
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
            is_proxy_on = proxySettings.kitsunebiSetup2(vpnData)
        } catch (error) {
            closeVPNSettings()
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
    commonFun.clearData(tiktop_packageName)
    randomSleep()
    var vpnState = SLChanges.getVPNLinkState()
    if (!vpnState) {
        checkVPNConnect()
    }
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
                break
            }
        }
        try {
            sleep(5000)
            checkSignUpPage()
            sleep(5000)
            check_web_fb_login()
            if (fail_register) {
                break
            }
            check_face_recognition()
            if (fail_register) {
                break
            }
            create_random_name()
            checkinterestsPage()
            checkinterestsPage1()
            checkSwipe_up_Page()
            clickProfile()
            check_allow_cookiesPage()
            checkauthorizationPage()
            if (registerDone) {
                break
            }
        } catch (error) {
            log("一键登陆时捕获到一个错误:" + error)
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
    log("检查兴趣爱好页面")
    var choose_interests = text("Choose your interests").id("com.zhiliaoapp.musically:id/bek").findOne(FIND_WIDGET_TIMEOUT)
    if (choose_interests != null) {
        log("点击跳过按钮")
        var interests_skip1 = text("Skip").id("com.zhiliaoapp.musically:id/em0").findOne(FIND_WIDGET_TIMEOUT)
        if (interests_skip1 != null) {
            interests_skip1.click()
        }
    }
}

function checkSwipe_up_Page() {
    log("开始看视频")
    randomSleep()
    var Start_up = text("Swipe up").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (Start_up != null) {
        log("点击Start watching")
        var start_watching = text("Start watching").id("com.zhiliaoapp.musically:id/e6z").findOne(FIND_WIDGET_TIMEOUT)
        if (start_watching != null) {
            commonFun.clickWidget(start_watching)
        }
    }
    randomSleep()
    commonFun.scrollShortUp()
    commonFun.scrollShortUp()
}

function Facebook_Account_Transfer() {
    console.time('迁移耗时');
    log("正在迁移facebook账号")
    commonFun.Facebook_Account_Transfer(facebook_packageName, androidId)
    console.timeEnd('迁移耗时');
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
    if (!app.getAppName(tiktop_packageName)) {
        log("检测到未安装TikTok")
        // closeVPNSettings()
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


// 素材获取
function material_gain() {
    try {
        log("素材获取")
        let material_gain = httpUtilFunc.materialGet({
            "app_id": "a01ed8c2a96ef33a28f21043318acf5f",
            "app_secret": "c159d6d44650179ef5498d5081c87bdd",
            "count": 1,
            "type": 0,
            "classify": 3,
            "used_times": 0,
            "used_times_model": "lte",
            "lable": "GBR"
        })
        var android_Id = material_gain.text_content
        log("安卓id获取--->>", android_Id)
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
                "appName": "tiktok",
                "phone": "test_20220104 Ran_" + commonFun.androidId,
                "deviceId": commonFun.deviceId,
                "folderId": commonFun.folderId,
                "androidId": commonFun.androidId,
                "password": null,
                "username": null,
                "tag": "test_20220104_ran",
                "phoneProvider": "facebook",
                "dialCode": "44",
                "countryCode": "GB",
                "email": null,
                "emailPassword": null,
                "smsurl": null,
                "isRegistered": false,
                "isProcess": isProcess,
                "extra": null,
                "city": null,
                "country": null,
                "emailProvider": null,
                "proxy": vpnData,
                "proxyProvider": "bytesfly",
                "ip": getGlobalIp(1000),
                "isUsed": isUsed,
                "desc": desc,
                "isSuccess": isSuccess,
                "deviceInfo": commonFun.model,
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
            updateRegisterResult()
            let log_server = commonFun.taskResultSet("该账号需要人脸验证", "w")
            commonFun.taskResultGet(log_server)
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
    resgisterStatus = enums.REGISTER_STATUS.SUCCESS
    commonFun.backupUpAppInfo(tiktop_packageName, "UK-Tiktok—ran(2022-1-4)")

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
                log("点击Profile")
                randomSleep()
                commonFun.clickWidget(click_profile)
            }
            fail_register = true
            resgisterStatus = enums.REGISTER_STATUS.SUCCESS
            registerDone = true
            desc = resgisterStatus
            updateRegisterResult()
            randomSleep()
            tiktio_backupUplive()
            commonFun.taskResultSet("任务配置-" + url, "a")
            let log_server = commonFun.taskResultSet("-Result-"+desc, "w")
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
            updateRegisterResult()
        }
    } catch (error) {
        log("该账号需要web登陆:" + error)
    }

}

// 创建随机名字
function create_random_name() {
    log("检测创建昵称页面")
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
}

// 获取ip
function getGlobalIp(timeout) {
    let ip = null
    timeout = typeof (timeout) == "number" ? timeout : 1000 * 30
    let res = http.get("https://api.ipify.org/?format=json", {
        "headers": {
            'User-Agent': commonFun.getRandomUA()
        }
    })
    if (res.statusCode == 200) {
        res = res.body.json()
        return res.ip
    }
}

// **********************************方法编辑区**********************************