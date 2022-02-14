/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-02-14 11:46:30
 * @LastEditTime: 2022-02-14 11:47:44
 */
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


checkFacebookInstall()   // 检测facebook是否安装
checkTiktokInstall() // 检测tiktok是否安装



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


// 检测Tiktok是否安装对应版本
function checkTiktokInstall() {
    if (!app.getAppName(tiktop_packageName)) {
        log("检测到未安装TikTok")
        httpUtilFunc.downloadFile("http://192.168.91.3:8012/upload/a59d3e2a-1a41-4eb1-8098-2d9a0b524364.xapk", "/storage/emulated/obb/Tiktok_v19.2.4", 1000 * 60, false)
        randomSleep()
        commonFun.installApkNew("/storage/emulated/obb/Tiktok_v19.2.4")

    }
}

//  随机等待
function randomSleep() {
    var randomSleep = random(500, 1500)
    sleep(randomSleep)
}