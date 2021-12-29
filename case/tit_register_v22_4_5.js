var commonFun = require("../lib/common.js")
var proxySettings = require("../vpn/proxySettings.js")

var registerDone = false
var registerSignUp = false
var FIND_WIDGET_TIMEOUT = 750
var launchAppCount = 1
var tiktop_packageName = "com.zhiliaoapp.musically"
var facebook_packageName = "com.facebook.katana"
var androidId = "e7b3f127ba5d5b28"

var vpnInfos = [
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$g9NkvqmNL0*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$3FJHAhGpFW*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$A0K4Lmeui8*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$mpziPDECFK*GB", "pass": "88tr", "ptype": "sock5" }
]

// **********************************方法执行区**********************************
// commonFun.systemTimezoneSet("Europe/London")
// commonFun.systemTimezoneGet()   // 获取当前时区
// closeLocation()  // 关闭本地网络
// closeVPNSettings()   // 关闭本地网络
// checkTiktokInstall() // 检测tiktok是否安装
// checkFacebookInstall()   // 检测facebook是否安装
// Facebook_Account_Transfer()  // facebook账号迁移
// if (connectVPN()) {  // 判断是否已连接vpn
//     randomSleep()
//     log("脚本执行")
//     One_Key_Login()  // 一键登陆
// }
One_Key_Login()
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
        sleep(5000)
        checkSignUpPage()
        checkauthorizationPage()
        checkBirthdayPage()
        checkphonePage()
        checkAuthorizationPage1()
        checkSignupPage()
        checkinterestsPage()
        // checkinterestsPage1()
        checkSwipe_up_Page()
        checkSynchronizingPage()
        if (registerDone && registerSignUp) {
            break
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
    var authorizationPage = id("m-future-page-header-title").findOne(FIND_WIDGET_TIMEOUT)
    if (authorizationPage != null) {
        log("点击授权按钮")
        var authorizationText = id("u_0_5_ik").findOne(FIND_WIDGET_TIMEOUT)
        if (authorizationText != null) {
            commonFun.clickWidget(authorizationText)
            randomSleep()
        }
    }
}

function checkBirthdayPage() {
    log("选择出生月月日页")
    randomSleep()
    var choose_birthday = text("When’s your birthday?").id("com.zhiliaoapp.musically:id/qv").findOne(500)
    if (choose_birthday != null) {
        log("点击返回")
        var click_back = id("com.zhiliaoapp.musically:id/pi").findOne(500)
        randomSleep()
        click_back.click()
    }
}

function checkphonePage() {
    log("手机/邮箱页")
    randomSleep()
    var checkphone = text("Send code").id("com.zhiliaoapp.musically:id/cfh").findOne(500)
    if (checkphone != null) {
        log("点击返回")
        var click_back = id("com.zhiliaoapp.musically:id/pi").findOne(500)
        randomSleep()
        click_back.click()
    }
}

function checkAuthorizationPage1() {
    log("授权登陆界面")
    randomSleep()
    var authorizationText = className("android.widget.Button").text("Cancel").find()
    if (authorizationText != null) {
        log("点击允许授权")
        var click_authorization = text("Agree and Continue").find()
        randomSleep()
        click_authorization.click();

    }
}

function checkSignupPage() {
    log("检查创建用户名页面")
    randomSleep()
    var vpnSettings = text("Sign up").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (vpnSettings != null) {
        log("点击跳过按钮")
        var skip = text("Skip").id("com.zhiliaoapp.musically:id/egf").findOne(FIND_WIDGET_TIMEOUT)
        if (skip != null) {
            commonFun.clickWidget(skip)
            randomSleep()
        }
    }
}


function checkinterestsPage() {
    log("选择你的兴趣界面")
    var choose_interests = text("Choose your interests").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (choose_interests != null) {
        log("点击跳过按钮")
        var interests_skip = text("Skip").id("com.zhiliaoapp.musically:id/e1u").findOne(FIND_WIDGET_TIMEOUT)
        var interests_skip1 = text("Skip").id("com.zhiliaoapp.musically:id/em0").findOne(FIND_WIDGET_TIMEOUT)
        if (interests_skip != null || interests_skip1 != null) {
            commonFun.clickWidget(interests_skip)
        }
    }
}


function checkinterestsPage1() {
    log("选择你的兴趣界面")
    var choose_interests = text("Choose your interests").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (choose_interests != null) {
        log("点击跳过按钮")
        var interests_skip = text("Skip").id("com.zhiliaoapp.musically:id/em0").findOne(FIND_WIDGET_TIMEOUT)
        if (interests_skip != null) {
            commonFun.clickWidget(interests_skip)
            randomSleep()
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
}


function checkSynchronizingPage() {
    log("关闭同步联系人")
    randomSleep()
    var Synchronizing = text("Sync your contacts to easily find people you know on TikTok. Your contacts will only be used to help you connect with friends.").id("com.zhiliaoapp.musically:id/adq").findOne(500)
    if (Synchronizing != null) {
        log("点击不允许")
        var click_dont = text("Don't allow").findOne(500)
        randomSleep()
        click_dont.click()
    }
    commonFun.scrollShortUp()
}

function checkSynchronizingPage() {
    log("关闭同步联系人")
    var Synchronizing = findOne(FIND_WIDGET_TIMEOUT)
    if (Synchronizing != null) {
        log("点击不允许")
        var click_dont = text("Don't allow").findOne(FIND_WIDGET_TIMEOUT)
        if (click_dont != null) {
            commonFun.clickWidget(click_dont)
        }
        randomSleep()
    }
    commonFun.scrollShortUp()
}

function Facebook_Account_Transfer() {
    log("正在迁移facebook账号")
    commonFun.Facebook_Account_Transfer(facebook_packageName, androidId)
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
        if (!commonFun.facebookInstall("http://192.168.91.3:8012/upload/4ffa85b5-a6b5-45e8-a3aa-025761aadadd.apk")) { throw "未安装 " + "Facebook" }
    }
}


// **********************************方法编辑区**********************************