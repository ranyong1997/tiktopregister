var httpUtilFunc = require("../http/httpUtils.js");
var commonFunc = {};
//  用于系统设置
importClass(android.provider.Settings);
importClass(android.content.Context);
importClass(java.util.TimeZone);
importClass(java.util.Locale);
importClass(android.app.backup.BackupManager);
importClass(android.app.ActivityManager);
//初始化
commonFunc.init = function () {
    log("初始化 commonFunc")
    if (commonFunc.folderId != null) { return }
    //  获取服务器地址
    try {
        commonFunc.server = "192.168.91.3"
        commonFunc.server = shell("getprop cltest.config.running.task.server").result.replace(/[\r\n\s]/g, "").match(/(\d+\.\d+\.\d+\.\d+)\:\d+/)[1]
        log("  server  = " + commonFunc.server)
    } catch (error) { }
    //  获取任务id
    try {
        commonFunc.taskid = ""
        commonFunc.taskid = shell("getprop cltest.config.running.task.id").result.replace(/[\r\n\s]/g, "")
        log("  taskid  = " + commonFunc.taskid)
    } catch (error) { }
    //  获取设备名称
    try {
        commonFunc.brand = ""
        commonFunc.brand = shell("getprop cltest.test.ro.product.brand").result.replace(/[\r\n\s]/g, "")
        log("  brand   = " + commonFunc.brand)
    } catch (error) { }
    //  获取设备型号
    try {
        commonFunc.model = ""
        commonFunc.model = shell("getprop cltest.test.ro.product.model").result.replace(/[\r\n\s]/g, "")
        log("  model   = " + commonFunc.model)
    } catch (error) { }
    //  获取设备id
    try {
        commonFunc.deviceId = -1
        commonFunc.deviceId = shell("getprop gsm.serial").result.replace(/[\r\n\s]/g, "")
    } catch (error) { }
    //  获取用户id
    try {
        commonFunc.userId = -1
        commonFunc.userId = shell("am get-current-user").result.replace(/[\r\n\s]/g, "")
    } catch (error) { }
    //  获取安卓id
    try {
        commonFunc.androidId = -1
        // commonFunc.androidId = shell("getprop gsm.serial").result.replace(/[\r\n\s]/g, "")
        importClass(android.provider.Settings);
        commonFunc.androidId = Settings.Secure.getStringForUser(context.getContentResolver(), "cltest.test.android_id", commonFunc.userId);
    } catch (error) { }
    //  获取分区id
    try {
        commonFunc.folderId = -1
        let folders = shell("pm list users").result.replace(/[\r\n\s]/g, "")
        commonFunc.folderId = folders.match(/.*folderId-(\d+):.*running/)[1]
    } catch (error) { }
    try {
        // commonFunc.happybayVersion = context.getPackageManager().getPackageInfo("com.happybay.machine.change",0).versionName
        let happybayVersion = shell("dumpsys package com.happybay.machine.change | grep versionName")
        // commonFunc.happybayVersion = happybayVersion.result.match(/versionName=(.+)\n/)[1] 
        commonFunc.happybayVersion = happybayVersion.result.match(/versionName=([^\s]+)/)[1]
    } catch (error) { }
    try {
        commonFunc.jsengineVersion = context.getPackageManager().getPackageInfo("com.yx.jsengine", 0).versionName
    } catch (error) { }

    try {
        let date = new Date();
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        // log("==========      " + "commonFunc.init()" + "      ==========  ")
        log("")
        log("==========      " + Y + M + D + "      ==========  ")
        log("==========     当前分区 - " + (commonFunc.folderId < 10 ? "0" + commonFunc.folderId : commonFunc.folderId) + "      ==========  ")
    } catch (error) { }
    //  初始化任务结果日志
    try {
        files.createWithDirs("/storage/emulated/obb/logs/" + commonFunc.taskid + ".log");
        log("    TaskResult init: " + files.write("/storage/emulated/obb/logs/" + commonFunc.taskid + ".log", ""))
    } catch (error) { log("TaskResult init: " + error) }
}
/**
 * 给应用开启权限
 * @return Boolean
 */
commonFunc.accessPermissions = function (bid) {
    try {
        if (bid) {
            app.openAppSetting(bid)
            this.shortSleep()
            if (this.clickIfWidgetExists(text("权限").findOne(3000))) {
                this.shortSleep()
                let last_value = null
                while (id("android:id/switch_widget").findOne(3000)) {
                    this.shortSleep()
                    let btn_list = id("android:id/switch_widget").text("关闭").visibleToUser().find()
                    for (let idx_btn = 0; idx_btn < btn_list.length; idx_btn++) {
                        this.clickIfWidgetExists(btn_list[idx_btn])
                        this.shortSleep()
                    }
                    this.shortSleep()
                    let title_list = id("android:id/title").visibleToUser().find()
                    if (!title_list.length || last_value == title_list[title_list.length - 1].text()) {
                        break
                    } else {
                        last_value = title_list[title_list.length - 1].text()
                        this.scrollShortUp()
                    }
                }
                if (last_value) {
                    log(bid + " 应用权限已全部开启")
                    return true
                }
            }
        }
    } catch (error) { }
    log(bid + " 应用权限查看失败")
    return false
}
/**
 * 追加联系人通讯录 
 * @return Boolean
 */
commonFunc.appendContactWithPhone = function (phone, alias) {
    try {
        if (!phone) { throw "添加联系人 号码为空" }
        alias = alias ? alias : phone
        let add_list = [
            {
                "contactId": null,
                "displayName": alias,
                "phone": [phone]
            }
        ]
        return SLContact.appendContact(JSON.stringify(add_list))
    } catch (error) { throw error }
}
/**
 * 批量追加联系人通讯录 
 * @return Boolean
 */
commonFunc.appendContactWithTable = function (tab) {
    try {
        if (!tab) { throw "添加联系人 列表为空" }
        return SLContact.appendContact(JSON.stringify(tab))
    } catch (error) { throw error }
}
/*
    * 
*/
commonFunc.appendTaskResult = function (result) {
    try {
        if (result) {
            files.append("/storage/emulated/obb/logs/" + commonFunc.taskid + ".log", commonFunc.objectToString(result) + "\n")
            return true
        }
    } catch (error) { log("appendTaskResult Error: " + error) }
    return false
}

//判读分辨率是基准分辨率的倍数 控制脚本点击
commonFunc.checkDevice = function () {
    nowHeight = device.height
    nowWidth = device.width
}
commonFunc.clearData = function (bid) {
    try {
        log("清除数据: " + bid)
        try {
            shell("am force-stop " + bid)
            sleep(500)
        } catch (error) { }
        app.openAppSetting(bid)
        packageName("com.android.settings").findOne(7000)
        sleep(1000)
        if (this.clickIfWidgetExists(text("Storage").findOne(5000))) {
            sleep(1000)
        }
        if (this.clickIfWidgetClickable(text("CLEAR DATA").findOne(5000))) {
            sleep(1000)
            if (this.clickIfWidgetClickable(text("OK").findOne(5000))) {
                sleep(2000)
                log("清除数据: 完成")
                back()
                sleep(200)
                back()
                sleep(200)
                back()
                sleep(500)
                return true
            }
        }
    } catch (error) {
        log("清除数据: 失败-" + JSON.stringify(error))
    }
    back()
    sleep(200)
    back()
    sleep(200)
    back()
    sleep(500)
    return false
}
commonFunc.clickIfWidgetExists = function (widget) {
    try {
        return widget.visibleToUser() && click(random(widget.bounds().centerX() - 3, widget.bounds().centerX() + 3), random(widget.bounds().centerY() - 3, widget.bounds().centerY() + 3))
    } catch (error) { }
    return false
}

commonFunc.clickIfWidgetClickable = function (widget) {
    try {
        return widget.click()
    } catch (error) { }
    return false
}
/**
 * clickIfParentsClickable 从当前节点逐层向父节点查找, 直到找到可点击的控件( 即 clickable 属性为 true ), 点击它并返回结果
 * @param {Object} widget 目标节点
 * @returns {Boolean} 返回点击结果
 */
commonFunc.clickIfParentsClickable = function (widget) {
    if (!widget) { return false }
    if (widget.clickable()) { return widget.click() }
    if (widget.parent()) { return commonFunc.clickIfParentsClickable(widget.parent()) }
    return false
}
commonFunc.debugWidget = function (widget, flag) {
    flag = flag != null ? flag : 0
    if (widget) {
        let prefix = ""
        for (let idx = 0; idx < flag; idx++) {
            prefix = prefix + "  "
        }
        log("  " + prefix + flag + " " + widget.bounds() + " " + widget.id() + " " + widget.className() + " - " + widget.text() + " - " + widget.desc() + " - " + widget.checked() + " - " + widget.selected() + " - " + widget.clickable() + " - " + widget.visibleToUser())
        if (widget.childCount()) {
            log(prefix + "  " + " \\" + widget.childCount())
            widget.children().forEach(child => {
                commonFunc.debugWidget(child, flag + 1)
            });
        }
    }
}
commonFunc.getAppVersionName = function (bid) {
    try {
        return context.getPackageManager().getPackageInfo(bid, 0).versionName
    } catch (error) { }
    return null
}
commonFunc.getmd5 = function (content) {
    try {
        return commonFunc.md5(content)
    } catch (error) { log("获取 MD5 出错：" + JSON.stringify(error)) }
    return null
}
commonFunc.isNotNullObject = function (obj) {
    return obj != null && typeof (obj) == "object"
}

/**
 * 安装apk
 * @return Boolean
 */
commonFunc.installApk = function (filepath, max_timeout) {
    try {
        max_timeout = typeof (max_timeout) == "number" ? max_timeout : 120000    //  默认超时时间为 2 分钟
        return commonFunc.newThread(() => {
            log("installApp " + filepath)
            let userId = shell("am get-current-user")
            let install = shell("pm install -r -d -i com.yx.jsengine --user " + userId.result.trim() + " " + filepath)
            log("installApp " + install)
            return install.result.trim() == "Success"
        }, false, max_timeout)
    } catch (error) {
        log("installApp " + JSON.stringify(error))
    }
    return false
}


// 安装xapk New
commonFunc.installApkNew = function (installFilePath) {
    toastLog("安装xapk");
    // let result = SLChanges.installApp("/storage/emulated/0/Facebook_v348.apk");
    // toastLog("result" + result)
    for (let i = 1; i < 4; i++) {
        try {
            var installResult = JSON.parse(SLChanges.installApp(installFilePath));
            log("尝试第" + i + "次安装")
            if (installResult.code < 200) {
                toastLog("安装xapk失败" + installResult);
                throw "安装xapk失败: " + installResult
            }
            toastLog("安装xapk成功");
            return true
        } catch (error) {
            throw "安装xapk异常: " + commonFunc.objectToString(error)
        }
    }
}



/**
 * 卸载apk
 * @return Boolean
 */
commonFunc.uninstallApp = function (bid) {
    try {
        log("uninstallApp " + bid)
        context.getPackageManager().deletePackageAsUser(bid, null, 0, commonFunc.userId)
        sleep(5000)
    } catch (error) {
        log("uninstallApp " + JSON.stringify(error))
    }
    return !app.getAppName(bid) ? true : false
}

/**
 * 安装tiktok
 * @return Boolean
 */
commonFunc.tiktokInstall = function (url) {
    if (!app.getAppName("com.zhiliaoapp.musically")) {
        if (!httpUtilFunc.downloadFile(url, "/storage/emulated/obb/Tiktok_v19.2.4", 1000 * 60, false) || !commonFunc.installApkNew("/storage/emulated/obb/Tiktok_v19.2.4", 1000 * 60)) {
            return false
        }
    }
    return true
}

/**
 * 安装facebook
 * @return Boolean
 */
commonFunc.facebookInstall = function (url) {
    if (!app.getAppName("com.facebook.katana")) {
        if (!httpUtilFunc.downloadFile(url, "/storage/emulated/obb/Facebook_v348", 1000 * 60, false) || !commonFunc.installApk("/storage/emulated/obb/Facebook_v348", 1000 * 60)) {
            return false
        }
    }
}

/**
 * facebook账号迁移
 */
commonFunc.Facebook_Account_Transfer = function (facebook_packageName, androidId) {
    var trans = JSON.parse(SLChanges.transferApp(facebook_packageName, androidId))
    log(trans)
    if (trans.code != 200) { throw "restore fail" }
}

/*
    * Javascript md5() 函数 用于生成字符串对应的md5值
    * 吴先成  www.51-n.com ohcc@163.com QQ:229256237
    * @param string string 原始字符串
    * @return string 加密后的32位md5字符串
*/
commonFunc.md5 = function (string) {
    function md5_RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function md5_AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function md5_F(x, y, z) {
        return (x & y) | ((~x) & z);
    }
    function md5_G(x, y, z) {
        return (x & z) | (y & (~z));
    }
    function md5_H(x, y, z) {
        return (x ^ y ^ z);
    }
    function md5_I(x, y, z) {
        return (y ^ (x | (~z)));
    }
    function md5_FF(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_GG(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_HH(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_II(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    function md5_WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };
    function md5_Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = md5_Utf8Encode(string);
    x = md5_ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = md5_AddUnsigned(a, AA);
        b = md5_AddUnsigned(b, BB);
        c = md5_AddUnsigned(c, CC);
        d = md5_AddUnsigned(d, DD);
    }
    return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
}
/**
 * 开启一个定时循环线程
 * doBusiness 业务回调函数
 * result 默认返回值
 * timeout 线程超时时间（毫秒）
 */
commonFunc.newInterval = function (doBusiness, result, times, interval) {
}

/**
 * newThread 开启一个阻塞线程
 * @param {Function} doBusiness 业务回调函数
 * @param {any} result 默认返回值
 * @param {Number=12000} timeout 线程超时时间（毫秒）
 * @param {Function} timeoutCall 线程超时回调
 */
commonFunc.newThread = function (doBusiness, result, timeout, timeoutCall) {
    let errMsg = null
    let result = result
    let timeout = typeof (timeout) == "number" ? timeout : 120000    //  默认超时时间为 2 分钟
    let doBusiness = typeof (doBusiness) == "function" ? doBusiness : () => { }
    let timeoutCall = typeof (timeoutCall) == "function" ? timeoutCall : () => { }
    let is_timeout = true
    let thread = threads.start(function () {
        try {
            result = doBusiness()
        } catch (error) {
            errMsg = error
        }
        is_timeout = false
    })
    thread.join(timeout)
    thread.interrupt()
    if (errMsg) { throw errMsg }
    try { is_timeout && timeoutCall() } catch (error) { throw error }
    return result
}

/**
 * 随机等待
 */
commonFunc.randomSleep = function (dur1, dur2) {
    if (dur2) {
        sleep(random(dur1, dur2))
    } else if (dur1) {
        sleep(random(dur1 * 0.5, dur1 * 1.5))
    }
    else {
        sleep(random(500, 1500))
    }
    return true
}

/**
 * 随机字符串
 */
commonFunc.randomStr = function (len) {
    len = len || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (i = 0; i < len; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

/**
 * 随机数字
 */
commonFunc.randomStrInStr = function (str, len) {
    let res = ""
    let s = typeof (str) == "string" ? str : "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890"
    let n = len || 6;
    let l = s.length
    for (i = 0; i < n; i++) res += s.charAt(Math.floor(Math.random() * l));
    return res
}
/*
* Javascript swipeWithBezier() 函数 按贝塞尔曲线轨迹滑动
*/
commonFunc.swipeWithBezier = function (x1, y1, x2, y2, step) {
    let w = device.width
    let h = device.height

    function bezier_curves(cp, t) {
        cx = 3.0 * (cp[1].x - cp[0].x);
        bx = 3.0 * (cp[2].x - cp[1].x) - cx;
        ax = cp[3].x - cp[0].x - cx - bx;
        cy = 3.0 * (cp[1].y - cp[0].y);
        by = 3.0 * (cp[2].y - cp[1].y) - cy;
        ay = cp[3].y - cp[0].y - cy - by;

        tSquared = t * t;
        tCubed = tSquared * t;
        result = { "x": 0, "y": 0 };
        result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
        result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
        return result;
    };
    function sml_move(qx, qy, zx, zy, time) {
        //仿真随机带曲线滑动: qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,过程耗时单位毫秒
        let xxy = [time];
        let point = [
            { "x": qx, "y": qy },
            { "x": random(qx - 100, qx + 100), "y": random(qy, qy + 50) },
            { "x": random(zx - 100, zx + 100), "y": random(zy, zy + 50) },
            { "x": zx, "y": zy }
        ];
        for (let i = 0; i < 1; i += 0.08) {
            xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)]
            xxy.push(xxyy);
        }
        gesture.apply(null, xxy);
    }
    // sml_move(w / 2, h * 0.75 + h * random() * 0.1, w / 2, h * 0.15, 400 + 100 * random());
    // down ? sml_move(w / 2, h * 0.5, w / 2, h * 0.85, 450) : sml_move(w / 2, h * 0.85, w / 2, h * 0.5, 450);
    sml_move(x1, y1, x2, y2, step)
}

/**
 * 上滑一小段
 */
commonFunc.swipeUpSlowly = function () {
    log("上滑一小截1次");
    var time_random = random(50, 200);
    var x1 = parseInt(device.width / (random(15, 25) / 10));
    var y1 = parseInt(device.height * (random(70, 82) / 100));
    var x2 = parseInt(device.width / (random(15, 25) / 10));
    var y2 = parseInt(device.height * (random(20, 32) / 100));
    var duration = random(3000, 5000);
    swipe(x1, y1, x2, y2, duration);
    sleep(time_random);
}

/**
 * 下滑一小段
 */
commonFunc.swipeDownSlowly = function () {
    log("下滑一小截1次");
    var time_random = random(50, 200);
    var x1 = parseInt(device.width / (random(15, 25) / 10));
    var y1 = parseInt(device.height * (random(70, 82) / 100));
    var x2 = parseInt(device.width / (random(15, 25) / 10));
    var y2 = parseInt(device.height * (random(30, 42) / 100));
    var duration = random(3000, 5000);
    swipe(x2, y2, x1, y1, duration);
    sleep(time_random);
}


/**
 * 更改系统语言
 */
commonFunc.switchLanguage = function (language, country) {
    return this.newThread(() => {
        try {
            country = country != null ? country : ""
            let is_add = false
            app.launch("com.android.settings")
            sleep(1000)
            while (true) {
                if (desc("Search settings").findOne(3000) || text("Language preferences").findOne(1)) {
                    log("系统语言: English")
                    back()
                    sleep(1000)
                    return true
                }
                else if (text("语言偏好设置").findOne(1)) {
                    if (is_add) {
                        if (this.clickIfWidgetClickable(desc("更多选项").findOne(3000))) {
                            sleep(1000)
                            if (this.clickIfWidgetExists(idContains("title").text("移除").findOne(3000))) {
                                sleep(2000)
                                let language_list = idContains("checkbox").find()
                                //  English (United States)
                                for (let idx_language = 0; idx_language < language_list.length; idx_language++) {
                                    let btn = language_list[idx_language]
                                    if (!new RegExp(language + ".*" + country + ".*").test(btn.text())) {
                                        this.clickIfWidgetClickable(btn)
                                        sleep(1000)
                                    }
                                }
                                this.clickIfWidgetClickable(desc("移除").clickable().findOne(3000))
                                sleep(1000)
                                this.clickIfWidgetClickable(text("确定").clickable().findOne(3000))
                                sleep(1000)
                            }
                        }
                    } else {
                        let added_list = id("com.android.settings:id/label").find()
                        for (let index = 0; index < added_list.length; index++) {
                            let btn = added_list[index]
                            log(btn.text())
                            if (new RegExp(language + ".*" + country + ".*").test(btn.text())) {
                                is_add = true
                                log(is_add)
                                break
                            }
                            sleep(1000)
                        }
                        if (!is_add && this.clickIfWidgetClickable(idContains("add_language").findOne(3000))) {
                            if (this.clickIfWidgetClickable(idContains("locale_search_menu").findOne(3000))) {
                                sleep(2000)
                                setText("English")
                                sleep(2000)
                                if (this.clickIfWidgetClickable(idContains("locale").text(language).clickable().findOne(3000))) {
                                    if (text("语言偏好设置").findOne(3000)) {
                                        is_add = true
                                    }
                                    else if (country && text(language).clickable(false).findOne(1)) {
                                        for (let index = 0; index < 10; index++) {
                                            if (this.clickIfWidgetClickable(idContains("locale").text(country).findOne(3000))) {
                                                if (text("语言偏好设置").findOne(3000)) {
                                                    is_add = true
                                                }
                                                break
                                            }
                                            this.swipeUpSlowly()
                                        }
                                    }
                                    else {
                                        back()
                                    }
                                }
                            }
                        } else {
                            back()
                        }
                    }
                }
                else if (desc("在设置中搜索").findOne(1)) {
                    if (this.clickIfWidgetExists(idContains("title").text("系统").findOne(1))) {
                        if (this.clickIfWidgetExists(idContains("title").text("语言和输入法").findOne(3000))) {
                            if (this.clickIfWidgetExists(idContains("title").text("语言").findOne(3000))) {
                            }
                        }
                        else {
                            back()
                        }
                    } else {
                        this.swipeUpSlowly()
                    }
                }
                else if (!packageName("com.android.settings").findOne(1)) {
                    app.launch("com.android.settings")
                    sleep(3000)
                }
                else {
                    back()
                }
                sleep(1000)
            }
        } catch (error) { commonFunc.debugWidget(classNameStartsWith("android").findOne(1000)); throw "系统语言设置异常" + commonFunc.objectToString(error) }
    }, false, 1000 * 60)
}

commonFunc.objectToString = function (obj) {
    return typeof (obj) == "object" ? JSON.stringify(obj) : obj
}



































//脚本休眠时间控制
commonFunc.longSleep = function () {
    sleep(3100)
}
commonFunc.shortSleep = function () {
    sleep(1000)
}


commonFunc.commonClick = function (x, y) {
    click(x, y)
}

commonFunc.commonDoubleClick = function (x, y) {
    click(x, y)
    sleep(50)
    click(x, y)
}


commonFunc.commonSwipe = function (x1, y1, x2, y2, duration) {
    swipe(x1, y1, x2, y2, duration)
}


commonFunc.startApp = function (package) {
    var result = currentActivity(package)
    if (result.indexOf(package) > -1) {
        this.screenTip("already enter package - short sleep")
        launch("com.tencent.mm")
        this.shortSleep()
    } else {
        launch("com.tencent.mm")
        sleep(7000)
    }
    log(result)
}

/*
    * Javascript md5() 函数 用于生成字符串对应的md5值
    * 吴先成  www.51-n.com ohcc@163.com QQ:229256237
    * @param string string 原始字符串
    * @return string 加密后的32位md5字符串
*/
commonFunc.md5 = function (string) {
    function md5_RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function md5_AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function md5_F(x, y, z) {
        return (x & y) | ((~x) & z);
    }
    function md5_G(x, y, z) {
        return (x & z) | (y & (~z));
    }
    function md5_H(x, y, z) {
        return (x ^ y ^ z);
    }
    function md5_I(x, y, z) {
        return (y ^ (x | (~z)));
    }
    function md5_FF(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_GG(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_HH(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_II(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    function md5_WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };
    function md5_Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = md5_Utf8Encode(string);
    x = md5_ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = md5_AddUnsigned(a, AA);
        b = md5_AddUnsigned(b, BB);
        c = md5_AddUnsigned(c, CC);
        d = md5_AddUnsigned(d, DD);
    }
    return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
}
commonFunc.getmd5_old = function (content) {
    var result = http.get("http://39.97.173.173:82/api/md5?content=" + content);
    var resultJson = result.body.json();
    var content = resultJson["data"]
    return content
}
commonFunc.getmd5 = function (content) {
    try {
        return commonFunc.md5(content)
    } catch (error) { log("获取 MD5 出错：" + JSON.stringify(error)) }
    return null
}
/**
 * getDialCode 根据国家代码获取拨号代码
 * @param {String} countryCode 国家代码, 如 CN-中国; US-美国
 * @returns {String} dialCode 返回拨号代码, 如 86-中国; 1-美国
 */
commonFunc.getDialCode = function (country_code) {
    try {
        let _code = {
            "AO": "244",
            "AF": "93",
            "AL": "355",
            "DZ": "213",
            "AD": "376",
            "AI": "1264",
            "AG": "1268",
            "AR": "54",
            "AM": "374",
            "AU": "61",
            "AT": "43",
            "AZ": "994",
            "BS": "1242",
            "BH": "973",
            "BD": "880",
            "BB": "1246",
            "BY": "375",
            "BE": "32",
            "BZ": "501",
            "BJ": "229",
            "BM": "1441",
            "BO": "591",
            "BW": "267",
            "BR": "55",
            "BN": "673",
            "BG": "359",
            "BF": "226",
            "MM": "95",
            "BI": "257",
            "CM": "237",
            "CA": "1",
            "CF": "236",
            "TD": "235",
            "CL": "56",
            "CN": "86",
            "CO": "57",
            "CG": "242",
            "CK": "682",
            "CR": "506",
            "CU": "53",
            "CY": "357",
            "CZ": "420",
            "DK": "45",
            "DJ": "253",
            "DO": "1890",
            "EC": "593",
            "EG": "20",
            "SV": "503",
            "EE": "372",
            "ET": "251",
            "FJ": "679",
            "FI": "358",
            "FR": "33",
            "GF": "594",
            "GA": "241",
            "GM": "220",
            "GE": "995",
            "DE": "49",
            "GH": "233",
            "GI": "350",
            "GR": "30",
            "GD": "1809",
            "GU": "1671",
            "GT": "502",
            "GN": "224",
            "GY": "592",
            "HT": "509",
            "HN": "504",
            "HK": "852",
            "HU": "36",
            "IS": "354",
            "IN": "91",
            "ID": "62",
            "IR": "98",
            "IQ": "964",
            "IE": "353",
            "IL": "972",
            "IT": "39",
            "JM": "1876",
            "JP": "81",
            "JO": "962",
            "KH": "855",
            "KZ": "327",
            "KE": "254",
            "KR": "82",
            "KW": "965",
            "KG": "331",
            "LA": "856",
            "LV": "371",
            "LB": "961",
            "LS": "266",
            "LR": "231",
            "LY": "218",
            "LI": "423",
            "LT": "370",
            "LU": "352",
            "MO": "853",
            "MG": "261",
            "MW": "265",
            "MY": "60",
            "MV": "960",
            "ML": "223",
            "MT": "356",
            "MU": "230",
            "MX": "52",
            "MD": "373",
            "MC": "377",
            "MN": "976",
            "MS": "1664",
            "MA": "212",
            "MZ": "258",
            "NA": "264",
            "NR": "674",
            "NP": "977",
            "NL": "31",
            "NZ": "64",
            "NI": "505",
            "NE": "227",
            "NG": "234",
            "KP": "850",
            "NO": "47",
            "OM": "968",
            "PK": "92",
            "PA": "507",
            "PG": "675",
            "PY": "595",
            "PE": "51",
            "PH": "63",
            "PL": "48",
            "PF": "689",
            "PT": "351",
            "PR": "1787",
            "QA": "974",
            "RO": "40",
            "RU": "7",
            "LC": "1758",
            "VC": "1784",
            "SM": "378",
            "ST": "239",
            "SA": "966",
            "SN": "221",
            "SC": "248",
            "SL": "232",
            "SG": "65",
            "SK": "421",
            "SI": "386",
            "SB": "677",
            "SO": "252",
            "ZA": "27",
            "ES": "34",
            "LK": "94",
            "LC": "1758",
            "VC": "1784",
            "SD": "249",
            "SR": "597",
            "SZ": "268",
            "SE": "46",
            "CH": "41",
            "SY": "963",
            "TW": "886",
            "TJ": "992",
            "TZ": "255",
            "TH": "66",
            "TG": "228",
            "TO": "676",
            "TT": "1809",
            "TN": "216",
            "TR": "90",
            "TM": "993",
            "UG": "256",
            "UA": "380",
            "AE": "971",
            "GB": "44",
            "US": "1",
            "UY": "598",
            "UZ": "233",
            "VE": "58",
            "VN": "84",
            "YE": "967",
            "YU": "381",
            "ZW": "263",
            "ZR": "243",
            "ZM": "260",
        }
        return _code[country_code]
    } catch (error) { log("获取 拨号代码 出错：" + JSON.stringify(error)) }
    return null
}
/**
 * getRandomUA 获取一个随机浏览器 User-Agen
 * @param 
 * @returns
 */
commonFunc.getRandomUA = function () {
    let user_agents = [
        // PC端：
        // safari5.1–MAC
        "Mozilla/5.0(Macintosh;U;IntelMacOSX10_6_8;en-us)AppleWebKit/534.50(KHTML,likeGecko)Version/5.1Safari/534.50",

        // safari5.1–Windows
        "Mozilla/5.0(Windows;U;WindowsNT6.1;en-us)AppleWebKit/534.50(KHTML,likeGecko)Version/5.1Safari/534.50",

        // IE9.0
        "Mozilla/5.0(compatible;MSIE9.0;WindowsNT6.1;Trident/5.0;",

        // IE8.0
        "Mozilla/4.0(compatible;MSIE8.0;WindowsNT6.0;Trident/4.0)",

        // IE7.0
        "Mozilla/4.0(compatible;MSIE7.0;WindowsNT6.0)",

        // IE6.0
        "Mozilla/4.0(compatible;MSIE6.0;WindowsNT5.1)",

        // Firefox4.0.1–MAC
        "Mozilla/5.0(Macintosh;IntelMacOSX10.6;rv:2.0.1)Gecko/20100101Firefox/4.0.1",

        // Firefox4.0.1–Windows
        "Mozilla/5.0(WindowsNT6.1;rv:2.0.1)Gecko/20100101Firefox/4.0.1",

        // Opera11.11–MAC
        "Opera/9.80(Macintosh;IntelMacOSX10.6.8;U;en)Presto/2.8.131Version/11.11",

        // Opera11.11–Windows
        "Opera/9.80(WindowsNT6.1;U;en)Presto/2.8.131Version/11.11",

        // Chrome17.0–MAC
        "Mozilla/5.0(Macintosh;IntelMacOSX10_7_0)AppleWebKit/535.11(KHTML,likeGecko)Chrome/17.0.963.56Safari/535.11",

        // 傲游（Maxthon）
        "Mozilla/4.0(compatible;MSIE7.0;WindowsNT5.1;Maxthon2.0)",

        // 搜狗浏览器1.x
        "Mozilla/4.0(compatible;MSIE7.0;WindowsNT5.1;Trident/4.0;SE2.XMetaSr1.0;SE2.XMetaSr1.0;.NETCLR2.0.50727;SE2.XMetaSr1.0)",

        // 360浏览器
        "Mozilla/4.0(compatible;MSIE7.0;WindowsNT5.1;360SE)",

        // Avant
        "Mozilla/4.0(compatible;MSIE7.0;WindowsNT5.1;AvantBrowser)",

        // GreenBrowser
        "Mozilla/4.0(compatible;MSIE7.0;WindowsNT5.1)",
        // 移动设备端：
        // safariiOS4.33–iPhone
        "Mozilla/5.0(iPhone;U;CPUiPhoneOS4_3_3likeMacOSX;en-us)AppleWebKit/533.17.9(KHTML,likeGecko)Version/5.0.2Mobile/8J2Safari/6533.18.5",

        // safariiOS4.33–iPodTouch
        "Mozilla/5.0(iPod;U;CPUiPhoneOS4_3_3likeMacOSX;en-us)AppleWebKit/533.17.9(KHTML,likeGecko)Version/5.0.2Mobile/8J2Safari/6533.18.5",

        // safariiOS4.33–iPad
        "Mozilla/5.0(iPad;U;CPUOS4_3_3likeMacOSX;en-us)AppleWebKit/533.17.9(KHTML,likeGecko)Version/5.0.2Mobile/8J2Safari/6533.18.5",

        // AndroidQQ浏览器Forandroid
        "MQQBrowser/26Mozilla/5.0(Linux;U;Android2.3.7;zh-cn;MB200Build/GRJ22;CyanogenMod-7)AppleWebKit/533.1(KHTML,likeGecko)Version/4.0MobileSafari/533.1",

        // AndroidOperaMobile
        "Opera/9.80(Android2.3.4;Linux;OperaMobi/build-1107180945;U;en-GB)Presto/2.8.149Version/11.10",

        // AndroidPadMotoXoom
        "Mozilla/5.0(Linux;U;Android3.0;en-us;XoomBuild/HRI39)AppleWebKit/534.13(KHTML,likeGecko)Version/4.0Safari/534.13",
    ]
    return user_agents[random(0, user_agents.length - 1)]
}

/**
 * 上滑一下段
 */
commonFunc.scrollShortUp = function () {
    log("上滑一小截1次");
    var time_random = random(50, 200);
    var x1 = parseInt(device.width / (random(15, 25) / 10));
    var y1 = parseInt(device.height * (random(70, 82) / 100));
    var x2 = parseInt(device.width / (random(15, 25) / 10));
    var y2 = parseInt(device.height * (random(20, 32) / 100));
    var duration = random(850, 1220);
    swipe(x1, y1, x2, y2, duration);
    sleep(time_random);
}

/**
 * 下滑一下段
 */
commonFunc.scrollShortDown = function () {
    log("上滑一小截1次");
    var time_random = random(50, 200);
    var duration = random(850, 1220);
    swipe(224, 223, 224, 482, duration);
    sleep(time_random);
}

/**
 * 上滑一大段
 */
commonFunc.scrollLongUp = function () {
    log("上滑一大截1次");
    var time_random = random(50, 200);
    var x1 = parseInt(device.width * (random(20, 80) / 100));
    var y1 = parseInt(device.height * (random(70, 90) / 100));
    var x2 = parseInt(device.width * (random(20, 80) / 100));
    var y2 = parseInt(device.height * (random(15, 30) / 100));
    var duration = random(850, 1220);
    swipe(x1, y1, x2, y2, duration);
    sleep(time_random);
}

/**
 * 下滑一大段
 */
commonFunc.scrollLongDown = function () {
    log("下拉滑一大截1次");
    var time_random = random(50, 200);
    var x1 = parseInt(device.width * (random(20, 80) / 100));
    var y1 = parseInt(device.height * (random(15, 30) / 100));
    var x2 = parseInt(device.width * (random(20, 80) / 100));
    var y2 = parseInt(device.height * (random(70, 90) / 100));
    var duration = random(850, 1220);
    swipe(x1, y1, x2, y2, duration);
    sleep(time_random);
}

/**
 * 获取时区
 * 例如：America/Los_Angeles
 */
commonFunc.systemTimezoneGet = function () {
    log("当前时区:" + TimeZone.getDefault().getID())
    return TimeZone.getDefault().getID()
}

/**
 * 设置时区
 * 时区格式: America/Los_Angeles(废除)
 */
commonFunc.systemTimezoneSet = function (timeZone) {
    try {
        shell("setprop persist.sys.timezone " + timeZone);
        // 如果发布线上就将下行代码中的【context】改成=>Context
        Settings.Global.putInt(context.getContentResolver(), Settings.Global.AUTO_TIME_ZONE, 0);
        let am = context.getSystemService(Context.ALARM_SERVICE)
        log("设置时区: " + timeZone + " - " + am.setTimeZone(timeZone))
        return true
    } catch (error) {
        log("设置时区捕获一个错误:" + error)
        throw error
    }
}

/**
 * 设置时区
 * 时区格式: America/Los_Angeles
 */
commonFunc.systemTimezoneSet_New = function (timeZone) {
    try {
        log("设置时区");
        var systemTimezoneSet = JSON.parse(SLChanges.updateTimeZone(timeZone));
        if (systemTimezoneSet.code < 200) {
            throw "设置时区" + timeZone + "失败:" + systemTimezoneSet.msg
        }
        log("设置时区成功");
        return true
    } catch (error) {
        throw "设置时区异常: " + commonFunc.objectToString(error)
    }
}



/**
 * 检测控件是否存在
 */
commonFunc.checkWidgetExists = function (descOrText) {
    if (descContains(descOrText).exists()) {
        return true
    } else if (textContains(descOrText).exists()) {
        return true
    } else {
        return false
    }
}


commonFunc.clickWidget = function (descOrText) {
    try {
        // log("找到了")
        // log(descOrText)
        if (descContains(descOrText).exists()) {
            let tempWidget = descContains(descOrText).findOne(1000)
            commonFunc.commonClick(tempWidget.bounds().centerX(), tempWidget.bounds().centerY())
        } else if (textContains(descOrText).exists()) {
            let tempWidget = textContains(descOrText).findOne(1000)
            commonFunc.commonClick(tempWidget.bounds().centerX(), tempWidget.bounds().centerY())
        } else {
            this.screenTip("找不到")
            sleep(100)
        }
    }
    catch (error) {
        log("点击控件时捕获到一个错误:" + error)
    }
}



commonFunc.offsetClick = function (widget) {
    commonFunc.commonClick(random(widget.bounds().centerX() - 3, widget.bounds().centerX() + 3), random(widget.bounds().centerY() - 3, widget.bounds().centerY() + 3))
}

commonFunc.clickAlreadyFindWidget = function (widget) {
    commonFunc.commonClick(widget.bounds().centerX(), widget.bounds().centerY())
}


//脚本获取序列号
commonFunc.getSerial = function () {
    var result = shell("getprop gsm.serial");
    return result["result"]
}


commonFunc.setVolume = function (number) {
    device.setMusicVolume(number)
}


//控件比对
commonFunc.widgetCompare = function (widget1, widget2) {
    if (widget1.bounds().toString() == widget2.bounds().toString()) {
        return true
    } else {
        return false
    }
}


//根据分辨率放大  默认高度854
commonFunc.getMultiplyingPower = function () {
    var multiplyingPower = device.height / 854
    return multiplyingPower
}


/**
 * 清理后台程序
 */
commonFunc.cleanBakegroundApplication = function (_appName) {
    recents();
    sleep(1000);
    if (currentActivity() == "com.android.systemui.recents.RecentsActivity") {
        if (_appName != null) {
            let taskList = id("com.android.systemui:id/recents_view").findOne(3000);
            if (taskList != null) {
                taskList.children().forEach(function (child) {
                    toast("正在查找清除按钮");
                    var dismiss = child.findOne(desc("移除" + _appName + "。"));
                    sleep(3000);
                    if (dismiss != null) {
                        let left = Math.abs(dismiss.bounds().centerX());
                        let top = Math.abs(dismiss.bounds().centerY());
                        log("清除找到了left=" + left + "--top=" + top + "-->=" + dismiss.enabled());
                        click(left, top);
                        return;
                    } else {
                        toast("清除未找到");
                    }
                });
            } else {
                toast("未找到最近任务列表");
            }
        } else {
            let allCleanBtn = className("android.widget.Button").text("全部清除").findOne(3000);
            if (allCleanBtn != null) {
                allCleanBtn.click();
            } else {
                toast("未找到全部清除按钮");
            }
        }
    } else {
        toast("当前不在最近任务界面");
    }
}

commonFunc.uninstallApp = function (bid) {
    try {
        log("uninstallApp " + bid)
        context.getPackageManager().deletePackageAsUser(bid, null, 0, commonFunc.userId)
        sleep(5000)
    } catch (error) {
        log("uninstallApp " + JSON.stringify(error))
    }
    return !app.getAppName(bid) ? true : false
}

commonFunc.clickWidget = function (widget) {
    var b = widget.bounds()
    var left = b.left
    var right = b.right
    var top = b.top
    var bottom = b.bottom
    var width = right - left
    var height = bottom - top
    var xRandom = random(left + width / 4, right - width / 4)
    var yRandom = random(top + height / 4, bottom - height / 4)
    click(xRandom, yRandom)
}

commonFunc.inputEditText = function (index, textValue) {
    if (textValue != null) {
        var textLength = textValue.length
        var i = 0
        do {
            var inputText = textValue.slice(0, i + 1)
            setText(index, inputText)
            sleep(random(200, 1000))
            i++
        } while (i < textLength)
    }
}

commonFunc.randomNums = function (n, min, max) {
    var arr = [];
    for (i = 0; i < n; i++) {
        var ran = Math.ceil(Math.random() * (max - min) + min);
        while (isExist(arr, ran)) {
            ran = Math.ceil(Math.random() * (max - min) + min);
        }
        arr[i] = ran;
    }
    return arr;
}

commonFunc.resolutionWidthScale = function (px) {
    var widthScale = device.width / 720
    return Math.floor(px * widthScale)
}

commonFunc.resolutionHeightScale = function (px) {
    var heightScale = device.height / 1280
    return Math.floor(px * heightScale)
}

commonFunc.inputDigKeyboard = function (dig, width, top) {
    var scaleSize = width / 720
    var screenWidth = 720 * scaleSize
    //键盘上面的坐标，y轴
    var keyboardTop = top
    //键盘下面的坐标，y轴
    var keyboardBottom = 1174
    var keyboardHeight = 484 * scaleSize

    var leftRightMargin = 80 * scaleSize
    //左右俩边的margin 为80
    var columnWidth = screenWidth - leftRightMargin * 2
    //每个数字的左右间隔15
    var columnItemWidthMargin = 15 * scaleSize
    //每个数字的上下间隔 25
    // var columnItemHeightMargin = 25
    //每个数字的宽度
    var columnItemWidth = Math.floor((columnWidth - columnItemWidthMargin * 2) / 3)

    //数字键盘最上面的margin 10
    var rowHeightTopMargin = 10 * scaleSize
    //数字键盘最下面的margin 20
    var rowHeightBottomMargin = 20 * scaleSize

    var rowTotalHeight = keyboardHeight - rowHeightTopMargin - rowHeightBottomMargin

    //数字键盘每一行的margin 间隔 30
    var rowHeightMargin = 30 * scaleSize

    var rowItemHeight = Math.floor((rowTotalHeight - rowHeightMargin * 3) / 4)

    //限制在数字的框框的区域
    var xAreaLeftRight = Math.floor(columnItemWidth / 3)
    var yAreaTopBottom = Math.floor(rowItemHeight / 4)

    var clickX = 0
    var clickY = 0
    toastLog("inputDigKeyboard columnItemWidth " + columnItemWidth + " rowItemHeight " + rowItemHeight)
    switch (dig) {
        case "1":
            clickX = random(leftRightMargin + xAreaLeftRight, columnItemWidth + leftRightMargin - xAreaLeftRight)
            clickY = random(keyboardTop + rowHeightTopMargin + yAreaTopBottom, keyboardTop + rowHeightTopMargin + rowItemHeight - yAreaTopBottom)
            break;
        case "2":
            var startX = columnItemWidth + leftRightMargin + columnItemWidthMargin
            clickX = random(startX + xAreaLeftRight, columnItemWidth + startX - xAreaLeftRight)
            var startY = keyboardTop + rowHeightTopMargin
            clickY = random(startY + yAreaTopBottom, startY + rowItemHeight - yAreaTopBottom)
            break;
        case "3":
            var startX = leftRightMargin + columnItemWidthMargin * 2 + columnItemWidth * 2
            clickX = random(startX + xAreaLeftRight, columnItemWidth + startX - xAreaLeftRight)
            var startY = keyboardTop + rowHeightTopMargin
            clickY = random(startY + yAreaTopBottom, startY + rowItemHeight - yAreaTopBottom)
            break;
        case "4":
            clickX = random(leftRightMargin + xAreaLeftRight, columnItemWidth + leftRightMargin - xAreaLeftRight)
            var startY = keyboardTop + rowHeightTopMargin + rowItemHeight + rowHeightMargin
            clickY = random(startY + yAreaTopBottom, startY + rowItemHeight - yAreaTopBottom)
            break
        case "5":
            var startX = columnItemWidth + leftRightMargin + columnItemWidthMargin
            clickX = random(startX + xAreaLeftRight, columnItemWidth + startX - xAreaLeftRight)
            var startY = keyboardTop + rowHeightTopMargin + rowItemHeight + rowHeightMargin
            clickY = random(startY + yAreaTopBottom, startY + rowItemHeight - yAreaTopBottom)
            break;
        case "6":
            var startX = leftRightMargin + columnItemWidthMargin * 2 + columnItemWidth * 2
            clickX = random(startX + xAreaLeftRight, columnItemWidth + startX - xAreaLeftRight)
            var startY = keyboardTop + rowHeightTopMargin + rowItemHeight + rowHeightMargin
            clickY = random(startY + yAreaTopBottom, startY + rowItemHeight - yAreaTopBottom)
            break
        case "7":
            clickX = random(leftRightMargin + xAreaLeftRight, columnItemWidth + leftRightMargin - xAreaLeftRight)
            var startY = keyboardTop + rowHeightTopMargin + rowItemHeight * 2 + rowHeightMargin * 2
            clickY = random(startY + yAreaTopBottom, startY + rowItemHeight - yAreaTopBottom)
            break;
        case "8":
            var startX = columnItemWidth + leftRightMargin + columnItemWidthMargin
            clickX = random(startX + xAreaLeftRight, columnItemWidth + startX - xAreaLeftRight)
            var startY = keyboardTop + rowHeightTopMargin + rowItemHeight * 2 + rowHeightMargin * 2
            clickY = random(startY + yAreaTopBottom, startY + rowItemHeight - yAreaTopBottom)
            break
        case "9":
            var startX = leftRightMargin + columnItemWidthMargin * 2 + columnItemWidth * 2
            clickX = random(startX + xAreaLeftRight, columnItemWidth + startX - xAreaLeftRight)
            var startY = keyboardTop + rowHeightTopMargin + rowItemHeight * 2 + rowHeightMargin * 2
            clickY = random(startY + yAreaTopBottom, startY + rowItemHeight - yAreaTopBottom)
            break;
        case "0":
            var startX = columnItemWidth + leftRightMargin + columnItemWidthMargin
            clickX = random(startX + xAreaLeftRight, columnItemWidth + startX - xAreaLeftRight)
            var startY = keyboardTop + rowHeightTopMargin + rowItemHeight * 3 + rowHeightMargin * 3
            clickY = random(startY + yAreaTopBottom, startY + rowItemHeight - yAreaTopBottom)
            break
        case "-1":
            clickX = random(leftRightMargin + xAreaLeftRight, columnItemWidth + leftRightMargin - xAreaLeftRight)
            var startY = keyboardTop + rowHeightTopMargin + rowItemHeight * 2 + rowHeightMargin * 2
            var startY = keyboardTop + rowHeightTopMargin + rowItemHeight * 3 + rowHeightMargin * 3
            clickY = random(startY + yAreaTopBottom, startY + rowItemHeight - yAreaTopBottom)
            break
    }
    click(clickX, clickY)

}

function isExist(arr, ran) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == ran) {
            return true;
        }
    }
    return false;
}


/**
 * 悬浮日志
 */
// TODO:需要调试
commonFunc.Floating_logs = function () {
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
        dialogs.alert("已停止运行脚本！");
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

commonFunc.backupUpApp = function (targetPackageName) {
    toastLog("备份Tiktok");
    for (let i = 1; i < 6; i++) {
        try {
            var backupResult = JSON.parse(SLChanges.backupApp(targetPackageName));
            log("尝试第" + i + "次备份")
            if (backupResult.code < 200) {
                throw "备份Tiktok失败: " + backupResult.msg
            }
            toastLog("备份Tiktok成功");
            return true
        } catch (error) {
            throw "备份Tiktok异常: " + commonFunc.objectToString(error)
        }
    }
}


commonFunc.backupUpAppInfo = function (targetPackageName,desc) {
    toastLog("备份Tiktok");
    for (let i = 1; i < 6; i++) {
        try {
            var backupResult = JSON.parse(SLChanges.changeBackupDesc(targetPackageName,desc,0));
            log("尝试第" + i + "次备份")
            if (backupResult.code < 200) {
                throw "备份Tiktok失败: " + backupResult.msg
            }
            toastLog("备份Tiktok成功");
            return true
        } catch (error) {
            throw "备份Tiktok异常: " + commonFunc.objectToString(error)
        }
    }
}


commonFunc.getGlobalIp = function (timeout) {
    let ip = null
    timeout = typeof (timeout) == "number" ? timeout : 1000 * 30
    let res = http.get("https://api.ipify.org/?format=json", {
        "headers": {
            'User-Agent': commonFun.getRandomUA()
        }
    })
    if (res.statusCode == 200) {
        res = res.body.json()
        return res.ip
    }
}


commonFunc.init()
module.exports = commonFunc;