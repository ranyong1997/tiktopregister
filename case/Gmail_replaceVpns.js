var commonFun = require("../lib/common.js")
var proxySettings = require("../vpn/proxySettings.js")
var httpUtilFunc = require("../http/httpUtils")
var isSuccess = true
var desc = ""
var isUsed = false
var isProcess = true
var FIND_WIDGET_TIMEOUT = 750
var gmail_package = "com.google.android.gm"
// 获取动态【GMail_20220117】代理
var proxy_data = httpUtilFunc.getProxyData("sellerip", "GMail_20220117")
var vpnData = proxy_data.proxy
log("proxy_data---->", vpnData)

// **********************************方法执行区**********************************
commonFun.systemTimezoneSet_New("America/Los_Angeles") // 设置时区
commonFun.systemTimezoneGet()   // 获取当前时区
if (connectVPN()) {  // 判断是否已连接vpn
    randomSleep()
    log("脚本执行")
    One_Key_Login()
}

// One_Key_Login()

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
            is_proxy_on = proxySettings.kitsunebiSetup3(vpnData)
        } catch (error) {
            log("连接vpn时捕获到一个错误:", error)
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

// 更新账号信息到8000端口
function updateRegisterResult() {
    log("更新账号信息到8000端口")
    try {
        return commonFun.newThread(() => {
            var data = {
                "forceRecord": true,
                "type": 1,
                "appName": "Gmail",
                "phone": "test_20220118(Gmail)_guo_" + commonFun.androidId,
                "deviceId": commonFun.deviceId,
                "folderId": commonFun.folderId,
                "androidId": commonFun.androidId,
                "password": null,
                "username": user_name,
                "tag": "test_20220118(Gmail)_guo",
                "phoneProvider": null,
                "dialCode": null,
                "countryCode": "US",
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
                "proxyProvider": "GMail_20220117",
                "ip": null,
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

// 一键登陆Gmail邮箱
function One_Key_Login() {
    toastLog("开始Gmail一键登陆功能")
    if (!packageName(gmail_package).findOne(1)) {
        log("Gmail启动中...")
        launch(gmail_package)
        sleep(10000)
    } else {
        log("目前还没有此app,请检查改机工具是否被隐藏")
        openGMSApp(commonFun.userId)
    }
    do {
        // try {
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
            randomSleep()
            click_HeadPortrait()
            randomSleep()
            click_IdInfo()
            if (isSuccess = true) {
                break
            }
        // } catch (error) {
        //     log("一键登陆时捕获到一个错误:" + error)
        // }
    } while (true);
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
            input(username)
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
            input(password)
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
            randomSleep()
            commonFun.clickWidget(check_page)
            sleep(3000)
        }
    } catch (error) {
        log("检查Take me to gmail页面时捕获到一个错误:", error)
    }
}
// Gmail第十步:点击弹窗关闭按钮
function click_PopUpBtn() {
    randomSleep()
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
        }
    } catch (error) {
        log("获取账号信息时捕获到一个错误:", error)
    }
}
// 检查使用时间提示框
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
// **********************************方法编辑区**********************************



