/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2021-12-23 19:59:44
 * @LastEditTime: 2022-02-10 11:22:00
 */
function init() {
    // 设置日志文件
    try {
        // 初始化日志文件 存放在 /sdcard/CloudMobile/ 中
        let log_file = "/sdcard/CloudMobile/" + require("./project.json").name + ".log"; // 日志文件
        files.createWithDirs(log_file);
        console.setGlobalLogConfig({
            "file": log_file,
            "maxFileSize": 1024 * 1024 //  1M 
        });
        log("初始化日志:" + log_file)
    } catch (error) {
        log("日志初始化异常:" + JSON.stringify(error))
    }
    try {
        //  唤醒屏幕
        device.wakeUpIfNeeded()
        device.keepScreenOn()
        sleep(2000)
    } catch (error) { }
    try {
        log("初始化 main文件  版本号:1.2.5  作者:ranyong")
        sleep(1000)
        shell("cmd statusbar expand-notifications") // 返回主界面
        sleep(3000)
        shell("cmd statusbar collapse") // 返回主界面
        sleep(1000)
        home()
        sleep(1000)
    } catch (error) {
        log("main error:" + error)
    }
    try { http.__okhttp__.setTimeout(120000) } catch (error) { } //  设置网络请求超时时间(全局)
}
init()
// var mainTask = require("./case/tit_restore");
// var mainTask = require("./case/tit_register_v22_4_5ID");
// var mainTask = require("./case/tit_register_v22_4_5UK");
// var mainTask = require("./case/tit_register_v22_4_5PH");
// var mainTask = require("./case/模板");
// var mainTask = require("./case/Gmail_login");
// var mainTask = require("./case/tit_restore");
// var mainTask = require("./case/Gmail_replaceVpns");
// var mainTask = require("./case/demo");


//  爬取用户信息业务
// var mainTask = require("./case/taskReptile_Uuid_19.2");
// mainTask.runTask()

//  TT注册可视化业务
// var mainTask = require("./case/tit_register_v22_4_5_develop");
var mainTask = require("./case/tit_register_v22_4_5_developdebug");
mainTask.runTask()
