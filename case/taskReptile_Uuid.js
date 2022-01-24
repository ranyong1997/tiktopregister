/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-22 18:26:39
 * @LastEditTime: 2022-01-24 18:52:37
 */
const commonFunc = require("../lib/common");
const httpUtilFunc = require("../http/httpUtils");
const httpUtilFun = require("../network/httpUtil.js");
const proxySttings = require("../network/proxySttings.js");
const { reportLog } = require("../network/httpUtil.js");
const { newThread, randomSleep, taskResultSet, shortSleep, longSleep } = require("../lib/common.js");
const taskDemo = {}
var FIND_WIDGET_TIMEOUT = 1000
var TT_PACKAGE = "com.zhiliaoapp.musically"
taskDemo.init = function () {
    // commonFunc.taskStepRecordSet(40, null, "初始化任务", null)
    commonFunc.showLog("init taskDemo")
    taskDemo.result = 0
    taskDemo.desc = ""
    if (commonFunc.server.length) { return true }
}

taskDemo.runTask = function () {
    try {
        let timestamp = new Date().getTime()
        try {   // 版本检测
            let happybayVersion = "1.1.40_beta_8_4"
            if (commonFunc.happybayVersion < happybayVersion) { throw "happybayVersion " + commonFunc.happybayVersion + " -> " + happybayVersion }
            let jsengineVersion = "4.1.1 Alpha2-gxl-817"
            if (commonFunc.jsengineVersion < jsengineVersion) { throw "jsengineVersion " + commonFunc.jsengineVersion + " -> " + jsengineVersion }
        } catch (error) {
            throw "系统应用版本过低,请先升级: " + commonFunc.objectToString(error)
        }
        try {   //  初始化测试
            // commonFunc.taskStepRecordSet(40, null, "连接群控后台", null)
            if (!commonFunc.server) { throw "未连接到群控后台" }
            //  业务后台连接检测
            let lan_test = null
            for (let index = 0; index < 5; index++) {
                // commonFunc.taskStepRecordSet(40, null, "局域网测试", null)
                try { lan_test = httpUtilFunc.testTaskServer() } catch (error) { }
                commonFunc.showLog("局域网测试: " + lan_test)
                if (lan_test) { break }
                sleep(5000)
            }
            if (!lan_test) {
                log("业务后台连接异常")
                commonFunc.uninstallApp("fun.kitsunebi.kitsunebi4android")
                //  业务后台连接检测
                for (let index = 0; index < 90; index++) {
                    try {
                        if (!httpUtilFunc.testTaskServer()) { throw "" }
                        break
                    } catch (error) {
                        if (index > 80) { throw "业务后台连接异常, 请检查网络和服务器状态. " + commonFunc.objectToString(error) }
                        commonFunc.showLog("业务后台连接异常, 请检查网络和服务器状态. ")
                    }
                    sleep(60000)
                }
            }
            randomSleep(3000)
        } catch (error) { throw error }
        try {   //  获取插件配置
            // commonFunc.taskStepRecordSet(40, null, "获取插件配置", null)
            taskPluginData = httpUtilFunc.getPluginData()
            reportLog("插件配置: " + JSON.stringify(taskPluginData))
            crawl_number = taskPluginData.crawl_number
            lable = taskPluginData.material_keyword
            material_username = taskPluginData.material_username
            app_id = taskPluginData.appid
            app_secret = taskPluginData.appid_key
            used_times_model = taskPluginData.used_times_model
            used_counter = taskPluginData.used_counter
            log("每账号爬取大V数", crawl_number)
            log("素材关键字", lable)
            log("素材账号", material_username)
            log("AppId", app_id)
            log("密钥", app_secret)
            log("匹配模式", used_times_model)
            log("使用次数", used_counter)
            material_gain(lable, app_id, app_secret, used_times_model, used_counter)
        } catch (error) {
            reportLog("插件配置 异常 " + JSON.stringify(error))
            throw "插件配置 获取失败 " + JSON.stringify(error)
        }

        //  执行任务
        try {
            taskDemo.result = 1
            //  本机ip
            let local_ip = httpUtilFun.getIpInfo(1000)
            reportLog("本机 IP: " + local_ip)
            log("本机 IP: " + local_ip)
            One_Key_Login()
            reportLog("运行时间 - " + parseInt((new Date().getTime() - timestamp) / 1000 / 60) + "分钟")
        } catch (error) {
            throw error
        }
    } catch (error) {
        taskDemo.result = 0
        taskDemo.desc = commonFunc.objectToString(error)
        commonFunc.taskResultSet(taskDemo.desc, "a")
    }
    sleep(3000)
    try { threads.shutDownAll() } catch (error) { }
    try { home(); sleep(2000) } catch (error) { }
    let task_result = "任务结果: " + taskDemo.result + " - \n" + commonFunc.taskResultGet()
    commonFunc.taskResultSet(task_result, "w")
    // commonFunc.taskStepRecordSet(200, null, "执行成功", task_result)
    //  任务结果反馈    
    if (taskDemo.result == 1) {
        reportLog(task_result, 1)
    } else {
        reportLog(task_result, 2)
        throw task_result
    }
}



// ---------------------------------写方法区-----------------------

// app_id = "2e6e1842780c037a64942f4141584731"
// app_secret = "ca27b3460e37812276f3ceba1503f626"
// used_times_model = "lte"
// used_times = "2"
// lable = "test_follow"

// 素材获取
function material_gain(lable, app_id, app_secret, used_times_model, used_counter) {
    try {
        log("正在素材获取")
        var material_gain = httpUtilFunc.materialGet({
            "lable": lable, // 标签
            "app_id": app_id,   // app_id
            "app_secret": app_secret,   // 密钥
            "count": 1,
            "type": 0,
            "classify": 9,
            "used_times_model": used_times_model,   // 匹配模式
            // "used_times": 0, // 重置后需将这个设置为0
            "used_times": used_counter    // 使用次数
        })
        material_INFO = material_gain
        log("素材info--->>", material_INFO)
        uuid = material_gain.text_content
        log("联系人--->>", uuid)
        return material_INFO
    } catch (error) {
        log("获取安卓id时捕获到一个错误:" + error)
        commonFunc.taskResultSet("素材获取失败" + error, "w")
    }
}


function One_Key_Login() {
    randomSleep()
    toastLog("开始爬取粉丝数据")
    do {
        if (!packageName(TT_PACKAGE).findOne(1)) {
            log("TikTok 启动中...")
            launchApp("TikTok")
            sleep(3000)
        }
        checkHomePage()
        checkSerchPage()
        checkUsersPage()
        checkUsersInfoPage()
    } while (true)
}



function material_gain() {
    try {
        log("正在素材获取")
        var material_gain = httpUtilFunc.materialGet({
            "app_id": "2556dd6d0987e7e6f00c956a688e217a",
            "app_secret": "200d5a8ed05c67a385797c0f3d067b1d",
            "count": 1,
            "type": 0,
            "classify": 9,
            // "used_times": 0, // 重置后需将这个设置为0
            "used_times_model": "lte",
            "lable": "test_follow"
        })
        material_INFO = material_gain
        log("素材info--->>", material_INFO)
        uuid = material_gain.text_content
        log("联系人--->>", uuid)
        return material_INFO
    } catch (error) {
        log("获取安卓id时捕获到一个错误:" + error)
        commonFunc.taskResultSet("素材获取失败" + error, "w")
    }
}



function checkHomePage() {
    log("检查主界面")
    var HomePageText = text("Home").findOne(FIND_WIDGET_TIMEOUT)
    if (HomePageText != null) {
        log("检查头像框")
        var click_head = id("com.zhiliaoapp.musically:id/f__").findOne(FIND_WIDGET_TIMEOUT).bounds()
        if (click_head != null) {
            log("获取头像坐标")
            log(click_head)
            log("点击搜索按钮")
            var x = click_head.centerX() - 17
            var y = click_head.centerY() - 523
            click(x, y)
            shortSleep()
        }
    }
}

function checkSerchPage() {
    log("检查搜索页面")
    var SerchText = id("com.zhiliaoapp.musically:id/dsw").findOne(FIND_WIDGET_TIMEOUT)
    if (SerchText != null) {
        log("输入素材")
        setText(uuid)
        shortSleep()
        log("点击Search")
        commonFunc.clickWidget(SerchText)
    }
}

function checkUsersPage() {
    log("检查搜索结果页面")
    var SerchedText = text("Users").findOne(FIND_WIDGET_TIMEOUT)
    if (SerchedText != null) {
        log("点击Users")
        shortSleep()
        commonFunc.clickWidget(SerchedText)
        shortSleep()
        log("检查Users页面")
        var SerchOne = text("Users").findOne(FIND_WIDGET_TIMEOUT).bounds()
        if (SerchOne != null) {
            shortSleep()
            let x = SerchOne.centerX() + 119
            let y = SerchOne.centerY() + 235
            click(x, y)
            log("抖主主页停留3秒")
            longSleep()
        }
    }
}

function checkUsersInfoPage() {
    log("检查抖主主页")
    var SersInfoText = text("Followers").id("com.zhiliaoapp.musically:id/b77").findOne(FIND_WIDGET_TIMEOUT)
    if (SersInfoText != null) {
        log("点击粉丝列表")
        shortSleep()
        commonFunc.clickWidget(SersInfoText)
        longSleep()
        log("循环滑动")
        do {
            commonFunc.scrollShortUp()
        } while (true);
    }
}

// ---------------------------------写方法区-----------------------

taskDemo.init()
module.exports = taskDemo;