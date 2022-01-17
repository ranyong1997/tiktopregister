var commonFun = require("../lib/common.js")
var proxySettings = require("../vpn/proxySettings.js")
var httpUtilFunc = require("../http/httpUtils")
var isSuccess = true
var desc = ""
var isUsed = false
var isProcess = true
var FIND_WIDGET_TIMEOUT = 750
var gmail_package = "com.google.android.gm"
var youtube_package = "com.google.android.youtube"
var GJ_tools_package = "com.gxl.logsrecordmaster"
// 获取动态代理
var vpnData = httpUtilFunc.getProxyFromConnanys("connanys", { "regionid": "US", "timeout": 30 })
log(vpnData)
// 获取ip
var global_ip = httpUtilFunc.getGlobalIp()
log(global_ip)
material_gain() // 素材获取
matter_rollback()   // 回滚素材

updateRegisterResult()  // 更新账号信息


// **********************************方法执行区**********************************
// commonFun.systemTimezoneSet_New("Europe/London") // 设置时区
commonFun.systemTimezoneGet()   // 获取当前时区
if (connectVPN()) {  // 判断是否已连接vpn
    randomSleep()
    log("脚本执行")
    One_Key_Login()
}


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
            is_proxy_on = proxySettings.kitsunebiSetup2(vpnData)
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
                "phone": "test_20220117 Ran_" + commonFun.androidId,
                "deviceId": commonFun.deviceId,
                "folderId": commonFun.folderId,
                "androidId": commonFun.androidId,
                "password": null,
                "username": null,
                "tag": "test_20220117_ran",
                "phoneProvider": "facebook",
                "dialCode": "44",
                "countryCode": "US",
                "email": username,
                "emailPassword": password,
                "smsurl": null,
                "isRegistered": false,
                "isProcess": isProcess,
                "extra": null,
                "city": null,
                "country": null,
                "emailProvider": null,
                "proxy": vpnData,
                "proxyProvider": "connanys",
                "ip": global_ip,
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


// 一键登陆Gmail邮箱
function One_Key_Login() {
    toastLog("开始Gmail一键登陆功能")
    openGMSApp(commonFun.userId)
    randomSleep()
    // do {
    //     if (!packageName(gmail_package).findOne(1)) {
    //         log("Gmail启动中...")
    //         launch(gmail_package)
    //         sleep(3000)
    //     } else {
    //         log("目前还没有此app,请检查改机工具是否被隐藏")
    //         openGMSApp(commonFun.userId)
    //     }
    //     try {
    //         // 写方法区





    //     } catch (error) {
    //         log("一键登陆时捕获到一个错误:" + error)
    //     }
    // } while (true);
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

// 从素材库获取账号密码
function material_gain() {
    try {
        log("正在素材获取")
        var material_gain = httpUtilFunc.materialGet({
            "app_id": "21a5ae2f6168064f2c664056ea56726b",
            "app_secret": "132a34bba2167280f59f4bd249b2ae69",
            "count": 1,
            "type": 0,
            "classify": 3,
            "used_times": 0,
            "used_times_model": "lte",
            "lable": "gmail"
        })
        Gmail_info = material_gain.text_content.split(",")
        log("Gmail邮箱密码获取--->>", Gmail_info)
        username = Gmail_info[0]
        password = Gmail_info[1]
        log("账号为：", username, "密码为：", password)
        material_INFO = material_gain
        return Gmail_info
    } catch (error) {
        log("获取安卓id时捕获到一个错误:" + error)
        commonFun.taskResultSet("素材获取失败" + error, "w")
    }
}

// 回滚素材库
function matter_rollback() {
    let app_id = "a01ed8c2a96ef33a28f21043318acf5f"
    let app_secret = "c159d6d44650179ef5498d5081c87bdd"
    httpUtilFunc.materialRollback(app_id, app_secret, material_INFO)
}


// **********************************方法编辑区**********************************