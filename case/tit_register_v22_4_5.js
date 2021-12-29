var commonFun = require("../lib/common.js")
var proxySettings = require("../vpn/proxySettings.js")
var httpUtilFunc = require("../http/httpUtils")
var enums = require("../util/enums")

var registerDone = false
var isSuccess = true
var desc = ""
var registerSignUp = false
var fail_register = false
var FIND_WIDGET_TIMEOUT = 750
var launchAppCount = 1
var resgisterStatus = enums.REGISTER_STATUS.DEFAULT
var tiktop_packageName = "com.zhiliaoapp.musically"
var facebook_packageName = "com.facebook.katana"
var androidId = material_gain()

var vpnInfos = [
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$g9NkvqmNL0*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$3FJHAhGpFW*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$A0K4Lmeui8*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$mpziPDECFK*GB", "pass": "88tr", "ptype": "sock5" }
]

// **********************************方法执行区**********************************
commonFun.systemTimezoneSet("Europe/London")
commonFun.systemTimezoneGet()   // 获取当前时区
closeLocation()  // 关闭本地网络
closeVPNSettings()   // 关闭VPN
checkTiktokInstall() // 检测tiktok是否安装
checkFacebookInstall()   // 检测facebook是否安装
material_gain() // 安卓id获取
Facebook_Account_Transfer()  // facebook账号迁移
if (connectVPN()) {  // 判断是否已连接vpn
    randomSleep()
    log("脚本执行")
    One_Key_Login()  // 一键登陆
}

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
            sleep(3000)
        }
        if (!packageName("com.android.settings").findOne(1)) {
            sleep(1000)
            continue
        }
        var settingPage = id("com.android.settings:id/dashboard_container").findOne(3000)
        if (settingPage != null) {
            var locationSetting = text("Security & location").id("android:id/title").findOne(3000)
            if (locationSetting != null) {
                commonFun.clickWidget(locationSetting)
                sleep(2000)
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
            sleep(2000)
        }
        var locationSettings = text("Location").id("android:id/title").findOne(3000)
        if (locationSettings != null) {
            commonFun.clickWidget(locationSettings)
            sleep(2000)

        }
        var switchBt = id("com.android.settings:id/switch_widget").findOne(3000)
        if (switchBt != null && switchBt.text() != "OFF") {
            commonFun.clickWidget(switchBt)
            sleep(2000)
            back()
            sleep(2000)
            back()
            sleep(2000)
            back()
            break
        } else if (switchBt != null && switchBt.text() == "OFF") {
            sleep(2000)
            back()
            sleep(2000)
            back()
            sleep(2000)
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
            checkauthorizationPage()
            check_face_recognition()
            if (fail_register) {
                break
            }
            check_content_not_found()
            if (fail_register) {
                break
            }
            // checkBirthdayPage()
            // checkphonePage()
            checkAuthorizationPage1()
            checkCreatNamePage()
            checkinterestsPage()
            // checkinterestsPage1()
            checkSwipe_up_Page()
            // checkSynchronizingPage()
            check_login_success()
            updateRegisterResult()
            if (registerDone && registerSignUp) {
                break
            }
        } catch (error) {
            toastLog(" register error " + error)
        }
    } while (4)
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

function checkCreatNamePage() {
    log("检查创建用户名页面")
    randomSleep()
    var vpnSettings = text("Sign up").id("com.zhiliaoapp.musically:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (vpnSettings != null) {
        log("点击Sign up")
        var sign_up = text("Sign up").id("com.zhiliaoapp.musically:id/cfh").findOne(FIND_WIDGET_TIMEOUT)
        if (sign_up != null) {
            toastLog("该账号已被注册")
            commonFun.clickWidget(sign_up)
            randomSleep()
            fail_register = true
            resgisterStatus = enums.REGISTER_STATUS.REGISTERED
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
}


function checkSynchronizingPage() {
    log("关闭同步联系人")
    randomSleep()
    var Synchronizing = text("Sync your contacts to easily find people you know on TikTok. Your contacts will only be used to help you connect with friends.").id("com.zhiliaoapp.musically:id/adq").findOne(500)
    if (Synchronizing != null) {
        log("点击不允许")
        var click_dont = text("Don't allow").findOne(500)
        if (click_dont != null) {
            // randomSleep()
            commonFun.clickWidget(start_watching)
            // click_dont.click()
            registerDone = true
            registerSignUp = true
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
        if (!commonFun.facebookInstall("	http://192.168.91.3:8012/upload/aefb636d-5f4b-435b-adfc-12734903a05a.apk")) { throw "未安装 " + "Facebook" }
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


// 更新账号信息到8000端口
function updateRegisterResult() {
    log("更新账号信息到8000端口")
    function updateRegisterResult(account) {
        toastLog("updateRegisterResult status " + resgisterStatus)
        var resultBody = {
            "id": account.id,
            "password": account.password,
            "email": emailAddress,
            "register_ip": httpUtilFunc.getIpByIpify(),
            "status": resgisterStatus,
            "account": accountName,
            "register_app_id": enums.REGISTER_APP_ID.TIKTOK
        }
        toastLog(" updateRegisterResult ")
        var result = httpUtilFunc.httpRequest("registerAccountUpdate", resultBody)
        toastLog(" updateRegisterResult result " + result.body.string())
    }
}

// 需要人脸验证直接结束并返回
function check_face_recognition() {
    log("检测是否需要人脸识别")
    randomSleep()
    var face_recognition = text("Your account has been disabled").findOne(FIND_WIDGET_TIMEOUT)
    if (face_recognition != null) {
        toastLog("该账号需要人脸识别")
        // TODO：记录该facebook安卓id
        randomSleep()
        commonFun.clearData(tiktop_packageName)
        fail_register = true
        resgisterStatus = enums.REGISTER_STATUS.FACE_RECOGNITION
        One_Key_Login()
    }
}

// 请求页面无法显示
function check_content_not_found() {
    log("检测是否为请求页无法显示")
    randomSleep()
    var content_not_found = text("Content Not Found").findOne(FIND_WIDGET_TIMEOUT)
    if (content_not_found != null) {
        toastLog("该账号请求也无法显示")
        // TODO：记录该facebook安卓id
        randomSleep()
        fail_register = true
        resgisterStatus = enums.REGISTER_STATUS.Content_Not_Found
        Home()
        One_Key_Login()
    }
}

// tiktok注册成功进行备份
function tiktio_backupUplive() {
    commonFun.backupUplive(tiktop_packageName)
    randomSleep()
    resgisterStatus = enums.REGISTER_STATUS.SUCCESS
}

// tiktok登陆成功
function check_login_success() {
    log("检测tiktok登陆成功")
    randomSleep()
    var login_success = id("com.zhiliaoapp.musically:id/bbq").findOne(FIND_WIDGET_TIMEOUT)
    if (login_success != null) {
        toastLog("该账号已登陆成功")
        // TODO：记录该facebook安卓id
        randomSleep()
        fail_register = true
        resgisterStatus = enums.REGISTER_STATUS.REGISTERED
        tiktio_backupUplive()
        One_Key_Login()
    }
}

// **********************************方法编辑区**********************************检查授权页面