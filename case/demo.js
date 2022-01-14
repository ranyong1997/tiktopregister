// next_error()

// function next_error() {   // 点击下一步出现错误toast
//     var txt = "";//声明一个全局变量
//     threads.start(function () {
//         events.observeToast();//创建监听
//         events.onToast(function (toast) {
//             txt = toast.getText()//获取监听内容赋值给全局变量
//         });
//     })
//     let p = function () {
//         // Couldn't log in
//         while (true) if (txt) return true;
//     }
//     if (p) {
//         log(txt);
//     }
// }

// user_Name = ""
// var user_name = id("com.zhiliaoapp.musically:id/f_q").findOne(750)
// if (user_name != null) {
//     log(user_name.getText())
//     var user_Name = user_name.getText()
// }
// log(user_Name)



check_error()
function check_error() {   // 点击登陆出现错误toast
    var txt = "";//声明一个全局变量
    threads.start(function () {
        events.observeToast()//创建监听
        events.onToast(function (toast) {
            txt = toast.getText()//获取监听内容赋值给全局变量
        });
    })
    let p = function () {
        while (true) if (txt == "Couldn't log in") return true;
    }()
    if (p) {
        log("检测到不可登陆" + txt + "即将停止该任务")
        fail_register = true
        // resgisterStatus = enums.REGISTER_STATUS.Content_Not_Found
        isSuccess = false
        // desc = resgisterStatus
        // updateRegisterResult()
        home()
    }
    return true;
}
