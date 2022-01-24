
const { clickIfWidgetExists, clickIfWidgetClickable, scrollShortUp } = require("../lib/common.js");
var openvpn = {}

openvpn.import = function () {
    let count_down = 0
    for (let index = 0; index < 50; index++) {
        if (!packageName("net.openvpn.openvpn").findOne(1)) {
            launch("net.openvpn.openvpn")
            sleep(3000)
        }
        else if (text("Profile successfully imported").findOne(1)) {
            log("Profile successfully imported")
            try {
                className("android.widget.EditText").desc("Username").findOne(1).setText("mgvpn1-")
                sleep(1000)
                if (clickIfWidgetExists(className("android.widget.TextView").text("ADD").visibleToUser().findOne(1))) {
                    sleep(1000)
                    if (clickIfWidgetExists(className("android.widget.TextView").text("Replace").visibleToUser().findOne(1))) {
                        sleep(3000)
                    }
                }

            } catch (error) { }
        }
        else if (clickIfWidgetExists(className("android.widget.TextView").visibleToUser().text("FILE").findOne(3000))) {
            sleep(2000)
            if (clickIfWidgetExists(className("android.widget.TextView").text("client.ovpn").visibleToUser().findOne(1))) {
                sleep(2000)
                if (clickIfWidgetClickable(className("android.view.ViewGroup").desc("Import wrapper").clickable().findOne(1))) {
                    sleep(3000)
                }
            } else {
                scrollShortUp()
            }
        }
        else if (descStartsWith("Connect profile ").findOne(1)) {
            log("导入配置成功")
            sleep(3000)
            return true
        }
        else {
            log("openVPN 界面异常")
            count_down = count_down + 0.5
            if (count_down > 5) {
                break
            }
            back()
        }
    }
    log("openVPN 导入失败")
    // home()
    return false
}
openvpn.connect = function () {
    try {
        if (!app.getAppName("net.openvpn.openvpn")) {
            log("openvpn App 未安装")
            return false
        }
        let count_down = 0
        for (let index = 0; index < 100; index++) {
            if (!packageName("net.openvpn.openvpn").findOne(1)) {
                launch("net.openvpn.openvpn")
                sleep(1000)
            }
            if (className("android.view.ViewGroup").desc("connected").findOne(3000)) {
                log("openvpn 已连接")
                sleep(3000)
                return true
            }
            else if (className("android.view.ViewGroup").desc("connecting").findOne(1)) {
                if (index % 6 == 0) {
                    log("openvpn 尝试连接中")
                }
            }
            else if (className("android.view.ViewGroup").desc("disconnected").findOne(1) && clickIfWidgetClickable(className("android.view.ViewGroup").descStartsWith("Connect profile").clickable().findOne(1))) {
                log("openvpn 尝试连接")
            }
            else if (text("Retry").findOne(1)) {
                if (++count_down > 2) {
                    break
                }
                else if (clickIfWidgetExists(text("Retry").findOne(1))) {
                    log("openvpn 尝试重新连接 " + count_down + " 次")
                }
            }
            else if (clickIfWidgetClickable(id("android:id/button2").text("CONTINUE").findOne(1))) {

            }
            else if (className("android.widget.TextView").visibleToUser().text("FILE").findOne(1)) {
                log("openvpn 未登录")
                return false
            }
            else {
                log("openvpn 界面异常")
                count_down = count_down + 0.5
                if (count_down > 5) {
                    break
                }
                back()
            }
        }
        log("openvpn 连接超时")
    } catch (error) {
        log("[openvpn.connect] " + JSON.stringify(error))
    }
    home()
    return false
}

module.exports = openvpn;