var commonFun = require("../lib/common.js")
var proxySettings = require("../vpn/proxySettings.js")
var httpUtilFunc = require("../http/httpUtils")
var enums = require("../util/enums")

var registerDone = false
var isSuccess = true
var desc = ""
var registerSignUp = false
var click_all_cookies_success = false
var fail_register = false
var FIND_WIDGET_TIMEOUT = 500
var launchAppCount = 1
var resgisterStatus = ""
var tiktop_packageName = "com.zhiliaoapp.musically"
var facebook_packageName = "com.facebook.katana"
var androidId = material_gain()

var vpnInfos = [
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$g9NkvqmNL0*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$3FJHAhGpFW*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$A0K4Lmeui8*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$mpziPDECFK*GB", "pass": "88tr", "ptype": "sock5" }
]
var vpnData = vpnInfos[random(0, 3)]

// **********************************方法执行区**********************************
commonFun.systemTimezoneSet_New("Europe/London")
commonFun.systemTimezoneGet()   // 获取当前时区
closeLocation()  // 关闭本地网络
closeVPNSettings()   // 关闭VPN
checkTiktokInstall() // 检测tiktok是否安装
checkFacebookInstall()   // 检测facebook是否安装
if (connectVPN()) {  // 判断是否已连接vpn
    randomSleep()
    log("脚本执行")
    Facebook_Account_Transfer()
    One_Key_Login()  // 一键登陆
}
// Facebook_Account_Transfer()
// One_Key_Login()

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
            let vpnData = vpnInfos[random(0, 3)]
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
            //点击授权失效
            check_allow_cookiesPage()
            checkauthorizationPage()
            sleep(5000)
            create_random_name()
            // checkCreatNamePage()
            checkinterestsPage()
            checkSynchronizingPage()
            checkSwipe_up_Page()
            
            clickProfile()
            if (registerDone && registerSignUp) {
                break
            }
        } catch (error) {
            toastLog(" register error " + error)
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
    log("检查授权页面")
    var authorizationPage = text("Log in With Facebook").id("m-future-page-header-title").find()
    if (authorizationPage != null) {
        var cancel = text("Cancel").findOne().bounds()
        log("点击授权按钮")
        if (cancel != null) {
            var x = cancel.centerX() - 126
            var y = cancel.centerY() - 126
            randomSleep()
            click(x, y)
        }
    }
}

// function checkCreatNamePage() {
//     log("检查创建用户名页面")
//     randomSleep()
//     var creatName = text("Sign up").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
//     if (creatName != null) {
//         log("点击Sign up")
//         var sign_up = id("com.zhiliaoapp.musically:id/dwe").find()
//         if (sign_up != null) {
//             log("该账号已被一键登陆成功")
//             sign_up.click()
//             randomSleep()
//             fail_register = true
//             resgisterStatus = enums.REGISTER_STATUS.SUCCESS
//             desc = resgisterStatus
//         }
//     }
// }

function checkinterestsPage() {
    log("选择你的兴趣界面")
    var choose_interests = text("Choose your interests").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (choose_interests != null) {
        log("点击跳过按钮")
        var interests_skip = text("Skip").id("com.zhiliaoapp.musically:id/e1u").findOne(FIND_WIDGET_TIMEOUT)
        var interests_skip1 = text("Skip").id("com.zhiliaoapp.musically:id/em0").findOne(FIND_WIDGET_TIMEOUT)
        if (interests_skip != null || interests_skip1 != null) {
            commonFun.clickWidget(interests_skip)
            // TODO：可能会点击失败
            commonFun.clickWidget(interests_skip1)
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


function checkSynchronizingPage() {
    log("关闭同步联系人")
    randomSleep()
    var Synchronizing = text("OK").findOne(FIND_WIDGET_TIMEOUT)
    if (Synchronizing != null) {
        log("点击不允许")
        var click_dont = text("Don't allow").findOne(FIND_WIDGET_TIMEOUT)
        if (click_dont != null) {
            commonFun.clickWidget(click_dont)
        }
    }
    randomSleep()
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
// TODO:tiktokInstall地址需要更改
function checkTiktokInstall() {
    if (!app.getAppName(tiktop_packageName)) {
        log("检测到未安装TikTok")
        closeVPNSettings()
        if (!commonFun.tiktokInstall("http://192.168.91.3:8012/upload/7c207a62-dafc-48ce-ae55-af6d1d05c737.apk")) { throw "未安装 " + "TikTok" }
    }
}

// 检测Facebook是否安装对应版本
function checkFacebookInstall() {
    if (!app.getAppName(facebook_packageName)) {
        toastLog("检测到未安装Facebook")
        closeVPNSettings()
        if (!commonFun.facebookInstall("http://192.168.91.3:8012/upload/aefb636d-5f4b-435b-adfc-12734903a05a.apk")) { throw "未安装 " + "Facebook" }
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
    }
}


updateRegisterResult()
// 更新账号信息到8000端口
function updateRegisterResult() {
    log("更新账号信息到8000端口")
    try {
        return commonFun.newThread(() => {
            var data = {
                "forceRecord": true,
                "type": 1,
                "appName": "tiktok",
                "phone": "",
                "deviceId": commonFun.deviceId,
                "folderId": commonFun.folderId,
                "androidId": androidId,
                "password": null,
                "username": null,
                "tag": "test_20211230_ran",
                "phoneProvider": "facebook",
                "dialCode": "44",
                "countryCode": "GB",
                "email": null,
                "emailPassword": null,
                "smsurl": null,
                "isRegistered": false,
                "isProcess": true,
                "extra": null,
                "city": null,
                "country": null,
                "emailProvider": null,
                "proxy": vpnData,
                "proxyProvider": "bytesfly",
                "ip": getGlobalIp(1000),
                "isUsed": true,
                "desc": desc,
                "isSuccess": isSuccess,
                "deviceInfo": commonFun.model,
                "nickname": create_random_name,
            }
            httpUtilFunc.reportLog("更新注册账号: " + JSON.stringify(data))
            let url = "http://" + commonFun.server + "/:8000/user/registered"
            var res = http.postJson(url, data);
            res = res.body.json()
            httpUtilFunc.reportLog("更新注册账号结果: " + res.resultBody)
            if (res.code != 200) { throw res }
            return JSON.parse(res.data)
        })
    } catch (error) {
        httpUtilFunc.reportLog("更新注册账号异常: " + JSON.stringify(error))
    }
    return null
}

// 需要人脸验证直接结束并返回
function check_face_recognition() {
    log("检测是否需要人脸识别")
    randomSleep()
    var face_recognition = text("Your account has been disabled").findOne(FIND_WIDGET_TIMEOUT)
    if (face_recognition != null) {
        toastLog("该账号需要人脸识别")
        randomSleep()
        commonFun.clearData(tiktop_packageName)
        fail_register = true
        resgisterStatus = enums.REGISTER_STATUS.FACE_RECOGNITION
        isSuccess = false
        desc = resgisterStatus
        log(desc)
        updateRegisterResult()
        One_Key_Login()
    }
}

// 请求页面无法显示,需要加超时等待
// function check_content_not_found() {
//     log("检测是否为请求页无法显示\n【需要等待页面超时,预计需要等待2分13秒】")
//     do {
//         var content_not_found = text("Content Not Found").findOne(FIND_WIDGET_TIMEOUT)
//         if (content_not_found != null) {
//             try {
//                 check_allow_cookiesPage()
//                 checkauthorizationPage()
//             } catch (error) {
//                 log("在检查允许cookie时捕获到一个错误:" + error)
//             }
//         }
//     } while (true)
// }

// tiktok注册成功进行备份

// 进行tiktok备份
function tiktio_backupUplive() {
    commonFun.backupUplive(tiktop_packageName)
    randomSleep()
    resgisterStatus = enums.REGISTER_STATUS.SUCCESS

}

// tiktok登陆成功
function clickProfile() {
    log("登陆成功后点击我的页面")
    var login_in = text("Home").findOne(FIND_WIDGET_TIMEOUT)
    if (login_in != null) {
        log("该账号已登陆成功")
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
        registerSignUp = true
        isSuccess = false
        desc = resgisterStatus
        updateRegisterResult()
        randomSleep()
        tiktio_backupUplive()
        randomSleep()
    }
}

// 检查允许cookie页面
function check_allow_cookiesPage() {
    log("检查允许cookie页面")
    randomSleep()
    var allow_cookies = text("Allow the use of cookies by Facebook?").findOne(FIND_WIDGET_TIMEOUT)
    if (allow_cookies != null) {
        log("点击Allow All Cookies")
        var click_allow_cookies = text("Allow All Cookies").findOne().bounds()
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
    var web_fb_login = text("signup-button").findOne(FIND_WIDGET_TIMEOUT)
    if (web_fb_login != null) {
        log("重置app")
        fail_register = true
        resgisterStatus = enums.REGISTER_STATUS.WEB_FB_LOGIN
        isSuccess = false
        desc = resgisterStatus
        updateRegisterResult()
        One_Key_Login()
    }
}

// 创建随机名字
function create_random_name() {
    var creatName = text("Sign up").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (creatName != null) {
        var a = commonFun.randomStr(7)
        var b = commonFun.randomStrInStr(2)
        var create_username = a + b
        log("创建用户名为===>", create_username)
        randomSleep()
        setText(create_username)
        randomSleep()
        log("点击Sign up")
        var sign_up = id("com.zhiliaoapp.musically:id/dwe").find()
        if (sign_up != null) {
            log("该账号已被一键登陆成功")
            sign_up.click()
            randomSleep()
            fail_register = true
            resgisterStatus = enums.REGISTER_STATUS.SUCCESS
            desc = resgisterStatus
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