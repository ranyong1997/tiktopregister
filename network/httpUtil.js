const { shortSleep, newThread } = require("../lib/common.js");
const commonFunc = require("../lib/common.js");
var httpUtilFunc = {};
//初始化
httpUtilFunc.init = function () {
    try {
        log("init httpUtilFunc")
        let deviceInfo = "设备详情: " + "\n"
        deviceInfo = deviceInfo + "   happybay=" + commonFunc.happybayVersion + "\n"
        deviceInfo = deviceInfo + "   jsengine=" + commonFunc.jsengineVersion + "\n"
        deviceInfo = deviceInfo + "   androidId=" + commonFunc.androidId + "    deviceId=" + commonFunc.deviceId + "   folderId=" + commonFunc.folderId + "    userId=" + commonFunc.userId + "    brand=" + commonFunc.brand + "   model=" + commonFunc.model + "\n"
        deviceInfo = deviceInfo + "   server=" + commonFunc.server + "   taskid=" + commonFunc.taskid + "\n"
        httpUtilFunc.reportLog(deviceInfo)
    } catch (error) { log("    " + JSON.stringify(error)) }
}
/**
 * 
 * @param {*} record_data 
 */
httpUtilFunc.accountLoginRecord = function (record_data) {
    try {
        record_data.appName = record_data.appName || null
        record_data.accountId = record_data.accountId || null
        record_data.username = record_data.username || null
        record_data.proxy = record_data.proxy || null
        record_data.proxyProvider = record_data.proxyProvider || null

        record_data.actionType = record_data.actionType || 2  //  1-注册; 2-登录
        record_data.result = record_data.result || 0      //  0/1/-1  非空数字
        record_data.desc = record_data.desc || null        //  描述信息
        record_data.deviceId = commonFunc.deviceId
        record_data.folderId = commonFunc.folderId

        try { record_data.ip = record_data.ip ? record_data.ip : httpUtilFunc.getGlobalIp() } catch (error) { }
        httpUtilFunc.reportLog("记录登陆信息: " + JSON.stringify(record_data))
        let url = "http://" + commonFunc.server + ":8000/user/loginrecord"
        let res = http.postJson(url, record_data)
        res = res.body.json()
        // log( JSON.stringify(res) )
        if (res.code == 200) {
            httpUtilFunc.reportLog("记录登陆完成")
            return true
        } else {
            throw res
        }
    } catch (error) {
        httpUtilFunc.reportLog("记录登陆失败 " + commonFunc.objectToString(error))
        throw error
    }
    // return false
}
/**
 * 
 * @param {*} filter 
 * @returns 
 */
httpUtilFunc.accountQuery = function (filter) {
    let account = null
    try {
        filter.datatype = filter.datatype || 2
        filter.id = filter.id || ""
        filter.appName = filter.appName || ""
        filter.androidId = filter.androidId || ""
        filter.deviceId = filter.deviceId || ""
        filter.folderId = filter.folderId || ""
        filter.phone = filter.phone || ""
        filter.username = filter.username || ""
        if (filter.isSuccess != null) { filter.isSuccess = filter.isSuccess ? 1 : 0 }
        if (filter.isSuccess == null) { filter.isSuccess = "" }
        let url = "http://" + commonFunc.server + ":8000/user/search?datatype=" +
            filter.datatype + "&id=" + filter.id + "&appName=" + filter.appName + "&isSuccess=" + filter.isSuccess +
            "&androidId=" + filter.androidId + "&deviceId=" + filter.deviceId + "&folderId=" + filter.folderId +
            "&phone=" + filter.phone + "&username=" + filter.username
        httpUtilFunc.reportLog("查询账号: " + url)
        var res = http.get(url);
        let res_json = res.body.json()
        let data_list = JSON.parse(res_json.data)
        if (data_list.length) {
            for (let index = data_list.length - 1; index > -1; index--) {
                account = data_list[index].fields
                account.id = data_list[index].pk
                account.accountId = account.id
                break
            }
        }
        account ? httpUtilFunc.reportLog("查询账号结果: " + commonFunc.objectToString(account)) : httpUtilFunc.reportLog("查询账号失败: " + commonFunc.objectToString(res_json))
    } catch (error) {
        throw error
    }
    return account
}
/**
 * 
 * @param {*} account_id 
 * @param {*} new_data 
 * @returns 
 */
httpUtilFunc.accountUpdate = function (account_id, new_data) {
    try {
        if (!account_id || !commonFunc.isNotNullObject(new_data)) { throw "参数异常" }
        let new_account = httpUtilFunc.accountQuery({ "id": account_id })
        httpUtilFunc.reportLog("账号更新: " + account_id + " - " + commonFunc.objectToString(new_data))
        for (let key in new_data) {
            new_account[key] = new_data[key]
        }
        new_account.force_record = true
        let url = "http://" + commonFunc.server + ":8000/user/registered"
        let res = http.postJson(url, new_account)
        res = res.body.json()
        if (res.code == 200) {
            httpUtilFunc.reportLog("账号更新完成: " + res.data)
            new_account = JSON.parse(res.data)
            return new_account
        } else {
            throw res
        }
    } catch (error) {
        throw "账号更新异常" + commonFunc.objectToString(error)
    }
}
/**
 * 
 * @param {*} filter 
 * @returns 
 */
httpUtilFunc.queryProxy = function (filter) {
    let proxy_data = null
    try {
        filter.datatype = filter.datatype || 4
        filter.id = filter.id || filter.proxyId || ""
        filter.proxy = filter.proxy || ""
        filter.proxyProvider = filter.proxyProvider || ""
        filter.tag = filter.tag || ""
        filter.desc = filter.desc || ""
        if (filter.isDeleted != null) { filter.isDeleted = filter.isSuccess ? 1 : 0 }
        if (filter.isDeleted == null) { filter.isDeleted = "" }
        let url = "http://" + commonFunc.server + ":8000/user/search?datatype=" + filter.datatype + "&id=" +
            filter.id + "&proxy=" + filter.proxy + "&proxyProvider=" + filter.proxyProvider + "&tag=" + filter.tag +
            "&desc=" + filter.desc + "&isDeleted=" + filter.isDeleted
        httpUtilFunc.reportLog("查询代理: " + url)
        var res = http.get(url);
        let res_json = res.body.json()
        let data_list = JSON.parse(res_json.data)
        if (data_list.length) {
            for (let index = data_list.length - 1; index > -1; index--) {
                proxy_data = data_list[index].fields
                proxy_data.id = data_list[index].pk
                break
            }
        }
        proxy_data ? httpUtilFunc.reportLog("查询代理结果: " + commonFunc.objectToString(proxy_data)) : httpUtilFunc.reportLog("查询代理失败: " + commonFunc.objectToString(res_json))
    } catch (error) {
        throw error
    }
    return proxy_data
}
httpUtilFunc.downloadFile = function (file_url, file_path, timeout, force_download) {
    try {
        timeout = typeof (timeout) == "number" ? timeout : 120000
        force_download = typeof (force_download) == "boolean" ? force_download : false
        if (!file_url) { throw "file_url 异常: " + file_url }
        try {
            if (files.exists(file_path) && !force_download) {
                log("文件已存在：" + file_url)
                return true
            }
            files.remove(file_path)
        } catch (error) { }

        //  下载文件
        let is_download = newThread(function () {
            log("开始下载文件：" + file_url)
            res = http.get(file_url)
            files.writeBytes(file_path, res.body.bytes())
            return true
        }, false, timeout)

        //  刷新设备媒体库
        if (is_download && files.exists(file_path)) {
            media.scanFile(file_path)
            log("文件已载入设备")
            return true
        }
        throw "未知异常"
    } catch (error) {
        log("文件下载失败 " + JSON.stringify(error))
    }
    return false
}
httpUtilFunc.downLoadImg = function (imgUrl, imgPath, timeout) {
    try {
        timeout = timeout != null ? timeout : 30000
        let errMsg = ""
        let is_download = false
        try {
            log("删除本地文件：" + imgPath + " -> " + files.remove(imgPath))
        } catch (error) { }
        let dl_thread = threads.start(function () {
            log("开始下载图片：" + imgUrl)
            let img = images.load(imgUrl)
            if (img) {
                images.save(img, imgPath, "png");
                shortSleep()
                media.scanFile(imgPath)
                shortSleep()
            } else {
                errMsg = "图片下载失败"
            }
            is_download = files.exists(imgPath)
        })
        dl_thread.join(timeout)
        dl_thread.interrupt()
        if (is_download) {
            log("图片已载入相册")
            return true
        }
        errMsg != "" ? errMsg : "图片下载异常"
        throw errMsg
    } catch (error) {
        errMsg = error
        log(errMsg)
    }
    return false
}
httpUtilFunc.downloadVideo = function (mediaUrl, mediaPath, timeout) {
    try {
        timeout = timeout != null ? timeout : 30000
        let errMsg = ""
        let is_download = false
        try {
            log("删除本地文件：" + mediaPath + " -> " + files.remove(mediaPath))
        } catch (error) { }
        let dl_thread = threads.start(function () {
            log("开始下载文件：" + mediaUrl)
            res = http.get(mediaUrl)
            files.writeBytes(mediaPath, res.body.bytes())
            is_download = true
        })
        dl_thread.join(timeout)
        dl_thread.interrupt()
        if (is_download && files.exists(mediaPath)) {
            media.scanFile(mediaPath)
            log("文件已载入相册")
            return true
        }
        errMsg != "" ? errMsg : "文件下载 未知异常"
        throw errMsg
    } catch (error) {
        errMsg = error
        log(errMsg)
    }
    return false
}
/**
 * 获取已注册账号信息
 * @param {Object} filter {  "appName": "", "id": "", "isSuccess": "", "androidId": "", "deviceId": "", "folderId": "" }
 * @returns 
 */

httpUtilFunc.getAccountOnDevice = function (filter) {
    let account = null
    try {
        filter.datatype = filter.datatype || 2
        filter.id = filter.id || ""
        filter.appName = filter.appName || ""
        filter.androidId = filter.androidId || ""
        filter.deviceId = filter.deviceId || ""
        filter.folderId = filter.folderId || ""
        filter.phone = filter.phone || ""
        filter.username = filter.username || ""
        if (filter.isSuccess != null) { filter.isSuccess = filter.isSuccess ? 1 : 0 }
        if (filter.isSuccess == null) { filter.isSuccess = "" }

        let url = "http://" + commonFunc.server + ":8000/user/search?datatype=" + filter.datatype + "&id=" + filter.id + "&appName=" + filter.appName + "&isSuccess=" + filter.isSuccess + "&androidId=" + filter.androidId + "&deviceId=" + filter.deviceId + "&folderId=" + filter.folderId + "&phone=" + filter.phone + "&username=" + filter.username
        httpUtilFunc.reportLog("查询本机账号: " + url)
        var res = http.get(url);
        let res_json = res.body.json()
        //  {"code":200,"msg":"Success","data":"[{\"model\": \"model.registaccount\", \"pk\": 28842, \"fields\": {\"appName\": \"facebook\", \"deviceId\": \"AA2036086D\", \"folderId\": \"1\", \"isSuccess\": true, \"isRegistered\": false, \"isUsed\": true, \"isDeleted\": false, \"isSold\": false, \"username\": \"David Peterson\", \"password\": \"k(Sx6WA_!\", \"email\": null, \"emailPassword\": null, \"phone\": \"777507857\", \"ip\": \"14.233.65.24\", \"dialCode\": \"84\", \"city\": null, \"country\": null, \"countryCode\": \"VN\", \"extra\": null, \"account_tag\": null, \"phoneProvider\": \"yuenanka\", \"emailProvider\": null, \"proxy\": \"SOCKS5,18.138.238.133,58314\", \"proxyProvider\": \"doveip\", \"desc\": null, \"deviceInfo\": \"htc-HTC2Q55300\", \"androidId\": \"f0b0da3ef3565f1e\", \"tag\": null, \"forceRecord\": true, \"createTime\": \"2021-08-23T11:55:25.994Z\", \"updateTime\": \"2021-08-23T11:55:25.994Z\"}}]"}
        // log( JSON.stringify(res_json) )
        let data_list = JSON.parse(res_json.data)
        if (data_list.length) {
            // log( data_list.length )
            for (let index = data_list.length - 1; index > -1; index--) {
                // if( filter.id && filter.id != data_list[index].pk ){ continue }
                account = data_list[index].fields
                account.id = data_list[index].pk
                account.accountId = account.id
                break
            }
        }
        account ? httpUtilFunc.reportLog("查询本机账号结果: " + JSON.stringify(account)) : httpUtilFunc.reportLog("查询本机账号失败: " + JSON.stringify(res_json))
    } catch (error) {
        httpUtilFunc.reportLog("查询本机账号失败: " + JSON.stringify(error))
    }
    return account
}
// httpUtilFunc.getAccountOnDevice_old = function( filter ){
//     let account = null
//     try {   

//             filter.datatype     = filter.datatype || 2
//             filter.appName      = filter.appName || ""
//             filter.isSuccess    = filter.isSuccess != null ? filter.isSuccess : 1
//             filter.deviceId     = commonFunc.deviceId
//             filter.folderId     = commonFunc.folderId
//             httpUtilFunc.reportLog( "查询本机账号: " + JSON.stringify(filter) )  
//             let url = "http://" + commonFunc.server + ":8000/user/search?datatype="+filter.datatype+"&appName="+filter.appName+"&isSuccess="+filter.isSuccess            
//             var res = http.get(url);
//             let res_json = res.body.json()
//             // log( JSON.stringify(res_json) )
//             let data_list = JSON.parse( res_json.data )
//             if( data_list.length ){
//                 // log( data_list.length )
//                 for (let index = data_list.length-1; index > -1; index--) {
//                     if( filter.id != null && filter.id != data_list[index].pk ){ continue }
//                     let temp_data = data_list[index].fields
//                     if( temp_data.deviceId == filter.deviceId && temp_data.folderId == filter.folderId ){
//                         account = temp_data
//                         account.id = data_list[index].pk
//                         account.accountId = account.id
//                         // return account
//                         break
//                     }
//                 }
//             }

//     } catch (error) {
//         httpUtilFunc.reportLog( "本机账号查询失败: " + JSON.stringify( error ) )        
//     }
//     httpUtilFunc.reportLog( "获取本机账号: " + JSON.stringify(account) )  
//     return account
// }
httpUtilFunc.getDeviceBindInfo = function (appName) {
    let bind_info = null
    try {
        let deviceId = commonFunc.deviceId
        let folderId = commonFunc.folderId
        log("查询绑定情况: " + appName)
        bind_info = newThread(() => {
            let url = "http://" + commonFunc.server + ":8000/user/search?datatype=5&appName=" + appName + "&deviceId=" + deviceId + "&folderId=" + folderId
            let res = http.get(url);
            res = res.body.json()
            if (res.code != 200) { throw res }
            let list = JSON.parse(res.data)
            if (list.length) { return list[0].fields }
        }, null, 1000 * 30)
    } catch (error) { throw "查询绑定异常: " + JSON.stringify(error) }
    return bind_info
}

httpUtilFunc.getRegisterContact = function () {
    let contact = {}
    try {
        let url_unreg = "http://" + commonFunc.server + ":8000/user/search?datatype=1&appName=whatsapp"
        let url_reg = "http://" + commonFunc.server + ":8000/user/search?datatype=2&appName=whatsapp&isSuccess=1"
        let url = random(0, 100) < 20 ? url_unreg : url_reg
        var res = http.get(url);
        let res_json = res.body.json()
        // log( JSON.stringify(res_json) )
        let data_list = JSON.parse(res_json.data)
        if (data_list.length) {
            let temp_data = data_list[random(0, data_list.length - 1)].fields
            contact.phone = temp_data.phone
            contact.firstName = temp_data.username
            contact.lastName = ""
            contact.email = temp_data.email
        }
    } catch (error) {
        httpUtilFunc.reportLog("获取插件配置失败: " + JSON.stringify(error))

        // throw error
    }
    return contact
}
httpUtilFunc.getPluginData = function () {
    let pluginData = null
    try {
        let url = "http://" + commonFunc.server + ":83/task/getplugindata?taskid=" + commonFunc.taskid
        // let url = "http://192.168.91.3:83/task/getplugindata?taskid=fa43be62-83cb-48cc-b8c7-d69db40eca89"
        log("   读取配置:" + url)
        commonFunc.taskResultSet("任务配置-" + url, "a")
        var res = http.get(url);
        let res_json = res.body.json()
        if (commonFunc.isNotNullObject(res_json.param)) {
            pluginData = res_json.param.pluginData ? res_json.param.pluginData : res_json.param
        } else if (typeof (res_json.param) == "string") {
            pluginData = JSON.parse(res_json.param)
        }
    } catch (error) {
        throw error
    }
    return pluginData
}
/**
 * getProxyData 从代理库中获取一个可用代理
 * @param {String} proxy_provider 代理来源
 * @param {String} proxy_tag 代理标签
 * @returns {String} proxy_data 代理信息 示例: SOCKS5,18.139.39.145,59230
 */
httpUtilFunc.getProxyData = function (proxy_provider, proxy_tag) {
    try {
        // if( !proxy_provider || !proxy_tag ){ throw "代理来源或代理标签为空" }
        if (!proxy_tag) { throw "代理标签为空" }
        let url = null
        if (proxy_provider) {
            url = "http://" + commonFunc.server + ":8000/proxy/getproxy?proxyProvider=" + proxy_provider + "&tag=" + proxy_tag
        } else {
            url = "http://" + commonFunc.server + ":8000/proxy/getproxy?tag=" + proxy_tag
        }
        httpUtilFunc.reportLog("获取代理: " + url)
        /**
         * 这里有个疑问, 以这种方式获取到的代理, 如何区分app绑定?
         * 例如 个代理, 最多可以被 WhatsApp 绑定 3个账号, 目前已经被 WhatsApp 绑定满3个
         * 此时, 我需要 用同样这个 代理 去绑定 Facebook, 如何实现? (用当前这个api 还能取到这个代理吗? 参数是否应该加上 appName ? )
         */
        return newThread(function () {
            let res = http.get(url)
            res = res.body.json()
            if (res.code == 200) {
                let data = JSON.parse(res.data)
                // {"id":252,"proxy":"SOCKS5,192.210.187.138,10247","proxyProvider":"sk5go","bindMax":5,"bindNum":1,"tag":"2021061702","desc":"","isDeleted":false,"createTime":"2021-08-25T07:43:09.096Z","updateTime":"2021-08-25T07:43:09.096Z"}
                if (data.proxy) {
                    delete data.proxyId
                    return data
                }
            }
            throw res
        }, null, 1000 * 20, () => { throw "超时退出" })
    } catch (error) { throw "获取代理异常: " + commonFunc.objectToString(error) }
}
/**
 * 获取 北鲲云 动态代理
 * @param {*} base_url 
 * @param {*} args 
 * @returns 
 */
httpUtilFunc.getProxyFromCloudam = function (base_url, args) {
    try {
        if (!base_url || !args) { throw "getProxyFromCloudam 参数异常" }
        let protocol = args.protocol || "socks"
        let regionid = args.regionid || "US"
        let needpwd = args.needpwd || false
        let duplicate = args.duplicate || true
        let amount = args.amount || 1
        let type = args.type || "text"

        let uri = "?protocol=" + protocol + "&regionid=" + regionid + "&needpwd=" + needpwd + "&duplicate=" + duplicate + "&amount=" + amount + "&type=" + type
        let url = base_url + uri.toLowerCase()
        log("尝试获取动态代理: " + url)
        return newThread(function () {
            let res = http.get(url)
            res = res.body.string().replace(/[\r\n\s]/g, "")
            if (new RegExp(/\d+\.\d+\.\d+\.\d+:\d+/).test(res)) {
                res = res.replace(":", ",")
                res = "SOCKS5," + res
                return res
            }
            throw res
        }, null, 1000 * 20, () => { throw "超时退出" })
    } catch (error) { throw "获取代理异常: " + commonFunc.objectToString(error) }
}
/**
 * 获取 doveip 动态代理
 * @param {*} base_url 
 * @param {*} args 
 * @returns 
 */
httpUtilFunc.getProxyFromDoveip = function (base_url, args) {
    try {
        if (!base_url || !args) { throw "getProxyFromDoveip 参数异常" }
        let geo = args.geo || "US"
        let selfip = args.selfip || ""
        let accurate = args.accurate || 0
        let timeout = args.timeout || 10
        let agreement = args.agreement || 0
        let url = base_url + "&geo=" + geo + "&selfip=" + selfip + "&accurate=" + accurate + "&timeout=" + timeout + "&agreement=" + agreement
        log("尝试获取动态代理: " + url)
        return newThread(function () {
            let res = http.get(url)
            res = res.body.json()
            if (res.errno == 200) {
                proxy_info = "SOCKS5" + "," + res.data.ip + "," + res.data.port
                return proxy_info
            }
            throw res
        }, null, 1000 * 20, () => { throw "超时退出" })
    } catch (error) { throw "获取代理异常: " + commonFunc.objectToString(error) }
}



/**
 * 从 https://api.ipify.org 或 https://www.whatismyip.com 获取当前网络IP
 * @param {*} timeout 
 * @returns ip
 */
httpUtilFunc.getGlobalIp = function (timeout) {
    let ip = null
    try {
        timeout = typeof (timeout) == "number" ? timeout : 1000 * 30
        ip = newThread(function () {
            // let user_agent  = commonFunc.getRandomUA()
            let res = http.get("https://api.ipify.org/?format=json", {
                headers: {
                    'User-Agent': commonFunc.getRandomUA()
                }
            })
            if (res.statusCode == 200) {
                res = res.body.json()
                return res.ip
            }
            throw res.statusCode
        }, null, timeout, () => { throw "超时退出" })
    } catch (error) { log("    https://api.ipify.org/?format=json: request error ") }
    try {
        ip = ip || newThread(function () {
            let res = http.get("https://ipinfo.io/json", {
                headers: {
                    'User-Agent': commonFunc.getRandomUA()
                }
            })
            if (res.statusCode == 200) {
                res = res.body.json()
                return res.ip
            }
            throw res
        }, null, timeout, () => { throw "超时退出" })
    } catch (error) { log("    https://ipinfo.io/json: request error ") }
    try {
        ip = ip || newThread(function () {
            let res = http.get("https://ifconfig.me/", {
                headers: {
                    'User-Agent': commonFunc.getRandomUA()
                }
            })
            res = res.body.string()
            let reg = new RegExp(/id="ip_address">([^<]+)/)
            if (reg.test(res)) {
                return res.match(reg)[1]
            }
            throw res
        }, null, timeout, () => { throw "超时退出" })
    } catch (error) { log("    https://ifconfig.me/ request error ") }
    try {
        ip = ip || newThread(function () {
            let res = http.get("https://www.whatismyip.com/", {
                headers: {
                    'User-Agent': commonFunc.getRandomUA()
                }
            })
            res = res.body.string()
            let reg = new RegExp(/Detailed information about IP address ([^"]+)/)
            if (reg.test(res)) {
                return res.match(reg)[1]
            }
            throw res
        }, null, timeout, () => { throw "超时退出" })
    } catch (error) { log("    https://www.whatismyip.com/ request error ") }
    return ip
}
/**
 * 从 http://ip-api.com 获取当前网络IP和IP所属地理位置信息
 * @param {*} timeout 
 * @returns 示例数据: {"status":"success","country":"United States","countryCode":"US","region":"NY","regionName":"New York","city":"Buffalo","zip":"14202","lat":42.893,"lon":-78.8753,"timezone":"America/New_York","isp":"ColoCrossi
ng","org":"ColoCrossing","as":"AS36352 ColoCrossing","query":"23.94.65.69"}
 */
httpUtilFunc.getIpInfo = function (timeout) {
    let ipInfo = {}
    try {
        timeout = typeof (timeout) == "number" ? timeout : 1000 * 30
        ipInfo = newThread(function () {
            let res = http.get("http://ip-api.com/json/", {
                headers: {
                    'User-Agent': commonFunc.getRandomUA()
                }
            })
            return res.body.json()
        }, {}, timeout, () => { throw "超时退出" })
    } catch (error) { log("  http://ip-api.com/json/: " + commonFunc.objectToString(error)) }
    ip = ipInfo.query
    return ip
}
/**
 * 从 https://www.ip.cn 获取 Bypass 网络IP
 * @param {*} timeout 
 * @returns ip
 */
httpUtilFunc.getLocalIp = function (timeout) {
    let ip = null
    timeout = typeof (timeout) == "number" ? timeout : 1000 * 30
    let res = http.get("https://api.ipify.org/?format=json", {
        "headers": {
            'User-Agent': commonFunc.getRandomUA()
        }
    })
    if (res.statusCode == 200) {
        res = res.body.json()
        return res.ip
    }
}

/**
 * 从 https://api.ipify.org 或 https://www.whatismyip.com 获取当前网络IP
 * @param {*} timeout 
 * @returns ip
 */
httpUtilFunc.getGlobalIp = function (timeout) {
    let ip = null
    try {
        timeout = typeof (timeout) == "number" ? timeout : 1000 * 30
        ip = commonFunc.newThread(function () {
            let res = http.get("https://api.ipify.org/?format=json", {
                "headers": {
                    'User-Agent': commonFunc.getRandomUA()
                }
            })
            if (res.statusCode == 200) {
                res = res.body.json()
                return res.ip
            }
            throw res.statusCode
        }, null, timeout, () => { throw "超时退出" })
    } catch (error) { log("    https://api.ipify.org/?format=json: request error ") }
    try {
        ip = ip || commonFunc.newThread(function () {
            let res = http.get("https://ipinfo.io/json", {
                "headers": {
                    'User-Agent': commonFunc.getRandomUA()
                }
            })
            if (res.statusCode == 200) {
                res = res.body.json()
                return res.ip
            }
            throw res
        }, null, timeout, () => { throw "超时退出" })
    } catch (error) { log("    https://ipinfo.io/json: request error ") }
    try {
        ip = ip || commonFunc.newThread(function () {
            let res = http.get("https://ifconfig.me/", {
                "headers": {
                    'User-Agent': commonFunc.getRandomUA()
                }
            })
            res = res.body.string()
            let reg = new RegExp(/id="ip_address">([^<]+)/)
            if (reg.test(res)) {
                return res.match(reg)[1]
            }
            throw res
        }, null, timeout, () => { throw "超时退出" })
    } catch (error) { log("    https://ifconfig.me/ request error ") }
    try {
        ip = ip || commonFunc.newThread(function () {
            let res = http.get("https://www.whatismyip.com/", {
                "headers": {
                    'User-Agent': commonFunc.getRandomUA()
                }
            })
            res = res.body.string()
            let reg = new RegExp(/Detailed information about IP address ([^"]+)/)
            if (reg.test(res)) {
                return res.match(reg)[1]
            }
            throw res
        }, null, timeout, () => { throw "超时退出" })
    } catch (error) { log("    https://www.whatismyip.com/ request error ") }
    return ip

}


httpUtilFunc.isUrlAccessable = function (url, flag_content, timeout) {
    let is_accessable = false
    try {
        let errMsg = null
        log("访问网址：" + url)
        let timeout = typeof (timeout) == "number" ? timeout : 1000 * 60 * 2
        let thread = threads.start(function () {
            try {
                let res = http.get(url)
                res = res.body.string()
                if (res.indexOf(flag_content) != -1) {
                    is_accessable = true
                }
            } catch (error) {
                // log( "访问异常: " + JSON.stringify(error) )
                errMsg = error
            }
        })
        thread.join(timeout)
        thread.interrupt()
        if (errMsg) { throw errMsg }
    } catch (error) {
        // log( JSON.stringify( error ) )
        throw error
    }
    log("访问结果：" + is_accessable)
    return is_accessable
}
httpUtilFunc.randomAnswer = function () {
    //  http://random-answer.goodplace.eu/
    return newThread(function () {
        try {
            var result = http.get("http://random-answer.goodplace.eu/");
            result = result.body.string();
            result = result.match('style="text-decoration: none">"(.*)"</a>')[1]
            // log( result )
            return result
        } catch (error) { }
    }, null, 10000)
}
httpUtilFunc.randomEmojis = function (num) {
    let str = ""
    try {
        num = typeof (num) == "number" ? num : 1
        let emojis = require("./randomData.js").emojis
        for (let index = 0; index < num; index++) {
            str = str + emojis[random(0, emojis.length - 1)]
        }
    } catch (error) { log(JSON.stringify(error)) }
    return str
}
httpUtilFunc.randomJoke = function () {
    //  http://random-answer.goodplace.eu/
    return newThread(function () {
        try {
            var result = http.get("https://geek-jokes.sameerkumar.website/api?format=json");
            result = result.body.json();
            result = result.joke
            result = result.replace("Chuck Norris", "")
            // log( result )
            return result
        } catch (error) { }
    }, null, 15000)
}
httpUtilFunc.randomSentence = function () {
    try {
        let sentences = require("./randomData.js").sentences
        return sentences[random(0, sentences.length - 1)]
    } catch (error) { }
    return null
}
httpUtilFunc.randomWd = function () {
    var result = http.get("http://39.97.173.173:82/api/randomName?key=%E4%B8%AD");
    var resultJson = result.body.json();
    var content = resultJson["data"]
    content = content.substr(content.length - 1, 1)
    return content
}

httpUtilFunc.randomMingyan = function () {
    var result = http.get("https://v1.alapi.cn/api/mingyan");
    var resultJson = result.body.json();
    var content = resultJson["data"]["content"]
    return content
}

httpUtilFunc.randomName = function () {
    return newThread(function () {
        try {
            var result = http.get("https://namey.muffinlabs.com/name.json?count=1&with_surname=true&frequency=common");
            var resultJson = result.body.json();
            var name = resultJson[0]
            return name
        } catch (error) { }
    }, null, 10000)
    // 示例:  ["James Allen","David Hill","Sarah Perry","Michael Ford"]
}
httpUtilFunc.randomUserDetail = function () {
    return newThread(function () {
        try {
            var result = http.get("https://randomuser.me/api/");
            var resultJson = result.body.json();
            var userDetail = resultJson["results"][0]
            return userDetail
        } catch (error) { }
    }, null, 10000)
    // 示例:  {"results":[{"gender":"male","name":{"title":"Mr","first":"Leo","last":"Crawford"},"location":{"street":{"number":3030,"name":"Taylor St"},"city":"Wollongong","state":"Northern Territory","country":"Australia","postcode":2468,"coordinates":{"latitude":"-85.4453","longitude":"-44.6631"},"timezone":{"offset":"+6:00","description":"Almaty, Dhaka, Colombo"}},"email":"leo.crawford@example.com","login":{"uuid":"92c4df59-468c-4380-8e26-9c2d34e96efc","username":"bluegorilla653","password":"teaser","salt":"rzIWpHbq","md5":"7d2696223a78c4580b8e6c2f842fbeb9","sha1":"740cfbb52c4b08fa5490ad4a309805ca994ff822","sha256":"082a677fad6b4c1c0d0746f2d47f8d00f54c7983384830d61ea5cf766a55f8db"},"dob":{"date":"1986-08-31T06:31:26.426Z","age":35},"registered":{"date":"2004-12-13T06:32:09.056Z","age":17},"phone":"02-2954-8981","cell":"0415-652-217","id":{"name":"TFN","value":"963820663"},"picture":{"large":"https://randomuser.me/api/portraits/men/82.jpg","medium":"https://randomuser.me/api/portraits/med/men/82.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/82.jpg"},"nat":"AU"}],"info":{"seed":"ef340505dc7f98b9","results":1,"page":1,"version":"1.3"}}
}
httpUtilFunc.randomUserInfo = function () {
    let userInfo = null
    try {
        var user = httpUtilFunc.randomUserDetail()
        userInfo = {
            "gender": user.gender,
            "name": user.name.first + " " + user.name.last,
            "birthday": user.dob.date.match(/(\d\d\d\d-\d\d-\d\d)/)[0],
            // "email"     : user.email,    
            "picture": user.picture.large
        }
    } catch (error) { }
    return userInfo
}
httpUtilFunc.reportLog = function (context, logType) {
    let is_upload = false
    try {
        let errMsg = ""
        context = typeof (context) == "object" ? JSON.stringify(context) : context
        log("  " + context)
        let rep_thread = threads.start(function () {
            try {
                let log_type = logType != null ? logType : 0
                // let url = "http://192.168.91.3:83/api/logger/rptlogs"
                // let url = "http://172.16.0.100:83/api/logger/rptlogs"
                let url = "http://" + commonFunc.server + ":83/api/logger/rptlogs"
                let data = {
                    "AndroidId": commonFunc.androidId,
                    "mobile_no": commonFunc.deviceId,
                    "user_id": commonFunc.folderId,
                    "task_id": commonFunc.taskid,
                    "log_type": log_type,
                    "log_content": context
                }
                let res = http.postJson(url, data);
                res = res.body.json()
                if (res.code == 200) {
                    // log( "    上报日志成功" )
                    is_upload = true
                    return true
                } else {
                    throw res
                }
            } catch (error) {
                log("  " + JSON.stringify(error))
            }
        })
        rep_thread.join(1000 * 5)
        rep_thread.interrupt()
    } catch (error) { log("  " + JSON.stringify(error)) }
    if (!is_upload) {
        log("  上报结果：" + is_upload)
    }
    return is_upload
}
/**
 * 
 * @param {*} device_list 设备id列表
 * @returns 
 */
httpUtilFunc.taskEnvironmentFolderListGet = function (device_list) {
    try {
        let data = commonFunc.isNotNullObject(device_list) ? device_list : [device_list]
        let url = "http://" + commonFunc.server + ":83/DataFolder/list"
        let res = http.postJson(url, data)
        res = res.body.json()
        if (res.code == 1) {
            // httpUtilFunc.reportLog( "解绑设备: " + commonFunc.deviceId+"-"+commonFunc.folderId )
            return res.detail.items
        }
        throw res
    } catch (error) {
        // httpUtilFunc.reportLog("解绑设备异常: " + commonFunc.objectToString(error))
        throw error
    }
}
/**
 * 群控后台设备分区解绑   -- 本接口属于极度敏感操作!!!  请务必谨慎, 确保您非常明确该接口产生的后果
 * @returns 
 */
httpUtilFunc.taskEnvironmentFolderUnbind = function () {
    try {
        // http://192.168.1.100:83/Environment/Unbind?deviceid=gxl4000&dataFolderId=4
        let url = "http://" + commonFunc.server + ":83/Environment/Unbind?deviceid=" + commonFunc.deviceId + "&dataFolderId=" + commonFunc.folderId
        let res = http.post(url, {})
        res = res.body.json()
        if (res.code == 1) {
            // httpUtilFunc.reportLog( "解绑设备: " + commonFunc.deviceId+"-"+commonFunc.folderId )
            return res
        }
        throw res
    } catch (error) {
        // httpUtilFunc.reportLog("解绑设备异常: " + commonFunc.objectToString(error))
        throw error
    }
    // return false    
}
httpUtilFunc.taskStop = function (taskid, desc) {
    try {
        taskid = commonFunc.taskid
        desc = commonFunc.objectToString(desc)
        httpUtilFunc.reportLog("强制停止任务: " + commonFunc.taskid + " - " + desc)
        let url = "http://" + commonFunc.server + ":83/task/stoptask?taskid=" + taskid
        let res = http.post(url)
        res = res.body.json()
        if (res.code == 1) {
            httpUtilFunc.reportLog("停止任务成功: " + commonFunc.taskid)
            return true
        }
        throw res
    } catch (error) {
        httpUtilFunc.reportLog("停止任务异常: " + commonFunc.taskid + " - " + commonFunc.objectToString(error))
    }
    return false
}
httpUtilFunc.testGlobalNetwork = function () {

}
httpUtilFunc.testLocalNetwork = function () {

}
httpUtilFunc.testTaskServer = function () {
    try {
        let deviceId = commonFunc.deviceId
        let folderId = commonFunc.folderId
        let url = "http://" + commonFunc.server + ":8000/user/search?datatype=5&appName=" + "testTaskServer" + "&deviceId=" + deviceId + "&folderId=" + folderId
        this.reportLog("业务后台连接检测: " + url)
        let res = http.get(url);
        res = res.body.json()
        if (res.code != 200 || !res.data) { throw res }
        // this.reportLog( "业务后台连接正常" )
        return true
    } catch (error) { throw "业务后台连接异常: " + commonFunc.objectToString(error) }
}
httpUtilFunc.updateDevice = function (appName, proxyData, accountData) {
    try {
        return newThread(() => {
            let data = {
                "deviceId": commonFunc.deviceId,
                "folderId": commonFunc.folderId,
                "appName": appName,
            }
            if (proxyData) {
                log(commonFunc.objectToString(proxyData))
                data.proxyId = proxyData.proxyId || proxyData.id || null
                data.proxy = proxyData.proxy || null
            }
            if (accountData) {
                log(commonFunc.objectToString(accountData))
                data.accountId = accountData.accountId || accountData.id || null
            }
            // "proxyId": proxyData.proxyId,
            // "proxy": proxyData.proxy,
            // "accountId": isNotNullObject(accountData) ? accountData.accountId : null,
            httpUtilFunc.reportLog("更新设备绑定账号: " + commonFunc.objectToString(data))
            let url = "http://" + commonFunc.server + ":8000/proxy/updatedevice"
            var res = http.postJson(url, data);
            res = res.body.json()
            httpUtilFunc.reportLog("更新设备绑定结果: " + commonFunc.objectToString(res.data))
            if (res.code != 200) { throw res }
            return JSON.parse(res.data)
        }, null, 1000 * 10)
        // } catch (error) { httpUtilFunc.reportLog( "更新设备绑定异常: " + commonFunc.objectToString(error) ) }
    } catch (error) { throw "更新设备绑定异常: " + commonFunc.objectToString(error) }
    // return null
}

httpUtilFunc.init()
module.exports = httpUtilFunc;