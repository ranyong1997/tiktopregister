// Floating_logs()


function Floating_logs(message) {
    //下面是悬浮窗
    var window = floaty.window(
        <frame>
            <button id="action" text="点击停止脚本" w="120" h="40" bg="#F0EB4336" />
        </frame>
    );
    setInterval(() => { }, 1000);
    var execution = null;
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
        device.cancelKeepingAwake();
        log("用户点击了停止按钮");
        exit();
    }
    log("使用“悬浮日志”");
    function toastLog(message) {
        log(message);
        var myDate = new Date();
        ui.run(() => {
            w.WZ.setText(myDate.getHours() + "时" + myDate.getMinutes() + "分" + myDate.getSeconds() + "秒：" + message + "\n" + w.WZ.getText());
            return true;
        });
    }
    var w = floaty.rawWindow(
        <card bg="#80000000">
            <vertical align="center">
                <text text="─ 当前脚本运行日志 ─" textSize="15" color="#FFFFFF" textStyle="bold" gravity="center" margin="0 0 0 5" />
                <text id="WZ" text="" textSize="15" color="#FFFFFF" marginLeft="10" gravity="left" />
            </vertical>
        </card>
    );
    w.setSize(device.width, 800);   // 显示大小
    w.setTouchable(false);   // 是否可触碰
    w.setPosition(0, device.height - 800);   // 设置控制台的位置
}

Floating_logs("测试一下")