engines.stopAll();
toastLog("停止脚本")




  // show();
    // toastLog("等待无障碍权限开启……\n您必须手动授予本软件无障碍权限\n否则本软件将无法工作！");
    // auto.waitFor();
    // toastLog("无障碍权限已开启" + "\n" + "继续运行脚本……");
    // function show() {   // 控制台输出
    //     // console.show();
    //     // console.setPosition(110, 100);
    //     var window = floaty.window(
    //         <frame>
    //             <button id="action" text="点击停止脚本" w="90" h="40" bg="#F0EB4336" />
    //         </frame>
    //     );
    //     setInterval(() => { }, 1000);
    //     //记录按键被按下时的触摸坐标
    //     var x = 0,
    //         y = 0;
    //     //记录按键被按下时的悬浮窗位置
    //     var windowX, windowY;
    //     //记录按键被按下的时间以便判断长按等动作
    //     var downTime;
    //     window.action.setOnTouchListener(function (view, event) {
    //         switch (event.getAction()) {
    //             case event.ACTION_DOWN:
    //                 x = event.getRawX();
    //                 y = event.getRawY();
    //                 windowX = window.getX();
    //                 windowY = window.getY();
    //                 downTime = new Date().getTime();
    //                 return true;
    //             case event.ACTION_MOVE:
    //                 //移动手指时调整悬浮窗位置
    //                 window.setPosition(windowX + (event.getRawX() - x),
    //                     windowY + (event.getRawY() - y));
    //                 //如果按下的时间超过1.5秒判断为长按，退出脚本
    //                 if (new Date().getTime() - downTime > 1500) {
    //                     toast("长按可以移动位置哦～");
    //                 }
    //                 return true;
    //             case event.ACTION_UP:
    //                 //手指弹起时如果偏移很小则判断为点击
    //                 if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
    //                     onClick();
    //                 }
    //                 return true;
    //         }
    //         return true;
    //     });
    //     function onClick() {
    //         log("用户点击了停止按钮");
    //         exit();
    //     }
    // }