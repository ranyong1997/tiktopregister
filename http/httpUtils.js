const { shortSleep, timing, screenTip, getSerial, commonClick, widgetCompare, clickAlreadyFindWidget, clickWidget, longSleep, newThread, md5 } = require("../lib/common.js");
const commonFunc = require("../lib/common.js");
var httpUtilFunc = {};
// 初始化Http
httpUtilFunc.init = function () {
    try {
        log("正在初始化httpUtilFunc...")
        let deviceInfo = "设备详情:" + "\n"
        deviceInfo = deviceInfo + "【happybay】 = " + commonFunc.happybayVersion + "\n"
        deviceInfo = deviceInfo + "【jsengine】 = " + commonFunc.jsengineVersion + "\n"
        deviceInfo = deviceInfo + "【androidId】 = " + commonFunc.androidId + "【deviceId】 = " + commonFunc.deviceId + "【folderId】 = " + commonFunc.folderId + "【userId】 = " + commonFunc.userId + "【brand】 = " + commonFunc.brand + "【model】 = " + commonFunc.model + "\n"
        deviceInfo = deviceInfo + "【server】 = " + commonFunc.server + "【taskid】 = " + commonFunc.taskid + "\n"
        httpUtilFunc.reportLog(deviceInfo)
    } catch (error) {
        log("捕捉到错误" + JSON.stringify(error))
    }
}

// 日志
httpUtilFunc.reportLog = function (context, logType) {
    let is_upload = false
    try {
        context = typeof (context) == "object" ? JSON.stringify(context) : context
        log("  " + context)
        return true
    } catch (error) { log("  " + JSON.stringify(error)) }
    if (!is_upload) {
        log("上报结果:" + is_upload)
    }
    return is_upload
}

// 上报日志服务
httpUtilFunc.testTaskServer = function () {
    try {
        let deviceId = commonFunc.deviceId
        let folderId = commonFunc.folderId
        let url = "http://" + commonFunc.server + ":8000/user/search?datatype=5&appName=" + "testTaskServer" + "&deviceId=" + deviceId + "&folderId=" + folderId
        this.reportLog("业务后台连接检测: " + url)
        let res = http.get(url);
        res = res.body.json()
        if (res.code != 200 || !res.data) { throw res }
        this.reportLog("业务后台连接正常")
        return true
    } catch (error) { throw "业务后台连接异常: " + JSON.stringify(error) }
}

// 得到注册账户
httpUtilFunc.registerAccountGet = function () {
    toastLog("start http")
    let accountInfo = {}
    var url = "http://192.168.2.194:3003/i/a"
    var body = {
        "register_app_id": 2,
        "limit": 1,
        "status": 0
    }
    var args = {
        "body": body,
        "comm_args": {}
    }
    var ts = new Date().getTime()
    var appId = "1"
    var callStr = "registerAccountGet"
    var version = "1.0.0"
    var ua = "script"
    var sign = md5(ua + ts + callStr + JSON.stringify(args) + version)
    var res = http.postJson(url, {
        "app_id": appId,
        "ts": ts,
        "call": callStr,
        "args": args,
        "version": version,
        "sign": sign,
        "ua": ua

    });
    log("responseRes = " + res.body.string())
}

// 发起Http请求
httpUtilFunc.httpRequest = function (apiCall, body) {
    try {
        let commArgs = {
            "appId": 1,
            "appVersion": app.versionName,
            "appVersionNo": app.versionCode,
            "channel": "mainc",
            "deviceId": device.fingerprint,
            "gps": "",
            "idfa": "",
            "idfv": "",
            "imei2": "",
            "imsi1": "",
            "imsi2": "",
            "ip": "",
            "language": "zh",
            "latitude": null,
            "longitude": null,
            "wifiMac": device.getMacAddress(),
            "networkTypeName": 1,
            "osType": 1,
            "osVersion": "",
            "sdkInt": device.sdkInt,
            "packageName": "",
            "resolution": device.width + "*" + device.height,
            "btMac": "",
            "province": "",
            "city": "",
            "zone": "",
            "eip": "",
            "oaid": ""
        };
        var args = {
            "body": body,
            "comm_args": commArgs
        }
        var ts = new Date().getTime()
        var appId = "1"
        var callStr = apiCall
        var version = "1.0.0"
        var ua = "script"
        var sign = md5(ua + ts + callStr + JSON.stringify(args) + version)
        var data = {
            "app_id": appId,
            "ts": ts,
            "call": callStr,
            "args": args,
            "version": version,
            "sign": sign,
            "ua": ua
        }
        let result = http.postJson("http://bytesfly.tpddns.cn:8090/i/a", data);
        return result;
    } catch (error) {
        toastLog("error = " + error);
    }
    return null;
}

httpUtilFunc.init()
module.exports = httpUtilFunc;