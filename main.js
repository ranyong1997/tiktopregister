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
        log("初始化 main文件  版本号:1.2.2  作者:ranyong")
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
}

init()
// var mainTask = require("./case/tit_restore");
// var mainTask = require("./case/tit_register_v22_4_5ID");
// var mainTask = require("./case/tit_register_v22_4_5UK");
// var mainTask = require("./case/模板");
// var mainTask = require("./case/Gmail_login");
// var mainTask = require("./case/tit_restore");
// var mainTask = require("./case/tit_register_v22_4_5获取昵称");
var mainTask = require("./case/Gmail_login");
threads.shutDownAll()
toastLog("脚本结束")