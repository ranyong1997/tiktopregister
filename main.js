function init() {
    show();
    toastLog("等待无障碍权限开启……\n您必须手动授予本软件无障碍权限\n否则本软件将无法工作！");
    auto.waitFor();
    toastLog("无障碍权限已开启" + "\n" + "继续运行脚本……");
    function show() {   // 控制台输出
        // console.show();
        // console.setPosition(110, 100);
        var window = floaty.window(
            <frame>
                <button id="action" text="点击停止脚本" w="100" h="40" bg="#F0EB4336" />
            </frame>
        );
        setInterval(() => { }, 1000);
        //记录按键被按下时的触摸坐标
        var x = 0,
            y = 0;
        //记录按键被按下时的悬浮窗位置
        var windowX, windowY;
        //记录按键被按下的时间以便判断长按等动作
        var downTime;
        window.action.setOnTouchListener(function (view, event) {
            switch (event.getAction()) {
                case event.ACTION_DOWN:
                    x = event.getRawX();
                    y = event.getRawY();
                    windowX = window.getX();
                    windowY = window.getY();
                    downTime = new Date().getTime();
                    return true;
                case event.ACTION_MOVE:
                    //移动手指时调整悬浮窗位置
                    window.setPosition(windowX + (event.getRawX() - x),
                        windowY + (event.getRawY() - y));
                    //如果按下的时间超过1.5秒判断为长按，退出脚本
                    if (new Date().getTime() - downTime > 1500) {
                        toast("长按可以移动位置哦～");
                    }
                    return true;
                case event.ACTION_UP:
                    //手指弹起时如果偏移很小则判断为点击
                    if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                        onClick();
                    }
                    return true;
            }
            return true;
        });
        function onClick() {
            log("用户点击了停止按钮");
            exit();
        }
    }

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
        log("初始化 main文件  版本号:1.2.1  作者:ranyong")
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
// var mainTask = require("./case/tit_register_v22_4_5");
var mainTask = require("./case/模板");
threads.shutDownAll()
toastLog("脚本结束")