var httpUtilFunc = require("../http/httpUtils.js");
var utilsFunc = require("../util/utils.js")
var commonFun = require("../lib/common.js")
var enums = require("../util/enums")
var proxySettings = require("../vpn/proxySettings.js")
const { VPN_TYPE, VPN_PROXY_TIMELINESS, REGISTER_APP_ID, VPN_USE_ACTION_TAG } = require("../util/enums.js");
const { getIpByIpify } = require("../http/httpUtils.js");

var FIND_TIMEOUT = 750
var FIND_WIDGET_TIMEOUT = 750
var firstName = ""
var lastName = ""
var birthdayMonth = ""
var brithdayDay = ""
var brithdayYear = ""
var emailAddress = ""
var password = ""
var hasCheckInfoed = false 
var registerDone = false
var registerSignUp = false
var nickName = ""
var resgisterStatus = enums.REGISTER_STATUS.DEFAULT
var accountName = ""
var ip = "1"
var isBirthDayDone = false
var isCheckPassword = false
var isVpnConnect = false
//验证邮箱账户和密码
var encrypted_email = ""
var encrypted_email_password = ""
var selectBirthDayValue = ""
var isInputEmail = false;
var inputTime = 0
var emailCheckCount = 0
var startRegisterTime = 0
var mailCodeCount = 0
var lastMailCode = ""
var maxSendEmailCodeCount = 2
var getTaskCount = 0
// test()

var vpnInfos = [
    {"ip":"185.145.128.72","port":4113,"user":"u768$jhckPSKqFX*GB","pass":"88tr","ptype":"sock5"},
    {"ip":"185.145.130.56","port":4113,"user":"u768$QUmc8bBg0t*GB","pass":"88tr","ptype":"sock5"},
    {"ip":"185.145.130.56","port":4113,"user":"u768$8xDXQuVuqt*GB","pass":"88tr","ptype":"sock5"},
    {"ip":"185.145.130.58","port":4113,"user":"u768$R9uieqbXbs*GB","pass":"88tr","ptype":"sock5"},
    {"ip":"185.217.95.186","port":4113,"user":"u768$q8VPGYrg5m*GB","pass":"88tr","ptype":"sock5"},
    {"ip":"185.145.128.51","port":4113,"user":"u768$jPVl9viT6z*GB","pass":"88tr","ptype":"sock5"},
    {"ip":"185.145.130.58","port":4113,"user":"u768$TGDAqhsPA1*GB","pass":"88tr","ptype":"sock5"},
    {"ip":"185.145.130.58","port":4113,"user":"u768$BUTinqEhjb*GB","pass":"88tr","ptype":"sock5"},
    {"ip":"185.145.128.72","port":4113,"user":"u768$065FSlB3KA*GB","pass":"88tr","ptype":"sock5"},
    {"ip":"185.145.128.51","port":4113,"user":"u768$fPYd0vQs7e*GB","pass":"88tr","ptype":"sock5"}
]


commonFun.systemTimezoneSet("Europe/London")
// closeLocation()
// closeVPNSettings()
// checkTiktokInstall()
if (connectVPN()) {
    sleep(5000)
    resgisterTiktok()
}
// getRegisterInfo()

function getRegisterInfo () {
    try {
        var body = {
            "register_app_id": enums.REGISTER_APP_ID.TIKTOK,
            "limit": 1,
            "status": 0
        }
        var result = httpUtilFunc.httpRequest("registerAccountGet", body)
        var resultJson = result.body
        var resultData = resultJson.json().data;
        // toastLog(" result = " +resultJson.string())
        var code = resultData.code
        if (code == "000000") {
            var getRegisterIofoaccounts = resultData.data.accounts
            firstName = accounts[0].first_name
            lastName = accounts[0].last_name
            birthday = accounts[0].birthday
            nickName = accounts[0].nick_name
            birthdaySplitList = birthday.split("-")
            birthdayMonth = utilsFunc.transMonth(birthdaySplitList[1])
            brithdayDay = birthdaySplitList[2]
            brithdayYear = birthdaySplitList[0]
            emailAddress = accounts[0].email
            // emailAddress = "madgehoney745@gmail.com"
            password = accounts[0].password
            accountName = accounts[0].email.split("@")[0]
            encrypted_email = accounts[0].encrypted_email
            encrypted_email_password = accounts[0].encrypted_email_password
            toastLog(" firstName "+firstName +" lastName = "+lastName + " birthdayMonth = "+birthdayMonth +" email =  "+emailAddress)
            resgisterTiktok()
            home()
            // connectVPN()
            updateRegisterResult(accounts[0])
            sleep(15*1000)
            // shell("am broadcast --user 0 -a android.intent.action.AUTO_MASTER_CLEAR")
        } else {
            toastLog("任务获取失败")
            throw "任务获取失败"
        }
    } catch (error) {
        toastLog(" getRegisterIofo "+error)
        sleep(5000)
        getTaskCount++
		toastLog(" getTaskCount "+getTaskCount)
        if (getTaskCount < 3) {
            getRegisterInfo()
        }
    }
    
}
//点击VPN连接按钮
function connectVPN () {
    // if( !commonFunc.uninstallApp("fun.kitsunebi.kitsunebi4android") ){ reportLog("设备环境异常") }
    if( !proxySettings.kitsunebiInstall("http://192.168.91.3:8012/upload/e3acddc3-4ce1-4286-8ad6-f2c0e8bac093.apk") ){ throw "未安装 " + "fun.kitsunebi.kitsunebi4android" }
    var is_proxy_on = false
    var startVpnConnnectTime = new Date().getTime()
    do {

        var nowTime = new Date().getTime()
        if (nowTime - startVpnConnnectTime > 3 * 60 * 1000) {
            return false
        }
        try {
            httpUtilFunc.getIpByIpify()   
        } catch (error) {
            // throw error
            closeVPNSettings()
        }

        try {
            // closeVPNSettings()
            // is_proxy_on = proxySettings.kitsunebiSetup( getVpnConfigInfo() )  
            let vpnData = vpnInfos[random(0, 9)]
            is_proxy_on = proxySettings.kitsunebiSetup2(vpnData)
        } catch (error) {
            // throw error
            // reportLog( error )
            closeVPNSettings()
        }
        if (!is_proxy_on) {
            sleep(2000)
        }
    } while (!is_proxy_on)
    return true
    
}

function closeLocation () {
    var startVpnConnnectTime = new Date().getTime()
    do {
        toastLog("closeLocation")
        var nowTime = new Date().getTime()
        if (nowTime - startVpnConnnectTime > 3 * 60 * 1000) {
            return false
        }
        if( !packageName("com.android.settings").findOne(1) ){
            log( "kitsunebi launching .. " )
            launchApp("Settings")
            sleep(5000)
        }

        if (!packageName("com.android.settings").findOne(1)) {
            sleep(3000)
            continue
        }

        var settingPage = id("com.android.settings:id/dashboard_container").findOne(3000)
        if (settingPage != null) {
            var locationSetting = text("Security & location").id("android:id/title").findOne(3000)
            if (locationSetting != null) {
                commonFun.clickWidget(locationSetting)
                sleep(3000)
            } else {
                var locationSetting = text("System").id("android:id/title").findOne(1000)
                if (locationSetting != null) {
                    settingPage.scrollBackward()
                } else {
                    toastLog("scrolldown "+settingPage.scrollable())
                    settingPage.scrollForward()
                }
                
            }
        } else {
            back()
            sleep(3000)
        }
    
        var locationSettings = text("Location").id("android:id/title").findOne(3000)
        if (locationSettings != null) {
            commonFun.clickWidget(locationSettings)
            sleep(3000)
                
        }
        
        var switchBt = id("com.android.settings:id/switch_widget").findOne(3000)
        if (switchBt != null && switchBt.text() != "OFF") {
            commonFun.clickWidget(switchBt)
            sleep(3000)
            back()
            sleep(3000)
            back()
            sleep(3000)
            back()
            break
        } else if (switchBt != null && switchBt.text() == "OFF") {
            sleep(3000)
            back()
            sleep(3000)
            back()
            sleep(3000)
            back()
            break
        }

    
    } while (true)
}

function checkTiktokInstall () {
    if (!app.getAppName("com.ss.android.ugc.trill")) {
        toastLog("未安装Tik Tok")
        closeVPNSettings()
        if( !commonFun.tiktokInstall("http://192.168.91.3:8012/upload/7c207a62-dafc-48ce-ae55-af6d1d05c737.apk") ){ throw "未安装 " + "tiktok" }
    }
}

function getVpnConfigInfo () {
    var body = {
        "vpn_proxy_type": VPN_TYPE.SOCKS,
        "vpn_proxy_timeliness": VPN_PROXY_TIMELINESS.SHORT,
        "use_app_tag": REGISTER_APP_ID.TIKTOK,
        "use_action_tag": VPN_USE_ACTION_TAG.REGISTER,
        "addrStrict": 0,
        "country": "GB",
    }
    var result = httpUtilFunc.httpRequest("vpnProxyGet", body)
    var resultJson = result.body
    var resultData = resultJson.json().data;
    // toastLog(" result = " +resultJson.string())
    var code = resultData.code
    if (code == "000000") {
        var ipInfo = resultData.data.ips[0]
        return ipInfo
    } else {
        throw "获取VPN失败"
    }
    
}

function closeVPNSettings () {
    // launchApp("Settings")
    randomSleep()
    do {

        if( !packageName("com.android.settings").findOne(1) ){
            log( "kitsunebi launching .. " )
            launchApp("Settings")
            sleep(3000)
        }

        

        if (!packageName("com.android.settings").findOne(1)) {
            sleep(3000)
            continue
        }

        var settingPage = id("com.android.settings:id/dashboard_container").findOne(3000)
        if (settingPage != null) {
            var networkSetting = text("Network & Internet").findOne(FIND_WIDGET_TIMEOUT)
            if (networkSetting != null) {
                commonFun.clickWidget(networkSetting)
                randomSleep()
            } else {
                settingPage.scrollBackward()
            }
        } else {
            back()
            sleep(3000)
        }
    
        var vpnSettings = text("VPN").id("android:id/title").findOne(500)
        if (vpnSettings != null) {
            commonFun.clickWidget(vpnSettings)
            randomSleep()
                
        }
    
        var  KitsunebiSetting = text("Kitsunebi").id("android:id/title").findOne(500)
            if (KitsunebiSetting != null ) {
                commonFun.clickWidget(id("com.android.settings:id/settings_button").findOne(500))
                randomSleep()
            }
        
        var switchBt = id("android:id/switch_widget").findOne(FIND_WIDGET_TIMEOUT)
        if (switchBt != null && switchBt.text() != "OFF") {
            commonFun.clickWidget(switchBt)
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            break
        } else if (switchBt != null && switchBt.text() == "OFF") {
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            break
        }

        var noVPN = text("No VPNs added").findOne(500)
        if (noVPN != null) {
            sleep(500)
            back()
            sleep(500)
            back()
            sleep(500)
            back()
            break
        }
    } while(true)
    
}

function resgisterTiktok() {
    commonFun.clearData("com.ss.android.ugc.trill")
    sleep(5 * 1000)
    var vpnState = SLChanges.getVPNLinkState()
    toastLog(" vpnState1 "+vpnState)
    if (!vpnState) {
        checkVPNConnect()
    }
    // launchApp("TikTok");
    startRegisterTime = new Date().getTime()
    // randomSleep()
    toastLog("start1")
    randomSleep()
    var launchAppCount =  0
    do {

        if( !packageName("com.ss.android.ugc.trill").findOne(1) ){

            log( "TikTok launching .. launchAppCount "+launchAppCount )
            launchApp("TikTok")
            sleep(3000)
            launchAppCount ++
            var vpnState = SLChanges.getVPNLinkState()
            toastLog(" vpnState "+vpnState)
            if (!vpnState) {
                checkVPNConnect()
            }
        }

        try {
            var nowTime = new Date().getTime()
            if (nowTime - startRegisterTime > 10*60*1000) {
                registerDone = true
                registerSignUp = true
                if (resgisterStatus == enums.REGISTER_STATUS.DEFAULT) {
                    resgisterStatus = enums.REGISTER_STATUS.FAIL
                }
                break
            }
            if (!isBirthDayDone) {
                checkSignUpPage()
                checkBirthDayPage()
            }
            checkSignUpEmail()
            checkVerifyPicture()
            checkCreatePassword()
            checkVerifyCode()
            checkAlreadySignUp()
            if (isCheckPassword) {
                checkUserName()
                chooseYourInterests()
                checkSwipeUp()
            }
            startTiktok()
            if (registerDone && registerSignUp) {
                break
            }
        } catch (error) {
            toastLog(" register error "+error)
        }
        
    } while (true)
}

function checkVPNConnect () {
    do {
        try {
            if( !packageName("fun.kitsunebi.kitsunebi4android").findOne(1) ){
                log( "kitsunebi launching .. " )
                launch("fun.kitsunebi.kitsunebi4android")
                sleep(6000)
            }
        
            //  首页
            if( className("android.widget.TextView").text("Kitsunebi").findOne(1000) && id("fun.kitsunebi.kitsunebi4android:id/add_btn").findOne(1) ){
                if( id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) ){     
                    toastLog("代理正常" )
                    return true
                } else {
                    clickIfWidgetClickable( id( "fun.kitsunebi.kitsunebi4android:id/fab" ).findOne(1) ) && toastLog("启动代理")
                    id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) || clickIfWidgetClickable( text("OK").findOne(1) )
                    id("fun.kitsunebi.kitsunebi4android:id/running_indicator").text("running").findOne(3000) || clickIfWidgetClickable( id( "fun.kitsunebi.kitsunebi4android:id/fab" ).findOne(1) ) && toastLog("启动代理")
        
                }
            }
        } catch (error) {
            toastLog(error)
            break
        }
    } while (true)
}

function updateRegisterResult (account) {
    toastLog("updateRegisterResult status "+resgisterStatus)
    var uploadDone = false
    var updateErrorCount = 0
    do {
        try {
            var resultBody = {
                "id": account.id,
                "password": account.password,
                "email": emailAddress,
                "register_ip": httpUtilFunc.getIpByIpify(),
                "status": resgisterStatus,
                "account": accountName,
                "register_app_id": enums.REGISTER_APP_ID.TIKTOK,
                "birthday": selectBirthDayValue,
                "device_unique_key": commonFun.deviceId+":"+commonFun.folderId
            }
            toastLog(" updateRegisterResult ")
            var result = httpUtilFunc.httpRequest("registerAccountUpdate", resultBody)
            toastLog(" updateRegisterResult result "+result.body.string())
            uploadDone = true
        } catch (error) {
            toastLog(error)
            updateErrorCount ++
            sleep(5*1000)
        }
        if (updateErrorCount > 3) {
            closeVPNSettings()
            updateErrorCount = 0
        }
    } while (!uploadDone)
    
}

function checkSignUpPage () {
    toastLog("checkSignUpPage")
    var signUpText = text("Sign up for TikTok").id("com.ss.android.ugc.trill:id/title").findOne(FIND_WIDGET_TIMEOUT)
    var welcomeToTiktok = text("Welcome to TikTok").id("com.ss.android.ugc.trill:id/title").findOne(FIND_WIDGET_TIMEOUT)
    if (signUpText != null || welcomeToTiktok != null) {
        var continuePhoneOrEmail = text("Continue with phone or email").id("com.ss.android.ugc.trill:id/a13").findOne(FIND_WIDGET_TIMEOUT)
        var usePhoneEmail = text("Use phone or email").id("com.ss.android.ugc.trill:id/a13").findOne(FIND_WIDGET_TIMEOUT)
        if (usePhoneEmail != null || continuePhoneOrEmail != null) {
            if (continuePhoneOrEmail != null) {
                usePhoneEmail = continuePhoneOrEmail
            }
            commonFun.clickWidget(usePhoneEmail)
            randomSleep()
        }
    }
}

function checkBirthDayPage (){
    toastLog("checkBirthDayPage")
    var birthdayText = text("When’s your birthday?").id("com.ss.android.ugc.trill:id/oo").findOne(FIND_WIDGET_TIMEOUT)
    if (birthdayText != null) {

        var birthDayEdit = id("com.ss.android.ugc.trill:id/bd1").className("android.widget.EditText").findOne(FIND_WIDGET_TIMEOUT)
        if (birthDayEdit != null) {
            var birthDayEditText = birthDayEdit.text()
            toastLog("birthDayEditText = "+birthDayEditText)
            if (birthDayEditText != "") {
                var birthYear = birthDayEditText.split(",")[1]
                if (!(birthYear > 1988 && birthYear < 2005)) {
                    selectBirthDay()
                }
            } else {
                selectBirthDay()
            }
            toastLog(" birthDayEdit.text()1 "+birthDayEdit.text())
            var birthDayEdit2 = id("com.ss.android.ugc.trill:id/bd1").className("android.widget.EditText").findOne(500)
            toastLog(" birthDayEdit.text() "+birthDayEdit2.text())
            selectBirthDayValue = birthDayEdit2.text()
        }
        
        var nextBt = id("com.ss.android.ugc.trill:id/c3q").text("Next").findOne(FIND_WIDGET_TIMEOUT)
        if (nextBt != null) {
            randomSleep()
            commonFun.clickWidget(nextBt)
            randomSleep()
        }
    }
}

function selectBirthDay () {
    //月份
    var monthList = id("com.ss.android.ugc.trill:id/c9e").findOne(FIND_WIDGET_TIMEOUT)
    if (monthList != null) {
        var b = monthList.bounds()
        var top = b.top
        var bottom = b.bottom
        var left = b.left
        var right = b.right
        var listItemHeight = Math.floor((bottom - top) / 3)
        var randomSwipe = random(1,5)
        var randomScollDirection = random(0,6)
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
            toastLog(" swipeHeight "+ swipeHeight + " , listItemHeight "+listItemHeight)
            swipe(startX, startY, endX, endY, random(500, 1500))
            swipeCount++
        } while (swipeCount < randomSwipe)
    }
    randomSleep()
    //日期
    var dayList = id("com.ss.android.ugc.trill:id/acm").findOne(FIND_WIDGET_TIMEOUT)
    if (dayList != null) {
        var b = dayList.bounds()
        var top = b.top
        var bottom = b.bottom
        var left = b.left
        var right = b.right
        var listItemHeight = Math.floor((bottom - top) / 3)
        var randomSwipe = random(3,6)
        var swipeCount = 0
        var randomDayScollDirection = random(0,6)
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
            toastLog(" swipeHeight "+ swipeHeight + " , listItemHeight "+listItemHeight)
            swipe(startX, startY, endX, endY, random(500, 1500))
            swipeCount++
        } while (swipeCount < randomSwipe)
    }
    randomSleep()
    //年份
    var yearList = id("com.ss.android.ugc.trill:id/et7").findOne(FIND_WIDGET_TIMEOUT)
    if (yearList != null) {
        var b = yearList.bounds()
        var top = b.top
        var bottom = b.bottom
        var left = b.left
        var right = b.right
        var listItemHeight = Math.floor((bottom - top) / 3)
        var randomSwipe = random(12,15)
        var swipeCount = 0
        do {
            var startX = random(left, right)
            var startY = random(bottom - Math.floor(listItemHeight / 2), bottom)
            var endX = random(left, right)
            var endY = random(top, top + Math.floor(listItemHeight / 2))
            var swipeHeight = startY - endY
            toastLog(" swipeHeight "+ swipeHeight + " , listItemHeight "+listItemHeight)
            swipe(endX, endY, startX, startY, random(200, 400))
            sleep(random(300, 500))
            swipeCount++
        } while (swipeCount < randomSwipe)
    }
}

function checkSignUpEmail() {
    toastLog("checkSignUpEmail a")
    var nowTime = new Date().getTime()
    if (isInputEmail && nowTime - inputTime > 1.5 * 60* 1000 ) {
        var titleText = text("Verify to continue:").findOne(FIND_TIMEOUT) ||
            desc("Verify to continue:").findOne(FIND_TIMEOUT) ||
            text("Verification:").findOne(FIND_TIMEOUT)
            toastLog("titleText value "+(titleText == null))
        if (titleText == null) {
            isInputEmail = false
            if (emailCheckCount > 3) {
                registerDone = true
                registerSignUp = true
                resgisterStatus = enums.REGISTER_STATUS.PHOTO_VERIFY_TIMEOUT
            }
            emailCheckCount ++
            resgisterStatus = enums.REGISTER_STATUS.PHOTO_VERIFY_TIMEOUT
            toastLog("emailCheckCount = "+emailCheckCount)
            back()
            randomSleep()
        } else {
            emailCheckCount = 0
            isInputEmail = false
        }
    }
    var signUpEmail = text("Sign up").id("com.ss.android.ugc.trill:id/title").findOne(FIND_WIDGET_TIMEOUT)
    // toastLog("signUpEmail = "+signUpEmail)
    if (signUpEmail != null) {
        var emailTab = text("Email").id("android:id/text1").findOne(FIND_WIDGET_TIMEOUT)
        if (emailTab != null) {
            toastLog("signUpEmail in")
            // isBirthDayDone = true
            randomSleep()
            commonFun.clickWidget(emailTab)
            randomSleep()
            var emailInput = id("com.ss.android.ugc.trill:id/bd1").className("EditText").findOnce(1)
            if (emailInput != null) {
                emailInput.click()
                randomSleep()
                toastLog("emailInput.text() "+emailInput.text())
                if (emailInput.text() != emailAddress) {
                    commonFun.inputEditText(1,emailAddress)
                    // randomSleep()
                }
                back()
                randomSleep()
                var nextBt = id("com.ss.android.ugc.trill:id/c3q").text("Next").findOne(FIND_WIDGET_TIMEOUT)
                if (nextBt != null) {
                    commonFun.clickWidget(nextBt)
                    toastLog("click next")
                    isInputEmail = true
                    inputTime = new Date().getTime()
                    randomSleep()
                }
            }
        }
    }
}

function checkVerifyPicture () {
    toastLog("checkVerifyPicture")
    var titleText = text("Verify to continue:").findOne(FIND_TIMEOUT)
    var titleDesc = desc("Verify to continue:").findOne(FIND_TIMEOUT)
    // var dragDesc = desc("Drag the puzzle piece into place").findOne(1500)
    if (titleText != null || titleDesc != null) {
        // verifyPicture()
        var startVerfyTime = new Date().getTime()
        do {
            var nowTime = new Date().getTime()
            if (nowTime - startVerfyTime > 5 * 60 *1000) {
                break
            }
            verifyPicture()
            var titleText = text("Verify to continue:").findOne(FIND_TIMEOUT)
            var titleDesc = desc("Verify to continue:").findOne(FIND_TIMEOUT)
            if (titleText == null && titleDesc == null) {
                break
            }
        } while (true)
    }



    var canNotLoadDesc = desc("Couldn’t load image. Refresh to try again.").findOne(FIND_TIMEOUT)
    var canNotLoadText = text("Couldn’t load image. Refresh to try again.").findOne(FIND_TIMEOUT)
    var canNotLoadDesc2 = desc("No internet connection. Please try again.").findOne(FIND_TIMEOUT)
    var canNotLoadText2 = desc("No internet connection. Please try again.").findOne(FIND_TIMEOUT)
    if (canNotLoadDesc != null || canNotLoadDesc2 != null || canNotLoadText != null || canNotLoadText2 != null) {
        randomSleep()
        var refresh = desc("Refresh").findOne(FIND_TIMEOUT)
        if (refresh != null) {
            commonFun.clickWidget(refresh)
        }
        var refreshText = text("Refresh").findOne(FIND_TIMEOUT)
        if (refreshText != null) {
            commonFun.clickWidget(refreshText)
        }
    }

    var securityVerifyText = text("Security Verify").findOne(FIND_TIMEOUT)
        if (securityVerifyText != null) {
            back()
            sleep(800)
            // var nextBt = id("com.ss.android.ugc.trill:id/c3q").text("Next").findOne(FIND_WIDGET_TIMEOUT)
            //     if (nextBt != null) {
            //         commonFun.clickWidget(nextBt)
            //         toastLog("click next")
            //         randomSleep()
            //     }
        }
}

function verifyPicture () {
    toastLog("checkVerifyPicture in")
    isInputEmail = false
    emailCheckCount = 0
    var startVerifyPictureTime = 0
    do {
        var nowTime = new Date().getTime()
        if (nowTime - startVerifyPictureTime > 2 * 60 *1000) {
            break
        }
        var securityVerifyText = text("Security Verify").findOne(FIND_TIMEOUT)
        if (securityVerifyText != null) {
            back()
            sleep(800)
            var nextBt = id("com.ss.android.ugc.trill:id/c3q").text("Next").findOne(FIND_WIDGET_TIMEOUT)
                if (nextBt != null) {
                    commonFun.clickWidget(nextBt)
                    toastLog("click next")
                    randomSleep()
                }
        }
        var canNotLoadDesc = desc("Couldn’t load image. Refresh to try again.").findOne(FIND_TIMEOUT)
        || text("Couldn’t load image. Refresh to try again.").findOne(FIND_TIMEOUT)
        || desc("No internet connection. Please try again.").findOne(FIND_TIMEOUT)
        || text("No internet connection. Please try again.").findOne(FIND_TIMEOUT)
        // var canNotLoadText = text("Couldn’t load image. Refresh to try again.").findOne(FIND_TIMEOUT)
        // var canNotLoadDesc2 = desc("No internet connection. Please try again.").findOne(FIND_TIMEOUT)
        // var canNotLoadText2 = text("No internet connection. Please try again.").findOne(FIND_TIMEOUT)
        // toastLog(" canNotLoadDesc2 "+canNotLoadDesc2)
        if (canNotLoadDesc != null) {
            toastLog(" network error ")
            randomSleep()
            var refresh = desc("Refresh").findOne(FIND_TIMEOUT)
            if (refresh != null) {
                commonFun.clickWidget(refresh)
            }
            var refreshText = text("Refresh").findOne(FIND_TIMEOUT)
            if (refreshText != null) {
                commonFun.clickWidget(refreshText)
            }
            sleep(10000)
        } else {
            break
        }
    } while (true)
    
    randomSleep()

    var scrollVerfiyText = text("verify captcha").findOne(FIND_TIMEOUT)
    var scrollVerfiyDesc = desc("verify captcha").findOne(FIND_TIMEOUT)
    if (scrollVerfiyDesc != null || scrollVerfiyText != null) {
        // var children = scrollVerfiyDesc.find(className("Image"))
        if (scrollVerfiyText != null) {
            scrollVerfiyDesc = scrollVerfiyText
        }
        var children = scrollVerfiyDesc.children().get(0).children().get(0).children()
        toastLog(" children "+children.size())
        if (children.size() > 1 ) {
            var imageChildren = children.get(1).children()
            if (imageChildren.size() > 1) {
                var imageRect = imageChildren.get(0)
                // var imageRectRight = imageRect.bounds().right
                // var imageSlider = imageChildren.get(1)
                var imageBounds = imageRect.bounds()
                var top = imageBounds.top
                var bottom = imageBounds.bottom
                var right = imageBounds.right
                var left = imageBounds.left
                //请求横屏截图
                var thread = threads.start(function(){
                    toastLog(" requestScreenCapture  start ")
                    requestScreenCapture(false)
                });
                thread.waitFor();
                // thread.interrupt();
                toastLog(" startCapturuingMsg  start ")
                var startCapturuingMsg = text("Auto.js will start capturing everything that's displayed on your screen.").findOne(3500)
                // toastLog(" startCapturuingMsg1 "+startCapturuingMsg)
                if (startCapturuingMsg != null) {
                    var startBt = text("START NOW").id("android:id/button1").findOne()
                    if (startBt != null) {
                        // commonFun.clickWidget(startBt)
                        startBt.click()
                        randomSleep()
                    }
                }
                toastLog(" startCapturuingMsg  end ")
                try {
                    //截图
                    var img = captureScreen();
                    randomSleep()
                } catch (error) {
                    var startCapturuingMsg = text("Auto.js will start capturing everything that's displayed on your screen.").findOne(FIND_WIDGET_TIMEOUT)
                    toastLog(" startCapturuingMsg2 "+startCapturuingMsg)
                    if (startCapturuingMsg != null) {
                        var startBt = text("START NOW").id("android:id/button1").findOne()
                        if (startBt != null) {
                            commonFun.clickWidget(startBt)
                            randomSleep()
                        }
                    }
                    var img = captureScreen();
                    randomSleep()
                }
                var widthScale = device.width  / 720
                var height = Math.floor(120 * widthScale) 
                var startClipX = left + Math.floor(130 * widthScale)
                var width = right - left  - Math.floor(150 * widthScale)
                var startY = Math.floor((bottom - top)/2) + top - Math.floor(60 * widthScale) 
                var clipImage = images.clip(img, startClipX, startY , width , height);
                images.save(clipImage, "/sdcard/clipImage.png");
                var grayscaleImage = images.grayscale(clipImage)
                // images.save(grayscaleImage, "/sdcard/grayscaleImage.png");
                var intervalImage = images.interval(grayscaleImage, colors.rgb(215, 185, 187) , 30)
                images.save(intervalImage, "/sdcard/intervalImage.png");
                toastLog(" image save end imageHight "+intervalImage.getHeight() + " width = "+intervalImage.getWidth() + "  " + width +" "+height)
                var yWhiteCount = 0
                var maxCountX = 0
                var maxCountY = 0

                var xCountList = []
                var xList = []
                for(let i = 0; i　< width -1; i++) {
                    var tempCount = 0
                    var tempY = 0
                    for (let j = 0; j < height -3; j = j+2) {
                        var color = images.pixel(intervalImage, i, j)
                        if (color == -1) {
                            if (i + 1 < width - 1) {
                                var nextColor = images.pixel(intervalImage, i + 1, j)
                                if (nextColor != -1) {
                                    tempCount++
                                    tempY = j
                                }
                            }
                        }
                    }
                    if (tempCount > 5) {
                        // toastLog(" xCount "+tempCount)
                    }
                    xCountList.push(tempCount)
                    xList.push(i)
                    // xCountMap.set(i, tempCount);
                    if (tempCount > yWhiteCount) {
                        yWhiteCount = tempCount
                        maxCountX = i
                        maxCountY = tempY
                    }
                }
                toastLog(" findColor end yWhiteCount "+yWhiteCount +" x "+maxCountX +" y "+ maxCountY)
                for (let i = 0; i < xCountList.length - 1; i++) {
                    for (let j = 0; j < xCountList.length - i -1; j++) {
                        if (xCountList[j] > xCountList[j + 1]) {
                            var temp = xCountList[j];
                            xCountList[j] = xCountList[j + 1];
                            xCountList[j + 1] = temp;
                            var tempX = xList[j];
                            xList[j] = xList[j + 1];
                            xList[j + 1] = tempX;
                        }
                    }
                }
                var finalX = maxCountX + startClipX
                var finalY = maxCountY + top + 120
                toastLog("finalX first "+finalX + " startClipX "+startClipX)
                // for (let j = xList.length -1; j > xList.length -10; j --) {
                //     if (xList[xList.length -1] - xList[j] < 95 && xList[xList.length -1] - xList[j] > 70) {
                //         toastLog(xList[j])
                //         finalX = xList[j] + startClipX
                //     }
                //     toastLog("x "+xList[j] + " count "+xCountList[j])
                // }
                // toastLog(" findColor end1 x "+xList[xList.length -1] +" count "+xCountList[xCountList.length -1 ] )
                // toastLog(" findColor end2 x "+xList[xList.length -2] +" count "+xCountList[xCountList.length -2 ] )
                if (xList[xList.length -1] > xList[xList.length -2] && xList[xList.length -1] - xList[xList.length -2] < 95 && xList[xList.length -1] - xList[xList.length -2] > 70) {
                    finalX = xList[xList.length -2] + startClipX
                }

                toastLog(" findColor end finalX "+finalX + " finalY "+finalY)
                var dragText = text("Drag the puzzle piece into place").findOne(FIND_WIDGET_TIMEOUT)
                var dragDesc = desc("Drag the puzzle piece into place").findOne(FIND_WIDGET_TIMEOUT)
                // toastLog(" dragText "+dragText + " dragDesc  "+dragDesc)
                if (dragText != null || dragDesc != null) {
                    if (dragDesc != null) {
                        dragText = dragDesc
                    }
                    var dragBounds = dragText.bounds()
                    var randomX = random(30, 60)
                    var startX = dragBounds.left + randomX
                    var startY = random(dragBounds.top + 25, dragBounds.bottom - 25)
                    var endX = random(finalX + randomX  - 3, finalX + randomX  - 1) - 3
                    var endY = random(dragBounds.top + 25, dragBounds.bottom - 25)
                    
                    swipe(startX, startY, endX, endY, random(2000, 3000))
                    toastLog(" scrollTo end startX "+startX + " endX = "+endX)
                }

            //    if(point != null){
            //        toastLog("找到啦:" + point);
            //        var swipeWidth = point.x - right + (right - left)
            //        var startX = random(left, right)
            //        var startY = random(top, bottom)
            //        var endX = random(left + swipeWidth, left + swipeWidth)
            //        var endY = random(top, bottom)
            //        toastLog(" swipeWidth "+swipeWidth)
            //        swipe(startX, startY, endX, endY, random(2000, 3000))
            //        toastLog(" scrollTo end")
            //    }else{
            //     toastLog("没找到");
            //     var refresh = desc("Refresh").findOne(1500)
            //     if (refresh != null) {
            //         commonFun.clickWidget(refresh)
            //     }
            //     var refreshText = text("Refresh").findOne(1500)
            //     if (refreshText != null) {
            //         commonFun.clickWidget(refreshText)
            //         // refreshText.click()
            //     }
            //    }
            }
        }
        
    } else {
        var titleText = text("Verify to continue:").findOne(FIND_TIMEOUT)
        var titleDesc = desc("Verify to continue:").findOne(FIND_TIMEOUT)
        // var dragDesc = desc("Drag the puzzle piece into place").findOne(1500)
        if (titleText != null || titleDesc != null) {
            back()
            sleep(1000)
       }
    }
}

function checkCreatePassword(){
    toastLog(" checkCreatePassword ")
    var createPsText = text("Create password").id("com.ss.android.ugc.trill:id/oo").findOne(FIND_WIDGET_TIMEOUT)
    if (createPsText != null) {
        isInputEmail = false
        emailCheckCount = 0
        randomSleep()
        var tooManyAttempts = text("Too many attempts. Try again later.").id("com.ss.android.ugc.trill:id/czd").findOne(FIND_WIDGET_TIMEOUT)
        if (tooManyAttempts != null) {
            registerDone = true
            registerSignUp = true
            resgisterStatus = enums.REGISTER_STATUS.TOOMANYATTEMPTS
        } else {
            commonFun.inputEditText(0, password)
            randomSleep()
            var nextBt = id("com.ss.android.ugc.trill:id/c3q").text("Next").findOne(FIND_WIDGET_TIMEOUT)
            if (nextBt != null) {
                commonFun.clickWidget(nextBt)
                toastLog("click next")
                randomSleep()
                isCheckPassword = true
                sleep(6*1000)
            }
        }
    }
}

function checkAlreadySignUp () {
    toastLog(" checkAlreadySignUp ")
    var createPsText = text("You’ve already signed up").id("com.ss.android.ugc.trill:id/oo").findOne(FIND_WIDGET_TIMEOUT)
    if (createPsText != null) {
        var accountEmail = id("com.ss.android.ugc.trill:id/azo").className("EditText").findOne(FIND_WIDGET_TIMEOUT)
        if (accountEmail != null) {
            emailAddress = accountEmail.text()
        }
        resgisterStatus = enums.REGISTER_STATUS.REGISTERED
        registerSignUp = true
        registerDone = true
    }
}

function checkVerifyCode () {
    toastLog(" checkVerifyCode ")
    var createPsText = text("Enter 6-digit code").id("com.ss.android.ugc.trill:id/oo").findOne(FIND_WIDGET_TIMEOUT)
    if (createPsText != null) {
        var errrorCode = text("Email verification code error").findOne(FIND_WIDGET_TIMEOUT)
        if (errrorCode != null) {
            resgisterStatus = enums.REGISTER_STATUS.EMAIL_CODE_ERROR
            registerDone = true
            registerSignUp = true
            return
        }
        var tooManyAttempts = text("Too many attempts. Try again later.").id("com.ss.android.ugc.trill:id/czd").findOne(FIND_WIDGET_TIMEOUT)
        if (tooManyAttempts != null && mailCodeCount < maxSendEmailCodeCount -1) {
            //重新发送验证码
            var resent = textStartsWith("Resend code").findOne(FIND_WIDGET_TIMEOUT)
            if (resent != null) {
                toastLog("checkVerifyCode 重新发送验证码 ")
                commonFun.clickWidget(resent)
                randomSleep()
            }
            mailCodeCount ++
        }
        if ((tooManyAttempts != null && mailCodeCount +1 >= maxSendEmailCodeCount) || (tooManyAttempts != null && maxSendEmailCodeCount < 2)) {
            registerDone = true
            registerSignUp = true
            resgisterStatus = enums.REGISTER_STATUS.TOOMANYATTEMPTS
        } else {
            // var networkError = text("No network connection").id("com.ss.android.ugc.trill:id/czd").findOne(FIND_WIDGET_TIMEOUT)
            // if (networkError != null) {
            //   //todo
            // }
            //todo
            // var resent = text("Resend code").id("com.ss.android.ugc.trill:id/bch")
            var vCode = getMailVerifyCode()
            if (lastMailCode == "") {
                lastMailCode = vCode
            } else if (lastMailCode == vCode) {
                vCode = getMailVerifyCode()
            }
            // var vCode = "736892"
            if (vCode != "") {
                sleep(10 * 1000)
                toastLog("checkVerifyCode vCode "+vCode)
                var vCodeEdit = id("com.ss.android.ugc.trill:id/bcl").className("EditText").findOne(FIND_WIDGET_TIMEOUT)
                if (vCodeEdit != null) {
                    commonFun.clickWidget(vCodeEdit)
                    randomSleep()
                    var editLayout = id("com.ss.android.ugc.trill:id/bci").findOne(FIND_WIDGET_TIMEOUT)
                    if (editLayout != null) {
                        var bounds = editLayout.bounds()
                        var  top = bounds.top
                        var bottom = bounds.bottom
                        var left = bounds.left
                        var right = bounds.right
                        //三次尝试
                        var tryCount = 0
                        var needBreak = true
                        do {
                            toastLog("tryCount1 = "+tryCount)
                            for(let i = 0; i < vCode.length; i++) {
                                toastLog(vCode[i])
                                sleep(random(500, 1000))
                                commonFun.inputDigKeyboard(vCode[i], device.width, bottom)
                            }
                            sleep(6000)
                            var networkError = text("No network connection").id("com.ss.android.ugc.trill:id/czd").findOne(FIND_WIDGET_TIMEOUT)
                            if (networkError != null) {
                                needBreak = false
                                commonFun.clickWidget(vCodeEdit)
                                sleep(2000)
                                commonFun.inputDigKeyboard("-1", device.width, bottom)
                            }

                            var errrorCode = text("Email verification code error").findOne(FIND_WIDGET_TIMEOUT)
                            if (errrorCode != null) {
                                needBreak = false
                                commonFun.clickWidget(vCodeEdit)
                                sleep(2000)
                                commonFun.inputDigKeyboard("-1", device.width, bottom)
                                //todo 验证码不对
                                // if (vCodeEdit.text().length != vCode)  {
                                //     commonFun.clickWidget(vCodeEdit)
                                //     sleep(2000)
                                //     commonFun.inputDigKeyboard("-1", device.width, bottom)
                                //     continue
                                // } else {
                                //     //todo 验证码不对
                                // }
                                // resgisterStatus = enums.REGISTER_STATUS.EMAIL_CODE_ERROR
                                // registerDone = true
                                // registerSignUp = true
                            }
                            if (needBreak) {
                                break
                            }
                            var codePage = text("Enter 6-digit code").id("com.ss.android.ugc.trill:id/oo").findOne(FIND_WIDGET_TIMEOUT)
                            if (codePage == null) {
                                break
                            }
                            tryCount++
                            toastLog("tryCount2 = "+tryCount)
                        } while (tryCount < 3)
                        
                    }
                    
                }
                var errrorCode = text("Email verification code error").findOne(FIND_WIDGET_TIMEOUT)
                if (errrorCode != null) {
                    // resgisterStatus = enums.REGISTER_STATUS.EMAIL_CODE_ERROR
                    // registerDone = true
                    // registerSignUp = true
                }

                var errrorCode = text("Couldn't create account. Try again.").findOne(FIND_WIDGET_TIMEOUT)
                if (errrorCode != null ) {
                    resgisterStatus = enums.REGISTER_STATUS.EMAIL_CODE_ERROR
                    registerDone = true
                    registerSignUp = true
                }
                // sleep(30 * 1000)
            }
        }
    }
}

function getMailVerifyCode() {
    var vCode = ""
    var startGetCodeTime = new Date().getTime()
    do {
        try{
            sleep(10*1000)
            var nowGetCodeTime = new Date().getTime()
            if (nowGetCodeTime - startGetCodeTime > 3.5 * 60 * 1000) {
                resgisterStatus = enums.REGISTER_STATUS.EMAIL_CODE_TIMEOUT
                registerDone = true
                registerSignUp = true
                break
            }
            var body = {
                "user": encrypted_email,
                "password": encrypted_email_password,
                "app_id": enums.REGISTER_APP_ID.TIKTOK
            }
            toastLog("getMailVerifyCode start")
            var result = httpUtilFunc.httpRequest("mailVerifyCodeGet", body)
            var resultJson = result.body
            var resultData = resultJson.json().data;
            var code = resultData.code
            if (code == "000000") {
                vCode = resultData.data.v_code
                break
            } else if (code == "000500") {
                toastLog("getMailVerifyCode failed")
                resgisterStatus = enums.REGISTER_STATUS.EMAIL_CODE_OPEN_FAILED
                registerDone = true
                registerSignUp = true
                break
            } else {
                var nowGetCodeTime = new Date().getTime()
                if (nowGetCodeTime - startGetCodeTime > 3.5 * 60 * 1000) {
                    resgisterStatus = enums.REGISTER_STATUS.EMAIL_CODE_TIMEOUT
                    registerDone = true
                    registerSignUp = true
                    break
                }
                wakeUp()
            }
        } catch (error) {
            toastLog(error)
        }
        
    } while (true)
    return vCode
}

function checkUserName(){
    toastLog(" checkUserName ")
    var createPsText = text("Create username").id("com.ss.android.ugc.trill:id/oo").findOne(FIND_WIDGET_TIMEOUT)
    if (createPsText != null) {
        randomSleep()
        
        // inputEditText(0, "Liang179shae!")
        // randomSleep()

        //优化 todo
        var nickNameText = id("ccom.ss.android.ugc.trill:id/bd1").findOne(FIND_WIDGET_TIMEOUT)
        if (nickNameText != null) {
            //姓名过长
            var nameTooLongText = text("Your username can have up to 24 characters").findOne(FIND_WIDGET_TIMEOUT)
            if (nameTooLongText != null) {
                toastLog("姓名过长")
                var username = nickNameText.text().slice(0,24)
                commonFun.inputEditText(0, username)
                randomSleep()
            } else if (nickNameText.text() == "") {
                commonFun.inputEditText(0, nickName)
                randomSleep()
            }
            accountName = nickNameText.text()
        }
        toastLog("accountName "+accountName)
        var nextBt = id("com.ss.android.ugc.trill:id/c3q").text("Sign up").findOne(FIND_WIDGET_TIMEOUT)
        if (nextBt != null) {
            commonFun.clickWidget(nextBt)
            toastLog("click next")
            randomSleep()
            registerSignUp = true
            resgisterStatus = enums.REGISTER_STATUS.SUCCESS
            sleep(5*1000)
        }
    }
}

function chooseYourInterests () {
    toastLog("chooseYourInterests")
    var chooseYourInterestsText = id("com.ss.android.ugc.trill:id/title").text("Choose your interests").findOne(FIND_WIDGET_TIMEOUT)
    toastLog("chooseYourInterests chooseYourInterestsText "+chooseYourInterestsText)
    if (chooseYourInterestsText != null) {
        var randomSkip = random(0, 10)
        if (randomSkip > 6) {
            var skipText = id("com.ss.android.ugc.trill:id/dex").text("Skip").findOne(FIND_WIDGET_TIMEOUT)
            if (skipText != null) {
                randomSleep()
                commonFun.clickWidget(skipText)
                randomSleep()
            } else {
                chooseInterests()
            }
        } else {
            chooseInterests()
        }
        randomSleep()
    }
}

function chooseInterests () {
    var recycleViewList = id("com.ss.android.ugc.trill:id/d3u").className("androidx.recyclerview.widget.RecyclerView").findOne(FIND_WIDGET_TIMEOUT)
    if (recycleViewList != null) {
        registerDone = true
        toastLog("chooseInterests  recycleViewList != null")
        var viewGroups = recycleViewList.find(className("android.view.ViewGroup"))
        if (viewGroups != null && viewGroups.length > 0) {
            // var children = viewGroups.children()
            toastLog("chooseInterests recycleViewList "+viewGroups.length)
            var num = random(1, viewGroups.length - 2)
            toastLog("chooseInterests num "+num)
            var selectChild = commonFun.randomNums(num, 0, viewGroups.length -1 )
            for (let i = 0; i < num ; i ++) {
                randomSleep()
                toastLog(" selectChild[i] "+selectChild[i])
                commonFun.clickWidget(viewGroups[selectChild[i]])
            }
            randomSleep()
            var nextBt = id("com.ss.android.ugc.trill:id/ahr").text("Next").findOne(FIND_WIDGET_TIMEOUT)
            if (nextBt != null) {
                commonFun.clickWidget(nextBt)
                randomSleep()
            }
        }
    }
}

function checkSwipeUp() {
    toastLog("checkSwipeUp")
    var swpieUpText = id("com.ss.android.ugc.trill:id/title").text("Swipe up").findOne(FIND_WIDGET_TIMEOUT)
    var startWatching = id("com.ss.android.ugc.trill:id/djq").text("Start watching").findOne(FIND_WIDGET_TIMEOUT)
    if (swpieUpText != null && startWatching != null) {
        randomSleep()
        commonFun.clickWidget(startWatching)
        randomSleep()
    }

}

function startTiktok() {
    toastLog(" startTiktok ")
    var swipeMore = text("Swipe up for more").findOne(FIND_WIDGET_TIMEOUT)
    toastLog(" startTiktok   swipeMore "+swipeMore)
    if (swipeMore != null) {
        randomSleep()
        var startX = random(commonFun.resolutionWidthScale(400), commonFun.resolutionWidthScale(500))
        var startY = random(commonFun.resolutionHeightScale(800), commonFun.resolutionHeightScale(1000))
        var endX = random(commonFun.resolutionWidthScale(400), commonFun.resolutionWidthScale(500))
        var endY = random(commonFun.resolutionHeightScale(200), commonFun.resolutionHeightScale(350))
        swipe(startX, startY, endX, endY, random(500, 1500))
    }

    var forYouText = text("For You").id("android:id/text1").findOne(FIND_WIDGET_TIMEOUT)
        var pinglunBt = id("com.ss.android.ugc.trill:id/a63").findOne(FIND_WIDGET_TIMEOUT)
        if (forYouText != null && pinglunBt != null) {
            var count = 0
            var swipeCountTotal = random(1, 5)
            do {
                var favorRanom = random(0, 10)
                var startX = random(commonFun.resolutionWidthScale(400), commonFun.resolutionWidthScale(500))
                var startY = random(commonFun.resolutionHeightScale(800), commonFun.resolutionHeightScale(1000))
                var endX = random(commonFun.resolutionWidthScale(400), commonFun.resolutionWidthScale(500))
                var endY = random(commonFun.resolutionHeightScale(200), commonFun.resolutionHeightScale(350))
                toastLog("startX "+startX + " startY "+startY)
                swipe(startX, startY, endX, endY, random(500, 1000))
                sleep(random(5000, 10000))
                toastLog("favorRanom "+favorRanom)
                if (favorRanom > 6) {
                    click(startX, startY)
                    sleep(random(50, 200))
                    click(startX + 5, startY - 5)
                    sleep(random(1000, 2000))
                }
                count ++
            } while (count < swipeCountTotal)
            registerDone = true
            if (registerDone && registerSignUp) {
                resgisterStatus = enums.REGISTER_STATUS.SUCCESS
            }
        }

        checkSignTiktok()
}

function checkSignTiktok () {
    toastLog("checkSignTiktok")
    if (!registerSignUp) {
        var tabBar = id("com.ss.android.ugc.trill:id/c5y").findOne(500)
        if (tabBar != null) {
            var meTab = tabBar.findOne(text("Me"))
            if (meTab != null) {
                commonFun.clickWidget(meTab)
                randomSleep()
            }
        }
    
        var signUpAccount = text("Sign up for an account").id("com.ss.android.ugc.trill:id/b6b").findOne(500)
        if (signUpAccount != null) {
            var singnBt = id("com.ss.android.ugc.trill:id/wh").text("Sign up").findOne(500)
            if (singnBt != null) {
                commonFun.clickWidget(singnBt)
                randomSleep()
            }
        }
    }
    
}

function randomSleep() {
    var randomSleep = random(500, 1500)
    sleep(randomSleep)
}

/**
 * 获取缺口位置的x坐标
 * 传入值 img, 识别精度(precision)
 */
 function getPointX(img,precision){
    var xCount = 0;
    var finnalX = 0;
    for(var x = 270; x < 950; x += 5){    //横向遍历像素点，间隔5个像素点
        // var row = "";
        var tempCount = 0
        for(var y = 570; y < 1070; y+=5){      //找到黑点最多的y轴
            if(isBlackPoint(x,y,img,precision)){
                // row +="1";
                tempCount += 1;
            }else{
                // row += "0";
            }
        }
        if( tempCount >= xCount ){
            xCount = tempCount;
            finnalX = x
        }
        // console.log(row);
    }
    return finnalX
}

/**
 * 判断点是否为黑色点
 * 传入值 坐标(x,y), img, 识别精度(precision)
 */
function isBlackPoint(x, y,img,precision) {
    var rgb = images.pixel(img,x,y);    //此时获取到的是ARGB
    var r = (rgb & 0xff0000) >> 16;      //得到R
    var g = (rgb & 0xff00) >> 8;            //得到G
    var b = (rgb & 0xff);                        //得到B
    var criticalValue = 255 * (1 - precision);
    if (r <= criticalValue && g <= criticalValue && b <= criticalValue) {
        return true;
    }
    return false;
}

/**
 * 判断点是否为白色点
 * 传入值 坐标(x,y), img, 识别精度(precision)
 */
function isWhitePoint(color) {
    var rgb = color;  //此时获取到的是ARGB
    var r = (rgb & 0xff0000) >> 16;   //得到R
    var g = (rgb & 0xff00) >> 8;        //得到G
    var b = (rgb & 0xff);                    //得到B
    var criticalValue = 255;
    if (r >= criticalValue && g >= criticalValue && b >= criticalValue) {
        return true;
    }
    return false;
}

function sortNumber(a,b){
    return a - b
}