const commonFunc = require("../lib/common.js");
const httpUtilFunc = require("../network/httpUtil.js");
const proxySttings = require("../network/proxySttings.js");
const { reportLog } = require("../network/httpUtil.js");
const { newThread, randomSleep, taskResultSet, longSleep } = require("../lib/common.js");
const taskDemo = {}
var taskPluginData = null
var FIND_WIDGET_TIMEOUT = 1000
var TT_PACKAGE = "com.zhiliaoapp.musically"
var Bir_success = false
taskDemo.init = function () {
    commonFunc.taskStepRecordSet(40, null, "初始化任务", null)
    commonFunc.showLog("init taskDemo")
    taskDemo.result = 0
    taskDemo.desc = ""
    if (commonFunc.server.length) { return true }
}
taskDemo.getTempData = function () {
    let datas = []
    for (let index = 0; index < datas.length; index++) {
        let _account_split = datas[index].split("|");
        let temp_account = {
            "proxy": _account_split[0].toUpperCase(),
            "phone": null,
            "email": _account_split[1],
            "password": _account_split[2],
            "ip": _account_split[3],
            "deviceId": _account_split[4].toUpperCase(),
            "folderId": _account_split[5],
        }
        if (temp_account.deviceId.toUpperCase() == commonFunc.deviceId.toUpperCase() && temp_account.folderId == commonFunc.folderId) {
            return temp_account
        }
    }
    return null
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
                commonFunc.uninstallApp("com.v2ray.ang")
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
            commonFunc.showLog("")
        } catch (error) { throw error }
        try {   //  获取插件配置
            // commonFunc.taskStepRecordSet(40, null, "获取插件配置", null)
            taskPluginData = httpUtilFunc.getPluginData() //|| {}
            taskPluginData.proxyName = taskPluginData.proxyName
            taskPluginData.bindAccount = taskPluginData.bindAccount == "on" ? true : false
            taskPluginData.shareProxy = taskPluginData.useShareProxy == "on" ? taskPluginData.shareProxy : null
            taskPluginData.bindProxy = taskPluginData.bindProxy == "on" ? true : false
            taskPluginData.proxyProvider = taskPluginData.proxyProvider != "none" ? taskPluginData.proxyProvider : null
            if (!taskPluginData.proxyTag) { taskPluginData.bindProxy = false }
            taskPluginData.unbindProxy = taskPluginData.unbindProxy == "on" ? true : false
            taskPluginData.unbindAccount = taskPluginData.unbindAccount == "on" ? true : false
            taskPluginData.backupApp = taskPluginData.backupApp == "on" ? true : false
            taskPluginData.removeFolder = taskPluginData.removeFolder == "on" ? true : false
            reportLog("插件配置: " + JSON.stringify(taskPluginData))
        } catch (error) {
            reportLog("插件配置 异常 " + JSON.stringify(error))
            throw "插件配置 获取失败 " + JSON.stringify(error)
        }
        try {   //  语言和应用检测
            // commonFunc.taskStepRecordSet(40, null, "设置系统语言", null)
            taskPluginData.systemLanguage = "en-US"
            if (taskPluginData.systemLanguage) {
                reportLog("检测系统语言: " + commonFunc.systemLanguageGet())
                commonFunc.systemLanguageSet(taskPluginData.systemLanguage)
                sleep(3000)
                if (taskPluginData.systemLanguage != commonFunc.systemLanguageGet()) {
                    throw "系统语言错误"
                }
            }
            reportLog("当前系统语言: " + commonFunc.systemLanguageGet())
            commonFunc.systemTimezoneSet_New("Europe/London")
            if (taskPluginData.systemTimezone) {
                reportLog("检测系统时区: " + commonFunc.systemTimezoneGet())
                commonFunc.systemTimezoneSet_New("Europe/London")
                sleep(3000)
                if (taskPluginData.systemTimezone != commonFunc.systemTimezoneGet()) {
                    throw "系统时区错误"
                }
            }
            reportLog("当前系统时区: " + commonFunc.systemTimezoneGet())
        } catch (error) { throw error }

        //  执行任务
        try {
            taskDemo.result = 1
            let appName = taskPluginData.targetApp
            //  本地网络
            let local_ip = httpUtilFunc.getIpInfo(1000)
            let global_ip = null
            // commonFunc.taskStepRecordSet(40, null, "获取本地ip", null)
            reportLog("本地 IP: " + local_ip)
            let bind_info = null
            // 查询绑定信息
            for (let index = 0; index < 5; index++) {
                try {
                    // 查询绑定情况
                    bind_info = httpUtilFunc.getDeviceBindInfo(appName)
                    // commonFunc.taskStepRecordSet(40, null, "查询绑定情况", null)
                    break
                } catch (error) {
                    if (index > 3) { throw "查询绑定异常: " + commonFunc.objectToString(error) }
                }
                sleep(5000)
            }
            // ----------------------以上运行正常

            //  尝试连接代理
            // 解绑操作(需要去插件手动勾选)
            if (taskPluginData.unbindProxy || taskPluginData.unbindAccount) {
                if (taskPluginData.unbindProxy) {
                    try {
                        bind_info = httpUtilFunc.getDeviceBindInfo(appName)
                        reportLog("解绑代理: " + commonFunc.objectToString(bind_info))
                        if (bind_info) {
                            bind_info = httpUtilFunc.updateDevice(appName, { "proxyId": null, "proxy": null }, null)
                            commonFunc.taskResultSet("解绑代理: " + appName + "-" + (bind_info.proxy ? false : true), "a")
                        }
                    } catch (error) {
                        throw "解绑代理异常: " + commonFunc.objectToString(error)
                    }
                }
                if (taskPluginData.unbindAccount) {
                    try {
                        bind_info = httpUtilFunc.getDeviceBindInfo(appName)
                        reportLog("即将解绑账号: " + commonFunc.objectToString(bind_info))
                        //  解绑账号
                        if (bind_info) {
                            if (bind_info.accountId && taskPluginData.backupApp) {
                                try {
                                    let bid = null
                                    switch (appName) {
                                        case "facebook":
                                            bid = "com.facebook.katana"
                                            break
                                        case "tiktok":
                                            bid = "com.ss.android.ugc.trill"
                                            break
                                        case "whatsapp":
                                            bid = "com.whatsapp"
                                            break
                                    }
                                    if (!app.getAppName(bid)) { throw "未安装 " + appName + " - " + bid }
                                    reportLog("开始备份: " + appName + " - " + bid)
                                    for (let idx_backup = 1; idx_backup < 10; idx_backup++) {
                                        let backup_result = null
                                        try {
                                            commonFunc.showLog("第" + idx_backup + "次尝试备份: " + appName + " - " + bid)
                                            backup_result = SLChanges.backupApp(bid)
                                            backup_result = JSON.parse(backup_result)
                                            if (backup_result.code != 200) { throw backup_result }
                                            commonFunc.taskResultSet("备份结果: " + commonFunc.objectToString(backup_result))
                                            break
                                        } catch (error) {
                                            log("分区备份异常")
                                            if (idx_backup > 8) { throw error }
                                        }
                                        randomSleep(5000)
                                    }
                                } catch (error) {
                                    throw "备份分区异常: " + commonFunc.objectToString(error)
                                }
                            }
                            if (bind_info.accountId) {
                                try {
                                    let login_record = {}
                                    login_record.appName = appName
                                    login_record.accountId = bind_info.accountId
                                    login_record.proxy = bind_info.proxy
                                    login_record.actionType = 2
                                    login_record.result = 0
                                    login_record.desc = "解绑"
                                    httpUtilFunc.accountLoginRecord(login_record)
                                } catch (error) { log("记录登录状态异常: " + commonFunc.objectToString(error)) }
                                try {
                                    bind_info = httpUtilFunc.updateDevice(appName, null, { "accountId": null })
                                    commonFunc.taskResultSet("解绑账号: " + appName + "-" + (bind_info.accountId ? false : true), "a")
                                } catch (error) {
                                    throw "解绑账号异常: " + commonFunc.objectToString(error)
                                }
                            }
                        }
                        //  解绑分区并重置分区
                        if (taskPluginData.removeFolder) {
                            // 1. 群控后台 解绑设备分区
                            for (let index = 0; index < 10; index++) {
                                // 多次尝试解绑分区, 应对网络延迟或服务器无响应等
                                try {
                                    //  极度敏感操作!!!  请务必谨慎, 确保您非常明确该接口产生的后果
                                    let res_unbind = httpUtilFunc.taskEnvironmentFolderUnbind()
                                    commonFunc.taskResultSet("分区解绑: " + commonFunc.objectToString(res_unbind), "a")
                                    break
                                } catch (error) {
                                    if (index > 8) { throw "分区解绑异常: " + commonFunc.objectToString(error) }
                                    randomSleep(5000)
                                }
                            }
                            // 2. 预先配置 分区重置之后的广播命令
                            let suffix_content = ""
                            try {
                                let folder_list = null
                                //  检查当前设备绑定的分区列表
                                try {
                                    folder_list = httpUtilFunc.taskEnvironmentFolderListGet([commonFunc.deviceId])
                                    suffix_content = "--ei ToFolderId " + folder_list[0].folderId      //  重置之后切回第一个可用分区
                                } catch (error) {
                                    log("分区查询异常: " + commonFunc.objectToString(error), "a")
                                }
                                //  再次确认分区是否已被群控系统解绑, 如果未被解绑 则抛出异常 拒绝重置分区
                                if (folder_list && folder_list.length) {
                                    for (let data_folder of folder_list) {
                                        if (commonFunc.folderId == data_folder.folderId && new RegExp(commonFunc.deviceId, "i").test(data_folder.deviceId)) {
                                            throw "拒绝重置分区,因为分区未解绑: " + commonFunc.deviceId + "-" + commonFunc.folderId
                                        }
                                    }
                                    commonFunc.taskResultSet("分区已解绑: " + commonFunc.deviceId + "-" + commonFunc.folderId, "a")
                                }
                            } catch (error) { throw error }
                            //  重置分区前先上报任务结果
                            commonFunc.taskResultSet("重置分区: " + commonFunc.deviceId + "-" + commonFunc.folderId, "a")
                            let task_result = "任务结果: " + "1" + " - \n" + commonFunc.taskResultGet()
                            commonFunc.taskResultSet(task_result, "w")
                            reportLog(task_result)
                            //  开始重置分区
                            for (let index = 0; index < 5; index++) {
                                try {
                                    //  运行 shell 命令之后, 当前分区会被重置清理, 脚本引擎也会被终止
                                    shell("am broadcast --user 0 -n com.happybay.machine.change/com.happybay.machine.task.SwitchUserReceiver -a " + commonFunc.folderId + " --ez IsReset true " + suffix_content);
                                }
                                catch (error) { if (index > 3) { throw "重置分区异常: " + commonFunc.objectToString(error) } }
                                randomSleep(5000)
                            }
                        }
                    } catch (error) {
                        throw "解绑异常: " + commonFunc.objectToString(error)
                    }
                }
            } else {
                //  尝试连接代理
                // 绑定操作(需要去插件手动勾选)
                if (taskPluginData.shareProxy || taskPluginData.bindProxy) {
                    // commonFunc.taskStepRecordSet(40, null, "绑定代理", null)
                    try {
                        let is_proxy_bind = false
                        let is_proxy_on = false
                        let proxy_info = null
                        let temp_proxy = null
                        try { is_proxy_bind = bind_info && bind_info.proxy ? true : false } catch (error) { }
                        let proxy_thread_timeout = taskPluginData.proxyThreadTimeout || 15
                        proxy_thread_timeout = parseInt(proxy_thread_timeout)
                        if (new RegExp(/v2ray/i).test(taskPluginData.proxyName)) { //  v2rayNG_1.6.23_arm64-v8a.apk
                            //  使用 v2rayNG_1.6.23 代理 app 
                            try { commonFunc.uninstallApp("fun.kitsunebi.kitsunebi4android"); sleep(3000) } catch (error) { }
                            taskPluginData.proxyLink = "http://192.168.91.3:8012/upload/267e5d6a-d1fb-4ab2-a19b-ef27f8dd150d.apk"
                            if (!proxySttings.v2rayInstall(taskPluginData.proxyLink)) { throw "未安装 " + "com.v2ray.ang" }
                            is_proxy_on = newThread(() => {
                                let proxy_loop_max = 3
                                for (let proxy_loop = 0; proxy_loop < proxy_loop_max; proxy_loop++) {
                                    //  1. 获取代理
                                    try {
                                        if (is_proxy_bind) {
                                            proxy_info = bind_info.proxy
                                            log("使用已绑定代理: " + proxy_info)
                                        }
                                        else {
                                            temp_proxy = httpUtilFunc.getProxyData(taskPluginData.proxyProvider, taskPluginData.proxyTag)
                                            if (!temp_proxy || !temp_proxy.proxy) { throw taskPluginData.proxyProvider + " - " + taskPluginData.proxyTag }
                                            if (proxy_info == temp_proxy.proxy) { continue }
                                            proxy_info = temp_proxy.proxy
                                            log("使用新的代理: " + proxy_info)
                                        }
                                        if (!proxy_info) { throw proxy_info }
                                    } catch (error) {
                                        taskDemo.desc = "获取代理异常: " + commonFunc.objectToString(error)
                                        continue
                                    }
                                    //  2. 连接代理
                                    try {
                                        is_proxy_on = proxySttings.v2raySetup(proxy_info, false, 1000 * 60 * 2)
                                        taskDemo.desc = "代理连接结果: " + is_proxy_on
                                        reportLog(taskDemo.desc)
                                    } catch (error) {
                                        taskDemo.desc = "代理连接异常: " + commonFunc.objectToString(error)
                                        reportLog(taskDemo.desc)
                                        continue
                                    }
                                    if (!is_proxy_on) { continue }
                                    //  3. 检测代理
                                    global_ip = null
                                    for (let index = 0; index < 3; index++) {
                                        // commonFunc.taskStepRecordSet(40, null, "代理IP检测", null)
                                        commonFunc.showLog("代理IP检测: " + global_ip)
                                        global_ip = httpUtilFunc.getGlobalIp()
                                        reportLog("检测IP: " + local_ip + " -> " + global_ip)
                                        commonFunc.showLog("代理IP检测: " + global_ip)
                                        if (global_ip) { return true } else { taskDemo.desc = "代理已连接, 但IP检测失败 " + local_ip + " -> " + global_ip }
                                        try { if (httpUtilFunc.isUrlAccessable("https://www.facebook.com", "facebook")) { return true } } catch (error) { taskDemo.desc = "代理已连接,但网站访问失败: " + commonFunc.objectToString(error) }
                                        randomSleep(5000)
                                    }
                                }
                            }, false, 1000 * 60 * proxy_thread_timeout, () => { throw "代理连接多次失败退出 " + taskDemo.desc })
                        } else {
                            //  使用 kitsunebi4android 代理 app
                            try { commonFunc.uninstallApp("com.v2ray.ang"); sleep(3000) } catch (error) { }
                            taskPluginData.proxyLink = "http://192.168.91.3:8012/upload/e3acddc3-4ce1-4286-8ad6-f2c0e8bac093.apk"   //  "fun.kitsunebi.kitsunebi4android"
                            if (!proxySttings.kitsunebiInstall(taskPluginData.proxyLink)) { throw "未安装 " + "fun.kitsunebi.kitsunebi4android" }
                            is_proxy_on = newThread(() => {
                                let proxy_loop_max = 3
                                for (let proxy_loop = 0; proxy_loop < proxy_loop_max; proxy_loop++) {
                                    try {
                                        if (is_proxy_bind) {
                                            proxy_info = bind_info.proxy
                                            try { taskPluginData.proxyProvider = taskPluginData.proxyProvider || httpUtilFunc.queryProxy({ "proxy": proxy_info }).proxyProvider } catch (error) { }
                                            log("使用已绑定代理: " + proxy_info)
                                        } else if (proxy_loop % 2 == 0) {
                                            temp_proxy = httpUtilFunc.getProxyData(taskPluginData.proxyProvider, taskPluginData.proxyTag)
                                            if (!temp_proxy || !temp_proxy.proxy) { throw taskPluginData.proxyProvider + " - " + taskPluginData.proxyTag }
                                            if (proxy_info == temp_proxy.proxy) { continue }
                                            proxy_info = temp_proxy.proxy
                                            taskPluginData.proxyProvider = temp_proxy.proxyProvider
                                            log("使用新的代理: " + proxy_info)
                                            taskResultSet("使用代理:" + proxy_info, "a")
                                        }
                                        if (!proxy_info) { throw proxy_info }
                                    } catch (error) {
                                        taskDemo.desc = "获取代理异常: " + commonFunc.objectToString(error)
                                        continue
                                    }
                                    try {
                                        if (proxy_loop > 0) { commonFunc.forceStopApp("fun.kitsunebi.kitsunebi4android"); sleep(2000) }
                                        is_proxy_on = proxySttings.kitsunebiSetup(proxy_info, taskPluginData.proxyProvider)
                                        taskDemo.desc = "代理连接结果: " + is_proxy_on
                                        reportLog(taskDemo.desc)
                                    } catch (error) {
                                        taskDemo.desc = "代理连接异常: " + commonFunc.objectToString(error)
                                        reportLog(taskDemo.desc)
                                        continue
                                    }
                                    if (!is_proxy_on) { continue }
                                    //  3. 检测代理
                                    global_ip = null
                                    for (let index = 0; index < 3; index++) {
                                        commonFunc.showLog("代理IP检测: " + global_ip)
                                        global_ip = httpUtilFunc.getGlobalIp()
                                        reportLog("检测IP: " + local_ip + " -> " + global_ip)
                                        commonFunc.showLog("代理IP检测: " + global_ip)
                                        if (global_ip) { return true } else { taskDemo.desc = "代理已连接, 但IP检测失败 " + local_ip + " -> " + global_ip }
                                        try { if (httpUtilFunc.isUrlAccessable("https://www.facebook.com", "facebook")) { return true } } catch (error) { taskDemo.desc = "代理已连接,但网站访问失败: " + commonFunc.objectToString(error) }
                                        randomSleep(5000)
                                    }
                                }
                            }, false, 1000 * 60 * proxy_thread_timeout, () => { throw "代理连接多次失败退出 " + taskDemo.desc })
                        }
                        if (!is_proxy_on) { throw taskDemo.desc }
                        ipInfo = httpUtilFunc.getIpInfo()
                        reportLog("代理网络 " + JSON.stringify(ipInfo))
                        //  4. 绑定代理
                        try {
                            if (!is_proxy_bind) {
                                // commonFunc.taskStepRecordSet(40, null, "绑定代理", null)
                                let new_bind_proxy = { "proxy": temp_proxy.proxy, "proxyId": temp_proxy.id }
                                for (let index = 0; index < 5; index++) {
                                    try { bind_info = httpUtilFunc.updateDevice(appName, new_bind_proxy, null); break } catch (error) { if (index > 3) { throw error } }
                                    sleep(5000)
                                }
                                commonFunc.taskResultSet("使用新的代理绑定: " + commonFunc.objectToString(new_bind_proxy), "a")
                            }
                        } catch (error) {
                            throw "代理绑定异常: " + commonFunc.objectToString(error)
                        }
                    } catch (error) {
                        throw error
                    }
                }
                //  绑定账号
                if (taskPluginData.bindAccount) {
                    // commonFunc.taskStepRecordSet(40, null, "绑定账号", null)
                    try {
                        let is_new_bind = false
                        let account = null
                        bind_info = bind_info ? bind_info : httpUtilFunc.getDeviceBindInfo(appName)
                        account = httpUtilFunc.accountQuery({ "appName": appName, "androidId": commonFunc.androidId })
                        if (bind_info && bind_info.accountId) {
                            let bind_account = null
                            for (let index = 0; index < 5; index++) {
                                try {
                                    bind_account = httpUtilFunc.accountQuery({ "appName": appName, "id": bind_info.accountId })
                                    break
                                } catch (error) {
                                    if (index > 3) { throw "账号查询异常: " + commonFunc.objectToString(error) }
                                }
                            }
                            if (!bind_account) { throw "账号查询失败: " + appName + "-" + bind_info.accountId }
                            if (!account) { account = bind_account }
                            if (bind_account.androidId) {
                                if (!account || bind_info.accountId != account.id) { throw "安卓ID对应的账号与当前绑定账号不匹配,请核对绑定信息是否正确" }
                            }
                            commonFunc.taskResultSet("已有绑定: " + appName + "-" + bind_info.accountId, "a")
                        }
                        else {
                            is_new_bind = true
                            if (account && account.id) {
                                bind_info = httpUtilFunc.updateDevice(appName, null, { "accountId": account.id })
                                commonFunc.taskResultSet("绑定账号: " + account.id, "a")
                                reportLog("绑定账号: " + account.id)
                                bind_info = bind_info || httpUtilFunc.getDeviceBindInfo(appName)
                                account = account || httpUtilFunc.accountQuery({ "appName": appName, "id": bind_info.accountId })
                                //  检测更新账号的 androidId
                                try {
                                    log("更新账号信息")
                                    // commonFunc.taskStepRecordSet(40, null, "更新账号信息", null)
                                    let updated_account = httpUtilFunc.accountUpdate(account.id, { "proxyProvider": taskPluginData.proxyProvider, "proxy": bind_info.proxy, "ip": global_ip, "deviceId": commonFunc.deviceId, "folderId": commonFunc.folderId })
                                    account = updated_account.id ? updated_account : account
                                } catch (error) { log("更新账号异常: " + commonFunc.objectToString(error)) }
                            }
                            else {
                                throw "根据安卓ID查询,当前设备无 " + appName + " 账号 "
                            }
                        }
                    } catch (error) {
                        throw "账号绑定异常: " + commonFunc.objectToString(error)
                    }
                }
            }
            // 绑定账号
            if (taskPluginData.bindAccount) {
                try {
                    // commonFunc.taskStepRecordSet(40, null, "绑定账号", null)
                    let is_new_bind = false
                    let account = null
                    bind_info = bind_info ? bind_info : httpUtilFunc.getDeviceBindInfo(appName)
                    account = httpUtilFunc.accountQuery({ "appName": appName, "androidId": commonFunc.androidId })
                    if (bind_info && bind_info.accountId) {
                        let bind_account = null
                        for (let index = 0; index < 5; index++) {
                            try {
                                bind_account = httpUtilFunc.accountQuery({ "appName": appName, "id": bind_info.accountId })
                                break
                            } catch (error) {
                                if (index > 3) { throw "账号查询异常: " + commonFunc.objectToString(error) }
                            }
                        }
                        if (!bind_account) { throw "账号查询失败: " + appName + "-" + bind_info.accountId }
                        if (!account) { account = bind_account }
                        if (bind_account.androidId) {
                            if (!account || bind_info.accountId != account.id) { throw "安卓ID对应的账号与当前绑定账号不匹配,请核对绑定信息是否正确" }
                        }
                        commonFunc.taskResultSet("已有绑定: " + appName + "-" + bind_info.accountId, "a")
                    }
                    else {
                        is_new_bind = true
                        if (account && account.id) {
                            bind_info = httpUtilFunc.updateDevice(appName, null, { "accountId": account.id })
                            commonFunc.taskResultSet("绑定账号: " + account.id, "a")
                            reportLog("绑定账号: " + account.id)
                            bind_info = bind_info || httpUtilFunc.getDeviceBindInfo(appName)
                            account = account || httpUtilFunc.accountQuery({ "appName": appName, "id": bind_info.accountId })
                            //  检测更新账号的 androidId
                            try {
                                log("更新账号信息")
                                // commonFunc.taskStepRecordSet(40, null, "更新账号信息", null)
                                let updated_account = httpUtilFunc.accountUpdate(account.id, { "proxyProvider": taskPluginData.proxyProvider, "proxy": bind_info.proxy, "ip": global_ip, "deviceId": commonFunc.deviceId, "folderId": commonFunc.folderId })
                                account = updated_account.id ? updated_account : account
                            } catch (error) { log("更新账号异常: " + commonFunc.objectToString(error)) }
                        }
                        else {
                            throw "根据安卓ID查询,当前设备无 " + appName + " 账号 "
                        }
                    }
                } catch (error) {
                    throw "账号绑定异常: " + commonFunc.objectToString(error)
                }
            }
            commonFunc.taskResultSet("设备绑定信息: " + commonFunc.objectToString(bind_info), "a")
            // 下载、安装、迁移tt
            try {
                // commonFunc.taskStepRecordSet(40, null, "下载、安装、还原tt", null)
                download_all()
                // commonFunc.taskStepRecordSet(40, null, "设置生日", null)
                set_birthday()
            } catch (error) {
                throw "下载、安装、迁移tt异常: " + commonFunc.objectToString(error)
            }
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

// ---------------------------------------下载tt并还原tt
// 下载tt并还原tt
function download_all() {
    try {
        // 检测Tiktok是否安装对应版本
        if (!app.getAppName("com.zhiliaoapp.musically")) {
            log("检测到未安装TikTok")
            httpUtilFunc.downloadFile("http://192.168.91.3:8012/upload/a59d3e2a-1a41-4eb1-8098-2d9a0b524364.xapk", "/storage/emulated/0/Tiktok22.4.xapk", 1000 * 60, false)
            randomSleep()
            log("正在安装TikTok")
            commonFunc.installApkNew("/storage/emulated/0/Tiktok22.4.xapk")
        }
        sleep(3000)
        let tiktokPackage = "com.zhiliaoapp.musically"
        log("正在还原tiktok: ")
        console.time('还原tiktok耗时');
        var restoreResult = JSON.parse(SLChanges.restoreApp(tiktokPackage));
        if (restoreResult.code < 200) {
            throw "还原tiktok失败: " + restoreResult.msg
        }
        console.timeEnd('还原tiktok耗时');
        log("还原tiktok成功")
        toastLog("开始打开tiktok进行生日设置")
        randomSleep()

    } catch (error) {
        log("还原tiktok时捕获到一个错误:" + error)
    }
}
// ---------------------------------------下载tt并还原tt

// ---------------------------------------打开tt点击设置，设置生日
function set_birthday() {
    try {
        log("打开tt")
        launch(TT_PACKAGE)
        sleep(5000)
        checkpop_up()
        for (let index = 0; index < 4; index++) {
            profile()
        }
    } catch (error) {
        log("设置出生年月时捕获到一个错误:", error)
    }
}
// ---------------------------------------打开tt点击设置，设置生日

// ---------------------------------临时-----------------------
function profile() {
    log("检查我的页面是否存在")
    var my = text("Profile").findOne(FIND_WIDGET_TIMEOUT)
    if (my != null) {
        log("点击我的")
        randomSleep()
        var profilebounds = my.bounds();
        click(profilebounds.centerX(), profilebounds.centerY());
        randomSleep()
        log("检查三横")
        var ThreeAcross = id("com.zhiliaoapp.musically:id/nav_end").findOne(FIND_WIDGET_TIMEOUT)
        if (ThreeAcross != null) {
            log("点击三横")
            randomSleep()
            var ThreeAcrossbounds = ThreeAcross.bounds();
            click(ThreeAcrossbounds.centerX(), ThreeAcrossbounds.centerY());
            randomSleep()
            log("检查设置弹框是否弹出")
            var Settings = text("Settings and privacy").findOne(FIND_WIDGET_TIMEOUT)
            if (Settings != null) {
                log("点击设置弹框")
                randomSleep()
                var Settingsbounds = Settings.bounds();
                click(Settingsbounds.centerX(), Settingsbounds.centerY());
                randomSleep()
                log("检查Manage")
                var Manage = text("Manage account").findOne(FIND_WIDGET_TIMEOUT)
                if (Manage != null) {
                    log("点击Manage account")
                    randomSleep()
                    var Managebounds = Manage.bounds();
                    click(Managebounds.centerX(), Managebounds.centerY());
                    randomSleep()
                    log("检查生日设置")
                    var birSetting = text("Date of birth").findOne(FIND_WIDGET_TIMEOUT)
                    if (birSetting != null) {
                        log("点击生日设置")
                        longSleep()
                        var birSettingbounds = birSetting.bounds();
                        click(birSettingbounds.centerX(), birSettingbounds.centerY());
                        randomSleep()
                        checkBirthDayPage()
                    }
                    else {
                        selectBirthDayed()
                        log("该账号已经选择过生日，无需再选")
                    }
                }
            }
        }
    }
}

function checkpop_up() {
    log("检查弹窗")
    sleep(10000)
    var TC1 = text("Don't allow").findOne(FIND_WIDGET_TIMEOUT)
    if (TC1 != null) {
        log("点击弹窗1")
        randomSleep()
        while (!click("Don't allow"));
    }
    sleep(3000)
    var TC2 = text("Don't allow").findOne(FIND_WIDGET_TIMEOUT)
    if (TC2 != null) {
        log("点击弹窗2")
        randomSleep()
        while (!click("Don't allow"));
    }
    var swipe_element = text("Swipe up for more").id("com.zhiliaoapp.musically:id/f4r").findOne(FIND_WIDGET_TIMEOUT)
    if (swipe_element != null) {
        log("检测用户引导")
        log("上滑一小截1次");
        commonFunc.swipeUpRandomSpeed()
        commonFunc.swipeUpRandomSpeed()
    }
    log("检测系统写入操作")
    var allow = text("ALLOW").findOne(FIND_WIDGET_TIMEOUT)
    if (allow != null) {
        while (!click("ALLOW"));
    }
}


function checkBirthDayPage() {
    log("检查选择生日年月日页")
    var birthdayText = text("What's your date of birth?").id("com.zhiliaoapp.musically:id/qv").findOne(FIND_WIDGET_TIMEOUT)
    log("已检测到选择生日页")
    if (birthdayText != null) {
        log("检查生日输入框")
        var birthDayEdit = id("com.zhiliaoapp.musically:id/hl").findOne(FIND_WIDGET_TIMEOUT)
        log("已检测到生日输入框")
        if (birthDayEdit != null) {
            var birthDayEditText = birthDayEdit.text()
            toastLog("birthDayEditText = " + birthDayEditText)
            if (birthDayEditText != "") {
                var birthYear = birthDayEditText.split(",")[1]
                if (!(birthYear > 1988 && birthYear < 2005)) {
                    selectBirthDay()
                }
            } else {
                selectBirthDay()
            }
        }
        log("检查Confirm是否存在")
        var nextBt = id("com.zhiliaoapp.musically:id/cfh").text("Confirm").findOne(FIND_WIDGET_TIMEOUT)
        log("已检测到Confirm存在")
        if (nextBt != null) {
            randomSleep()
            var a = nextBt.bounds();
            click(a.centerX(), a.centerY());
            randomSleep()
            log("检查确认年龄页面")
            var CheckYearsOld = text("Edit").findOne(FIND_WIDGET_TIMEOUT)
            log("已经检查到确认年龄页面")
            if (CheckYearsOld != null) {
                randomSleep()
                var confirm = text("Confirm").findOne(FIND_WIDGET_TIMEOUT)
                if (confirm != null) {
                    randomSleep()
                    var b = confirm.bounds();
                    click(b.centerX(), b.centerY());
                    sleep(5000)
                }
            }
        }
    }
}
function selectBirthDay() {
    //月份
    log("检查选择生日月元素")
    var monthList = id("com.zhiliaoapp.musically:id/clb").findOne(FIND_WIDGET_TIMEOUT)
    if (monthList != null) {
        log("已检测到选择生日月存在")
        var b = monthList.bounds()
        var top = b.top
        var bottom = b.bottom
        var left = b.left
        var right = b.right
        var listItemHeight = Math.floor((bottom - top) / 3)
        var randomSwipe = random(1, 5)
        var randomScollDirection = random(0, 6)
        var swipeCount = 0
        var startX = random(left, right)
        var startY = random(bottom - listItemHeight, bottom)
        var endX = random(left, right)
        var endY = random(top, top + listItemHeight)
        var swipeHeight = startY - endY
        if (randomScollDirection > 3) {
            startY = random(top, top + listItemHeight)
            endY = random(bottom - listItemHeight, bottom)
        }
        do {
            log(" swipeHeight " + swipeHeight + " , listItemHeight " + listItemHeight)
            swipe(startX, startY, endX, endY, random(500, 1500))
            swipeCount++
        } while (swipeCount < randomSwipe)
    }
    randomSleep()
    //日期
    var dayList = id("com.zhiliaoapp.musically:id/aho").findOne(FIND_WIDGET_TIMEOUT)
    if (dayList != null) {
        var b = dayList.bounds()
        var top = b.top
        var bottom = b.bottom
        var left = b.left
        var right = b.right
        var listItemHeight = Math.floor((bottom - top) / 3)
        var randomSwipe = random(3, 6)
        var swipeCount = 0
        var randomDayScollDirection = random(0, 6)
        var startX = random(left, right)
        var startY = random(bottom - listItemHeight, bottom)
        var endX = random(left, right)
        var endY = random(top, top + listItemHeight)
        if (randomDayScollDirection > 3) {
            startY = random(top, top + listItemHeight)
            endY = random(bottom - listItemHeight, bottom)
        }
        do {
            var swipeHeight = startY - endY
            log(" swipeHeight " + swipeHeight + " , listItemHeight " + listItemHeight)
            swipe(startX, startY, endX, endY, random(500, 1500))
            swipeCount++
        } while (swipeCount < randomSwipe)
    }
    randomSleep()
    //年份
    var yearList = id("com.zhiliaoapp.musically:id/fk0").findOne(FIND_WIDGET_TIMEOUT)
    if (yearList != null) {
        var b = yearList.bounds()
        var top = b.top
        var bottom = b.bottom
        var left = b.left
        var right = b.right
        var listItemHeight = Math.floor((bottom - top) / 3)
        var randomSwipe = random(12, 15)
        var swipeCount = 0
        do {
            var startX = random(left, right)
            var startY = random(bottom - Math.floor(listItemHeight / 2), bottom)
            var endX = random(left, right)
            var endY = random(top, top + Math.floor(listItemHeight / 2))
            var swipeHeight = startY - endY
            log(" swipeHeight " + swipeHeight + " , listItemHeight " + listItemHeight)
            swipe(endX, endY, startX, startY, random(200, 400))
            sleep(random(300, 500))
            swipeCount++
        } while (swipeCount < randomSwipe)
    }
}
function selectBirthDayed() {
    log("判断是否设置了年龄")
    var setting_Bir = text("Can't change date of birth").id("com.zhiliaoapp.musically:id/title_tv").findOne(FIND_WIDGET_TIMEOUT)
    if (setting_Bir != null) {
        log("点击ok")
        randomSleep()
        var click_ok = text("OK").findOne(FIND_WIDGET_TIMEOUT)
        var click_okbounds = click_ok.bounds();
        click(click_okbounds.centerX(), click_okbounds.centerY());
        randomSleep()
    }
    Bir_success = true
}
// ---------------------------------临时-----------------------

taskDemo.init()
module.exports = taskDemo;