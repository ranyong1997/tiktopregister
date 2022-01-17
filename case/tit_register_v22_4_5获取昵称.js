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
// 获取动态【doveip】代理
// var proxy_data = httpUtilFunc.getProxyData("doveip", "doveip")
// proxy_info = httpUtilFunc.getProxyFromDoveip(proxy_data.proxy, { "geo": proxy_data.ID, "timeout": 10 })
// httpUtilFunc.reportLog("获取的代理信息: " + JSON.stringify(proxy_info))
// log("获取的代理信息: " + JSON.stringify(proxy_info))

// **********************************方法执行区**********************************
// commonFun.systemTimezoneSet_New("Jakarta/Indonesia")
// commonFun.systemTimezoneGet()   // 获取当前时区
// checkFacebookInstall()   // 检测facebook是否安装
// checkTiktokInstall() // 检测tiktok是否安装
// if (connectVPN()) {  // 判断是否已连接vpn
//     randomSleep()
//     log("脚本执行")
//     alaways_running()
// }
// function alaways_running() {
//     Facebook_Account_Transfer()
//     One_Key_Login()
// }
// alaways_running()
One_Key_Login()
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
    randomSleep()
    startRegisterTime = new Date().getTime()
    toastLog("开始一键登陆功能")
    randomSleep()
    if (!packageName(tiktop_packageName).findOne(1)) {
        log("TikTok 启动中..." + "启动次数为:" + launchAppCount)
        launchApp("TikTok")
        sleep(3000)
        launchAppCount++
    }
    sleep(5000)
    clickProfile()
}

//  检查登录状态
commonFunc.taskResultSet("登录检查:" + login_status, "a")


//  检查账号 username
let aboutInfo = login_status
aboutInfo.username && commonFun.taskResultSet("粉丝数量:" + aboutInfo.followers, "a")
let account_unique_id = aboutInfo.username || null
try {
    if (account_unique_id && account_unique_id != account.username) {
        log("username 不匹配")
        let androidId_account = httpUtilFunc.accountQuery({ "appName": tiktop_packageName, "androidId": commonFun.androidId, "isSuccess": true })
        if (androidId_account.id == account.id) {
            log("更新 username: " + account_unique_id)
            let updated_account = httpUtilFunc.accountUpdate(account.id, { "username": account_unique_id })
            account = updated_account.id ? updated_account : account
        } else {
            throw "安卓ID对应的账号与当前绑定账号不匹配,请核对绑定信息是否正确"
        }
    }
} catch (error) { log("username 检查异常: " + commonFun.objectToString(error)) }




// 更新部分信息到后台
// updata_portioninfo()
function updata_portioninfo() {
    let new_account = targetApp.editProfile(account, { "name": null, "username": null, "bio": null, "photo": null })
    account = httpUtilFunc.accountUpdate(account.id, { "name": new_account.name })
    //  修改昵称
    try {
        if (taskPluginData.updateName) {
            if (!app_id || !app_secret) { throw "素材库账号异常: " + app_id + " " + app_secret }
            feedback_data = {
                "app_id": app_id,
                "app_secret": app_secret,
                "mid": null,
                "task_type": 4,                    //  "任务类型 0-未知; 1-发布视频",
                "task_result": 0,                    //  "任务结果 1/0",
                "account_id": account_unique_id,    //  "账号唯一标识",
                "account_tags": profileTag,  //  "账号标签",
                "ip": global_ip,            //  "当前代理IP" 
                // "box_no"        : "",
                "comment": ""
            }
            material = null

            material = httpUtilFunc.materialGet({
                "app_id": app_id,
                "app_secret": app_secret,
                "type": 0,
                "classify": 1,
                "used_times": taskPluginData.profile_used_times,
                "lable": profileTag,
                "used_times_model": taskPluginData.profile_used_times_mode,
            })
            try { material.id && commonFunc.taskResultSet("获取素材:" + material.text_content, "a") } catch (error) { }
            feedback_data.mid = material.id

            let new_account = targetApp.editProfile(account, { "name": material.text_content, "username": null, "bio": null, "photo": null })

            account = httpUtilFunc.accountUpdate(account.id, { "nickname": new_account.name })
            commonFunc.taskResultSet("成功修改昵称:" + new_account.name, "a")

            if (taskPluginData.relateTo3002) {
                try { feedback_data.task_result = 1; httpUtilFunc.materialFeedback(feedback_data) } catch (error) { }
            }
        }
    } catch (error) {
        if (taskPluginData.relateTo3002) {
            try { feedback_data.comment = commonFunc.objectToString(error) } catch (error) { }
            try { feedback_data.mid && httpUtilFunc.materialFeedback(feedback_data) } catch (error) { }
        }
        throw "修改昵称异常: " + commonFunc.objectToString(error)
    }

}






// 更新账号信息到8000端口
function updateRegisterResult() {
    log("更新账号信息到8000端口")
    try {
        return commonFun.newThread(() => {
            var data = {
                // "forceRecord": true,
                // "type": 1,
                // "appName": "tiktok",
                // "phone": "test_20220112 Ran_" + commonFun.androidId,
                // "deviceId": commonFun.deviceId,
                // "folderId": commonFun.folderId,
                // "androidId": commonFun.androidId,
                // "password": null,
                // "username": nickname,
                // "tag": "test_20220112_demo(印尼)_ran",
                // "phoneProvider": "facebook",
                // "dialCode": "44",
                // "countryCode": "ID",
                // "email": null,
                // "emailPassword": null,
                // "smsurl": null,
                // "isRegistered": false,
                // "isProcess": isProcess,
                // "extra": null,
                // "city": null,
                // "country": null,
                // "emailProvider": null,
                // "proxy": null,
                // "proxyProvider": "bytesfly",
                // "ip": null,
                // "isUsed": isUsed,
                // "desc": desc,
                // "isSuccess": isSuccess,
                // "deviceInfo": commonFun.model,
                // "nickname": nickname,


                // ---------------
                "forceRecord": true,
                "type": 1,
                "appName": "tiktok",
                "phone": "",
                "deviceId": "AA2036037A",
                "folderId": "1",
                "androidId": "1fb3067511752970",
                "password": null,
                "username": null,
                "tag": "test_20220112_ran",
                "phoneProvider": "facebook",
                "dialCode": "44",
                "countryCode": "ID",
                "email": null,
                "emailPassword": null,
                "smsurl": null,
                "isRegistered": false,
                "isProcess": true,
                "extra": null,
                "city": null,
                "country": null,
                "emailProvider": null,
                "proxy": {},
                "proxyProvider": "bytesfly",
                "ip": "82.29.215.165",
                "isUsed": isUsed,
                "desc": "注册成功",
                "isSuccess": isSuccess,
                "deviceInfo": "SM-C7010",
                // "nickname": nice_name,
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
                var user_name = id("com.zhiliaoapp.musically:id/f_q").findOne(FIND_WIDGET_TIMEOUT)
                log("获取昵称")
                if (user_name != null) {
                    var user_Name = user_name.getText()
                    log("该账号的昵称为:" + user_Name)
                }
            }

            let account = null
            //  查询账号信息
            for (let index = 0; index < 5; index++) {
                try {
                    account = httpUtilFunc.accountQuery({ "appName": targetApp.appName, "id": bind_info.accountId })
                    if (account && account.id) { break }
                } catch (error) {
                    if (index > 3) { throw "查询账号异常: " + commonFunc.objectToString(error) }
                }
                sleep(5000)
            }
            let new_account = targetApp.editProfile(account, { "name": material.text_content, "username": null, "bio": null, "photo": null })
            account = httpUtilFunc.accountUpdate(account.id, { "nickname": user_Name })
            log("成功修改昵称:" + new_account.name, "a")
            // commonFunc.taskResultSet("成功修改昵称:" + new_account.name, "a")

            fail_register = true
            resgisterStatus = enums.REGISTER_STATUS.SUCCESS
            registerDone = true
            desc = resgisterStatus
            updateRegisterResult()
            randomSleep()
            commonFun.taskResultSet("任务配置-" + url, "a")
            let log_server = commonFun.taskResultSet("-Result-" + desc, "w")
            commonFun.taskResultGet(log_server)
        }
    } catch (error) {
        commonFun.taskResultSet("创建失败" + error, "w")
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