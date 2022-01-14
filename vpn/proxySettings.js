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

/**
 * 
 * @param {*} proxy_info 
 * @param {*} force_update 
 * @returns 
 */
proxySettings.kitsunebiSetup = function (proxy_info, proxy_provider, force_update) {
    let server_name = null
    let server_address = null
    let server_port = null
    let server_type = null
    let username = null
    let password = null
    try {
        let _split = proxy_info.split(",")
        server_type = _split[0]
        server_address = _split[1]
        server_port = _split[2]
        username = _split.length > 3 ? _split[3] : ""
        password = _split.length > 4 ? _split[4] : ""
        server_name = proxy_info
        // if( new RegExp(/u768\$\w+$/).test(username) ){
        //     username = username + "*美国"
        //     server_name = server_type +","+ server_address +","+ server_port +","+ username +","+ password
        // }
        // if( new RegExp(/u768\$\w+[^\*US]$/).test(username) ){
        //     username = username + "*US"
        //     server_name = server_type +","+ server_address +","+ server_port +","+ username +","+ password
        // }
        // if( !new RegExp(/\d+\.\d+\.\d+\.\d+/).test( server_address ) ){ throw "" }
        if (!server_address) { throw "" }
        if (!new RegExp(/^\d+$/).test(server_port)) { throw "" }
        // if( !( new RegExp(/HTTPS/i).test( server_type ) || new RegExp(/SOCKS5/i).test( server_type ) ) ){ throw "" }
    } catch (error) {
        // log( "代理 参数异常" + JSON.stringify(error) )
        // return false
        throw "代理 参数异常" + commonFunc.objectToString(error)
    }
    if (!app.getAppName("fun.kitsunebi.kitsunebi4android")) { throw "未安装 fun.kitsunebi.kitsunebi4android" }
    try { shell("pm enable --user " + commonFunc.userId + " fun.kitsunebi.kitsunebi4android") } catch (error) { }
    sleep(3000)

    let is_proxy_set = false
    let is_rule_set = false
    let is_proxy_ready = false
    let err_msg = ""
    let is_unknow_page = false
    let not_found_count = 0
    try {
        is_proxy_ready = newThread(function () {
            while (true) {
                is_unknow_page = false
                // if (proxySettings.isOtherPage()) { sleep(3000) }
                if (!packageName("fun.kitsunebi.kitsunebi4android").findOne(1)) {
                    home()
                    sleep(1000)
                    log("kitsunebi launching .. ")
                    launch("fun.kitsunebi.kitsunebi4android")
                    sleep(3000)
                    if (!packageName("fun.kitsunebi.kitsunebi4android").findOne(6000)) { err_msg = "代理软件启动失败" }
                }
                //  首页
                if (className("android.widget.TextView").text("Kitsunebi").findOne(2000) && id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(1)) {
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
                        sleep(3000)
                        clickIfWidgetExists(text("Add Endpoint").findOne(1000))
                        sleep(3000)
                        clickIfWidgetExists(text("Manual").findOne(1000))
                        sleep(3000)

                    }
                    else
                        if (!is_rule_set) {
                            if (text(server_name).findOne(3000)) {
                                is_rule_set = true
                                toastLog("跳过规则设置")
                                continue
                            } else {
                                toastLog("点击添加" + clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(2000)))
                                sleep(3000)
                                toastLog("点击规则" + clickIfWidgetExists(text("Rule Set").findOne(2000)))
                                sleep(3000)
                                if (!(className("android.widget.TextView").text("Rule Set").findOne(3000) && id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(3000))) {
                                    err_msg = "规则检测异常"
                                }
                            }
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
                            sleep(1000)

                            for (let index = 0; index < 5; index++) {
                                clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/measure_latency_btn").findOne(1000)) && toastLog("刷新节点")
                                if (id("android:id/message").textStartsWith("Invalid").findOne(3000)) {
                                    clickIfWidgetClickable(text("OK").findOne(1))
                                    toastLog("无效节点")
                                    is_proxy_set = false
                                    force_update = true
                                    break
                                }
                                clickIfWidgetExists(text(server_name).findOne(1000))
                                sleep(3000)

                                //  适配廖的代理
                                if (proxy_provider == "liao_proxy" && clickIfWidgetExists(text(server_name).findOne(1000))) {
                                    id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) || clickIfWidgetClickable(text("OK").findOne(1))
                                    id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) || clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/fab").findOne(1)) && toastLog("启动代理")
                                    clickIfWidgetClickable(text("OK").findOne(3000))
                                }

                                let latency = id("fun.kitsunebi.kitsunebi4android:id/ep_latency").textMatches(/\d+ ms/).findOne(6000)
                                if (latency) {
                                    toastLog("网络延迟: " + latency.text())
                                    if (id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000)) {
                                        toastLog("代理启动")
                                        return true
                                    } else {
                                        clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/fab").findOne(1)) && toastLog("启动代理")
                                        id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) || clickIfWidgetClickable(text("OK").findOne(1))
                                        id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) || clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/fab").findOne(1)) && toastLog("启动代理")
                                        clickIfWidgetClickable(text("OK").findOne(3000))
                                    }
                                } else {
                                    try { err_msg = id("fun.kitsunebi.kitsunebi4android:id/ep_latency").findOne(1000).text() } catch (error) { }

                                    //  适配廖的代理
                                    if (proxy_provider == "liao_proxy" && clickIfWidgetExists(text(server_name).findOne(1000))) {
                                        try {
                                            let url = "http://2.2.2.2/switch-ip?cityid=68000"
                                            let res = http.get(url);
                                            res = res.body.json()
                                            // log( "switch-ip?cityid=68000: " + commonFunc.objectToString(res) )
                                            if (res.code != 0) { throw res }
                                        } catch (error) { err_msg = "switch-ip?cityid=68000 error: " + commonFunc.objectToString(error) }
                                        sleep(10000)
                                    }
                                }
                                try { toastLog("节点测试: " + id("fun.kitsunebi.kitsunebi4android:id/ep_latency").findOne(1000).text()) } catch (error) { }
                            }
                            // return true
                            // is_proxy_set = false
                            // force_update = true
                        }
                }
                //  Rule set 页
                else if (className("android.widget.TextView").text("Rule Set").findOne(1000) && id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(1)) {
                    log("Rule Set Page")
                    if (is_rule_set) {
                        back()
                        sleep(2000)
                        continue
                    }
                    if (clickIfWidgetExists(id("fun.kitsunebi.kitsunebi4android:id/remark").text("Bypass LAN & Mainland China").findOne(1000))) {
                        is_rule_set = true
                        log("代理规则: " + "Bypass LAN & Mainland China")
                        sleep(1000)
                        back()
                        sleep(2000)
                        continue
                    }
                    clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(2000))
                    sleep(1000)
                    clickIfWidgetExists(text("New Bypass LAN & Mainland China").findOne(2000))
                    sleep(1000)
                }
                //  Add Endpoint 页
                else if (className("android.widget.TextView").text("Add Endpoint").findOne(1000) && id("fun.kitsunebi.kitsunebi4android:id/save_btn").findOne(1)) {
                    try {
                        is_proxy_set = false
                        log("新增节点")
                        id("fun.kitsunebi.kitsunebi4android:id/text_input_remark").findOne(1000).setText(server_name) && toastLog("输入: " + server_name)
                        sleep(1000)
                        clickIfWidgetExists(id("android:id/text1").findOne(1000))
                        sleep(1000)
                        clickIfWidgetExists(text("socks").findOne(1000))
                        sleep(1000)
                        try {
                            id("fun.kitsunebi.kitsunebi4android:id/socks_address").findOne(1000).child(0).child(0).setText(server_address) && toastLog("输入: " + server_address)
                            sleep(1000)
                            id("fun.kitsunebi.kitsunebi4android:id/socks_port").findOne(1000).child(0).child(0).setText(server_port) && toastLog("输入: " + server_port)
                            sleep(1000)
                            id("fun.kitsunebi.kitsunebi4android:id/socks_user").findOne(1000).child(0).child(0).setText(username) && toastLog("输入: " + username)
                            sleep(1000)
                            id("fun.kitsunebi.kitsunebi4android:id/socks_password").findOne(1000).child(0).child(0).setText(password) && toastLog("输入: " + password)
                            sleep(1000)
                        } catch (error) {
                            // 01:24:23.124/D:       2 Rect(42, 655 - 1038, 796) null android.widget.EditText - Address - null - false - false - true - true
                            // 01:24:23.128/D:       2 Rect(42, 810 - 1038, 951) null android.widget.EditText - Port - null - false - false - true - true
                            // 01:24:23.132/D:       2 Rect(42, 965 - 1038, 1106) null android.widget.EditText - User - null - false - false - true - true
                            // 01:24:23.136/D:       2 Rect(42, 1120 - 1038, 1261) null android.widget.EditText - Password - null - false - false - true - true
                            className("android.widget.EditText").text("Address").findOne(1000).setText(server_address) && toastLog("输入: " + server_address)
                            sleep(1000)
                            className("android.widget.EditText").text("Port").findOne(1000).setText(server_port) && toastLog("输入: " + server_port)
                            sleep(1000)
                            className("android.widget.EditText").text("User").findOne(1000).setText(username) && toastLog("输入: " + username)
                            sleep(1000)
                            className("android.widget.EditText").text("Password").findOne(1000).setText(password) && toastLog("输入: " + password)
                            sleep(1000)
                        }

                        is_proxy_set = clickIfWidgetClickable(id("fun.kitsunebi.kitsunebi4android:id/save_btn").findOne(1000))
                        log("保存节点: " + is_proxy_set + " - " + server_name)
                        // sleep(2000)
                    } catch (error) {
                        log("新增节点异常: " + JSON.stringify(error))
                        back()
                    }
                    !className("android.widget.TextView").text("Kitsunebi").findOne(3000) && back()
                    // sleep(600)
                }
                else { is_unknow_page = true; not_found_count++ }

                if (is_unknow_page && not_found_count % 2 == 0) {
                    not_found_count = 0
                    log("unknow page")
                    err_msg = "界面异常"
                    back()
                    sleep(3000)
                }
                sleep(2000)
            }
        }, false, 1000 * 60 * 2, () => { throw err_msg ? err_msg : "超时退出" + currentActivity() })
    } catch (error) { throw "代理设置失败: " + commonFunc.objectToString(error) }
    return is_proxy_ready
}


/**
 * 
 * @param {*} proxy_info 
 * @param {*} force_update 
 * @returns 
 */
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