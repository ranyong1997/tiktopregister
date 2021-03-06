/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-25 20:12:22
 * @LastEditTime: 2022-02-17 11:31:54
 */


// taskip写死 需要重置  在httpUtilFunc.getPluginData
const commonFun = require("../lib/common.js");
const httpUtilFunc = require("../http/httpUtils");
const { reportLog } = require("../network/httpUtil.js");
const { randomSleep } = require("../lib/common.js");
const taskDemo = {}
let taskPluginData = null
var FIND_WIDGET_TIMEOUT = 1000
var desc = ""
var end = false
var isUsed = false
var isProcess = true
var gmail_package = "com.google.android.gm"


taskDemo.init = function () {
    commonFun.showLog("init Gmail_v22_4_5")
    taskDemo.result = 1
    taskDemo.desc = ""
}
taskDemo.init()
taskDemo.runTask = function () {
    new function () {
        try {
            try {   // 版本检测
                let happybayVersion = "1.1.40_beta_8_4"
                if (commonFun.happybayVersion < happybayVersion) { throw "happybayVersion " + commonFun.happybayVersion + " -> " + happybayVersion }
                if (commonFun.happybayVersion < "1.1.50_beta_4_8") { commonFun.taskResultSet("请升级群控系统应用:" + commonFun.happybayVersion + " -> " + "1.1.50_beta_4_8", "w") }
                let jsengineVersion = "4.1.1 Alpha2-gxl-817"
                if (commonFun.jsengineVersion < jsengineVersion) { throw "jsengineVersion " + commonFun.jsengineVersion + " -> " + jsengineVersion }
            } catch (error) {
                throw "系统应用版本过低,请先升级: " + commonFun.objectToString(error)
            }
            let timestamp = new Date().getTime()
            //  初始化测试
            try {
                if (!commonFun.server) { throw "未连接到群控后台" }
                //  业务后台连接检测
                commonFun.taskStepRecordSet(10, null, "业务后台连接检测", null)
                let lan_test = null
                for (let index = 0; index < 6; index++) {
                    try { lan_test = httpUtilFunc.testTaskServer() } catch (error) { }
                    commonFun.showLog("局域网测试: " + lan_test)
                    if (lan_test) { break }
                    sleep(5000)
                }
                if (!lan_test) {
                    log("业务后台连接异常")
                    commonFun.taskStepRecordSet(10, null, "业务后台连接异常", null)
                    commonFun.uninstallApp("fun.kitsunebi.kitsunebi4android")
                    //  业务后台连接检测
                    for (let index = 0; index < 90; index++) {
                        try {
                            if (!httpUtilFunc.testTaskServer()) { throw "" }
                            break
                        } catch (error) {
                            if (index > 80) { throw "业务后台连接异常, 请检查网络和服务器状态. " + commonFun.objectToString(error) }
                            commonFun.showLog("业务后台连接异常, 请检查网络和服务器状态. ")
                        }
                        sleep(60000)
                    }
                }
                randomSleep(3000)
                commonFun.showLog("")
            } catch (error) {
                commonFun.taskStepRecordSet(250, null, "任务回滚", null)
                throw error
            }
            try {   //  获取插件配置
                commonFun.taskStepRecordSet(20, null, "插件配置检测", null)
                taskPluginData = httpUtilFunc.getPluginData()
                reportLog("插件配置: " + JSON.stringify(taskPluginData))
                appName = taskPluginData.appName
                login = taskPluginData.login
                stoptimes = taskPluginData.stoptimes
                stoptimes2 = taskPluginData.stoptimes2
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
                log("stoptimes-->" + stoptimes)
            } catch (error) {
                commonFun.taskStepRecordSet(250, null, "任务回滚", null)
                throw "插件配置 获取失败 " + commonFun.objectToString(error)
            }
            //  执行任务
            try {
                //  本地网络
                commonFun.taskStepRecordSet(30, null, "代理ip检测", null)
                local_ip = httpUtilFunc.getLocalIp()
                log("本地 IP: " + local_ip)
                global_ip = null
                // 检测代理
                for (let index = 0; index < 3; index++) {
                    global_ip = httpUtilFunc.getGlobalIp()
                    reportLog("检测IP: " + local_ip + " -> " + global_ip)
                    commonFun.showLog("代理IP检测: " + global_ip)
                }
            } catch (error) {
                throw error
            }
            if (login != "") {
                commonFun.taskStepRecordSet(40, null, "Gmail一键登录任务开始", null)
                log("Gmail一键登录")
                material_gain(used_times_model) // 素材获取
                One_Key_Login()
                commonFun.taskStepRecordSet(200, null, "Gmail一键登录任务结束", null)
                commonFun.taskStepRecordSet(40, null, "Gmail浏览邮件任务开始", null)
                log("Gmail浏览邮件")
                browse_mail()
                commonFun.taskStepRecordSet(200, null, "Gmail浏览邮件结束", null)
                commonFun.taskResultSet("任务完成 下载报表查看详情", "a")
            }
            reportLog("运行时间 - " + parseInt((new Date().getTime() - timestamp) / 1000 / 60) + "分钟")
            if (taskDemo.result != 1) { throw taskDemo.desc }
        } catch (error) {
            throw error
        }
    }()
    sleep(3000)
    try { threads.shutDownAll() } catch (error) { }
    try { home(); sleep(2000) } catch (error) { }
    // ------------------------------分割线---------------------------------
    let task_result = commonFun.taskStepRecordGet()
    if (!task_result || typeof (task_result) != "object") { throw "未识别到任务上报日志" }
    let taskStatus = null
    let logsdesc = null
    if (taskDemo.result == 1) {
        taskStatus = 200
        try { logsdesc = "任务完成" + (task_result.logsdesc || "下载报表查看详情") } catch (error) { log(error) }
        commonFun.taskStepRecordSet(taskStatus, null, null, logsdesc)
    } else {
        if (task_result.taskStatus == 40) {
            taskStatus = 0
            logsdesc = "任务中途异常 " + (task_result.logsdesc || "下载报表查看详情")
            commonFun.taskStepRecordSet(taskStatus, null, null, logsdesc)
        }
        else if (task_result.taskStatus == 250) {
            logsdesc = "任务回滚,因为-" + (task_result.logsdesc || "下载报表查看详情")
            commonFun.taskStepRecordSet(taskStatus, null, null, logsdesc)
            throw task_result.taskStatus + "-" + logsdesc
        }
        else {
            logsdesc = (task_result.logsdesc || "下载报表查看详情")
            commonFun.taskStepRecordSet(taskStatus, null, null, logsdesc)
            throw task_result.taskStatus + "-" + logsdesc
        }
    }
}



















// ---------------------------------写方法区-----------------------
// 素材获取
function material_gain(used_times_model) {
    try {
        log("正在素材获取")
        let lable = taskPluginData.keyword_Gmail
        let app_id = taskPluginData.appid
        let appid_key = taskPluginData.appid_key
        let used_times = Number(taskPluginData.used_counter)
        var material_gain = httpUtilFunc.materialGet({
            "lable": lable, // FB素材标签
            "app_id": app_id,   // app_id
            "app_secret": appid_key,   // 密钥
            "count": 1, // 需要数据条数
            "type": 0,   // 类型（0:纯文本；1:图片；2:视频；3:音频）
            "classify": 3,   // 分类（文本类；图片类；视频类）
            "used_times_model": used_times_model,   // 匹配模式
            "used_times": used_times    // 使用次数 
        })
        material_INFO = material_gain
        Gmail_info = material_gain.text_content.split(",")
        log("Gmail邮箱密码获取--->>", Gmail_info)
        username = Gmail_info[0]
        password = Gmail_info[1]
        username1 = Gmail_info[2]
        log("账号为：", username, "密码为：", password, "辅助账号为：", username1)
        return Gmail_info
    } catch (error) {
        log("获取素材时捕获到一个错误:" + error)
        // 素材回退
        matter_rollback()
        commonFun.taskResultSet("素材获取失败" + error, "w")
    }
}
// 回滚素材库
function matter_rollback() {
    let app_id = taskPluginData.appid
    let appid_key = taskPluginData.appid_key
    httpUtilFunc.materialRollback(app_id, appid_key, material_INFO)
}

// 一键登陆Gmail邮箱
function One_Key_Login() {
    toastLog("开始Gmail一键登陆功能")
    openGMSApp(commonFun.userId)
    randomSleep()
    if (!packageName(gmail_package).findOne(1)) {
        log("Gmail启动中...")
        launch(gmail_package)
        sleep(6000)
    } else {
        log("目前还没有此app,请检查改机工具是否被隐藏")
        openGMSApp(commonFun.userId)
        launch(gmail_package)
    }
    while (true) {
        launch(gmail_package)
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
        click_HeadPortrait()
        click_IdInfo()
        if (end) {
            break
        }
    }
}

// 浏览邮件
function browse_mail() {
    toastLog("开始Gmail一键浏览")
    log("Gmail启动中...")
    launch(gmail_package)
    sleep(6000)
    click_WelcomePage()
    click_PopUpBtn()
    browse_Email()
    enter_Email()
}

// ------------------------------------------分割线-----------------
// 更新账号信息到8000端口
function updateRegisterResult() {
    log("更新账号信息到8000端口")
    try {
        return commonFun.newThread(() => {
            var data = {
                "forceRecord": true,
                "type": 1,
                "appName": "Gmail",
                "phone": "Gmail_login" + commonFun.androidId,
                "deviceId": commonFun.deviceId,
                "folderId": commonFun.folderId,
                "androidId": commonFun.androidId,
                "password": null,
                "username": user_name,
                "tag": "Gmail_login",
                "phoneProvider": null,
                "dialCode": null,
                "countryCode": null,
                "email": username,
                "emailPassword": password,
                "smsurl": null,
                "isRegistered": false,
                "isProcess": isProcess,
                "extra": null,
                "city": null,
                "country": null,
                "emailProvider": null,
                "proxy": null,
                "proxyProvider": "connanys",
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
            setText(username)
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
            setText(password)
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
                log("检查是否需要辅助邮箱验证")
                let check_AssistVerify = text("Confirm your recovery email").findOne(FIND_WIDGET_TIMEOUT)
                if (check_AssistVerify != null) {
                    log("点击辅助邮箱验证")
                    randomSleep()
                    commonFun.clickWidget(check_AssistVerify)
                    sleep(5000)
                    log("检查输入辅助邮箱页面是否存在")
                    let check_AssistVerifyPag = text("Try another way").findOne(FIND_WIDGET_TIMEOUT)
                    if (check_AssistVerifyPag != null) {
                        log("输入对应的辅助邮箱")
                        commonFun.swipeUpRandomSpeed()
                        sleep(2000)
                        setText(username1)
                        randomSleep()
                        log("检查Next是否存在")
                        let check_Next_Btn1 = text("Next").findOne(FIND_WIDGET_TIMEOUT)
                        if (check_Next_Btn1 != null) {
                            log("点击Next")
                            randomSleep()
                            commonFun.clickWidget(check_Next_Btn1)
                            sleep(5000)
                        }
                    }
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
            sleep(2000)
            commonFun.clickWidget(check_page)
            let click_ok = text("OK").findOne(FIND_WIDGET_TIMEOUT)
            if (click_ok != null) {
                log("点击ok")
                sleep(1000)
                commonFun.clickWidget(click_ok)
            }
            sleep(1000)
        }
    } catch (error) {
        log("检查Take me to gmail页面时捕获到一个错误:", error)
    }
}
// Gmail第十步:点击弹窗关闭按钮
function click_PopUpBtn() {
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
            end = true
            updateRegisterResult()
            back()
            return true
        }
    } catch (error) {
        log("获取账号信息时捕获到一个错误:", error)
    }
    return false
}
// Gmail第十四步:如果没有登陆成功则回退素材
//TODO:待补充

// Gmail异常提示处理
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

// Gmail 重新打开欢迎界面
function click_WelcomePage() {
    log("检查欢迎界面")
    try {
        let check_page = text("SKIP").id("com.google.android.gm:id/welcome_tour_skip").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击SKIP")
            randomSleep()
            commonFun.clickWidget(check_page)
            randomSleep()
        }
    } catch (error) {
        log("检查欢迎界面时捕获到一个错误:", error)
    }
}

// 进入邮件
function browse_Email() {
    log('检查邮件')
    try {
        let check_page = id("com.google.android.gm:id/senders").findOne(FIND_WIDGET_TIMEOUT)
        if (check_page != null) {
            log("点击第一封邮件")
            randomSleep()
            commonFun.clickWidget(check_page)
        }
    } catch (error) {
        log("检查邮件界面时捕获到一个错误:", error)
    }
}

// 浏览邮件
function enter_Email() {
    log('浏览邮件')
    try {
        sleep(2000)
        let check_star = id("com.google.android.gm:id/conversation_header_star").findOne(FIND_WIDGET_TIMEOUT)
        if (check_star != null) {
            log("点击收藏")
            commonFun.swipeDownRandomSpeed()
            sleep(2000)
            commonFun.clickWidget(check_star)
            // 传入等待时间
            commonFun.swipeUpRandomSpeed()
            commonFun.swipeUpRandomSpeed()
            log("停留时长：" + stoptimes + "秒")
            sleep(stoptimes * 1000)
            back()
        }
    } catch (error) {
        log("检查邮件界面时捕获到一个错误:", error)
    }
}
// ---------------------------------写方法区-----------------------
module.exports = taskDemo;