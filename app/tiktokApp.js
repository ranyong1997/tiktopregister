
//可能调用结构还要改动
const { clickIfWidgetExists, clickIfWidgetClickable, swipeWithBezier, randomSleep, md5, swipeUpSlowly, newThread, clickIfParentsClickable, isNotNullObject } = require("../lib/common.js");
const { reportLog } = require("../network/httpUtil.js");
const commonFunc = require("../lib/common.js");
const httpUtilFunc = require("../network/httpUtil.js");

//  用于图片识别的裁剪处理
importClass(android.graphics.Bitmap);
images.requestScreenCapture(false)

importClass(android.content.Intent);
importClass(android.net.Uri);

var _ids = {
    //  version : Tiktok_19.2.4
    "Tab_Home": "com.ss.android.ugc.trill:id/c5v",
    "Tab_Discover": "com.ss.android.ugc.trill:id/c5u",
    "Tab_Post": "com.ss.android.ugc.trill:id/c5t",
    "Tab_Inbox": "com.ss.android.ugc.trill:id/c5w",
    "Tab_Me": "com.ss.android.ugc.trill:id/c5x",
    "Discover_Topic": "com.ss.android.ugc.trill:id/ef8",    //  发现页的话题
    "Me_Username": "com.ss.android.ugc.trill:id/ek8",    //  Me 界面 账号昵称
    "Me_Nav_Right": "com.ss.android.ugc.trill:id/c9o",    //  Me 界面 顶部导航栏右侧菜单
    "Profile_Photo": "com.ss.android.ugc.trill:id/b5j",    //  头像按钮
    "Profile_Media": "com.ss.android.ugc.trill:id/a1k",    //  图片选择小圆点
    "Profile_Name_EditText": "com.ss.android.ugc.trill:id/apu",    //  Name 编辑框
    "Profile_Bio_Desc": "com.ss.android.ugc.trill:id/r8",    //  Bio 文本
    "Profile_Bio_EditText": "com.ss.android.ugc.trill:id/apu",    //  Bio 编辑框
    "Profile_Website_Desc": "com.ss.android.ugc.trill:id/erv",    //  Website 文本
    "Profile_Website_EditText": "com.ss.android.ugc.trill:id/apu",    //  Website 编辑框
    "Post_Select_Video": "com.ss.android.ugc.trill:id/b_g",     //  发布视频 选择视频 角标
    "Post_Desc_EditText": "com.ss.android.ugc.trill:id/ame",     //  发布视频 描述编辑框
    "Post_Post_Button": "com.ss.android.ugc.trill:id/csk",     //  发布视频 完成发布 按钮
    "Dialog_Close_UsernameUpdate": "com.ss.android.ugc.trill:id/bi6",    //  弹窗提示修改用户名的 关闭按钮
}

//###
var targetApp = {};
targetApp.init = function () {
    log("init targetApp")
    targetApp.appName = "tiktok"
    targetApp.bid = "com.zhiliaoapp.musically"
    targetApp.versionName = commonFunc.getAppVersionName(targetApp.bid)
    httpUtilFunc.reportLog("应用版本: " + targetApp.bid + " - " + (targetApp.versionName ? targetApp.versionName : '未安装'))
    httpUtilFunc.reportLog("创建媒体文件夹: " + files.createWithDirs("/storage/emulated/" + commonFunc.userId + "/DCIM/" + targetApp.appName + "/"))
}
targetApp.clearTaskCache = function () {
    //  清理 Camera 文件夹
    try {
        let folder_path = "/storage/emulated/" + commonFunc.userId + "/DCIM/Camera/"
        log("清理缓存: " + folder_path)
        let file_list = files.listDir(folder_path)
        for (let idx = 0; idx < file_list.length; idx++) {
            let filename = file_list[idx]
            files.remove(folder_path + filename)
        }
    } catch (error) { log("清理缓存异常: " + commonFunc.objectToString(error)) }
    try {
        let folder_path = "/storage/emulated/" + commonFunc.userId + "/DCIM/tiktok/"
        log("清理缓存: " + folder_path)
        let file_list = files.listDir(folder_path)
        for (let idx = 0; idx < file_list.length; idx++) {
            let filename = file_list[idx]
            // log("删除文件：" + filename + " -> " + files.remove(root_path + filename))
            files.remove(folder_path + filename)
        }
    } catch (error) { log("清理缓存异常: " + commonFunc.objectToString(error)) }
    return true
}
targetApp.keepFrontAppThread = function () {
    return threads.start(function () {
        toastLog("前台应用守护进程已启动")
        if (!app.getAppName(targetApp.bid)) { throw "未安装 " + targetApp.bid }
        // try { shell("pm enable --user " + commonFunc.userId + " " + targetApp.bid) } catch (error) { }
        while (true) {
            if (clickIfWidgetClickable(id("android:id/aerr_wait").findOne(1))) { toastLog("应用无响应: " + targetApp.bid); sleep(5000) }
            else if (!packageName(targetApp.bid).findOne(6000)) {
                launch(targetApp.bid)
                sleep(3000)
            }
            sleep(1000)
        }
    })
}
targetApp.isOtherPage = function () {
    let message_view = id("android:id/alertTitle").visibleToUser().findOne(1) || id("com.android.packageinstaller:id/permission_message").visibleToUser().findOne(1) // || id("android:id/message").visibleToUser().findOne(1)   
    if (message_view && message_view.id() == "android:id/alertTitle" && clickIfWidgetClickable(id("android:id/aerr_wait").visibleToUser().findOne(1))) {
        reportLog("应用崩溃: " + message_view.text())
        sleep(6000)
        return true
    }
    else if (message_view && message_view.id() == "com.android.packageinstaller:id/permission_message") {
        // 权限检查
        for (let index = 0; index < 6; index++) {
            try {
                let permission_message = id("com.android.packageinstaller:id/permission_message").visibleToUser().findOne(1000).text()
                if (new RegExp(/files/i).test(permission_message) && clickIfWidgetClickable(id("com.android.packageinstaller:id/permission_allow_button").visibleToUser().clickable().findOne(1))) {
                    reportLog("允许权限 - " + permission_message)
                }
                else if (new RegExp(/record/i).test(permission_message) && clickIfWidgetClickable(id("com.android.packageinstaller:id/permission_allow_button").visibleToUser().clickable().findOne(1))) {
                    reportLog("允许权限 - " + permission_message)
                }
                else if (new RegExp(/contacts/i).test(permission_message) && clickIfWidgetClickable(id("com.android.packageinstaller:id/permission_allow_button").visibleToUser().clickable().findOne(1))) {
                    reportLog("允许权限 - " + permission_message)
                }
                else if (clickIfWidgetClickable(id("com.android.packageinstaller:id/permission_deny_button").visibleToUser().clickable().findOne(1))) {
                    reportLog("拒绝权限 - " + permission_message)
                }
                else { break }
                sleep(1000)
            } catch (error) { }
        }
        return true
    }
    else if (clickIfWidgetExists(text("Okay").visibleToUser().findOne(1))) {
        toastLog("Okay")
        randomSleep()
        return true
    }
    else if (clickIfWidgetExists(text("Not now").visibleToUser().findOne(1))) {
        toastLog("Not now")
        randomSleep()
        return true
    }
    else if (clickIfWidgetClickable(desc("Not now").visibleToUser().findOne(1))) {
        toastLog("Not now")
        randomSleep()
        return true
    }
    else if (clickIfWidgetExists(text("Skip").visibleToUser().findOne(1))) {
        toastLog("Skip")
        randomSleep()
        return true
    }
    else if (clickIfWidgetExists(text("Agree and continue").visibleToUser().findOne(1))) {
        toastLog("Agree and continue")
        randomSleep()
        return true
    }
    else if (clickIfWidgetExists(text("Start watching").visibleToUser().findOne(1))) {
        toastLog("Start watching")
        randomSleep()
        return true
    }
    else if (clickIfWidgetClickable(id(_ids.Dialog_Close_UsernameUpdate).visibleToUser().findOne(1))) {  //  Updata username 弹窗关闭按钮
        toastLog("关闭弹窗")
        randomSleep()
        return true
    }
    else if (text("Swipe up for more").visibleToUser().findOne(1)) {
        commonFunc.swipeUpSlowly()
    }
    return false
}

targetApp.accountManager = {}

/**
 * editProfile  修改资料
 */
targetApp.editProfile = function (account, profile) {
    let new_account = account
    try {
        let new_name = null
        let save_name = null
        let new_username = null
        let save_username = null
        let new_bio = null
        let save_bio = null
        let new_website = null
        let save_website = null
        let new_photo = null
        let save_photo = null
        let is_name_set = true
        let is_username_set = true
        let is_bio_set = true
        let is_website_set = true
        let is_photo_set = true
        let max_timeout = 1000 * 60 * 2
        if (!isNotNullObject(new_account)) { throw "账号参数异常: " + JSON.stringify(new_account) }
        if (!isNotNullObject(profile)) { throw "资料参数异常: " + JSON.stringify(profile) }
        if (!profile.name && !profile.username && !profile.bio && !profile.website && !profile.photo) { throw "参数异常: " + JSON.stringify(profile) }
        new_account.forceRecord = true
        if (profile.name) {
            is_name_set = false
            new_name = profile.name.toLowerCase()
            max_timeout = max_timeout + 1000 * 60 * 1
        }
        if (profile.username) {
            is_username_set = false
            new_username = profile.username.toLowerCase()
            max_timeout = max_timeout + 1000 * 60 * 1
        }
        if (profile.bio) {
            is_bio_set = false
            new_bio = profile.bio
            max_timeout = max_timeout + 1000 * 60 * 1
        }
        if (profile.website) {
            is_website_set = false
            new_website = profile.website
            max_timeout = max_timeout + 1000 * 60 * 1
        }
        if (profile.photo) {
            is_photo_set = false
            new_photo = profile.photo
            max_timeout = max_timeout + 1000 * 60 * 5
        }
        newThread(() => {
            while (true) {
                if (clickIfWidgetExists(text("Skip").visibleToUser().findOne(1)) || clickIfWidgetExists(text("Not now").visibleToUser().findOne(1))) {
                    toastLog("跳过")
                }
                if (clickIfWidgetClickable(id(_ids.Tab_Me).findOne(3000)) && id(_ids.Tab_Me).selected().findOne(1000)) {
                    sleep(500)
                    toastLog("首页检查")
                    let nickname_view = id("com.ss.android.ugc.trill:id/title").textMatches(".+").visibleToUser().findOne(10000)
                    if (nickname_view) {
                        toastLog(" 账号昵称: " + nickname_view.text())
                    }
                    if (!(clickIfWidgetClickable(text("Edit profile").clickable().findOne(1000)) || clickIfWidgetClickable(text("Set up profile").clickable().findOne(1000)))) { back() }
                    id("com.ss.android.ugc.trill:id/title").text("Edit profile").findOne(5000)
                }
                else if (id("com.ss.android.ugc.trill:id/title").text("Edit profile").findOne(1)) {
                    let toast_msg = null
                    let t_thread = threads.start(function () {
                        events.observeToast();
                        events.onToast(function (toast) {
                            toast_msg = toast.getText()
                            reportLog("监听资料修改事件: " + toast_msg);
                        });
                    })
                    if (!is_name_set) {
                        //  检查当前用户昵称
                        if (desc("Name" + new_name).findOne(1000) || (save_name && desc("Name" + save_name).findOne(1))) {
                            is_name_set = true
                            new_account.name = save_name || new_name
                            continue;
                        }
                        toast_msg = null
                        //  开始修改昵称
                        clickIfWidgetClickable(descStartsWith("Name").clickable().findOne(1000)) && randomSleep(5000)
                        for (let index = 0; index < 10; index++) {
                            if (toast_msg == "Saved") { is_name_set = true; break }
                            else if (id("com.ss.android.ugc.trill:id/title").text("Name").findOne(1000)) {
                                //  可以修改昵称
                                setText(new_name); randomSleep()
                                reportLog("输入昵称: " + new_name)
                                try { save_name = id(_ids.Profile_Name_EditText).findOne(1000).text() } catch (error) { }
                                if (clickIfWidgetClickable(text("Save").clickable().findOne(6000))) {
                                    reportLog("保存昵称: " + save_name)
                                    randomSleep(10000)
                                    // new_account.name = save_name
                                }
                            }
                            randomSleep(1000, 2000)
                        }
                        if (!is_name_set) { throw "昵称修改失败" }
                        new_account.name = save_name
                    }
                    else if (!is_username_set) {
                        //  检查当前用户昵称
                        if (desc("Username" + new_username).findOne(1000) || (save_username && desc("Username" + save_username).findOne(1))) {
                            is_username_set = true
                            new_account.username = save_username || new_username
                            continue;
                        }
                        toast_msg = null
                        //  开始修改名称
                        clickIfWidgetClickable(descStartsWith("Username").clickable().findOne(1000)) && randomSleep(5000)
                        for (let index = 0; index < 10; index++) {
                            if (toast_msg == "Saved") { is_username_set = true; break }
                            else if (id("com.ss.android.ugc.trill:id/title").text("Username").findOne(1000)) {
                                //  30天内不可修改昵称
                                let username_desc = textContains("You can change it again").findOne(1000)
                                if (username_desc) { clickIfWidgetClickable(text("Cancel").clickable().findOne(1)); reportLog("限制修改昵称: " + username_desc.text()); break }
                                //  可以修改昵称
                                setText(new_username); randomSleep()
                                reportLog("输入用户名: " + new_username)
                                try { save_username = id("com.ss.android.ugc.trill:id/bd1").findOne(1000).text() } catch (error) { }
                                if (clickIfWidgetClickable(text("Save").clickable().findOne(6000))) {
                                    reportLog("保存名称: " + save_username)
                                    randomSleep(3000)
                                }
                                else if (id("com.ss.android.ugc.trill:id/text").text("Suggested").findOne(1)) {
                                    let btn_list = id("com.ss.android.ugc.trill:id/text").find()
                                    let temp_btn = btn_list[random(1, btn_list.length - 1)]
                                    new_username = temp_btn.text()
                                    clickIfWidgetClickable(temp_btn)
                                } else {
                                    new_username = new_username + random(0, 9)
                                }
                            }
                            else if (clickIfWidgetClickable(text("SET USERNAME").clickable().findOne(1))) { id("com.ss.android.ugc.trill:id/title").text("Edit profile").findOne(5000); randomSleep() }
                            randomSleep(1000, 2000)
                        }
                        if (desc("Username" + save_username).findOne(1)) {
                            is_username_set = true
                            new_account.username = save_username
                        }
                        if (!is_username_set) { throw "名称修改失败" }
                        new_account.username = save_username
                    }
                    else if (!is_bio_set) {
                        if (desc("Bio" + new_bio).findOne(1000) || (save_bio && desc("Bio" + save_bio).findOne(1))) {
                            is_bio_set = true
                            new_account.bio = save_bio || new_bio
                            continue;
                        }
                        toast_msg = null
                        for (let index = 0; index < 10; index++) {
                            if (toast_msg == "Saved") { is_bio_set = true; break }
                            else if (id("com.ss.android.ugc.trill:id/title").text("Bio").findOne(1000)) {
                                //  可以修改昵称
                                setText(new_bio); randomSleep()
                                reportLog("输入bio: " + new_bio)
                                try { save_bio = id(_ids.Profile_Bio_EditText).findOne(1000).text() } catch (error) { }
                                if (clickIfWidgetClickable(text("Save").clickable().findOne(6000))) {
                                    reportLog("保存Bio: " + save_bio)
                                    randomSleep(10000)
                                }
                                else { back() }
                            }
                            else if (desc("Bio" + new_bio).findOne(1000) || (save_bio && desc("Bio" + save_bio).findOne(1))) {
                                is_bio_set = true
                                new_account.bio = save_bio || new_bio
                                continue;
                            }
                            else if (!is_bio_set && clickIfWidgetClickable(id(_ids.Profile_Bio_Desc).findOne(1))) { randomSleep(3000) }
                            randomSleep(1000, 2000)
                        }
                        if (!is_bio_set) { throw "Bio 修改失败" }
                        new_account.bio = save_bio
                    }
                    else if (!is_website_set) {
                        if (desc("Website" + new_website).findOne(3000) || (save_website && desc("Website" + save_website).findOne(1))) {
                            is_website_set = true
                            new_account.website = save_website || new_website
                            continue;
                        }
                        else if (id("com.ss.android.ugc.trill:id/title").text("Edit profile").findOne(1) && !id(_ids.Profile_Website_Desc).findOne(3000)) {
                            throw "未开通外链功能, 请先升级商业号"
                        }
                        toast_msg = null
                        for (let index = 0; index < 10; index++) {
                            if (toast_msg == "Edited") { is_website_set = true; break }
                            else if (id("com.ss.android.ugc.trill:id/title").text("Website").findOne(1000)) {
                                setText(new_website); randomSleep()
                                reportLog("输入外链: " + new_website)
                                try { save_website = id(_ids.Profile_Website_EditText).findOne(1000).text() } catch (error) { }
                                if (clickIfWidgetClickable(text("Save").clickable().findOne(6000)) || clickIfWidgetExists(text("Save").clickable().findOne(1000))) {
                                    reportLog("保存外链: " + save_website)
                                    randomSleep(10000)
                                }
                                else { back() }
                            }
                            else if (desc("Website" + new_website).findOne(1000) || (save_website && desc("Website" + save_website).findOne(1))) {
                                is_website_set = true
                                new_account.website = save_website || new_website
                                continue;
                            }
                            else if (!is_website_set && clickIfWidgetClickable(id(_ids.Profile_Website_Desc).findOne(1))) { randomSleep(3000) }
                            randomSleep(1000, 2000)
                        }
                        if (!is_website_set && id("com.ss.android.ugc.trill:id/title").text("Website").findOne(1000)) { throw "外链保存无响应" } // 点击保存无响应
                        if (!is_website_set) { throw "Website 修改失败" }
                        new_account.website = save_website
                    }
                    else if (!is_photo_set) {
                        //  1. 下载图片
                        try {
                            httpUtilFunc.downloadFile(new_photo, "/storage/emulated/" + commonFunc.userId + "/DCIM/tiktok/photo.png", null, true)
                        } catch (error) { throw error }
                        //  2. 更新图片
                        clickIfWidgetClickable(id(_ids.Profile_Photo).clickable().findOne(1000)) && randomSleep(3000)
                        if (clickIfWidgetClickable(text("ALLOW").findOne(1))) { randomSleep(3000) }
                        clickIfWidgetClickable(text("Select from Gallery").clickable().findOne(1000)) && randomSleep(3000)
                        if (clickIfWidgetClickable(text("ALLOW").findOne(1))) { randomSleep(3000) }

                        for (let index = 0; index < 10; index++) {
                            if (text("Image size is too small").findOne(1000)) {
                                clickIfWidgetClickable(text("OK").visibleToUser().clickable().findOne(1000))
                                for (let idx_temp = 0; idx_temp < 5; idx_temp++) { ; back(); randomSleep() }
                                throw "Image size is too small"
                            }
                            else if (text("Confirm").findOne(1000)) {
                                if (clickIfWidgetClickable(id(_ids.Profile_Media).clickable().findOne(1000))) {
                                    reportLog("选择头像: " + clickIfWidgetClickable(text("Confirm").findOne(1000)))
                                    randomSleep(3000)
                                }
                                else { throw "媒体库无可用图片" }
                            }
                            else if (clickIfWidgetClickable(text("Save").findOne(1000))) {
                                is_photo_set = true
                                new_account.photo = new_photo
                                reportLog("保存新头像")
                                randomSleep(10000)
                            }
                            else if (text("Uploading...").findOne(1)) { randomSleep(5000) }
                            else if (id("com.ss.android.ugc.trill:id/title").text("Edit profile").findOne(1)) { break }
                            randomSleep()
                        }
                    }
                    else {
                        try { t_thread.interrupt() } catch (error) { }
                        back()
                        return true
                    }
                }
                else if (targetApp.isOtherPage()) { }
                else if (!packageName("com.ss.android.ugc.trill").findOne(1)) {
                    toastLog("启动应用中...")
                    launch("com.ss.android.ugc.trill")
                    randomSleep(3000)
                } else {
                    back()
                    toastLog("unknow page")
                    sleep(3000)
                }
                sleep(2000)
            }
        }, false, max_timeout, () => { throw "超时退出" })
    } catch (error) {
        throw error
    }
    return new_account
}
/**
 * 
 * @returns 
 */
targetApp.getAboutInfo = function () {
    let aboutInfo = {}
    if (targetApp.getLoginStatus() == 1) {
        try { aboutInfo.username = textStartsWith("@").visibleToUser().findOne(3000).text().match(/@(\S+)/)[1] } catch (error) { }
        try { aboutInfo.followers = id("com.ss.android.ugc.trill:id/azk").visibleToUser().findOne(1).text() } catch (error) { }
        try { aboutInfo.likes = id("com.ss.android.ugc.trill:id/aev").visibleToUser().findOne(1).text() } catch (error) { }
        try { aboutInfo.nickname = id("com.ss.android.ugc.trill:id/title").visibleToUser().findOne(1).text() } catch (error) { }
        try { aboutInfo.bio = id("com.ss.android.ugc.trill:id/eks").visibleToUser().findOne(1).text().replace(new RegExp(/[^\w\u4e00-\u9fa5\r\n\s`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/img), "") } catch (error) { }
        try { aboutInfo.website = id("com.ss.android.ugc.trill:id/ekx").visibleToUser().findOne(1).text() } catch (error) { }
    }
    return aboutInfo
}
/** getLoginStatus  获取账号登录状态
 *  
 *  ret  0-未登录； 1-已登录； -1:其他异常
 */
targetApp.getLoginStatus = function (timeout) {
    if (!app.getAppName(targetApp.bid)) { return -2 }
    let app_enable = parseInt(context.getPackageManager().getApplicationEnabledSetting(targetApp.bid))
    if (app_enable > 1) { throw "应用状态: " + app_enable + " - " + targetApp.bid }
    timeout = typeof (timeout) == "number" ? timeout : 1000 * 60 * 2
    return newThread(function () {
        while (true) {
            if (!packageName(targetApp.bid).findOne(1)) {
                launch(targetApp.bid)
                id(_ids.Tab_Me).findOne(10000)
            }
            if (1 == 2 && id(_ids.Tab_Home).visibleToUser().findOne(1)) {
                randomSleep(3000)
                //  检测是否提示上传失败
                try {
                    toastLog("检测是否提示上传失败")
                    let screenshot_path = '/storage/emulated/0/CloudMobile/cache/screen_480x854.png'
                    // let screenshot_path = '/storage/emulated/0/CloudMobile/screen_480x854.png'
                    let template_path = files.cwd() + '/res/upload_restart_30x30.png'
                    try { files.remove(screenshot_path); sleep(2000) } catch (error) { }
                    shell("screencap -p " + screenshot_path); sleep(2000)
                    let screen_img = images.read(screenshot_path);
                    let restart_img = images.read(template_path);
                    let restart_btn_point = null
                    if (screen_img && restart_img) {
                        restart_btn_point = findImage(screen_img, restart_img, {
                            region: [370, 80, 40, 40],
                            threshold: 0.8
                        });
                    }
                    screen_img.recycle()
                    restart_img.recycle()
                    if (restart_btn_point) {
                        restart_btn_point.x = parseInt((restart_btn_point.x + 15) * device.width / 480)
                        restart_btn_point.y = parseInt((restart_btn_point.y + 15) * device.height / 854)
                        toastLog("Failed to upload: " + restart_btn_point)
                        click(restart_btn_point.x, restart_btn_point.y)
                        sleep(15000)
                    }
                } catch (error) { toastLog("图片检测异常: " + commonFunc.objectToString(error)) }
            }
            if (clickIfWidgetClickable(id(_ids.Tab_Me).findOne(3000)) && id(_ids.Tab_Me).selected().findOne(3000)) {
                sleep(500)
                toastLog("首页检查")
                if (clickIfWidgetExists(text("Skip").visibleToUser().findOne(3000)) || clickIfWidgetExists(text("Not now").visibleToUser().findOne(1))) {
                    toastLog("跳过")
                }
                let nickname_view = textStartsWith("@").visibleToUser().findOne(10000)
                if (nickname_view) {
                    return 1
                }
                if (text("Edit profile").clickable().visibleToUser().findOne(3000) || text("Set up profile").clickable().visibleToUser().findOne(1)) {
                    return 1
                }
                //  检测是否提示上传失败
                try {
                    let screenshot_path = '/storage/emulated/0/CloudMobile/cache/screen_480x854.png'
                    let template_path = files.cwd() + '/res/upload_restart_30x30.png'
                    try { files.remove(screenshot_path); sleep(2000) } catch (error) { }
                    shell("screencap -p " + screenshot_path); sleep(2000)
                    let screen_img = images.read(screenshot_path);
                    let restart_img = images.read(template_path);
                    let restart_btn_point = null
                    if (screen_img && restart_img) {
                        restart_btn_point = findImage(screen_img, restart_img, {
                            region: [370, 80, 40, 40],
                            threshold: 0.8
                        });
                    }
                    screen_img.recycle()
                    restart_img.recycle()
                    if (restart_btn_point) {
                        restart_btn_point.x = parseInt((restart_btn_point.x + 15) * device.width / 480)
                        restart_btn_point.y = parseInt((restart_btn_point.y + 15) * device.height / 854)
                        upload_process = "Failed to upload: " + restart_btn_point
                        reportLog(upload_process)
                        click(restart_btn_point.x, restart_btn_point.y)
                        sleep(15000)
                        continue
                    }
                } catch (error) { reportLog("图片检测异常: " + commonFunc.objectToString(error)) }
                //  收起异常弹窗界面
                swipe(parseInt(device.width * 0.5), parseInt(device.height * 0.15), parseInt(device.width * 0.5), 0, 1000)
            }
            else if (!packageName("com.ss.android.ugc.trill").findOne(1)) {
                toastLog("启动应用中...")
                launch("com.ss.android.ugc.trill")
                randomSleep(3000)
            }
            else if (text("Log in to TikTok").findOne(1) || text("Sign up for TikTok").findOne(1)) {
                return 0
            }
            else if (textContains("was logged out").findOne(1)) {
                // toastLog( "账号已掉线" )
                return 2
            }
            else if (textContains("permanently banned").findOne(1)) {
                return 3
            }
            else if (textContains("Your account has multiple Community Guidelines violations").findOne(1)) {

                return 4
            }
            else if (targetApp.isOtherPage()) { }
            else {
                back()
                toastLog("unknown page")
                sleep(2000)
            }
        }
    }, -1, timeout, () => { reportLog("获取登录状态: 超时退出") })
}
targetApp.doLogin = function (account) {
    try {
        return newThread(() => {
            while (true) {
                if (clickIfWidgetClickable(id(_ids.Tab_Me).findOne(3000)) && id(_ids.Tab_Me).selected().findOne(3000)) {
                    sleep(500)
                    toastLog("首页检查")
                    if (clickIfWidgetExists(text("Skip").visibleToUser().findOne(3000)) || clickIfWidgetExists(text("Not now").visibleToUser().findOne(1))) {
                        toastLog("跳过")
                    }
                    let nickname_view = textStartsWith("@").visibleToUser().findOne(10000)
                    if (nickname_view) {
                        toastLog(" 账号昵称: " + nickname_view.text())
                        return true
                    }
                    if (text("Edit profile").clickable().visibleToUser().findOne(3000) || text("Set up profile").clickable().visibleToUser().findOne(1)) {
                        reportLog("账号昵称显示异常: ")
                        return true
                    }
                }
                else if (desc("verify captcha").visibleToUser().findOne(1)) {
                    randomSleep(3000)
                    //  滑块验证识别
                    targetApp.doDragImageVerify()
                }
                else if (id("com.ss.android.ugc.trill:id/title").text("Log in").visibleToUser().findOne(1)) {
                    if (clickIfParentsClickable(text("Email / Username").visibleToUser().findOne(1000)) && text("Email / Username").visibleToUser().selected().findOne(2000)) {
                        randomSleep(2000)
                        try { id("com.ss.android.ugc.trill:id/bd1").visibleToUser().findOne(1000).setText(account.username); randomSleep(3000) } catch (error) { }
                        try { id("com.ss.android.ugc.trill:id/apw").visibleToUser().findOne(1000).setText(account.password); randomSleep(3000) } catch (error) { }
                    }
                    if (text(account.username).visibleToUser().findOne(1000) && clickIfParentsClickable(id("com.ss.android.ugc.trill:id/c3q").text("Log in").visibleToUser().findOne(1000))) {
                        desc("verify captcha").visibleToUser().findOne(10000)
                        sleep(5000)
                    }
                }
                else if (text("Log in to TikTok").visibleToUser().findOne(1) && clickIfParentsClickable(text("Use phone / email / username").visibleToUser().findOne(1))) {
                    randomSleep(1000, 3000)
                }
                else if (clickIfWidgetClickable(text("Already have an account? Log in").visibleToUser().clickable().findOne(1))) {
                    randomSleep(1000, 3000)
                }
                else if (textContains("permanently banned").findOne(1000)) {
                    throw "Your account was permanently banned"
                }
                else if (targetApp.isOtherPage()) { }
                else if (clickIfWidgetClickable(text("OK").visibleToUser().clickable().findOne(1))) {
                    sleep(10000)
                }
                else if (!packageName(targetApp.bid).findOne(1)) {
                    launch(targetApp.bid)
                    id(_ids.Tab_Me).findOne(10000)
                }
                else {
                    back()
                    sleep(2000)
                }
                sleep(2000)
            }
        }, false, 1000 * 60 * 5, () => { throw "登录超时退出" })
    } catch (error) {
        throw error
    }
}
/** getLoginStatus  获取账号登录状态
 *  
 *  ret  0-未登录； 1-已登录； -1:其他异常
 */
targetApp.getLoginUsername = function (timeout) {
    try {
        return targetApp.getLoginStatus() == 1 ? textStartsWith("@").visibleToUser().findOne(3000).text().match(/@(\S+)/)[1] : null
    } catch (error) { }
    return null
}
/** getConnectStatus    获取账号 tiktok 联网状态
 *  
 *  ret  0-连接失败； 1-正常； 2:刷不出视频;  3:无网络连接  -1:其他异常
 */
targetApp.getConnectStatus = function (timeout) {
    if (!app.getAppName(targetApp.bid)) {
        throw "tiktok 应用未安装"
    }
    timeout = timeout != null ? timeout : 1000 * 60 * 2
    let connect_status = newThread(function () {
        let check_times = 0
        while (true) {
            if (clickIfWidgetClickable(id(_ids.Tab_Discover).findOne(3000)) && id(_ids.Tab_Discover).selected().findOne(3000)) {
                sleep(500)
                clickIfWidgetClickable(text("Refresh").visibleToUser().clickable().findOne(1000)) && randomSleep()
                commonFunc.swipeDownSlowly()
                sleep(5000)
                if (id(_ids.Discover_Topic).visibleToUser().findOne(30000)) {
                    return 1
                } else if (text("No network connection").visibleToUser().findOne(1)) {
                    //  IP 异常
                    return 3
                }
                if (++check_times > 1) { return 2 }    //  app 联网异常, 刷不出视频
            }
            else if (!packageName(targetApp.bid).findOne(1)) {
                toastLog("启动应用中...")
                launch(targetApp.bid)
                randomSleep(3000)
            }
            else if (text("Log in to TikTok").findOne(1) || text("Sign up for TikTok").findOne(1)) {
                return 0
            }
            else if (targetApp.isOtherPage()) { }
            else {
                back()
                sleep(2000)
            }
        }
    }, -1, timeout)
    log("联网状态: " + connect_status)
    return connect_status
}
targetApp.getRandomPassword = function () {
    let code = commonFunc.randomStrInStr("QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890._!@#$%^&*()_+", random(8, 16))
    return (new RegExp(/[a-zA-Z]/).test(code) && new RegExp(/[0-9]/).test(code) && new RegExp(/[\w]/).test(code)) ? code : targetApp.getRandomPassword()
}
targetApp.fyManager = {}
targetApp.getUnregisterAccount = function (req_data) {
    return newThread(function () {
        try {
            let url = "http://" + commonFunc.server + ":8000/user/unregaccount?appName=" + req_data.appName + "&countryCode=" + req_data.countryCode + "&phoneProvider=" + req_data.phoneProvider + "&tag=" + req_data.tag
            reportLog("请求账号: " + url)
            let res = http.get(url)
            res = res.body.json()
            if (res.code == 200) {
                let data = JSON.parse(res.data)
                if (data.id && data.appName) {
                    return data
                }
            }
            throw res
        } catch (error) {
            throw "请求账号失败: " + commonFunc.objectToString(error)
        }
    }, null, 1000 * 60 * 2)
}
targetApp.getVideoInfo = function () {
    let videoInfo = { "type": null, "creator": null, "content": null, "tags": null, "followed": null, "liked": null, "likeNum": null, "commentNum": null, "fx": null }
    try {   //  检测广告
        if (textContains("\nSponsored").visibleToUser().findOne(1000) || text("Replay").visibleToUser().findOne(1)) {
            videoInfo.type = "ad"
            return videoInfo
        }
    } catch (error) { }
    try {   //  检测直播
        if (id("com.ss.android.ugc.trill:id/dor").text("LIVE now").visibleToUser().findOne(1)) {
            videoInfo.type = "live"
            videoInfo.creator = id("com.ss.android.ugc.trill:id/dot").visibleToUser().findOne(1).text().match("@(.*)")[1]
            videoInfo.content = id("com.ss.android.ugc.trill:id/doy").visibleToUser().findOne(1).text() //  Tap to watch LIVE
            return videoInfo
        }
    } catch (error) { }
    try {   //  作者昵称
        videoInfo.creator = id("com.ss.android.ugc.trill:id/title").visibleToUser().findOne(1).text().match(/@(.*)/)[1]
    } catch (error) { }
    try {   //  视频描述和标签
        videoInfo.type = "video"
        videoInfo.content = ""
        videoInfo.tags = []
        let content = id("com.ss.android.ugc.trill:id/aa1").visibleToUser().findOne(1).text()
        videoInfo.content = content.match(/^[^#]*/)[0]
        let tags = content.match(/#(.[^# ]*)/g)
        for (let tag of tags) {
            videoInfo.tags.push(tag.match(/^#(.*)/)[1])
        }
        videoInfo.content = videoInfo.content != "" ? videoInfo.content : content.match("^#.*#[^ ]+ (.*)")[1]
    } catch (error) { }
    try {   //  是否已关注
        videoInfo.followed = id("com.ss.android.ugc.trill:id/arz").visibleToUser().findOne(1) ? false : true
    } catch (error) { }
    try {   //  是否已点赞
        let like_btn = id("com.ss.android.ugc.trill:id/abf").visibleToUser().clickable().findOne(1)
        if (like_btn) {
            videoInfo.liked = !images.detectsColor(captureScreen(), "#ffe8edf5", like_btn.bounds().centerX(), like_btn.bounds().centerY(), 16)
        }
    } catch (error) { }
    try {   //  视频点赞数量
        let likeNum = id("com.ss.android.ugc.trill:id/abg").visibleToUser().findOne(1).text()
        if (likeNum.match(/.*K/i)) { likeNum = likeNum.match(/([0-9\.]*)/)[0] * 1000 }
        else if (likeNum.match(/.*M/i)) { likeNum = likeNum.match(/([0-9\.]*)/)[0] * 1000000 }        //  百万级
        else if (likeNum.match(/.*B/i)) { likeNum = likeNum.match(/([0-9\.]*)/)[0] * 1000000000 }     //  十亿级
        videoInfo.likeNum = parseInt(likeNum)
    } catch (error) { }
    try {   //  视频评论数量
        let commentNum = id("com.ss.android.ugc.trill:id/a2x").visibleToUser().findOne(1).text()
        if (commentNum.match(/.*K/i)) { commentNum = commentNum.match(/([0-9\.]*)/)[0] * 1000 }
        else if (commentNum.match(/.*M/i)) { commentNum = commentNum.match(/([0-9\.]*)/)[0] * 1000000 }       //  百万级
        else if (commentNum.match(/.*B/i)) { commentNum = commentNum.match(/([0-9\.]*)/)[0] * 1000000000 }    //  十亿级
        videoInfo.commentNum = parseInt(commentNum)
    } catch (error) { }
    try {
        let fx_btn = id("com.ss.android.ugc.trill:id/hb").visibleToUser().findOne(1)
        videoInfo.fx = fx_btn ? fx_btn.text() : ""
    } catch (error) { }
    return videoInfo
}
targetApp.checkIfVideosMatch = function (videoInfo, regObj) {
    function checkMatchs(content, keys) {
        try {
            if (content.length && keys.length) {
                for (let idx_keys = 0; idx_keys < keys.length; idx_keys++) {
                    if (new RegExp(".*" + keys[idx_keys] + ".*", "i").test(content)) {
                        log("匹配到关键字：" + keys[idx_keys])
                        return true
                    }
                }
            }
        } catch (error) { }
        return false
    }
    try {
        //  作者匹配
        if (checkMatchs(videoInfo.creator, regObj.creator)) {
            return true
        }
        if (checkMatchs(videoInfo.content, regObj.content)) {
            return true
        }
        if (checkMatchs(videoInfo.tags, regObj.tags)) {
            return true
        }

    } catch (error) { }
    return false
}
targetApp.doCheckDrafts = function (timeout) {
    try {
        timeout = typeof (timeout) == "number" ? timeout : 1000 * 60 * 2
        return newThread(() => {
            while (true) {
                if (text("Edit profile").clickable().findOne(1000) || text("Set up profile").clickable().findOne(1000)) {
                    return text("Drafts").findOne(1000) ? true : false
                }
                else if (clickIfWidgetClickable(id(_ids.Tab_Me).findOne(3000)) && id(_ids.Tab_Me).selected().findOne(1)) {
                    sleep(500)
                    toastLog("首页检查")
                    if (clickIfWidgetExists(text("Skip").visibleToUser().findOne(3000)) || clickIfWidgetExists(text("Not now").visibleToUser().findOne(1))) {
                        toastLog("跳过")
                    }
                }
                else if (targetApp.isOtherPage()) { }
                else if (!packageName(targetApp.bid).findOne(1)) {
                    toastLog("启动应用中...")
                    launch(targetApp.bid)
                    randomSleep(3000)
                }
                else {
                    log("unknow page")
                    back()
                    sleep(3000)
                }
                sleep(1000)
            }
        }, false, timeout, () => { throw "超时退出" })
    } catch (error) {
        throw error
    }
}
targetApp.doCleanDrafts = function (timeout) {
    try {
        timeout = typeof (timeout) == "number" ? timeout : 1000 * 60 * 3
        return newThread(() => {
            log("检查清理草稿箱")
            randomSleep(5000)
            while (true) {
                if (text("Edit profile").clickable().findOne(2000) || text("Set up profile").clickable().findOne(1)) {
                    if (text("Drafts").findOne(5000)) {
                        let draft_view = id("com.ss.android.ugc.trill:id/aaz").findOne(3000)
                        if (draft_view && clickIfWidgetClickable(draft_view)) {
                            log("打开草稿箱")
                            randomSleep(3000)
                        } else {
                            log("草稿箱检测")
                            back()
                            randomSleep(3000)
                            back()
                        }
                    } else {
                        log("草稿箱已清理")
                        return true
                    }
                }
                else if (id("com.ss.android.ugc.trill:id/title").text("Drafts").visibleToUser().findOne(1)) {
                    if (clickIfWidgetClickable(text("Select").visibleToUser().clickable().findOne(1000))) {
                        randomSleep(3000)
                        let draft_views = id("com.ss.android.ugc.trill:id/a1l").clickable().checked(false).visibleToUser().find()
                        draft_views.forEach(element => {
                            clickIfWidgetClickable(element)
                            randomSleep(3000)
                        });
                        if (clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/e56").textStartsWith("Delete").clickable().findOne(3000))) {
                            log("清理草稿")
                            randomSleep(3000)
                            clickIfWidgetClickable(id("android:id/button1").text("DISCARD").clickable().findOne(3000))
                            sleep(5000)
                        }
                        else { back() }
                    } else {
                        back()
                    }
                }
                else if (clickIfWidgetClickable(id(_ids.Tab_Me).findOne(3000)) && id(_ids.Tab_Me).selected().findOne(1)) {
                    sleep(500)
                    toastLog("首页检查")
                    if (clickIfWidgetExists(text("Skip").visibleToUser().findOne(3000)) || clickIfWidgetExists(text("Not now").visibleToUser().findOne(1))) {
                        toastLog("跳过")
                    }
                }
                else if (targetApp.isOtherPage()) { }
                else if (!packageName(targetApp.bid).findOne(1)) {
                    toastLog("启动应用中...")
                    launch(targetApp.bid)
                    randomSleep(3000)
                }
                else {
                    log("unknow page")
                    back()
                    sleep(3000)
                }
                sleep(3000)
            }
        }, false, timeout, () => { throw "超时退出" })
    } catch (error) {
        throw error
    }
}

/**
 * 对指定视频发起评论; 因报表系统未确定, 暂时忽略任务执行结果的上报
 * @param {*} account 当前账号
 * @param {*} video_url 视频链接
 * @param {*} material_req_data 申请评论素材的接口配置
 * @param {*} material_feedback_data 反馈评论素材的接口配置
 * @param {*} comment_num 评论数量
 * @param {*} gap_time 评论间隔时间(秒)
 * @param {*} mention_req_data 申请艾特联系人的接口配置
 * @param {*} mention_feedback_data 反馈素材的接口配置
 * @param {*} mention_num 艾特数量
 * @param {*} timeout 
 * @returns 
 */
targetApp.doCommentUrlVideo = function (account, video_url, material_req_data, material_feedback_data, comment_num, gap_time, mention_req_data, mention_feedback_data, mention_num, timeout) {
    try {
        function mentionContact(mention_name) {
            if (clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/kt").findOne(3000))) { //  @ 好友
                sleep(3000)
                // input(mention_name+" ")
                shell("input text " + "'" + mention_name + "'")
                // sleep(1000)
                // KeyCode(67)
                sleep(3000)
                for (let index = 0; index < 10; index++) {
                    if (text("Searching...").visibleToUser().findOne(1000)) {
                        console.log("Searching...");
                        sleep(5000)
                    }
                    else if (id("com.ss.android.ugc.trill:id/e_d").visibleToUser().findOne(1000)) {
                        sleep(2000)
                        break
                    }
                    else if (textContains("Try again later").visibleToUser().findOne(1)) {
                        throw "Couldn't load. Try again later."
                    }
                    sleep(5000)
                }
                let member_btn = id("com.ss.android.ugc.trill:id/e_d").visibleToUser().findOne(10000)
                if (clickIfParentsClickable(member_btn)) {
                    console.log("艾特成功:" + member_btn.text());
                    sleep(3000)
                    return true
                } else {
                    throw "艾特失败"
                }
            }
            return false
        }

        comment_num = typeof (comment_num) == "number" ? comment_num : 0
        mention_num = typeof (mention_num) == "number" ? mention_num : 0
        mention_num = mention_num < 6 ? mention_num : 4
        let comment_timeout = 1000 * 60 * (2 + mention_num)
        let author = null
        let material = null
        log("评论视频: " + video_url)
        if (!video_url) { throw "视频 url 为空" }
        commonFunc.taskStepRecordSet(40, null, "评论视频:" + video_url, null) //
        let comment_success_count = 0
        let comment_failed_count = 0
        let mention_success_count = 0
        let mention_failed_count = 0
        let err_msg = ""

        for (let comment_idx = 0; comment_idx < comment_num; comment_idx++) {
            try {
                if (author) {
                    launch(targetApp.bid)
                    randomSleep(3000)
                    for (let index = 0; index < 6; index++) {
                        if (id("com.ss.android.ugc.trill:id/title").text("@" + author).visibleToUser().findOne(3000)) { break }
                        else if (id("com.ss.android.ugc.trill:id/title").textMatches(".*comments").visibleToUser().findOne(3000)) { break }
                        else if (index > 4) { author = null; break }
                        else { back() }
                        sleep(3000)
                    }
                }
                author = author || targetApp.doOpenUrlVideo(video_url)
                if (!author) { throw "目标视频打开失败 " + video_url }
                let content = null
                try {
                    material = null
                    material = httpUtilFunc.materialGet(material_req_data, 3)
                    content = material && material.text_content ? material.text_content + commonFunc.randomEmojisFromTiktok(random(0, 3)) : null
                    if (!content) { throw "" }
                } catch (error) { throw "评论数据异常:" + error }
                let idx_mention = 0
                let is_mention_ready = false
                let is_comment_ready = false
                let comment_result = newThread(() => {
                    try {
                        while (true) {
                            if (!packageName("com.ss.android.ugc.trill").findOne(1)) {
                                toastLog("启动应用中...")
                                launch("com.ss.android.ugc.trill")
                                sleep(3000)
                            }
                            if (is_comment_ready && is_mention_ready && clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/a6g").visibleToUser().findOne(1000))) {
                                toastLog("点击发布评论")
                                return true
                            }
                            else if (clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/a5s").visibleToUser().findOne(1000))) {
                                if (!is_comment_ready) {
                                    sleep(3000)
                                    setText(content)
                                    toastLog("输入评论内容: " + content)
                                    sleep(2000)
                                    is_comment_ready = true
                                }
                                else if (idx_mention < mention_num) {
                                    let mention_material = null
                                    try {
                                        mention_material = httpUtilFunc.materialGet(mention_req_data, 3)
                                        let mention_name = mention_material ? mention_material.text_content : ""
                                        mention_name = mention_name.replace(/[^\w]/ig, "")
                                        if (!mention_name) { throw "昵称异常" }
                                        if (!mentionContact(mention_name)) { throw "" }
                                        mention_success_count += 1
                                    } catch (error) {
                                        mention_failed_count += 1
                                        // commonFunc.taskResultSet( "艾特失败:" + error, "a" ) 
                                        if (error == "Couldn't load. Try again later.") { throw error }
                                        else if (error.match("素材申请异常")) { throw "艾特" + error }
                                    }
                                    idx_mention += 1
                                }
                                else {
                                    is_mention_ready = true
                                    toastLog("评论编辑完成")
                                }
                            }
                            else if (clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/a5q").visibleToUser().findOne(1000))) {
                                toastLog("点击评论入口")
                                randomSleep(3000)
                            }
                            else if (clickIfWidgetExists(id("android:id/text1").text("For You").visibleToUser().selected(false).findOne(1))) {
                                sleep(3000)
                            }
                            else { back() }
                            sleep(3000)
                        }
                    } catch (error) {
                        throw error
                    }

                }, false, comment_timeout, () => { throw "界面异常超时退出" })
                if (!comment_result) { throw "" }
                comment_success_count += 1
                log("")
                //  休息等待
                let temp_rest_time = parseInt((gap_time) / 10)
                for (let index = temp_rest_time; index > 0; index--) {
                    toast("第 " + (comment_idx + 1) + " 条评论\n" + "休息倒数 " + index * 10 + " 秒")
                    sleep(10000)
                }
                sleep(random(1000, 10000))
                err_msg = ""
            } catch (error) {
                comment_failed_count += 1
                err_msg = "评论异常:" + commonFunc.objectToString(error)
                break
                // throw error
            }
        }
        if (!comment_success_count) { throw err_msg }
        commonFunc.taskStepRecordSet(40, null, "评论:成功-" + comment_success_count + "/" + comment_num + " 失败-" + comment_failed_count + "; 艾特:成功-" + mention_success_count + " 失败-" + mention_failed_count + (err_msg ? " \n异常信息:" + err_msg : ""), null) //
        if (err_msg.match("Couldn't load. Try again later.")) { throw err_msg }
        else if (err_msg.match("素材申请异常")) { throw err_msg }
        else if (err_msg.match("链接失效")) { throw err_msg }
        return true
    } catch (error) {
        throw error
    }
}
targetApp.doDragImageVerify = function () {
    getBinaryMatchPoints = function () {
        function getScaleX(x) {
            return parseInt(x * 480 / device.width)
        }
        function getScaleY(y) {
            return parseInt(y * 854 / device.height)
        }
        let timestamp = new Date().getTime()
        try {
            log("滑块验证 开始识别")
            let root_path = "/storage/emulated/" + commonFunc.userId + "/DCIM/"
            try {
                let file_list = files.listDir(root_path)
                for (let idx = 0; idx < file_list.length; idx++) {
                    let filename = file_list[idx]
                    files.remove(root_path + filename)
                }
            } catch (error) { }

            let bg_btn = idContains("captcha-verify-image").findOne(1)
            let icon = bg_btn.parent().child(1)

            let img_left = parseInt(bg_btn.bounds().left * 480 / device.width)
            let img_right = parseInt(bg_btn.bounds().right * 480 / device.width)
            let img_top = parseInt(bg_btn.bounds().top * 854 / device.height)
            let img_bottom = parseInt(bg_btn.bounds().bottom * 854 / device.height)
            let icon_top = parseInt(icon.bounds().top * 854 / device.height)
            let icon_width = parseInt((icon.bounds().right - icon.bounds().left) * 480 / device.width)
            let drag_btn = idContains("secsdk-captcha-drag-wrapper").findOne(1)
            let drag_x = drag_btn.bounds().centerX()
            let drag_y = drag_btn.bounds().centerY()
            let icon_clip_rects = [
                //  二分切片
                {
                    "x": 3,
                    "y": parseInt(icon_top - img_top + icon_width * 0.5),
                    "w": icon_width - 6,
                    "h": parseInt(icon_width * 0.5),
                },
                {
                    "x": parseInt(icon_width * 0.5),
                    "y": icon_top - img_top,
                    "w": parseInt(icon_width * 0.5),
                    "h": icon_width,
                },
                {
                    "x": 3,
                    "y": icon_top - img_top,
                    "w": icon_width - 6,
                    "h": parseInt(icon_width * 0.5),
                },
                {
                    "x": 3,
                    "y": icon_top - img_top,
                    "w": parseInt(icon_width * 0.5),
                    "h": icon_width,
                },
                //  四角切片
                {
                    "x": 0,
                    "y": parseInt(icon_top - img_top + icon_width * 0.5),
                    "w": parseInt(icon_width * 0.5),
                    "h": parseInt(icon_width * 0.5),
                },
                {
                    "x": parseInt(icon_width * 0.5),
                    "y": parseInt(icon_top - img_top + icon_width * 0.5),
                    "w": parseInt(icon_width * 0.5),
                    "h": parseInt(icon_width * 0.5),
                },
                {
                    "x": parseInt(icon_width * 0.5),
                    "y": parseInt(icon_top - img_top),
                    "w": parseInt(icon_width * 0.5),
                    "h": parseInt(icon_width * 0.5),
                },
                {
                    "x": 0,
                    "y": parseInt(icon_top - img_top),
                    "w": parseInt(icon_width * 0.5),
                    "h": parseInt(icon_width * 0.5),
                },
            ]
            shell("screencap " + root_path + "screen.png")
            let bg_path = root_path + "bg_img.png"
            //  保存背景图片
            try {
                let bg_img = images.read(root_path + "screen.png")
                bg_img = images.clip(bg_img, img_left, img_top, img_right - img_left, img_bottom - img_top)
                images.save(bg_img, bg_path)
                bg_img.recycle()
            } catch (error) {
                throw error
            }
            //  滑块切片识别
            for (let idx_rect = 0; idx_rect < icon_clip_rects.length; idx_rect++) {
                let rect = icon_clip_rects[idx_rect]
                for (let idx_1 = 0; idx_1 < 10; idx_1++) {
                    let thres1 = 200 - 5 * idx_1
                    let s_path = root_path + "s_img_" + thres1 + ".png"
                    let icon_path = root_path + "icon_img_" + idx_rect + "_" + thres1 + ".png"
                    let s_img = images.read(bg_path)
                    s_img = images.grayscale(s_img)
                    s_img = images.threshold(s_img, thres1, 255, "BINARY")
                    images.save(s_img, s_path)
                    let icon_img = images.clip(s_img, rect.x, rect.y, rect.w, rect.h)
                    images.save(icon_img, icon_path)
                    s_img.recycle()
                    icon_img.recycle()
                    let big_img = images.read(s_path)
                    let tar_img = images.read(icon_path)
                    for (let idx_2 = 0; idx_2 < 5; idx_2++) {
                        let thres2 = 0.8 - 0.05 * idx_2
                        let p = null
                        try {
                            p = findImageInRegion(big_img, tar_img, parseInt(icon_width * 1.5), icon_top - img_top - 10, big_img.width - parseInt(icon_width * 1.5) - 10, tar_img.height + 20, thres2);
                        } catch (error) {
                            log(JSON.stringify(error))
                            break
                        }
                        if (p) {
                            big_img.recycle()
                            tar_img.recycle()
                            let drag_distance = parseInt((p.x - rect.x) * device.width / 480)
                            log("滑块验证 识别成功，耗时 " + (new Date().getTime() - timestamp) / 1000 + "s")
                            return { "x1": drag_x, "y1": drag_y, "x2": drag_x + drag_distance, "y2": drag_y }
                        }
                    }
                    try {
                        big_img.recycle()
                        tar_img.recycle()
                    } catch (error) { }
                }
            }
        } catch (error) {
            throw error
        }
        log("滑块验证 识别失败，耗时 " + (new Date().getTime() - timestamp) / 1000 + "s")
        return null
    }
    for (let idx_loop = 1; idx_loop < 10; idx_loop++) {
        if (!packageName("com.ss.android.ugc.trill").findOne(1)) {
            toastLog("启动应用中...")
            launch("com.ss.android.ugc.trill")
            randomSleep(3000)
        }
        if (!desc("verify captcha").visibleToUser().findOne(3000)) { return true }
        log("第 " + idx_loop + " 次尝试识别")
        try {
            let p = getBinaryMatchPoints()
            if (p) {
                log("p --> " + commonFunc.objectToString(p))
                swipe(p.x1, p.y1, p.x2, p.y2, 2000)
                sleep(10000)
            }
            else { throw "" }
        } catch (error) {
            log("识别失败:" + commonFunc.objectToString(error))
        }
        if (clickIfWidgetClickable(desc("Refresh").findOne(1000))) { sleep(10000) }

    }
    return false
}
/**
 * 
 * @param {*} account 本机账号
 * @param {*} task_info 任务信息对象
 * @param {*} gap_time 关注休息时间
 * @param {*} visit_time 查看目标主页时间
 * @returns 
 */
targetApp.doFollow = function (account, task_info, gap_time, visit_time) {
    function inputBySplit(text) {
        try {
            let text_arr = text.toString().split("")
            for (let index = 0; index < text_arr.length; index++) {
                if (index == 0) { setText(text_arr[index]) }
                else { input(text_arr[index]) }
                sleep(random(200, 1000))
            }
            return true
        } catch (error) { }
        return false
    }

    try {
        let curr_account = account
        let username = task_info.username
        let errMsg = ""
        let is_followed = false
        is_followed = newThread(() => {
            while (true) {
                //  发现页 搜索框
                if (id("com.ss.android.ugc.trill:id/apy").visibleToUser().findOne(3000) || id("com.ss.android.ugc.trill:id/edt").visibleToUser().findOne(1)) {
                    log("搜索用户: " + username)
                    //  1. 点击输入框
                    clickIfWidgetExists(id("com.ss.android.ugc.trill:id/apy").visibleToUser().findOne(1000) || id("com.ss.android.ugc.trill:id/edt").visibleToUser().findOne(1000)) && randomSleep(3000)
                    //  2. 输入 目标用户名
                    // inputBySplit(username) && randomSleep(3000)
                    setText(username) && randomSleep(3000)
                    //  3. 点击搜索
                    clickIfWidgetExists(className("android.widget.TextView").text("Search").visibleToUser().findOne(2000)) && randomSleep(3000)
                    //  点击 Users 栏目
                    clickIfParentsClickable(id("android:id/text1").text("Users").visibleToUser().findOne(2000)) && randomSleep(3000)
                    //  搜索结果 用户名列表
                    id("com.ss.android.ugc.trill:id/efw").text(username).visibleToUser().findOne(10000)
                    for (let index = 0; index < 8; index++) {
                        if (clickIfParentsClickable(id("com.ss.android.ugc.trill:id/efw").text(username).visibleToUser().findOne(3000))) {
                            log("找到用户: " + username)
                            break
                        } else if (id("com.ss.android.ugc.trill:id/efw").visibleToUser().findOne(1000)) {
                            commonFunc.swipeUpSlowly()
                            randomSleep()
                        } else {
                            break
                        }
                    }
                    if (!id("com.ss.android.ugc.trill:id/ek8").text("@" + username).visibleToUser().findOne(10000)) {
                        errMsg = "搜索不到"
                        log(errMsg + ": " + username)
                        back(); randomSleep()
                    }
                }
                else if (id("com.ss.android.ugc.trill:id/ek8").text("@" + username).visibleToUser().findOne(1)) {
                    // log("目标主页: " + username)
                    randomSleep(5000)
                    if (clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/cqr").text("Follow").visibleToUser().clickable().findOne(5000))) {
                        log("关注用户: " + username)
                        randomSleep(3000)
                    }
                    else if (clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/cqr").text("Follow back").visibleToUser().clickable().findOne(5000))) {
                        log("回关用户: " + username)
                        randomSleep(3000)
                    }
                    if (id("com.ss.android.ugc.trill:id/d_b").text("Message").visibleToUser().clickable().findOne(1000)) {
                        log("已关注: " + username)
                        return true
                    }
                    else if (text("Requested").visibleToUser().findOne(1000)) {
                        log("已发送好友验证: " + username)
                        return true
                    }
                }
                else if (clickIfWidgetClickable(id(_ids.Tab_Discover).clickable().visibleToUser().findOne(1))) { toastLog("前往发现页"); randomSleep() }
                else if (targetApp.isOtherPage()) { }
                else if (!packageName(targetApp.bid).findOne(1)) {
                    toastLog("启动应用中...")
                    launch(targetApp.bid)
                    randomSleep(3000)
                }
                else { toastLog("unknow page"); back(); randomSleep(3000) }
                randomSleep()
            }
        }, false, 1000 * 60 * 2, () => { throw errMsg ? errMsg : "超时退出" })
        if (!is_followed) { throw "" }
        // 随机浏览目标主页视频 
        if (visit_time && typeof (visit_time) == "number") {
            try {
                newThread(() => {
                    while (true) {
                        if (textContains("account is private").visibleToUser().findOne(1000) || textContains("has not published").visibleToUser().findOne(1)) {
                            toastLog("目标主页无视频")
                            break
                        }
                        if (id("com.ss.android.ugc.trill:id/title").text("@" + username).visibleToUser().findOne(3000)) {
                            commonFunc.swipeUpSlowly()
                            if (textContains("reached the end").visibleToUser().findOne(1000)) { break }
                            toast("正在浏览目标主页视频")
                            randomSleep(5000, 30000)
                        }
                        else if (clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/aaz").visibleToUser().findOne(3000))) {
                            toastLog("开始浏览目标主页视频")
                            randomSleep(5000)
                        }
                        else if (targetApp.isOtherPage()) { }
                        else if (!packageName(targetApp.bid).findOne(1)) {
                            toastLog("启动应用中...")
                            launch(targetApp.bid)
                            randomSleep(3000)
                        }
                        else {
                            commonFunc.swipeDownSlowly()
                            if (textContains("reached the end").visibleToUser().findOne(1000)) { break }
                            toast("正在浏览目标主页视频")
                            randomSleep(5000, 60000)
                        }
                        sleep(3000)
                    }
                }, null, visit_time + 10000, () => { throw "目标主页浏览结束" })
                randomSleep(10000)
            } catch (error) { log(error) }
        } else if (gap_time && typeof (gap_time) == "number") {
            sleep(gap_time)
        }
        return is_followed
    } catch (error) {
        back(); randomSleep()
        back(); randomSleep()
        throw error
    }
}
/**
 * 打开指定链接的 视频
 * @param {*} video_url 
 * @param {*} timeout 
 * @returns 
 */
targetApp.doOpenUrlVideo = function (video_url, timeout) {
    try {
        randomSleep()
        return newThread(() => {
            for (let loop = 0; loop < 6; loop++) {
                app.openUrl(video_url)
                sleep(3000)
                for (let index = 0; index < 10; index++) {
                    if (text("open with Browser").visibleToUser().findOne(1000) && clickIfWidgetClickable(text("JUST ONCE").visibleToUser().findOne(1000))) { randomSleep(2000) }
                    if (text("Open with Browser").visibleToUser().findOne(1000) && clickIfWidgetClickable(text("JUST ONCE").visibleToUser().findOne(1000))) { randomSleep(2000) }
                    if (text("JUST ONCE").visibleToUser().findOne(1000) && clickIfParentsClickable(text("Browser").visibleToUser().findOne(1000))) { randomSleep(2000) }
                    targetApp.isOtherPage()
                    if (desc("Stop page load").visibleToUser().findOne(1000)) { log("网页加载中.."); sleep(3000) }
                    else if (id("com.android.browser:id/url").className("android.widget.EditText").textStartsWith("https://www.tiktok.com/@").findOne(1)) { break }
                    sleep(2000)
                }
                sleep(3000)
                if (loop > 2 && (descContains("this page isn't available").visibleToUser().findOne(1) || descContains("頁面無法使用").visibleToUser().findOne(1))) { throw "链接失效" }
                let urlEdit = id("com.android.browser:id/url").className("android.widget.EditText").textStartsWith("https://www.tiktok.com/@").findOne(3000)
                if (urlEdit && urlEdit.text().indexOf("https://www.tiktok.com/@") != -1) {
                    let author = urlEdit.text().match(/https:\/\/www.tiktok.com\/@([^\/]+)/)[1]
                    log(author)
                    let intent = new Intent(Intent.ACTION_VIEW, Uri.parse(urlEdit.text()));
                    intent.setPackage(targetApp.bid)
                    context.startActivity(intent);
                    sleep(5000)
                    randomSleep(3000)
                    for (let index = 0; index < 5; index++) {
                        if (text("@" + author).visibleToUser().findOne(1000)) {
                            log("已打开 " + author + "'s video")
                            return author
                        }
                        else if (clickIfWidgetExists(id("android:id/text1").text("For You").visibleToUser().selected(false).findOne(1))) {
                            sleep(3000)
                        }
                        sleep(3000)
                    }
                }
            }
        }, null, 1000 * 60 * 5, () => { throw "超时退出" })
    } catch (error) {
        throw "视频链接打开异常 " + error
    }
}
/**
 * 4、账号可以开始自动定时的发布视频
 * ret Boolean
 */
// targetApp.postVideo = function( account, url, desc, hashtags ){
targetApp.postVideo = function (account, post_data) {
    try {
        if (!isNotNullObject(post_data) || (!post_data.url && !post_data.filepath)) { throw "参数异常 " + commonFunc.objectToString(post_data) }
        if (!files.exists(post_data.filepath)) { throw "未检测到下载的视频文件: " + post_data.filepath }
        let videoUrl = post_data.url
        let content = post_data.desc
        let tags = post_data.hashtags || []
        let videoPath = "/storage/emulated/" + commonFunc.userId + "/DCIM/tiktok/post.mp4"
        let errMsg = ""
        let is_video_post = false
        is_video_post = newThread(() => {
            let current_username = targetApp.getLoginUsername()
            try { current_username = current_username.match('user.+ T') ? current_username.match('(user.+) T')[1] : current_username } catch (error) { }
            if (!current_username) { throw "检测当前账号用户名失败" }
            reportLog("用户名检测结果: " + (account.username == current_username) + "  " + account.username + " - " + current_username)
            let upload_process_start = ""
            while (true) {
                clickIfWidgetClickable(text("ALLOW").findOne(1)) && randomSleep()
                if (is_video_post && id(_ids.Tab_Home).visibleToUser().findOne(3000)) {
                    let upload_process = ""
                    if (id("com.ss.android.ugc.trill:id/cro").visibleToUser().findOne(3000)) {
                        newThread(() => {
                            unknow_flag = 0
                            let upload_start_timestamp = new Date().getTime()
                            while (true) {
                                if (targetApp.isOtherPage()) { }
                                let process_btn = id("com.ss.android.ugc.trill:id/cro").visibleToUser().findOne(3000)
                                if (process_btn) {
                                    upload_process = process_btn.text()
                                    upload_process_start = upload_process_start || upload_process
                                    toastLog("视频上传进度: " + upload_process)
                                }
                                else if (id(_ids.Tab_Home).visibleToUser().findOne(1)) {
                                    randomSleep(5000, 10000)
                                    //  检测是否提示上传失败
                                    try {
                                        toastLog("检测是否提示上传失败")
                                        let screenshot_path = '/storage/emulated/0/CloudMobile/cache/screen_480x854.png'
                                        let template_path = files.cwd() + '/res/upload_restart_30x30.png'
                                        try { files.remove(screenshot_path); sleep(2000) } catch (error) { }
                                        shell("screencap -p " + screenshot_path); sleep(2000)
                                        let screen_img = images.read(screenshot_path);
                                        let restart_img = images.read(template_path);
                                        let restart_btn_point = null
                                        try { toastLog(screen_img.width + "x" + screen_img.height) } catch (error) { }
                                        try { toastLog(restart_img.width + "x" + restart_img.height) } catch (error) { }
                                        if (screen_img && restart_img) {
                                            restart_btn_point = findImage(screen_img, restart_img, {
                                                region: [370, 80, 40, 40],
                                                threshold: 0.8
                                            });
                                        }
                                        try { screen_img.recycle(); restart_img.recycle() } catch (error) { }
                                        if (restart_btn_point) {
                                            reportLog("Failed to upload: " + restart_btn_point)
                                            restart_btn_point.x = parseInt((restart_btn_point.x + 15) * device.width / 480)
                                            restart_btn_point.y = parseInt((restart_btn_point.y + 15) * device.height / 854)
                                            upload_process = "重新发布视频: " + restart_btn_point + " - "
                                            commonFunc.taskStepRecordSet(40, null, "点击重新发布视频: " + restart_btn_point, null)
                                            reportLog(upload_process + click(restart_btn_point.x, restart_btn_point.y))
                                            sleep(15000)
                                            continue
                                        } else { log("未识别到弹窗通知") }
                                    } catch (error) { reportLog("图片检测异常: " + commonFunc.objectToString(error)) }
                                    reportLog("视频上传完成 ?")
                                    upload_process = '耗时' + (new Date().getTime() - upload_start_timestamp) / 1000 + 's; ' + upload_process + " -> 100%"
                                    break
                                }
                                else {
                                    if (++unknow_flag > 30) { throw "上传视频弹出未知页面" }
                                    toastLog("unknow page " + unknow_flag)
                                    back()
                                }
                                sleep(10000)
                            }
                        }, null, 1000 * 60 * 30, () => { throw "视频上传超时30分钟:" + upload_process_start + "->" + upload_process })
                    }
                    else {
                        upload_process = "未识别到进度条"
                        for (let index = 8; index > 0; index--) {
                            if (id(_ids.Tab_Home).visibleToUser().findOne(1)) {
                                toastLog("等待视频上传 " + index * 15 + "s")
                            }
                            else {
                                back()
                            }
                            sleep(15000)
                        }
                    }
                    home()
                    randomSleep()
                    for (let index = 0; index < 10; index++) {
                        targetApp.isOtherPage()
                        if (!packageName(targetApp.bid).findOne(1)) {
                            toastLog("启动应用中...")
                            launch(targetApp.bid)
                            randomSleep(3000)
                        }
                        randomSleep()
                        if (id("com.ss.android.ugc.trill:id/title").text("@" + current_username).visibleToUser().findOne(1000)) {
                            break
                        }
                        else if (textStartsWith("@").visibleToUser().findOne(1)) {
                            break
                        }
                        else if (index % 2 == 0) {
                            commonFunc.swipeUpSlowly()
                        }
                    }

                    return newThread(() => {
                        while (true) {
                            if (text("Edit profile").clickable().findOne(1000) || text("Set up profile").clickable().findOne(1000)) {
                                if (text("Drafts").findOne(1000)) { throw "发布失败, 发现视频被打入草稿箱" }
                                else {
                                    log("草稿箱为空, 发布成功")
                                    return true
                                }
                            }
                            else if (clickIfWidgetClickable(id(_ids.Tab_Me).findOne(3000)) && id(_ids.Tab_Me).selected().findOne(1)) {
                                sleep(500)
                                toastLog("首页检查")
                                if (clickIfWidgetExists(text("Skip").visibleToUser().findOne(3000)) || clickIfWidgetExists(text("Not now").visibleToUser().findOne(1))) {
                                    toastLog("跳过")
                                }
                            }
                            else if (targetApp.isOtherPage()) { }
                            else if (!packageName(targetApp.bid).findOne(1)) {
                                toastLog("启动应用中...")
                                launch(targetApp.bid)
                                randomSleep(3000)
                            }
                            else {
                                log("unknow page")
                                back()
                                sleep(3000)
                            }
                            sleep(1000)
                        }
                    }, false, 1000 * 60 * 2, () => { throw "发布结果识别失败" + upload_process })
                }
                else if (clickIfWidgetClickable(id(_ids.Tab_Post).clickable().visibleToUser().findOne(1))) {
                    sleep(1000)
                    clickIfWidgetClickable(text("ALLOW").findOne(3000))
                    sleep(1000)
                    if (text("CANCEL").clickable().visibleToUser().findOne(3000)) {
                        back()
                        sleep(2000)
                    }
                    randomSleep()
                }
                else if (clickIfParentsClickable(text("Upload").visibleToUser().findOne(1))) { //  upload

                }
                else if (text("You can select both videos and photos").visibleToUser().findOne(1)) {
                    sleep(5000)
                    //  检查是否视频过小
                    let video_time = id("com.ss.android.ugc.trill:id/ak7").textMatches(/\d\d\:\d\d/).visibleToUser().findOne(1000)
                    if (video_time && video_time.text()) {
                        log("视频时长-" + video_time.text())
                        if (video_time.text() < "00:04") { throw "视频文件时长小于4秒" }
                    }
                    clickIfParentsClickable(text("Videos").visibleToUser().findOne(3000)) && randomSleep()
                    if (!clickIfWidgetClickable(id(_ids.Post_Select_Video).visibleToUser().findOne(3000))) {
                        errMsg = "选择视频失败"
                        log("选择视频失败")
                        back()
                    } else { errMsg = "" }
                    randomSleep(3000)
                    reportLog("选择视频,下一步 " + clickIfWidgetClickable(text("Next").visibleToUser().findOne(1000)))
                    randomSleep(6000)

                    //  检查是否视频过小
                    video_time = id("com.ss.android.ugc.trill:id/ak7").textMatches(/\d\d\:\d\d/).visibleToUser().findOne(1000)
                    if (video_time && video_time.text()) {
                        log("视频时长-" + video_time.text())
                        if (video_time.text() < "00:04") { throw "视频文件时长小于4秒" }
                    }
                }
                else if (id(_ids.Post_Post_Button).text("Post").visibleToUser().findOne(1)) {
                    let content_btn = id(_ids.Post_Desc_EditText).findOne(1000)
                    if (content_btn && content_btn.setText(content + " ")) {
                        log("设置描述：" + content)
                        randomSleep(2000)
                    }
                    randomSleep()
                    for (let index = 0; index < 6; index++) {
                        if (clickIfParentsClickable(id(_ids.Post_Post_Button).text("Post").findOne(3000))) {
                            log("点击发布")
                            is_video_post = true
                            // randomSleep(5000)
                            if (id(_ids.Tab_Home).visibleToUser().findOne(3000)) {
                                log("识别到首页")
                                break
                            }
                        }
                        else if (clickIfWidgetClickable(text("Post Now").visibleToUser().findOne(1))) { sleep(3000) }
                        else if (text("Post").visibleToUser().findOne(1)) {
                            back()
                            log("点击返回")
                        }
                        else if (id(_ids.Tab_Home).visibleToUser().findOne(1)) {
                            log("识别到首页")
                            break
                        }
                        else if (targetApp.isOtherPage()) { toastLog("异常界面"); sleep(3000) }
                        else {
                            toastLog("异常界面检查")
                        }
                        randomSleep(3000)
                    }
                }
                else if (clickIfWidgetClickable(text("Next").visibleToUser().findOne(1))) { }
                else if (targetApp.isOtherPage()) { }
                else if (!packageName(targetApp.bid).findOne(1)) {
                    toastLog("启动应用中...")
                    launch(targetApp.bid)
                    randomSleep(3000)
                    if (!packageName(targetApp.bid).findOne(5000)) { errMsg = "应用启动失败" }
                }
                else { toastLog("unknow page"); back(); randomSleep(3000) }
                randomSleep()
            }
        }, false, 1000 * 60 * 40, () => { throw "超时退出 " + errMsg })
        return is_video_post
    } catch (error) {
        let msg = "上传结果: 失败 - " + commonFunc.objectToString(error) + "\n"
        reportLog(msg)
        throw error
    }
}
/**
 * 
 * @param {*} account 
 * @param {*} username 
 */
targetApp.doAtmosphereWithUsername = function (account, username, stayTime, followChance) {
    try {
        //  搜索并进入直播间
        newThread(() => {
            while (true) {
                //  发现页 搜索框
                if (id("com.ss.android.ugc.trill:id/apy").visibleToUser().findOne(3000) || id("com.ss.android.ugc.trill:id/edt").visibleToUser().findOne(1)) {
                    log("搜索用户: " + username)
                    //  1. 点击输入框
                    clickIfWidgetExists(id("com.ss.android.ugc.trill:id/apy").visibleToUser().findOne(1000) || id("com.ss.android.ugc.trill:id/edt").visibleToUser().findOne(1000)) && randomSleep(3000)
                    //  2. 输入 目标用户名
                    setText(username) && randomSleep(3000)
                    //  3. 点击搜索
                    clickIfWidgetExists(className("android.widget.TextView").text("Search").visibleToUser().findOne(2000)) && randomSleep(3000)
                    //  点击 Users 栏目
                    clickIfParentsClickable(id("android:id/text1").text("Users").visibleToUser().findOne(2000)) && randomSleep(3000)
                    //  搜索结果 用户名列表
                    id("com.ss.android.ugc.trill:id/efw").text(username).visibleToUser().findOne(10000)
                    for (let index = 0; index < 8; index++) {
                        if (clickIfParentsClickable(id("com.ss.android.ugc.trill:id/efw").text(username).visibleToUser().findOne(3000))) {
                            log("找到用户: " + username)
                            break
                        } else if (id("com.ss.android.ugc.trill:id/efw").visibleToUser().findOne(1000)) {
                            commonFunc.swipeUpSlowly()
                            randomSleep()
                        } else {
                            break
                        }
                    }
                    if (!id("com.ss.android.ugc.trill:id/ek8").text("@" + username).visibleToUser().findOne(10000)) {
                        errMsg = "搜索不到"
                        log(errMsg + ": " + username)
                        back(); randomSleep()
                    }
                }
                else if (id("com.ss.android.ugc.trill:id/ekk").text(username).visibleToUser().findOne(1000)) {
                    log("已进入直播间: " + username)
                    return true
                }
                else if (id("com.ss.android.ugc.trill:id/ek8").text("@" + username).visibleToUser().findOne(1)) {
                    log("目标主页: " + username)
                    randomSleep(3000)
                    if (text("LIVE").visibleToUser().findOne(3000) && clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/b5j").visibleToUser().clickable().findOne(3000))) {
                        log("点击进入直播间")
                        id("com.ss.android.ugc.trill:id/ekk").text(username).visibleToUser().findOne(3000)
                    } else {
                        log("该账号没有在直播")
                        throw "该账号没有在直播"
                    }
                }
                else if (clickIfWidgetClickable(id(_ids.Tab_Discover).clickable().visibleToUser().findOne(1))) { toastLog("前往发现页"); randomSleep() }
                else if (targetApp.isOtherPage()) { }
                else if (!packageName(targetApp.bid).findOne(1)) {
                    toastLog("启动应用中...")
                    launch(targetApp.bid)
                    randomSleep(3000)
                }
                else { toastLog("unknow page"); back(); randomSleep(3000) }
                randomSleep(2000)
            }
        }, false, 1000 * 60 * 2, () => { throw errMsg ? errMsg : "搜索主页超时退出" })

        stayTime = typeof (stayTime) == "number" ? stayTime : random(20, 50)
        followChance = typeof (followChance) == "number" ? followChance : 0
        if (id("com.ss.android.ugc.trill:id/ekk").text(username).visibleToUser().findOne(3000)) {
            log("直播间内: " + username)
            if (random(0, 99) < followChance && clickIfWidgetClickable(text("Follow").visibleToUser().clickable().findOne(1000))) {
                log("关注主播")
                commonFunc.taskStepRecordSet(null, null, "关注主播: " + username, null)
            }
            newThread(() => {
                while (true) {
                    if (targetApp.isOtherPage()) { }
                    if (id("com.ss.android.ugc.trill:id/ekk").text(username).visibleToUser().findOne(1)) {
                        toastLog("直播间内")
                    }
                    randomSleep(5000)
                }
            }, false, 1000 * stayTime, () => { })
            back(); sleep(3000)
            back(); sleep(3000)
            back(); sleep(3000)
            return true
        } else {
            throw "未识别到直播间界面"
        }
    } catch (error) {
        throw error
    }
}
/**
 * 
 * @param {*} delete_mode  1:删除; 2:隐藏
 * @param {*} views_min 
 * @param {*} delete_violation 
 */
targetApp.doRemoveViolation = function (delete_mode, views_min, delete_violation, ignore_index) {
    try {
        if (targetApp.getLoginStatus() == 1) {
            let delete_count = 0
            return newThread(() => {
                let is_marked = false
                let is_removed = false
                let finish_flag = 0
                let last_views = null
                while (true) {
                    if (targetApp.isOtherPage()) { }
                    if (!packageName(targetApp.bid).findOne(1)) {
                        toastLog("启动应用中...")
                        launch(targetApp.bid)
                        randomSleep(3000)
                    }
                    if (clickIfWidgetExists(textContains("Your account has multiple Community Guidelines violations").findOne(1000))) {
                        randomSleep(5000)
                        back()
                    }
                    else if (clickIfWidgetClickable(id(_ids.Tab_Me).findOne(3000)) && id(_ids.Tab_Me).selected().findOne(5000)) {
                        sleep(3000)
                        let views_list = id("com.ss.android.ugc.trill:id/eao").visibleToUser().find()
                        let match_view = null
                        let violation_video = id("com.ss.android.ugc.trill:id/cs2").text("Community Guidelines violation").visibleToUser().findOne(1000)
                        if (!violation_video && delete_mode) {
                            for (let index = ignore_index; index < views_list.length; index++) {
                                try {
                                    let fans_num = parseInt(views_list[index].text().replace(".", "").replace("K", "000").replace("M", "000000"))
                                    if (fans_num < views_min + 1) {
                                        temp_view = views_list[index]
                                        log("识别到播放量为 " + fans_num + " 的视频")
                                        try {
                                            if (temp_view.parent().id() == "com.ss.android.ugc.trill:id/a8o") {
                                                match_view = temp_view.parent().child(0)
                                            }
                                            else if (temp_view.parent().parent().id() == "com.ss.android.ugc.trill:id/a8o") {
                                                match_view = temp_view.parent().parent().child(0)
                                            }
                                            else {
                                                match_view = temp_view
                                            }
                                            break
                                        } catch (error) {
                                        }
                                        // break
                                    }
                                } catch (error) { }
                            }
                        }
                        if (violation_video) {
                            try {
                                let violation_view = null
                                if (violation_video.parent().id() == "com.ss.android.ugc.trill:id/a8o") {
                                    violation_view = violation_video.parent().child(0)
                                }
                                else if (violation_video.parent().parent().id() == "com.ss.android.ugc.trill:id/a8o") {
                                    violation_view = violation_video.parent().parent().child(0)
                                }
                                else {
                                    violation_view = violation_video
                                }
                                clickIfWidgetClickable(violation_view) || clickIfWidgetExists(violation_view)
                                randomSleep(5000)
                            } catch (error) { }
                            // if( id("com.ss.android.ugc.trill:id/czn").text("Community Guidelines violation: See details").visibleToUser().findOne(6000) ){
                            if (text("Community Guidelines violation: See details").visibleToUser().findOne(6000)) {
                                log("删除违规视频")
                                finish_flag = 0
                                delete_count += 1
                                randomSleep(3000)
                                clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/db7").visibleToUser().findOne(1000)) && randomSleep(3000)
                                randomSleep(3000)
                                clickIfParentsClickable(text("Delete").visibleToUser().findOne(1000)) && randomSleep(3000)
                                randomSleep(3000)
                                clickIfWidgetClickable(text("DELETE").visibleToUser().findOne(1000)) && randomSleep(3000)
                                randomSleep(3000)
                                back()
                                sleep(3000)
                            }
                            else {
                                log("未识别到视频界面")
                                back()
                                sleep(3000)
                            }
                        }
                        else if (match_view) {
                            try {
                                if (clickIfWidgetClickable(match_view) || clickIfWidgetExists(match_view)) {
                                    toastLog("点击匹配视频")
                                    is_marked = true
                                    sleep(3000)
                                } else {
                                    toastLog("点击视频失败")
                                }
                            } catch (error) { }
                            clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/db7").visibleToUser().findOne(1000)) && randomSleep(3000)
                            if (text("Send to").visibleToUser().findOne(3000)) {
                                for (let index = 0; index < 5; index++) {
                                    if (delete_mode == 1 && clickIfParentsClickable(text("Delete").visibleToUser().findOne(1000))) {
                                        toastLog("删除视频")
                                        finish_flag = 0
                                        delete_count += 1
                                        randomSleep(1000, 3000)
                                        clickIfWidgetClickable(text("DELETE").visibleToUser().findOne(3000)) && randomSleep(1000, 3000)
                                        break
                                    }
                                    else if (delete_mode == 2 && clickIfParentsClickable(text("Privacy settings").visibleToUser().findOne(1000))) {
                                        toastLog("隐藏视频")
                                        finish_flag = 0
                                        delete_count += 1
                                        randomSleep(1000, 3000)
                                        clickIfParentsClickable(text("Who can watch this video").visibleToUser().findOne(3000)) && randomSleep(1000, 3000)
                                        clickIfParentsClickable(text("Only me").visibleToUser().findOne(3000)) && randomSleep(1000, 3000)
                                        clickIfWidgetClickable(text("Confirm").visibleToUser().findOne(1000)) && randomSleep(1000, 3000)
                                        back()
                                        randomSleep(1000, 3000)
                                        back()
                                        randomSleep(1000, 3000)
                                        break
                                    }
                                    else if (!text("Cancel").visibleToUser().findOne(1)) { break }
                                    else {
                                        swipe(parseInt(device.width * (random(75, 95) / 100)), parseInt(device.height * (random(80, 90) / 100)), device.width * (random(5, 25) / 100), parseInt(device.height * (random(80, 90) / 100)), random(1000, 2000))
                                    }
                                    sleep(2000)
                                }
                            }
                            //  退回首页
                            for (let index = 0; index < 3; index++) {
                                if (id(_ids.Tab_Me).findOne(3000)) { break }
                                back()
                            }
                        }
                        else if (finish_flag > 30) {
                            toastLog("播放量任务检测完毕")
                            return delete_count
                        }
                        else {
                            finish_flag++
                            try {
                                if (!views_list.length || last_views == views_list[views_list.length - 1].text()) { finish_flag += 2 }
                                else { last_views = views_list[views_list.length - 1].text() }
                            } catch (error) { }
                            swipeUpSlowly()
                            toastLog("检查视频 " + finish_flag)
                        }
                    }
                    else {
                        back()
                        finish_flag++
                        toast("未知页面 " + finish_flag)
                    }
                    sleep(2000)
                }
            }, delete_count, 1000 * 60 * 30, () => { return delete_count })
        } else {
            throw "未识别到应用首页"
        }
    } catch (error) {
        // log(error)
        throw error
    }
}

/**
 * 给粉丝列表发送名片
 * @param {*} account 
 * @param {*} profile_name 
 * @param {*} visit_time 
 * @param {*} send_num 
 * @returns 
 */
targetApp.doSendContact = function (account, profile_name, visit_time, send_num) {
    let sent_count = 0
    let err_msg = null

    send_num = typeof (send_num) == "number" ? send_num : 0

    //  1. 先关注 目标账号
    try {
        if (!targetApp.doFollow(account, { "username": profile_name }, null, visit_time)) { throw profile_name }
        for (let index = 1; index < 10; index++) {
            if (id("com.ss.android.ugc.trill:id/ek8").text("@" + profile_name).visibleToUser().findOne(5000)) { break }
            else if (index % 3 == 0) { back(); sleep(3000) }
            else if (index > 8) { throw "未识别到目标主页" }
        }
    } catch (error) {
        throw "搜索名片异常:" + commonFunc.objectToString(error)
    }
    //  2. 分享 目标名片
    try {
        let timeout = 1000 * 60 * 8
        // let sent_users = []
        newThread(() => {
            let unknow_page = false
            let not_found_flag = 0
            let finish_flag = 0
            while (true) {
                unknow_page = false
                if (id("com.ss.android.ugc.trill:id/title_tv").text("Select multiple contacts").visibleToUser().findOne(3000)) {
                    for (let index = 0; index < 10; index++) {
                        let select_btn = descStartsWith("Done").visibleToUser().findOne(1000)
                        let select_num = 0
                        try { select_num = parseInt(select_btn.desc().match(/Done\((\d+)\)/)[1]) } catch (error) { }
                        if (select_num >= send_num) { finish_flag = 10; break }
                        if (!clickIfParentsClickable(id("com.ss.android.ugc.trill:id/a1m").selected(false).visibleToUser().findOne(3000))) { break }
                        finish_flag = 0
                        sleep(2000)
                    }
                    if (true) {
                        finish_flag += 1
                        if (finish_flag > 5) {
                            toastLog("好友遍历结束")
                            let select_btn = descStartsWith("Done").visibleToUser().findOne(1000)
                            if (clickIfWidgetClickable(select_btn)) {
                                let select_num = 0
                                try { select_num = parseInt(select_btn.desc().match(/Done\((\d+)\)/)[1]) } catch (error) { }
                                toastLog("已选数量:" + select_num)
                            }
                        } else {
                            swipeUpSlowly()
                            sleep(1000)
                        }
                    }
                }
                else if (clickIfWidgetClickable(desc("Multiple").visibleToUser().findOne(1))) {
                    toastLog("点击 Multiple 按钮"); unknow_page = true
                }
                else if (id("com.ss.android.ugc.trill:id/db6").visibleToUser().findOne(1)) {
                    let send_btn = id("com.ss.android.ugc.trill:id/db6").visibleToUser().findOne(1000)
                    if (clickIfWidgetClickable(send_btn)) {
                        sent_count = 1
                        try { sent_count = parseInt(send_btn.text().match(/Send\((\d+)\)/)[1]) } catch (error) { }
                        toastLog("发送数量:" + sent_count)
                        break
                    }
                    else {
                        back()
                    }
                }
                else if (text("Share to").visibleToUser().findOne(1)) {
                    if (clickIfParentsClickable(text("Message").visibleToUser().findOne(3000))) { toastLog("点击 Message") }
                    else { toastLog("未识别 Message 按钮"); unknow_page = true }
                }
                else if (id("com.ss.android.ugc.trill:id/ek8").text("@" + profile_name).visibleToUser().findOne(1)) {
                    if (clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/cqs").visibleToUser().findOne(3000))) { toastLog("点击主页菜单") }
                    else { toastLog("未识别到主页菜单"); unknow_page = true }
                }
                else if (id(_ids.Tab_Home).visibleToUser().findOne(1)) {
                    try {
                        if (!targetApp.doFollow(account, { "username": profile_name }, null, null)) { throw profile_name }
                    } catch (error) {
                        throw "未识别到名片主页"
                    }
                }
                else if (targetApp.isOtherPage()) { }
                else if (!packageName(targetApp.bid).findOne(1)) {
                    toastLog("启动应用中...")
                    launch(targetApp.bid)
                    randomSleep(3000)
                }
                else {
                    unknow_page = true
                    toastLog("unknow page")
                    // back()
                }
                if (unknow_page) {
                    not_found_flag += 1
                    if (not_found_flag % 3 == 0) { back(); sleep(3000) }
                }
                else { not_found_flag = 0 }
                sleep(1000)
            }
        }, null, timeout, () => { throw "超时退出" })
    } catch (error) {
        err_msg = "异常信息:" + commonFunc.objectToString(err_msg)
        if (!sent_count) { throw err_msg }
    }
    commonFunc.taskStepRecordSet(40, null, "私信名片: 完成-" + sent_count + "/" + send_num + (err_msg ? " \n" + err_msg : ""), null) //
    return true
}
/**
 * 给粉丝列表发送私信
 * @param {*} account 
 * @param {*} message_req_data 
 * @param {*} send_num 
 */
targetApp.doSendDirectMessage = function (account, message_req_data, send_num, gap_time) {
    let sent_count = 0
    let err_msg = null
    send_num = typeof (send_num) == "number" ? send_num : 0

    try {
        function getCurrentFriendList() {
            let friend_list = []
            let btn_list = id("com.ss.android.ugc.trill:id/ccb").visibleToUser().find()
            for (let index = 0; index < btn_list.length; index++) {
                let userInfo = { "username": null, "nickname": null, "isFriend": false }
                let user_btn = btn_list[index];
                try { userInfo.username = user_btn.text() } catch (error) { }
                try { userInfo.nickname = user_btn.parent().parent().child(1).text() } catch (error) { }
                try { userInfo.isFriend = user_btn.parent().parent().parent().child(2).id() == "com.ss.android.ugc.trill:id/az3" ? true : false } catch (error) { }
                friend_list[friend_list.length] = userInfo
            }
            return friend_list
        }
        let timeout = 1000 * 60 * 60
        let sent_users = []
        newThread(() => {
            let unknow_page = false
            let not_found_flag = 0
            let finish_flag = 0
            let is_sent = false
            while (true) {
                unknow_page = false
                if (id("com.ss.android.ugc.trill:id/title_tv").text("New chat").visibleToUser().findOne(3000)) {
                    if (sent_users.length > send_num) { toastLog("已发送 " + sent_users.length + " 条私信"); break }
                    let target_username = null
                    let curr_list = getCurrentFriendList()
                    for (let index = 0; index < curr_list.length; index++) {
                        let userInfo = curr_list[index]
                        if (sent_users.indexOf(userInfo.username) != -1) { continue }
                        if (!userInfo.isFriend) { break }
                        target_username = userInfo.username
                        break
                    }
                    if (!target_username) {
                        finish_flag += 1
                        if (finish_flag > 5) {
                            toastLog("好友遍历结束")
                            break
                        }
                        swipeUpSlowly()
                        sleep(1000)
                    } else if (clickIfParentsClickable(text(target_username).visibleToUser().findOne(3000))) {
                        toastLog("私信:" + target_username)
                        is_sent = false
                        sent_users[sent_users.length] = target_username
                        sleep(3000)
                    }
                }
                else if (id("com.ss.android.ugc.trill:id/title_tv").text("Direct messages").visibleToUser().findOne(1)) {
                    if (clickIfWidgetClickable(desc("More").clickable().findOne(3000))) { toastLog("进入好友列表") }
                    else { unknow_page = true; back() }
                }
                if (clickIfWidgetClickable(id(_ids.Tab_Inbox).findOne(3000)) && id(_ids.Tab_Inbox).selected().findOne(3000)) {
                    if (clickIfParentsClickable(id("com.ss.android.ugc.trill:id/e9o").findOne(3000))) { toastLog("进入聊天列表") }
                    else { unknow_page = true; back() }
                }
                else if (id("com.ss.android.ugc.trill:id/d_3").visibleToUser().findOne(1)) {
                    if (is_sent) { back() }
                    else {
                        let content = null
                        try {
                            content = httpUtilFunc.materialGet(message_req_data, 3).text_content
                        } catch (error) {
                            throw "评论" + error
                        }
                        if (content) {
                            setText(content)
                            sleep(2000)
                            toastLog("发送信息:" + clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/d_3").visibleToUser().findOne(3000)) + " - " + content)
                            is_sent = true
                            sent_count += 1
                            sleep(3000)
                            //  间隔时间
                            if (gap_time) {
                                sleep(gap_time)
                            }
                            back()
                        }
                    }
                }
                else if (targetApp.isOtherPage()) { }
                else if (!packageName(targetApp.bid).findOne(1)) {
                    toastLog("启动应用中...")
                    launch(targetApp.bid)
                    randomSleep(3000)
                }
                else {
                    unknow_page = true
                    toastLog("unknow page")
                    // back()
                }
                if (unknow_page) {
                    not_found_flag += 1
                    if (not_found_flag % 3 == 0) { back(); sleep(3000) }
                }
                else { not_found_flag = 0 }
                sleep(1000)
            }
        }, null, timeout, () => { toastLog("超时退出") })
    } catch (error) {
        err_msg = "异常信息:" + commonFunc.objectToString(error)
        if (!sent_count) { throw err_msg }
    }
    commonFunc.taskStepRecordSet(40, null, "私信任务: 完成-" + sent_count + "/" + send_num + (err_msg ? " \n" + err_msg : ""), null) //
}
targetApp.randomSwitchPage = function () {
    //  随机点击各个控件，两分钟后退出
    newThread(() => {
        for (let idx_loop = 0; idx_loop < 100; idx_loop++) {
            //  随机点击四个主菜单中的一个
            let idx_btn = random(5, 7)
            if (targetApp.isOtherPage()) {
            }
            else if (random(0, 100) < 60) {
                scrollShortUp()
            }
            else if (random(0, 100) < 30) {
                clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/bu" + idx_btn).clickable().findOne(3000))
            }
            else {

            }
            sleep(random(1000, 10000))
        }
    }, null, random(1000 * 60 * 2, 1000 * 60 * 5))
}
targetApp.register = function (unregister_data) {
    let account = unregister_data
    let frontapp_thread = null
    try {
        reportLog("开始注册 " + httpUtilFunc.getGlobalIp())
        let dialCode = null
        let phoneNumber = null
        let verifyType = null  //  1-napi; 2-globalsms; 3-
        let smsurl = null
        let username = null
        let PIN = null
        let new_PIN = null
        let user_agent = commonFunc.getRandomUA()
        try {
            dialCode = account.dialCode
            phoneNumber = account.phone
            smsurl = account.smsurl
            verifyType = account.verifyType
            toastLog("手机号码: +" + dialCode + " " + phoneNumber)
        } catch (error) {
            throw error
        }
        let verifyCode = null
        let lastCode = null
        try {   //  接码测试
            //  获取上一次的验证码, 以在后续获取时过滤掉, 主要用于 globalsms.io 接码
            lastCode = newThread(function () {
                for (let index = 0; index < 1; index++) {
                    let msg = ""
                    let res = http.get(smsurl, {
                        headers: {
                            'User-Agent': user_agent
                        }
                    })
                    if (smsurl.match(/.*napi.*/)) {
                        msg = res.body.json().message
                    } else if (smsurl.match(/.*globalsms.*/)) {
                        msg = res.body.string()
                    }
                    if (msg.match(/TikTok/i)) {
                        if (new RegExp(/.*\d\d\d-\d\d\d.*/).test(msg)) {
                            lastCode = msg.match(/(\d\d\d-\d\d\d)/)[1].replace("-", "").trim()
                        } else if (new RegExp(/.*\d\d\d\d\d\d.*/).test(msg)) {
                            lastCode = msg.match(/(\d\d\d\d\d\d)/)[1].trim()
                        }
                        else if (new RegExp(/.*\d\d\d\d.*/).test(msg)) {
                            lastCode = msg.match(/(\d\d\d\d)/)[1].trim()
                        }
                        reportLog("屏蔽旧的验证码: " + lastCode)
                        return lastCode
                    }
                    else if (msg.match(/We blocked access to/)) {
                        account.desc = "We blocked access to"
                        throw account.desc
                    }
                    else if (msg.match(/DOCTYPE html/)) {
                        account.desc = "<!DOCTYPE html >"
                        throw account.desc
                    }
                    else {
                        reportLog("接码测试: " + msg)
                    }
                }
            }, null, 1000 * 60)
        } catch (error) { reportLog("接码测试异常: " + commonFunc.objectToString(error)) }
        if (account.desc == "We blocked access to") { throw "接码测试异常: " + account.desc }
        launch(targetApp.bid)
        toastLog("启动应用")
        sleep(5000)
        frontapp_thread = targetApp.keepFrontAppThread()
        sleep(3000)
        //  1. 注册登录界面
        for (let index = 0; index < 10; index++) {
            if (textStartsWith("By signing up").visibleToUser().findOne(3000) || clickIfWidgetClickable(text("Don’t have an account? Sign up").visibleToUser().findOne(1))) {
                clickIfWidgetExists(text("Use phone or email").visibleToUser().findOne(3000) || text("Continue with phone or email").visibleToUser().findOne(1000))
                if (text("When’s your birthday?").visibleToUser().findOne(1000)) { break }
            }
            else if (clickIfWidgetClickable(text("Sign up").clickable().visibleToUser().findOne(1))) {
                toastLog("Sign up")
            }
            else if (clickIfWidgetClickable(id(_ids.Tab_Me).findOne(1)) && id(_ids.Tab_Me).selected().findOne(1)) {
                sleep(500)
                toastLog("首页检查")
                if (clickIfWidgetExists(text("Skip").visibleToUser().findOne(3000)) || clickIfWidgetExists(text("Not now").visibleToUser().findOne(1))) {
                    toastLog("跳过")
                }
                if (clickIfWidgetClickable(text("Sign up").clickable().visibleToUser().findOne(3000))) {
                    toastLog("Sign up")
                    randomSleep(3000)
                    continue
                }
                let nickname_view = textStartsWith("@").visibleToUser().findOne(3000)
                if (nickname_view) {
                    account.desc == "已有账号登录: " + nickname_view.text()
                    toastLog(account.desc)
                }
            }
            else if (targetApp.isOtherPage()) { }
            else { back() }
            randomSleep(3000)
        }
        if (textStartsWith("By signing up").visibleToUser().findOne(1000) || text("Don’t have an account? Sign up").visibleToUser().findOne(1)) { throw "注册界面跳转失败" }

        //  2. 注册生日界面
        if (text("When’s your birthday?").visibleToUser().findOne(3000)) {
            log("birthday")
            let month_view = id("com.ss.android.ugc.trill:id/c9e").findOne(1000)
            try {
                let btn_bounds = month_view.bounds()
                let scroll_m = random(0, 12)
                for (let index = 0; index < scroll_m; index++) {
                    if (currentPackage() == "com.android.inputmethod.latin") { back(); randomSleep() }
                    else { commonFunc.swipeWithBezier(btn_bounds.centerX(), btn_bounds.centerY(), btn_bounds.centerX(), btn_bounds.bottom, random(500, 1000)) }
                    randomSleep(100, 1000)
                }
            } catch (error) { log(error) }
            let day_view = id("com.ss.android.ugc.trill:id/acm").findOne(1000)
            try {
                let btn_bounds = day_view.bounds()
                let scroll_d = random(0, 30)
                for (let index = 0; index < scroll_d; index++) {
                    if (currentPackage() == "com.android.inputmethod.latin") { back(); randomSleep() }
                    else { commonFunc.swipeWithBezier(btn_bounds.centerX(), btn_bounds.centerY(), btn_bounds.centerX(), btn_bounds.bottom, random(500, 1000)) }
                    randomSleep(100, 300)
                }
            } catch (error) { log(error) }
            let year_view = id("com.ss.android.ugc.trill:id/et7").findOne(1000)
            try {
                let btn_bounds = year_view.bounds()
                let scroll_y = random(20, 40)
                for (let index = 0; index < scroll_y; index++) {
                    if (currentPackage() == "com.android.inputmethod.latin") { back(); randomSleep() }
                    else { commonFunc.swipeWithBezier(btn_bounds.centerX(), btn_bounds.centerY(), btn_bounds.centerX(), btn_bounds.bottom, random(500, 1000)) }
                    randomSleep(100, 300)
                }
            } catch (error) { log(error) }
            let birth_year = 2020
            try {
                let birthday = id("com.ss.android.ugc.trill:id/bd1").visibleToUser().findOne(1000).text()
                reportLog("出生年月: " + birthday)
                birth_year = parseInt(birthday.match(/.*, (\d+)/)[1])
            } catch (error) { }
            if (birth_year > 2002) { throw "生日设置异常: " + birth_year }

            for (let index = 0; index < 10; index++) {
                clickIfWidgetExists(text("Next").visibleToUser().findOne(1000)) && randomSleep(3000)
                if (id("com.ss.android.ugc.trill:id/c3q").text("Send code").visibleToUser().findOne(1000)) { break }
            }
        }
        if (text("When’s your birthday?").visibleToUser().findOne(1000)) { throw "生日设置跳转失败," + "尝试访问网址: www.tiktok.com - " + httpUtilFunc.isUrlAccessable("www.tiktok.com", "tiktok") }
        //  3. 输入号码界面     
        if (id("com.ss.android.ugc.trill:id/c3q").text("Send code").visibleToUser().findOne(10000)) {
            randomSleep()
            for (let index = 0; index < 5; index++) {
                let send_btn = id("com.ss.android.ugc.trill:id/c3q").text("Send code").findOne(1000)
                if (send_btn) {
                    try {
                        let dial_view = id("com.ss.android.ugc.trill:id/aar").findOne(1)
                        if (dial_view) {
                            reportLog("拨号代码: " + dial_view.text())
                            if (dial_view.text() != ("+" + dialCode)) { throw "拨号代码异常: " + dial_view.text() }
                        }
                    } catch (error) { throw error }
                    setText(phoneNumber)
                    randomSleep()
                    reportLog("发送验证码 " + clickIfParentsClickable(send_btn))
                    randomSleep(6000)
                    account.isUsed = true
                }
                let band_view = id("com.ss.android.ugc.trill:id/czd").visibleToUser().findOne(1000)
                if (band_view) { throw "phoneError - " + band_view.text() }
                if (textMatches(/Enter.*digit code/).visibleToUser().findOne(1000)) { break }
            }
        }
        if (id("com.ss.android.ugc.trill:id/c3q").text("Send code").visibleToUser().findOne(1000)) { throw "输入号码跳转失败" }
        //  4. 输入验证码界面
        if (textMatches(/Enter.*digit code/).visibleToUser().findOne(10000)) {
            reportLog("开始查收验证码: " + smsurl)
            for (let idx_sms_loop = 1; idx_sms_loop < 15; idx_sms_loop++) {
                try {
                    clickIfWidgetClickable(text("Resend code").clickable().findOne(1000)) && randomSleep(5000)
                    newThread(function () {
                        let msg = ""
                        let res = http.get(smsurl, {
                            headers: {
                                'User-Agent': user_agent
                            }
                        })
                        if (smsurl.match(/.*napi.*/)) {
                            msg = res.body.json().message
                        } else if (smsurl.match(/.*globalsms.*/) || smsurl.match(/.*ma37.com.*/)) {
                            msg = res.body.string()
                        }
                        idx_sms_loop == 1 ? reportLog("轮询查收-" + idx_sms_loop + ": " + msg) : log("轮询查收-" + idx_sms_loop + " " + msg)
                        if (msg.match(/TikTok/i)) {
                            if (new RegExp(/.*\d\d\d-\d\d\d.*/).test(msg)) {
                                verifyCode = msg.match(/(\d\d\d-\d\d\d)/)[1].replace("-", "").trim()
                            }
                            else if (new RegExp(/.*\d\d\d\d\d\d.*/).test(msg)) {
                                verifyCode = msg.match(/(\d\d\d\d\d\d)/)[1].trim()
                            }
                            else if (new RegExp(/.*\d\d\d\d.*/).test(msg)) {
                                verifyCode = msg.match(/(\d\d\d\d)/)[1].trim()
                            } else {
                                account.desc = msg
                            }
                        }
                        else if (idx_sms_loop == 13) {
                            account.desc = (msg.match(/We blocked access to/) ? "We blocked access to" : msg)
                            reportLog("轮询查收-" + idx_sms_loop + ": " + account.desc)
                        }
                        else if (msg.match(/We blocked access to/)) {
                            account.desc = "We blocked access to"
                        }
                        else if (msg.match(/DOCTYPE html/)) {
                            account.desc = "<!DOCTYPE html >"
                        }
                    }, null, 1000 * 60 * 3, () => { throw "接码超时退出" })
                } catch (error) {
                    account.desc = commonFunc.objectToString(error)
                    reportLog(commonFunc.objectToString(error))
                }
                if (verifyCode && verifyCode != lastCode) {
                    break   //    break from sms checking
                }
                if (account.desc == "We blocked access to") { break }
                sleep(10000)
            }
            try { id("com.ss.android.ugc.trill:id/czd").visibleToUser().findOne(1) && reportLog(id("com.ss.android.ugc.trill:id/czd").visibleToUser().findOne(1).text()) } catch (error) { }
            reportLog("获取的验证码: " + verifyCode)
            if (verifyCode) {
                newThread(() => {
                    while (true) {
                        if (!packageName(targetApp.bid).findOne(1)) {
                            break
                        }
                        if (textMatches(/Enter.*digit code/).visibleToUser().findOne(1000)) {
                            setText(verifyCode)
                            for (let index = 0; index < 10; index++) {
                                sleep(6000)
                                if (!textMatches(/Enter.*digit code/).visibleToUser().findOne(1000) || id("com.ss.android.ugc.trill:id/czd").visibleToUser().findOne(1)) { break }
                                toastLog("等待验证")
                            }
                            let band_view = id("com.ss.android.ugc.trill:id/czd").visibleToUser().findOne(1000)
                            if (textMatches(/Enter.*digit code/).visibleToUser().findOne(1) && band_view) { throw "verifyError - " + band_view.text() }
                        }
                        else if (text("Create password").findOne(2000)) {
                            let password = targetApp.getRandomPassword()
                            reportLog("设置密码: " + password + setText(password))
                            randomSleep(3000)
                            clickIfWidgetExists(text("Next").visibleToUser().findOne(3000))
                            account.password = password
                            text("Create username").findOne(6000)
                            let band_view = id("com.ss.android.ugc.trill:id/czd").visibleToUser().findOne(1000) //  No network connection
                            if (band_view && clickIfWidgetExists(text("Skip").visibleToUser().findOne(1))) {
                                account.password = null;
                                reportLog("passwordError - " + band_view.text())
                                account.desc = band_view.text()
                            }
                        }
                        else if (text("Swipe up").visibleToUser().findOne(1) && clickIfWidgetExists(text("Start watching").visibleToUser().findOne(1))) {
                            commonFunc.swipeUpSlowly()
                        }
                        else if (clickIfWidgetExists(text("Skip").visibleToUser().findOne(1)) || clickIfWidgetExists(text("Not now").visibleToUser().findOne(1))) {
                        }
                        else if (text("Swipe up for more").visibleToUser().findOne(1)) {
                            commonFunc.swipeUpSlowly()
                        }
                        else if (text("Discover").findOne(1)) {
                            break
                        }
                        else if (targetApp.isOtherPage()) { }
                        else {
                            toastLog("等待检测中")
                        }
                        sleep(3000)
                    }
                }, null, 1000 * 60 * 2, () => { })
            }
            else { throw "未获取到验证码 " + account.desc }
        }
        if (text("Enter 6-digit code").visibleToUser().findOne(1000)) { throw "验证页面跳转失败" }

        //  5. 检查注册登录情况
        for (let index = 0; index < 10; index++) {
            toastLog("登录检查 " + index)
            if (clickIfWidgetClickable(id(_ids.Tab_Me).findOne(3000)) && id(_ids.Tab_Me).selected().findOne(3000)) {
                sleep(500)
                try {
                    account.username = textStartsWith("@").visibleToUser().findOne(10000).text().match(/@(\S+)/)[1]
                    reportLog("账号昵称: " + account.username)
                    account.isSuccess = true
                    return account
                } catch (error) { reportLog("账号昵称显示异常") }
                if (text("Edit profile").clickable().visibleToUser().findOne(1000)) {
                    return account
                }
            }
            else if (text("Swipe up").visibleToUser().findOne(1) && clickIfWidgetExists(text("Start watching").visibleToUser().findOne(1))) { commonFunc.swipeUpSlowly() }
            else if (clickIfWidgetExists(text("Skip").visibleToUser().findOne(1)) || clickIfWidgetExists(text("Not now").visibleToUser().findOne(1))) { }
            else if (text("Swipe up for more").visibleToUser().findOne(1)) { commonFunc.swipeUpSlowly() }
            else if (targetApp.isOtherPage()) { }
            else {
                toastLog("unknow page")
            }
            randomSleep(2000)
        }
    } catch (error) {
        reportLog("注册过程异常 " + commonFunc.objectToString(error))
        account.desc = commonFunc.objectToString(error)
    }
    try { frontapp_thread.interrupt(); log("前台应用守护进程已关闭") } catch (error) { }
    account.isSuccess = false
    account.desc = account.desc != null ? account.desc : "其他异常情况"
    reportLog("注册结束")
    return account
}
targetApp.reportLogin = function (account) {
    try {

        let post_data = account
        post_data.actionType = account.actionType || 2  //  1-注册; 2-登录
        post_data.result = account.result || 1       //  0/1/-1  非空数字
        post_data.deviceId = commonFunc.deviceId
        post_data.folderId = commonFunc.folderId
        try { post_data.ip = post_data.ip ? post_data.ip : httpUtilFunc.getGlobalIp() } catch (error) { }
        reportLog("记录登陆信息: " + JSON.stringify(post_data))
        let url = "http://" + commonFunc.server + ":8000/user/loginrecord"
        let res = http.postJson(url, post_data)
        res = res.body.json()
        if (res.code == 200) {
            reportLog("记录登陆完成")
            return true
        } else {
            throw res
        }
    } catch (error) {
        reportLog("记录登陆失败 " + commonFunc.objectToString(error))
    }
    return false
}
/**
 * 
 * @param {*} anomaly_data 
 * @returns 
 */
targetApp.reportAnomaly = function (anomaly_data) {
    try {
        if (!commonFunc.isNotNullObject(anomaly_data)) { throw "参数异常 " + commonFunc.objectToString(anomaly_data) }
        httpUtilFunc.reportLog("账号反馈参数: " + commonFunc.objectToString(anomaly_data))
        let app_id = anomaly_data.app_id
        let app_secret = anomaly_data.app_secret
        if (!app_id || !app_secret) { throw "素材库账号异常: " + app_id + " " + app_secret }
        let args_data = {}
        args_data.anomaly_acct = anomaly_data.anomaly_acct
        args_data.anomaly_type = anomaly_data.anomaly_type || 0
        args_data.comment = anomaly_data.comment || ""
        try { args_data.link_ip = anomaly_data.link_ip || httpUtilFunc.getGlobalIp() } catch (error) { }
        args_data.task_id = commonFunc.taskid
        // args_data.box_no                = "unknow"
        args_data.mobile_no = commonFunc.deviceId
        args_data.folder_no = commonFunc.folderId
        args_data.folder_bind_param_id = commonFunc.androidId
        args_data.folder_device_model = commonFunc.brand + " " + commonFunc.model
        args_data.folder_device_os_version = device.release
        let call = "tiktok_anomaly_report"
        let version = "1.0.0"
        let ts = new Date().getTime()
        let sign = commonFunc.getmd5(app_id + ts + call + JSON.stringify(args_data) + version + app_secret)
        let data_json = {
            "data": {
                "app_id": app_id,
                "ts": ts,
                "call": call,
                "version": version,
                "args": args_data,
                "sign": sign
            }
        }
        reportLog("账号反馈提交: " + commonFunc.objectToString(data_json))
        return newThread(() => {
            let res = http.postJson("http://" + commonFunc.server + ":3002/i/a/", data_json)
            res = res.body.json()
            if (res.data && res.data.code == "000000") {
                return true
            }
            throw res
        }, false, 1000 * 60 * 2, () => { throw "http.post 超时退出" })
    } catch (error) {
        throw error
    }
}
targetApp.reportRegister = function (account, reportType) {
    try {
        account.deviceId = commonFunc.deviceId
        account.folderId = commonFunc.folderId
        account.androidId = commonFunc.androidId
        try { account.ip = account.ip || httpUtilFunc.getGlobalIp() } catch (error) { }
        account.deviceInfo = commonFunc.brand + "-" + commonFunc.model
        account.desc = account.desc || null
        let log_text = account.isSuccess ? "注册成功 " : "注册失败 " + account.desc + " - "
        if (reportType == 2) { log_text = "更新账号 " }
        reportLog(log_text + JSON.stringify(account), 1)
        let url = "http://" + commonFunc.server + ":8000/user/registered"
        let res = http.postJson(url, account)
        res = res.body.json()
        if (res.code == 200) {
            reportLog("记录注册结果完成: " + res.data)
            let record_account = JSON.parse(res.data)
            return record_account
        } else {
            throw res
        }
    } catch (error) {
        reportLog("记录注册结果失败 " + commonFunc.objectToString(error))
    }
    return null
}
targetApp.resetAccount = function (account) {
    try {
        reportLog("注册失败 " + account.desc + " - 重置账号: " + JSON.stringify(account), 1)
        let url = "http://" + commonFunc.server + ":8000/user/unregaccount"
        let res = http.postJson(url, account)
        res = res.body.json()
        // log( JSON.stringify(res) )
        if (res.code == 200) {
            reportLog("账号重置完成: " + res.data)
            let reset_account = JSON.parse(res.data)
            return reset_account
        } else {
            throw res
        }
    } catch (error) {
        reportLog("账号重置失败 " + commonFunc.objectToString(error))
    }
    return null
}
targetApp.switchToPro = function (account, category) {
    let new_account = account
    try {
        let max_timeout = 1000 * 60 * 3
        if (!isNotNullObject(account)) { throw "账号参数异常: " + JSON.stringify(account) }
        if (!category) { throw "参数异常: " + JSON.stringify(category) }
        let categories = [
            "Art & Crafts ",
            "Automotive & Transportation ",
            "Baby ",
            "Beauty ",
            "Clothing & Accessories ",
            "Education & Training ",
            "Electronics ",
            "Finance & Investing ",
            "Food & Beverage ",
            "Gaming ",
            "Health & Wellness ",
            "Home, Furniture & Appliances ",
            "Machinery & Equipment ",
            "Media & Entertainment ",
            "Personal Blog ",
            "Pets ",
            "Professional Services ",
            "Public Administration ",
            "Real Estate ",
            "Restaurants & Bars ",
            "Shopping & Retail ",
            "Software & Apps ",
            "Sports, Fitness & Outdoors ",
            "Travel & Tourism ",
            "Others ",
        ]
        if (categories.indexOf(category) < 0) { category = categories[random(0, categories.length - 1)] }
        let category_prefix = category
        try { category_prefix = category_prefix.match(/([a-zA-Z]+).*/)[1] } catch (error) { }

        newThread(() => {
            while (true) {
                if (clickIfWidgetClickable(id(_ids.Tab_Me).findOne(3000)) && id(_ids.Tab_Me).selected().findOne(3000)) {
                    sleep(500)
                    toastLog("首页检查")
                    clickIfWidgetClickable(id(_ids.Me_Nav_Right).clickable().findOne(1000))
                }
                else if (clickIfWidgetClickable(desc("Manage account").clickable().findOne(1) || text("Manage account").clickable().findOne(1))) { toastLog("点击 Manage account") }
                else if (clickIfParentsClickable(descContains("Best for brands").findOne(1000) || textContains("Best for brands").findOne(1000))) { toastLog("选择 Business类型") }
                else if (text("Account control").findOne(1)) {
                    if (text("Switch to Pro Account").findOne(5000)) {
                        log("点击升级账号-" + clickIfParentsClickable(text("Switch to Pro Account").findOne(3000)))
                        randomSleep(3000)
                        for (let index = 0; index < 10; index++) {
                            if (descContains("Best for brands").findOne(1000) || textContains("Best for brands").findOne(1)) { randomSleep(2000); break }
                            sleep(3000)
                        }
                    }
                    else if (text("Switch to Personal Account").findOne(1)) {
                        log("已开启商业账号")
                        back(); randomSleep(3000)
                        back(); randomSleep(3000)
                        new_account.isPro = true
                        return true
                    }
                    else {
                        throw "未获得商业号权限"
                    }
                }
                else if (textContains("Welcome to your Business").visibleToUser().findOne(1) && clickIfWidgetClickable(text("Skip").clickable().findOne(1))) {
                    log("已开启商业账号")
                    new_account.isPro = true
                    return true
                }
                else if (clickIfWidgetClickable(desc("Next").clickable().findOne(1) || text("Next").clickable().findOne(1)) && randomSleep(3000)) { }
                else if (clickIfWidgetClickable(text("Skip").clickable().findOne(1)) && randomSleep(3000)) { }
                else if (desc("Choose a category").findOne(1)) {
                    log("查找商业类型desc:'" + category + "'")
                    while (true) {
                        if (clickIfWidgetExists(descStartsWith(category_prefix).visibleToUser().findOne(1000))) {
                            log("1.选择商业类型:" + category)
                            clickIfWidgetExists(desc("Next").findOne(1000)) && randomSleep(2000)
                            clickIfWidgetClickable(desc("Next").clickable().findOne(1000))
                        }
                        sleep(2000)
                        if (clickIfWidgetClickable(descStartsWith(category_prefix).visibleToUser().findOne(1000))) {
                            log("2.选择商业类型:" + category)
                            clickIfWidgetExists(desc("Next").findOne(1000)) && randomSleep(2000)
                            clickIfWidgetClickable(desc("Next").clickable().findOne(1000))
                        }
                        sleep(2000)
                        if (commonFunc.clickWithShell(descStartsWith(category_prefix).visibleToUser().findOne(1000))) {
                            log("3.选择商业类型:" + category)
                            clickIfWidgetExists(desc("Next").findOne(1000)) && randomSleep(2000)
                            clickIfWidgetClickable(desc("Next").clickable().findOne(1000))
                        }
                        sleep(2000)
                        clickIfWidgetExists(desc("Next").findOne(1000)) && randomSleep(2000)
                        clickIfWidgetClickable(desc("Next").clickable().findOne(1000))
                        randomSleep(3000)
                        // if( clickIfWidgetExists( desc("Next").clickable().findOne(1000) ) && randomSleep(5000) ){}
                        if (!desc("Choose a category").findOne(3000)) { break }
                        swipeUpSlowly()
                        sleep(2000)
                    }
                }
                else if (text("Choose a category").findOne(1)) {
                    log("查找商业类型text:'" + category + "'")
                    while (true) {
                        if (clickIfWidgetExists(textStartsWith(category_prefix).visibleToUser().findOne(1000))) {
                            log("1.选择商业类型:" + category)
                            clickIfWidgetExists(text("Next").findOne(1000)) && randomSleep(2000)
                            clickIfWidgetClickable(text("Next").clickable().findOne(1000))
                        }
                        sleep(2000)
                        if (clickIfWidgetClickable(textStartsWith(category_prefix).visibleToUser().findOne(1000))) {
                            log("2.选择商业类型:" + category)
                            clickIfWidgetExists(text("Next").findOne(1000)) && randomSleep(2000)
                            clickIfWidgetClickable(text("Next").clickable().findOne(1000))
                        }
                        sleep(2000)
                        if (commonFunc.clickWithShell(textStartsWith(category_prefix).visibleToUser().findOne(1000))) {
                            log("3.选择商业类型:" + category)
                            clickIfWidgetExists(text("Next").findOne(1000)) && randomSleep(2000)
                            clickIfWidgetClickable(text("Next").clickable().findOne(1000))
                        }
                        sleep(2000)
                        clickIfWidgetExists(text("Next").findOne(1000)) && randomSleep(2000)
                        clickIfWidgetClickable(text("Next").clickable().findOne(1000))
                        randomSleep(3000)
                        if (!text("Choose a category").findOne(3000)) { break }
                        swipeUpSlowly()
                        sleep(2000)
                    }
                }
                else if (targetApp.isOtherPage()) { }
                else if (!packageName(targetApp.bid).findOne(1)) {
                    toastLog("启动应用中...")
                    launch(targetApp.bid)
                    randomSleep(3000)
                }
                else {
                    toastLog("unknow page")
                    back()
                    sleep(3000)
                }
                sleep(2000)
            }
        }, false, max_timeout, () => { throw "升级账号超时退出" })
        return new_account
    } catch (error) {
        throw error
    }
}
targetApp.watchVideos = function (timeout, regObj) {
    let swipeUpSlowly = function (duration) {
        // log("上滑一小截1次");
        var time_random = random(50, 200);
        var x1 = parseInt(device.width / (random(15, 25) / 10));
        var y1 = parseInt(device.height * (random(70, 80) / 100));
        var x2 = parseInt(device.width / (random(15, 25) / 10));
        var y2 = parseInt(device.height * (random(30, 50) / 100));
        swipe(x1, y1, x2, y2, duration);
        sleep(time_random);
    }
    try {
        log("开始视频任务")
        let viedoNum = viedoNum != null ? viedoNum : 200
        sleep(2000)
        launch("com.ss.android.ugc.trill")
        sleep(6000)
        if (id("com.ss.android.ugc.trill:id/dur").findOne(3000) && clickIfWidgetExists(id("android:id/text1").text("For You").findOne(1))) {
            randomSleep(3000)
        }
        else if (clickIfWidgetExists(id("android:id/text1").text("For You").findOne(1))) {
            randomSleep(3000)
        }
        let errMsg = ""
        let video_list = []
        let last_video = null
        let count_down = 5
        let video_count = 0
        let left_num = 0 //  random(0,5) //  查看关注列表视频数量
        let left_count = 0
        newThread(() => {
            for (let idx_loop = 1; idx_loop < viedoNum + 1; idx_loop++) {
                if (!packageName("com.ss.android.ugc.trill").findOne(1)) {
                    toastLog("启动应用中...")
                    launch("com.ss.android.ugc.trill")
                    randomSleep(3000)
                }
                else if (targetApp.isOtherPage()) { }
                //  首页回关注 推荐的粉丝
                if (id("android:id/text1").text("For You").findOne(5000) && id("android:id/text1").text("Following").findOne(1)) {
                    if (text("No network connection").visibleToUser().findOne(1) || text("Hot videos list is empty").findOne(1) || id("com.ss.android.ugc.trill:id/cct").visibleToUser().findOne(1)) {
                        for (let idx_refresh = 0; idx_refresh < 1; idx_refresh++) {
                            if (id("com.ss.android.ugc.trill:id/title").visibleToUser().findOne(1)) {
                                break
                            }
                            else if (clickIfWidgetClickable(text("Refresh").visibleToUser().clickable().findOne(1))) {
                                log("加载视频网络异常： Refresh")
                            }
                            else if (clickIfWidgetExists(id("android:id/text1").text("For You").findOne(3000))) {
                                log("加载视频网络异常： Refresh")
                                randomSleep(3000)
                            }
                            sleep(6000)
                        }
                        let btn = text("No network connection").visibleToUser().findOne(1) || text("Hot videos list is empty").findOne(1) || id("com.ss.android.ugc.trill:id/cct").visibleToUser().findOne(1)
                        if (btn) {
                            errMsg = "视频加载异常 --> " + btn.text()
                            throw errMsg
                        }
                    }
                    else if (id("com.ss.android.ugc.trill:id/a2z").findOne(1) || id("com.ss.android.ugc.trill:id/b27").findOne(1)) {
                        //  评论页面
                        back()
                        randomSleep(2000)
                    }
                    //  每次进入先随机查看 0-10 好友视频
                    if (id("android:id/text1").text("For You").selected().findOne(1)) {
                        if (video_count < left_num && clickIfWidgetExists(id("android:id/text1").text("Following").findOne(1))) {
                            log("查看好友视频列表")
                            randomSleep(3000)
                        }
                    }
                    else if (id("android:id/text1").text("Following").selected().findOne(1)) {
                        // log( "好友视频界面" )
                        if (video_count++ > left_num && clickIfWidgetExists(id("android:id/text1").text("For You").findOne(1))) {
                            log("查看推荐视频列表")
                            randomSleep(3000)
                        }
                    }
                    if (idx_loop > 0) {
                        swipeWithBezier(random(300, 800), random(1400, 1600), random(300, 800), random(300, 500), random(200, 800))
                    }
                    randomSleep(2000)
                    toastLog("看第 " + idx_loop + "个视频")
                    video_list[video_list.length] = idx_loop
                    random(1, 100) < 30 ? randomSleep(10000, 50000) : randomSleep(5000, 15000)
                }
                else if (text("Log in to TikTok").findOne(1) || text("Sign up for TikTok").findOne(1)) {
                    errMsg = "未登录账号"
                    throw errMsg
                }
                else {
                    count_down--
                    toastLog("返回")
                    back()
                }
                if (count_down < 0) {
                    errMsg = "界面异常 退出运行"
                    throw errMsg
                }
            }
        }, null, timeout)
        reportLog("脚本运行结束，已浏览视频数：" + video_list.length)
        return video_list
    } catch (error) {
        throw error
    }
}
targetApp.watchVideos_v18441 = function (viedoNum, regObj) {
    let swipeUpSlowly = function (duration) {
        // log("上滑一小截1次");
        var time_random = random(50, 200);
        var x1 = parseInt(device.width / (random(15, 25) / 10));
        var y1 = parseInt(device.height * (random(70, 80) / 100));
        var x2 = parseInt(device.width / (random(15, 25) / 10));
        var y2 = parseInt(device.height * (random(30, 50) / 100));
        swipe(x1, y1, x2, y2, duration);
        sleep(time_random);
    }
    try {
        log("开始视频任务")
        viedoNum = viedoNum != null ? viedoNum : 50
        requestScreenCapture(false);
        sleep(2000)
        launch("com.ss.android.ugc.trill")
        sleep(6000)
        if (id("com.ss.android.ugc.trill:id/dur").findOne(3000) && clickIfWidgetExists(id("android:id/text1").text("For You").findOne(1))) {
            randomSleep(3000)
        }
        else if (clickIfWidgetExists(id("android:id/text1").text("For You").findOne(1))) {
            randomSleep(3000)
        }
        let errMsg = ""
        let video_list = []
        let last_video = null
        let count_down = 5
        let video_count = 0
        let left_num = 0 //  random(0,5) //  查看关注列表视频数量
        let left_count = 0
        for (let idx_loop = 0; idx_loop < viedoNum; idx_loop++) {
            if (!packageName("com.ss.android.ugc.trill").findOne(1)) {
                toastLog("启动应用中...")
                launch("com.ss.android.ugc.trill")
                randomSleep(3000)
            }
            else if (clickIfWidgetExists(text("Okay").visibleToUser().findOne(1))) {
                log("Okay")
                randomSleep()
            }
            if (id("android:id/text1").text("For You").findOne(5000) && id("android:id/text1").text("Following").findOne(1)) {
                if (text("No network connection").visibleToUser().findOne(1) || text("Hot videos list is empty").findOne(1) || id("com.ss.android.ugc.trill:id/cct").visibleToUser().findOne(1)) {
                    for (let idx_refresh = 0; idx_refresh < 1; idx_refresh++) {
                        if (id("com.ss.android.ugc.trill:id/title").visibleToUser().findOne(1)) {
                            break
                        }
                        else if (clickIfWidgetClickable(text("Refresh").visibleToUser().clickable().findOne(1))) {
                            log("加载视频网络异常： Refresh")
                        }
                        else if (clickIfWidgetExists(id("android:id/text1").text("For You").findOne(3000))) {
                            log("加载视频网络异常： Refresh")
                            randomSleep(3000)
                        }
                        sleep(6000)
                    }
                    let btn = text("No network connection").visibleToUser().findOne(1) || text("Hot videos list is empty").findOne(1) || id("com.ss.android.ugc.trill:id/cct").visibleToUser().findOne(1)
                    if (btn) {
                        errMsg = "视频加载异常 --> " + btn.text()
                        // reportLog( errMsg, 2 )
                        throw errMsg
                    }
                }
                else if (id("com.ss.android.ugc.trill:id/a2z").findOne(1) || id("com.ss.android.ugc.trill:id/b27").findOne(1)) {
                    //  评论页面
                    back()
                    randomSleep(2000)
                }
                //  每次进入先随机查看 0-10 好友视频
                if (id("android:id/text1").text("For You").selected().findOne(1)) {
                    // log( "推荐视频界面" )
                    // if( id("com.ss.android.ugc.trill:id/dur").findOne(3000) && clickIfWidgetExists( id("android:id/text1").text("For You").findOne(1) ) ){
                    if (video_count < left_num && clickIfWidgetExists(id("android:id/text1").text("Following").findOne(1))) {
                        log("查看好友视频列表")
                        randomSleep(3000)
                    }
                }
                else if (id("android:id/text1").text("Following").selected().findOne(1)) {
                    // log( "好友视频界面" )
                    if (video_count++ > left_num && clickIfWidgetExists(id("android:id/text1").text("For You").findOne(1))) {
                        log("查看推荐视频列表")
                        randomSleep(3000)
                    }
                }
                if (idx_loop > 0) {
                    swipeWithBezier(random(300, 800), random(1400, 1600), random(300, 800), random(300, 500), random(200, 800))
                }
                randomSleep(2000)
                let videoInfo = targetApp.getVideoInfo()
                if (videoInfo.type == "ad") {
                    toastLog("识别到广告信息")
                    continue
                } else if (videoInfo.type == "live") {
                    toastLog("识别到直播信息")
                    randomSleep(3000, 10000)
                    continue
                }
                else {
                    if (!videoInfo.creator) {
                        back()
                        toastLog("未识别到视频")
                        randomSleep(3000)
                        // viedoNum = viedoNum -5
                        count_down--
                        continue
                    }
                    let video_flag = md5(videoInfo.creator + videoInfo.content)
                    if (video_flag == last_video) {
                        log("重复的视频")
                        viedoNum = viedoNum - 5
                        continue
                    }
                    last_video = video_flag
                    toast("观看视频中...")
                    log("观看视频中：" + JSON.stringify(videoInfo))
                    // let start_watch = new 
                    try {   //  点赞
                        let liek_reg = {
                            "rate": "100",
                            "creator": [
                            ],
                            "content": [
                                "cute",
                                "funny",
                            ],
                            "tags": [
                                "pet",
                                "cute",
                                "cat",
                                "dog",
                                "animal",
                            ],
                            "fx": [
                            ]
                        }
                        if (targetApp.checkIfVideosMatch(videoInfo, liek_reg) || random(0, 100) < 2) {
                            randomSleep(1000 * 10, 1000 * 30)
                            video_list.push(videoInfo)
                            try {
                                if (random(1, 100) < 20) {
                                    randomSleep(1000 * 10, 1000 * 30)
                                }
                                videoInfo.liked = videoInfo.liked == true ? true : id("com.ss.android.ugc.trill:id/abf").visibleToUser().clickable().findOne(1000).click()
                                toastLog("   点赞了该视频\n")
                                randomSleep(1000 * 3, 1000 * 10)
                            } catch (error) { }
                        }
                        else {
                            toastLog("点赞规则不匹配")
                        }
                    } catch (error) { }

                    //  关注
                    try {
                        let follow_reg = {
                            "rate": "100",
                            "creator": [
                                "pet"
                            ],
                            "content": [
                            ],
                            "tags": [
                                "pet",
                            ],
                            "fx": null
                        }
                        if (targetApp.checkIfVideosMatch(videoInfo, follow_reg)) {
                            randomSleep(1000 * 5, 1000 * 10)
                            video_list.push(videoInfo)
                            try {
                                if (random(1, 100) < 30) {
                                    randomSleep(1000 * 20, 1000 * 50)
                                }
                                videoInfo.followed = id("com.ss.android.ugc.trill:id/as4").visibleToUser().clickable().findOne(1000).click()
                                toastLog("   关注了该作者\n")
                                randomSleep(1000 * 3, 1000 * 15)
                            } catch (error) { }
                        }
                        else {
                            toastLog("关注规则不匹配")
                        }
                    } catch (error) { }
                    //  查看评论
                    try {
                        if (videoInfo.liked && videoInfo.commentNum && videoInfo.commentNum > 100 && random(0, 100) < 20) {
                            if (clickIfWidgetClickable(id("com.ss.android.ugc.trill:id/a2x").visibleToUser().findOne(1))) {
                                if (id("com.ss.android.ugc.trill:id/a2z").findOne(1) || id("com.ss.android.ugc.trill:id/b27").findOne(1)) {
                                    let read_page_num = random(0, 10)
                                    randomSleep(3000)
                                    for (let idx_comment = 0; idx_comment < read_page_num; idx_comment++) {
                                        swipeUpSlowly(random(1000, 5000))
                                        sleep(2000, 10000)
                                        let like_btns = id("com.ss.android.ugc.trill:id/bhx").visibleToUser().clickable().find()
                                        if (like_btns.length && random(0, 100) < 5) {
                                            clickIfWidgetClickable(like_btns[random(0, like_btns.length - 1)])
                                        }
                                    }
                                    back()
                                    randomSleep(2000)
                                }
                            }
                        }
                    } catch (error) {

                    }
                    if (id("com.ss.android.ugc.trill:id/a2z").findOne(1) || id("com.ss.android.ugc.trill:id/b27").findOne(1)) {
                        //  评论页面
                        back()
                        randomSleep(2000)
                    }
                    //  进入主页
                    randomSleep(1000, random(1, 100) < 20 ? 1000 * 30 : 1000 * 5)
                }
            }
            else if (text("Log in to TikTok").findOne(1) || text("Sign up for TikTok").findOne(1)) {
                errMsg = "未登录账号"
                throw errMsg
            }
            else {
                count_down--
                toastLog("返回")
                back()
            }
            if (count_down < 0) {
                errMsg = "界面异常 退出运行"
                // reportLog( errMsg, 2 )
                throw errMsg
            }
        }
        reportLog("脚本运行结束，已浏览视频数：" + video_list.length)
        return video_list
    } catch (error) {
        throw error
    }
}

targetApp.init()
module.exports = targetApp;