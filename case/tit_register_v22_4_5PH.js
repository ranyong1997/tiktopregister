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
var kitsunebi_packageName = "fun.kitsunebi.kitsunebi4android"
// 获取ip
var global_ip = httpUtilFunc.getLocalIp()

commonFun.uninstallApp(kitsunebi_packageName)
// 获取动态【doveip】代理
var proxy_data = httpUtilFunc.getProxyData("doveip", "doveip")
proxy_info = httpUtilFunc.getProxyFromDoveip(proxy_data.proxy, { "geo": "ID", "timeout": 10 })
log("获取的代理信息: " + JSON.stringify(proxy_info))

// **********************************方法执行区**********************************
// commonFun.systemTimezoneSet_New("Jakarta/Indonesia")
commonFun.systemTimezoneGet()   // 获取当前时区
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
let myThreadResult = commonFun.newThread(doSomething, false, 1000 * 60 * 10, () => { log("时间已经超时10分钟,程序退出") })

function alaways_running() {
    Facebook_Account_Transfer()
}
// alaways_running()


// **********************************方法执行区**********************************

// **********************************方法保护区 勿动**********************************
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
            is_proxy_on = proxySettings.kitsunebiSetup(proxy_info)
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
        // One_Key_Login()
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
    if (!app.getAppName(tiktop_packageName)) {
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
function material_gain() {
    try {
        log("正在素材获取")
        var material_gain = httpUtilFunc.materialGet({
            "app_id": "a01ed8c2a96ef33a28f21043318acf5f",
            "app_secret": "c159d6d44650179ef5498d5081c87bdd",
            "count": 1,
            "type": 0,
            "classify": 3,
            "used_times": 0,
            "used_times_model": "lte",
            "lable": "PH"
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
                "appName": "tiktok",
                "phone": "test_20220124 Ran_" + commonFun.androidId,
                "deviceId": commonFun.deviceId,
                "folderId": commonFun.folderId,
                "androidId": commonFun.androidId,
                "password": null,
                "username": username,
                "tag": "test_20220124(菲律宾)_ran",
                "phoneProvider": "facebook",
                "dialCode": "44",
                "countryCode": "PH",
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
                "proxyProvider": "doveip",
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
            matter_rollback()
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
    commonFun.backupUpAppInfo(tiktop_packageName, "ID-Tiktok—ran(2022-1-12)")
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
    // while (true) {
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
    // }
}



// 回滚素材
function matter_rollback() {
    let app_id = "a01ed8c2a96ef33a28f21043318acf5f"
    let app_secret = "c159d6d44650179ef5498d5081c87bdd"
    httpUtilFunc.materialRollback(app_id, app_secret, material_INFO)
}





// **********************************方法编辑区**********************************