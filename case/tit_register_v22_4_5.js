var commonFunc = require("../lib/common")
var proxySettings = require("../vpn/proxySettings")
const { VPN_TYPE, VPN_PROXY_TIMELINESS, REGISTER_APP_ID, VPN_USE_ACTION_TAG } = require("../util/enums.js");

var FIND_WIDGET_TIMEOUT = 750 // 设置元素超时时间
var launchAppCount = 1
var tiktop_packageName = "com.zhiliaoapp.musically"
var android_set = "com.android.settings"

// 脚本执行方法区
commonFunc.systemTimezoneSet("Europe/London")   // 设置时区 (英国/伦敦)
commonFunc.systemTimezoneGet()  // 获取当前时区
// closeLocation()  // 关闭本地网络
// closeVPNSettings()   // 关闭vpn
// checkTiktokInstall() // 检测tiktop是否安装
// if (connectVPN()) { // 判断是否连接vpn
//     sleep(5000)
//     getRegisterInfo()
// }
One_Key_Login()

// TODO:更改英国ip
var vpnInfos = [
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$g9NkvqmNL0*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$3FJHAhGpFW*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$A0K4Lmeui8*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$mpziPDECFK*GB", "pass": "88tr", "ptype": "sock5" },
]

// 点击VPN连接按钮
function connectVPN() {
    log("判断vpn是否安装，若没安装就到网络上下载并安装")
    if (!proxySettings.kitsunebiInstall("http://192.168.91.3:8012/upload/e3acddc3-4ce1-4286-8ad6-f2c0e8bac093.apk")) { throw "未安装 " + "fun.kitsunebi.kitsunebi4android" }
    var is_proxy_on = false
    var startVpnConnnectTime = new Date().getTime()
    do {
        var nowTime = new Date().getTime()
        if (nowTime - startVpnConnnectTime > 3 * 60 * 1000) {
            return false
        }
        try {
            log("获取vpn IP地址")
            httpUtilFunc.getIpByIpify()
        } catch (error) {
            log("关闭vpn设置")
            closeVPNSettings()
        }
        try {
            let vpnData = vpnInfos[random(0, 9)]
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

// 关闭vpn设置
function closeVPNSettings() {
    randomSleep()
    // do {
    if (!packageName("com.android.settings").findOne(1)) {
        log("正在打开设置...")
        launchApp("Settings")
        sleep(3000)
    }
    if (!packageName("com.android.settings").findOne(1)) {
        sleep(3000)
        // continue
    }
    var settingPage = id("com.android.settings:id/dashboard_container").findOne(3000)
    if (settingPage != null) {
        var networkSetting = text("Network & Internet").findOne(FIND_WIDGET_TIMEOUT)
        if (networkSetting != null) {
            commonFunc.clickWidget(networkSetting)
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
        commonFunc.clickWidget(vpnSettings)
        randomSleep()
    }
    var KitsunebiSetting = text("Kitsunebi").id("android:id/title").findOne(500)
    if (KitsunebiSetting != null) {
        commonFunc.clickWidget(id("com.android.settings:id/settings_button").findOne(500))
        randomSleep()
    }
    var switchBt = id("android:id/switch_widget").findOne(FIND_WIDGET_TIMEOUT)
    if (switchBt != null && switchBt.text() != "OFF") {
        commonFunc.clickWidget(switchBt)
        sleep(500)
        back()
        sleep(500)
        back()
        sleep(500)
        back()
        sleep(500)
        back()
        sleep(500)
        // break
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
        // break
    }
    var noVPN = text("No VPNs added").findOne(500)
    if (noVPN != null) {
        sleep(500)
        back()
        sleep(500)
        back()
        sleep(500)
        back()
        // break
    }
    // } while (true)
}

// 关闭本地网络
function closeLocation() {
    var startVpnConnnectTime = new Date().getTime()
    do {
        log("正在关闭本地网络")
        var nowTime = new Date().getTime()
        if (nowTime - startVpnConnnectTime > 3 * 60 * 1000) {
            return false
        }
        if (!packageName("com.android.settings").findOne(1)) {
            log("kitsunebi launching .. ")
            launchApp("Settings")
            sleep(5000)
        }
        var settingPage = id("com.android.settings:id/dashboard_container").findOne(3000)
        if (settingPage != null) {
            var locationSetting = text("Security & location").id("android:id/title").findOne(3000)
            if (locationSetting != null) {
                commonFunc.clickWidget(locationSetting)
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
            commonFunc.clickWidget(locationSettings)
            sleep(3000)
        }
        var switchBt = id("com.android.settings:id/switch_widget").findOne(3000)
        if (switchBt != null && switchBt.text() != "OFF") {
            commonFunc.clickWidget(switchBt)
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

// 检测Tiktok是否安装对应版本
function checkTiktokInstall() {
    if (!app.getAppName(tiktop_packageName)) {
        toastLog("未安装TikTok")
        closeVPNSettings()
        if (!commonFunc.tiktokInstall("http://192.168.91.3:8012/upload/7c207a62-dafc-48ce-ae55-af6d1d05c737.apk")) { throw "未安装 " + "tiktok" }
    }
}


// 检查vpn连接
function checkVPNConnect() {
    do {
        try {
            if (!packageName("fun.kitsunebi.kitsunebi4android").findOne()) {
                log("kitsunebi launching .. ")
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
            toastLog(error)
            break
        }
    } while (true)
}

function One_Key_Login() {
    commonFunc.clearData(tiktop_packageName)
    randomSleep()
    if (!vpnState) {
        checkVPNConnect()
    }
    log(" VPN启动 " + vpnState)
    startRegisterTime = new Date().getTime()
    toastLog("开始一键登陆功能")
    randomSleep()
    do {
        if (!packageName(tiktop_packageName).findOne()) {
            log("TikTok 启动中..." + "启动次数为:" + launchAppCount)
            launchApp("TikTok")
            sleep(3000)
            launchAppCount++
            var vpnState = SLChanges.getVPNLinkState()
            log("vpn是否连接:" + vpnState)
            if (!vpnState) {
                checkVPNConnect()
            }
        }
        try {
            checkSignUpPage()
        } catch (error) {
            toastLog("检查启动页捕获到一个错误:" + error)
        }
    } while (true)
}

function checkSignUpPage() {
    log("检查登陆页")
    var signUpText = text("Sign up for TikTok").id(tiktop_packageName + ":id/title").find()
    if (signUpText != null) {
        var continueFacebooka = id(tiktop_packageName + ":id/acf").find();
        randomSleep()
        continueFacebooka.click();
    }
}




//------------------------------------------------------
// 随机等待
function randomSleep() {
    var randomSleep = random(500, 1500)
    sleep(randomSleep)
    log("随机等待时间为:" + randomSleep + "毫秒")
}
