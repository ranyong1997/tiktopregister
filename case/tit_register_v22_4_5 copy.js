var httpUtilFunc = require("../http/httpUtils.js");
var proxySettings = require("../vpn/proxySettings.js")
var commonFunc = require("../lib/common.js")
var proxySettings = require("../vpn/proxySettings.js")
 
var FIND_WIDGET_TIMEOUT = 750 // 设置元素超时时间
var launchAppCount = 1
var tiktop_packageName = "com.zhiliaoapp.musically"
var facebook_packageName = "com.facebook.katana"
var androidId = "e7b3f127ba5d5b28"

// 脚本执行方法区
commonFunc.systemTimezoneSet("Europe/London")   // 设置时区 (英国/伦敦)
commonFunc.systemTimezoneGet()  // 获取当前时区
closeLocation()  // 关闭本地网络
closeVPNSettings()   // 关闭vpn
checkTiktokInstall() // 检测Tiktok是否安装
checkFacebookInstall // 检测Facebook是否安装
//TODO: 需要重构
if (connectVPN()) { // 判断是否连接vpn
    sleep(5000)
    // One_Key_Login()
}
Facebook_Account_Transfer()
One_Key_Login()


// TODO:更改英国ip
var vpnInfos = [
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$g9NkvqmNL0*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$3FJHAhGpFW*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$A0K4Lmeui8*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$mpziPDECFK*GB", "pass": "88tr", "ptype": "sock5" }
]

//点击VPN连接按钮
function connectVPN () {
    // if( !commonFunc.uninstallApp("fun.kitsunebi.kitsunebi4android") ){ reportLog("设备环境异常") }
    if( !proxySettings.kitsunebiInstall("http://192.168.91.3:8012/upload/e3acddc3-4ce1-4286-8ad6-f2c0e8bac093.apk") ){ throw "未安装 " + "fun.kitsunebi.kitsunebi4android" }
    var is_proxy_on = false
    var startVpnConnnectTime = new Date().getTime()
    do {

        var nowTime = new Date().getTime()
        if (nowTime - startVpnConnnectTime > 3 * 60 * 1000) {
            return false
        }
        try {
            httpUtilFunc.getIpByIpify()   
        } catch (error) {
            // throw error
            closeVPNSettings()
        }
        try {
            // closeVPNSettings()
            // is_proxy_on = proxySettings.kitsunebiSetup( getVpnConfigInfo() )  
            let vpnData = vpnInfos[random(0, 9)]
            is_proxy_on = proxySettings.kitsunebiSetup2(vpnData)
        } catch (error) {
            // throw error
            // reportLog( error )
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
    do {
        if (!packageName("com.android.settings").findOne(1)) {
            log("正在打开设置...")
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
            log("正在打开设置 .. ")
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
// TODO:tiktokInstall地址需要更改
function checkTiktokInstall() {
    if (!app.getAppName(tiktop_packageName)) {
        log("检测到未安装TikTok")
        closeVPNSettings()
        if (!commonFunc.tiktokInstall("http://192.168.91.3:8012/upload/7c207a62-dafc-48ce-ae55-af6d1d05c737.apk")) { throw "未安装 " + "TikTok" }
    }
}

// 检测Facebook是否安装对应版本
function checkFacebookInstall() {
    if (!app.getAppName(facebook_packageName)) {
        toastLog("检测到未安装Facebook")
        closeVPNSettings()
        if (!commonFunc.facebookInstall("http://192.168.91.3:8012/upload/4ffa85b5-a6b5-45e8-a3aa-025761aadadd.apk")) { throw "未安装 " + "Facebook" }
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

function One_Key_Login() {
    commonFunc.clearData(tiktop_packageName)
    randomSleep()
    var vpnState = SLChanges.getVPNLinkState()
    log("vpn是否连接:" + vpnState)
    if (!vpnState) {
        checkVPNConnect()
    }
    log(" VPN启动 " + vpnState)
    startRegisterTime = new Date().getTime()
    toastLog("开始一键登陆功能")
    randomSleep()
    do {
        if (!packageName(tiktop_packageName).findOne(1)) {
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
            checkauthorizationPage()
            checkSignupPage()
        }
        catch (error) {
            toastLog("检查启动页捕获到一个错误:" + error)
        }
    } while (true)
}

function checkSignUpPage() {
    log("检查登陆页")
    var signUpText = text("Sign up for TikTok").id(tiktop_packageName + ":id/title").find()
    if (signUpText != null) {
        log("点击facebook登陆")
        var continueFacebook = id(tiktop_packageName + ":id/acf").find();
        randomSleep()
        continueFacebook.click();
    }
}


function checkauthorizationPage() {
    log("检查授权页面")
    var authorizationPage = id("m-future-page-header-title").waitFor()
    if (authorizationPage != null) {
        log("点击授权按钮")
        var authorizationText = id("u_0_5_ik").findOne()
        randomSleep()
        authorizationText.click();
    }
}


function checkSignupPage() {
    log("检查创建用户名页面")
    var vpnSettings = text("Sign up").id("com.zhiliaoapp.musically:id/title").findOne(500)
    if (vpnSettings != null) {
        log("点击跳过按钮")
        var vpnSettings1 = text("Skip").id("com.zhiliaoapp.musically:id/egf").findOne(500)
        randomSleep()
        vpnSettings1.click()
    }
}

function Facebook_Account_Transfer() {
    log("正在迁移facebook账号")
    commonFunc.Facebook_Account_Transfer(facebook_packageName, androidId)
}



//------------------------------------------------------
// 随机等待 
function randomSleep() {
    var randomSleep = random(500, 1500)
    sleep(randomSleep)
    log("随机等待时间为:" + randomSleep + "毫秒")
}