// 进行VPN设置

const { clickIfWidgetExists, clickIfWidgetClickable, newThread } = require("../lib/common.js");
const commonFunc = require("../lib/common.js");
const httpUtilFunc = require("../http/httpUtils.js");

var proxySettings = {}

// 安装VPN
proxySettings.kitsunebiInstall = function (url) {
    if (!app.getAppName("fun.kitsunebi.kitsunebi4android")) {
        if (!httpUtilFunc.downloadFile(url, "/storage/emulated/0/Kitsunebi_v1.8.0.apk", 1000 * 60, false) || !commonFunc.installApk("/storage/emulated/0/Kitsunebi_v1.8.0.apk", 1000 * 60)) {
            return false
        }
    }
    return true
}

// VPN设置
proxySettings.kitsunebiSetup = function (proxy_info, force_update) {
    let server_name = null
    let server_address = null
    let server_port = null
    let server_type = null
    let username = null
    let password = null
    log(" VPN代理信息" + proxy_info)
    try {
        server_address = proxy_info.proxy_host
        server_port = proxy_info.proxy_port
        username = proxy_info.user_name
        password = proxy_info.password
        server_name = server_address + ":" + server_port
        if (!new RegExp(/\d+\.\d+\.\d+\.\d+/).test(server_address)) { throw "" }
        if (!new RegExp(/^\d+$/).test(server_port)) { throw "" }
    } catch (error) {
        throw "代理 参数异常" + commonFunc.objectToString(error)
    }
    if (!app.getAppName("fun.kitsunebi.kitsunebi4android")) { throw "未安装 fun.kitsunebi.kitsunebi4android" }
    try { shell("pm enable --user " + commonFunc.userId + " fun.kitsunebi.kitsunebi4android") } catch (error) { }
    sleep(3000)
    let is_proxy_set = false
    let is_rule_set = false
    let is_proxy_ready = false
    try {
        is_proxy_ready = newThread(function () {
            while (true) {
                if (!packageName("fun.kitsunebi.kitsunebi4android").findOne(1)) {
                    log("正在启动VPN .. ")
                    launch("fun.kitsunebi.kitsunebi4android")
                    sleep(6000)
                }
                //  首页
                if (className("android.widget.TextView").text("Kitsunebi").findOne(1000) && id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(1)) {
                    if (!force_update) {
                        is_proxy_set = true
                    }
                    if (!is_proxy_set) {
                        //  清空现有节点列表
                        while (true) {
                            log("清空现有节点列表")
                            if (!clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/delete_btn").findOne(2000))) { break }
                            clickIfWidgetClickable(id("android:id/button1").text("YES").findOne(2000))
                            sleep(1000)
                        }
                        //  添加新的节点
                        clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(2000))
                        sleep(500)
                        clickIfWidgetExists(text("Add Endpoint").findOne(2000))
                        sleep(500)
                        clickIfWidgetExists(text("Manual").findOne(2000))
                        sleep(500)
                    }
                    else
                        if (!is_rule_set) {
                            clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(2000))
                            sleep(500)
                            clickIfWidgetExists(text("Rule Set").findOne(2000))
                            sleep(500)
                        }
                        else {
                            if (id("fun.kitsunebi.kitsunebi4android:id/endpoint_list_card_view").find().length > 1) {
                                is_proxy_set = false
                                force_update = true
                                log("识别到多余的节点")
                                continue
                            }
                            if (!clickIfWidgetExists(text(server_name).findOne(1000))) {
                                is_proxy_set = false
                                force_update = true
                                log("查找节点: " + server_name)
                                continue
                            }
                            sleep(500)
                            var timeoutCount = 0
                            for (let index = 0; index < 3; index++) {
                                clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/measure_latency_btn").findOne(1000)) && toastLog("刷新节点")
                                if (id("android:id/message").textStartsWith("Invalid").findOne(3000)) {
                                    clickIfWidgetClickable(text("OK").findOne(1))
                                    log("无效节点")
                                    is_proxy_set = false
                                    force_update = true
                                    break
                                }
                                let latency = id("fun.kitsunebi.kitsunebi4android:id/ep_latency").textMatches(/\d+ ms/).findOne(6000)
                                if (latency) {
                                    log("网络延迟: " + latency.text())
                                    if (id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000)) {
                                        log("代理生效")
                                        return true
                                    } else {
                                        clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/fab").findOne(1)) && toastLog("启动代理")
                                        id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) || clickIfWidgetClickable(text("OK").findOne(1))
                                        id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) || clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/fab").findOne(1)) && toastLog("启动代理")
                                    }
                                }
                                let timeoutLatency = id("fun.kitsunebi.kitsunebi4android:id/ep_latency").text("timeout").findOne(6000)
                                if (timeoutLatency != null) {
                                    timeoutCount++
                                    log("节点超时timeout为: " + timeoutCount)
                                    if (timeoutCount > 2) {
                                        return false
                                    }
                                    sleep(1000)
                                }
                                try { toastLog("节点测试: " + id("fun.kitsunebi.kitsunebi4android:id/ep_latency").findOne(1000).text()) } catch (error) { }
                            }
                            is_proxy_set = false
                            force_update = true
                        }
                }
                //  Rule set 页
                else if (className("android.widget.TextView").text("Rule Set").findOne(1000) && id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(1)) {
                    if (is_rule_set) {
                        back()
                        continue
                    }
                    if (clickIfWidgetExists(id("fun.kitsunebi.kitsunebi4android:id/remark").text("Global").findOne(1000))) {
                        sleep(500)
                        is_rule_set = true
                        log("代理规则: " + "New Global")
                        sleep(1000)
                        back()
                        sleep(1000)
                        continue
                    }
                    clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(2000))
                    sleep(500)
                    clickIfWidgetExists(text("New Global").findOne(2000))
                    sleep(500)
                }
                //  Add Endpoint 页
                else if (className("android.widget.TextView").text("Add Endpoint").findOne(1000) && id("fun.kitsunebi.kitsunebi4android:id/save_btn").findOne(1)) {
                    try {
                        is_proxy_set = false
                        log("新增节点")
                        id("fun.kitsunebi.kitsunebi4android:id/text_input_remark").findOne(1000).setText(server_name) && toastLog("输入: " + server_name)
                        sleep(500)
                        clickIfWidgetExists(id("android:id/text1").findOne(1000))
                        sleep(500)
                        clickIfWidgetExists(text("socks").findOne(1000))
                        sleep(500)
                        id("fun.kitsunebi.kitsunebi4android:id/socks_address").findOne(1000).child(0).child(0).setText(server_address) && toastLog("输入: " + server_address)
                        sleep(500)
                        id("fun.kitsunebi.kitsunebi4android:id/socks_port").findOne(1000).child(0).child(0).setText(server_port) && toastLog("输入: " + server_port)
                        sleep(500)
                        id("fun.kitsunebi.kitsunebi4android:id/socks_user").findOne(1000).child(0).child(0).setText(username) && toastLog("输入: " + username)
                        sleep(500)
                        id("fun.kitsunebi.kitsunebi4android:id/socks_password").findOne(1000).child(0).child(0).setText(password) && toastLog("输入: " + password)
                        sleep(500)
                        is_proxy_set = clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/save_btn").findOne(1000))
                        sleep(1000)
                        log("保存节点: " + is_proxy_set + " - " + server_name)
                    } catch (error) {
                        log("新增节点异常: " + JSON.stringify(error))
                        back()
                    }
                    !className("android.widget.TextView").text("Kitsunebi").findOne(3000) && back()
                }
                else {
                    log("unknow page")
                    back()
                    sleep(3000)
                }
                sleep(600)
            }
        }, false, 1000 * 60 * 3, () => { throw "超时退出" })
    } catch (error) { throw "代理设置失败: " + commonFunc.objectToString(error) }
    return is_proxy_ready
}

proxySettings.kitsunebiSetup2 = function (proxy_info, force_update) {
    let server_name = null
    let server_address = null
    let server_port = null
    let server_type = null
    let username = null
    let password = null
    toastLog(" kitsunebiSetup proxy_info " + proxy_info)
    try {
        server_address = proxy_info.ip
        server_port = proxy_info.port
        username = proxy_info.user
        password = proxy_info.pass
        server_name = server_address + ":" + server_port
        if (!new RegExp(/\d+\.\d+\.\d+\.\d+/).test(server_address)) { throw "" }
        if (!new RegExp(/^\d+$/).test(server_port)) { throw "" }
    } catch (error) {
        throw "代理 参数异常" + commonFunc.objectToString(error)
    }
    if (!app.getAppName("fun.kitsunebi.kitsunebi4android")) { throw "未安装 fun.kitsunebi.kitsunebi4android" }
    try { shell("pm enable --user " + commonFunc.userId + " fun.kitsunebi.kitsunebi4android") } catch (error) { }
    sleep(3000)
    let is_proxy_set = false
    let is_rule_set = false
    let is_proxy_ready = false
    try {
        is_proxy_ready = newThread(function () {
            while (true) {
                if (!packageName("fun.kitsunebi.kitsunebi4android").findOne(1)) {
                    log("kitsunebi launching .. ")
                    launch("fun.kitsunebi.kitsunebi4android")
                    sleep(6000)
                }
                //  首页
                if (className("android.widget.TextView").text("Kitsunebi").findOne(1000) && id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(1)) {
                    if (!force_update) {
                        is_proxy_set = true
                    }
                    if (!is_proxy_set) {
                        //  清空现有节点列表
                        while (true) {
                            log("清空节点")
                            if (!clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/delete_btn").findOne(2000))) { break }
                            clickIfWidgetClickable(id("android:id/button1").text("YES").findOne(2000))
                            sleep(1000)
                        }
                        //  添加新的节点
                        clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(2000))
                        sleep(500)
                        clickIfWidgetExists(text("Add Endpoint").findOne(2000))
                        sleep(500)
                        clickIfWidgetExists(text("Manual").findOne(2000))
                        sleep(500)

                    }
                    else
                        if (!is_rule_set) {
                            clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(2000))
                            sleep(500)
                            clickIfWidgetExists(text("Rule Set").findOne(2000))
                            sleep(500)
                        }
                        else {
                            if (id("fun.kitsunebi.kitsunebi4android:id/endpoint_list_card_view").find().length > 1) {
                                is_proxy_set = false
                                force_update = true
                                toastLog("识别到多余的节点")
                                continue
                            }
                            if (!clickIfWidgetExists(text(server_name).findOne(1000))) {
                                is_proxy_set = false
                                force_update = true
                                toastLog("查找节点: " + server_name)
                                continue
                            }
                            sleep(500)
                            var timeoutCount = 0
                            for (let index = 0; index < 3; index++) {
                                clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/measure_latency_btn").findOne(1000)) && toastLog("刷新节点")
                                // sleep(1000)
                                if (id("android:id/message").textStartsWith("Invalid").findOne(3000)) {
                                    clickIfWidgetClickable(text("OK").findOne(1))
                                    toastLog("无效节点")
                                    is_proxy_set = false
                                    force_update = true
                                    break
                                }
                                // let running_btn = id("fun.kitsunebi.kitsunebi4android:id/running_indicator").findOne(3000)
                                let latency = id("fun.kitsunebi.kitsunebi4android:id/ep_latency").textMatches(/\d+ ms/).findOne(6000)
                                if (latency) {
                                    toastLog("网络延迟: " + latency.text())
                                    if (id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000)) {
                                        toastLog("代理生效")
                                        return true
                                    } else {
                                        clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/fab").findOne(1)) && toastLog("启动代理")
                                        id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) || clickIfWidgetClickable(text("OK").findOne(1))
                                        id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) || clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/fab").findOne(1)) && toastLog("启动代理")
                                    }
                                }
                                let timeoutLatency = id("fun.kitsunebi.kitsunebi4android:id/ep_latency").text("timeout").findOne(6000)
                                if (timeoutLatency != null) {
                                    timeoutCount++
                                    toastLog("节点 timeout " + timeoutCount)
                                    if (timeoutCount > 2) {
                                        return false
                                    }
                                    sleep(1000)
                                    // return false
                                }
                                try { toastLog("节点测试: " + id("fun.kitsunebi.kitsunebi4android:id/ep_latency").findOne(1000).text()) } catch (error) { }
                            }
                            // return true
                            is_proxy_set = false
                            force_update = true
                        }
                }
                //  Rule set 页
                else if (className("android.widget.TextView").text("Rule Set").findOne(1000) && id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(1)) {
                    if (is_rule_set) {
                        back()
                        continue
                    }
                    if (clickIfWidgetExists(id("fun.kitsunebi.kitsunebi4android:id/remark").text("Global").findOne(1000))) {
                        sleep(500)
                        // clickIfWidgetExists(id("fun.kitsunebi.kitsunebi4android:id/edit_btn").findOne(1000))
                        is_rule_set = true
                        log("代理规则: " + "New Global")
                        sleep(1000)
                        back()
                        sleep(1000)
                        continue
                    }
                    clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(2000))
                    sleep(500)
                    clickIfWidgetExists(text("New Global").findOne(2000))
                    sleep(500)
                }
                //  Add Endpoint 页
                else if (className("android.widget.TextView").text("Add Endpoint").findOne(1000) && id("fun.kitsunebi.kitsunebi4android:id/save_btn").findOne(1)) {
                    try {
                        is_proxy_set = false
                        log("新增节点")
                        id("fun.kitsunebi.kitsunebi4android:id/text_input_remark").findOne(1000).setText(server_name) && toastLog("输入: " + server_name)
                        sleep(500)
                        clickIfWidgetExists(id("android:id/text1").findOne(1000))
                        sleep(500)
                        clickIfWidgetExists(text("socks").findOne(1000))
                        sleep(500)
                        id("fun.kitsunebi.kitsunebi4android:id/socks_address").findOne(1000).child(0).child(0).setText(server_address) && toastLog("输入: " + server_address)
                        sleep(500)
                        id("fun.kitsunebi.kitsunebi4android:id/socks_port").findOne(1000).child(0).child(0).setText(server_port) && toastLog("输入: " + server_port)
                        sleep(500)
                        id("fun.kitsunebi.kitsunebi4android:id/socks_user").findOne(1000).child(0).child(0).setText(username) && toastLog("输入: " + username)
                        sleep(500)
                        id("fun.kitsunebi.kitsunebi4android:id/socks_password").findOne(1000).child(0).child(0).setText(password) && toastLog("输入: " + password)
                        sleep(500)
                        is_proxy_set = clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/save_btn").findOne(1000))
                        sleep(1000)
                        log("保存节点: " + is_proxy_set + " - " + server_name)
                    } catch (error) {
                        log("新增节点异常: " + JSON.stringify(error))
                        back()
                    }
                    !className("android.widget.TextView").text("Kitsunebi").findOne(3000) && back()
                }
                else {
                    log("unknow page")
                    back()
                    sleep(3000)
                }
                sleep(600)
            }
        }, false, 1000 * 60 * 3, () => { throw "超时退出" })
    } catch (error) { throw "代理设置失败: " + commonFunc.objectToString(error) }
    return is_proxy_ready
}

module.exports = proxySettings;