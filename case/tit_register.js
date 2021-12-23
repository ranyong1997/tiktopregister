var httpUtilFunc = require("../http/httpUtils.js")
var utilsFunc = require("../util/utils.js")
var commonFunc = require("../lib/common.js")
var enums = require("../util/enums.js")
var FIND_TIMEOUT = 750


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


// 得到邮箱信息
function getRegisterInfo() {
    log("得到邮箱信息")
    var body = {
        "register_app_id": enums.REGISTER_APP_ID.TIKTOK,
        "limit": 1,
        "status": 0
    }
    var result = httpUtilFunc.httpRequest("registerAccountGet", body)
    var commonFunc = result.body
    var resultData = commonFunc.json().data;
    log("解析得到的result为:" + commonFunc.string())
    var code = resultData.code
    if (code == "000000") {
        var accounts = resultData.data.accounts
        firstName = accounts[0].first_name
        lastName = accounts[0].last_name
        birthday = accounts[0].birthday
        nickName = accounts[0].nick_name
        birthdaySplitList = birthday.split("-")
        birthdayMonth = utilsFunc.transMonth(birthdaySplitList[1])
        brithdayDay = birthdaySplitList[2]
        brithdayYear = birthdaySplitList[0]
        emailAddress = accounts[0].email
        password = accounts[0].password
        accountName = accounts[0].email.split("@")[0]
        encrypted_email = accounts[0].encrypted_email
        encrypted_email_password = accounts[0].encrypted_email_password
        toastLog(" 首字: " + firstName + " 尾字: = " + lastName + " 生日(月) = " + birthdayMonth + " 邮箱 =  " + emailAddress)
        resgisterTiktok()
        updateRegisterResult(accounts[0])
        sleep(15 * 1000)
    } else {
        log("任务获取失败")
    }
}


function resgisterTiktok() {
    sleep(15 * 1000)
    log("正在打开TikTok")
    launchApp("TikTok");
    randomSleep()
    toastLog("开始任务")
    log("开始任务")
    randomSleep()
    do {
        try {
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
        }

    } while (true)
}

// 检查tiktop登陆页
function checkSignUpPage() {
    toastLog("checkSignUpPage")
    var signUpText = text("Sign up for TikTok").id("com.ss.android.ugc.trill:id/title").findOne(1500)
    if (signUpText != null) {
        var usePhoneEmail = text("Use phone or email").id("com.ss.android.ugc.trill:id/vu").findOne(1500)
        if (usePhoneEmail != null) {
            commonFunc.clickWidget(usePhoneEmail)
            randomSleep()
        }
    }
}

// 检查生日页
function checkBirthDayPage() {
    log("检查生日页")
    var birthdayText = text("When’s your birthday?").id("com.ss.android.ugc.trill:id/m4").findOne(1500)
    if (birthdayText != null) {
        //月份
        var monthList = id("com.ss.android.ugc.trill:id/bq0").findOne(1500)
        if (monthList != null) {
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
                toastLog(" swipeHeight " + swipeHeight + " , listItemHeight " + listItemHeight)
                swipe(startX, startY, endX, endY, random(500, 1500))
                swipeCount++
            } while (swipeCount < randomSwipe)
        }
        randomSleep()
        //日期
        var dayList = id("com.ss.android.ugc.trill:id/a6b").findOne(1500)
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
                toastLog(" swipeHeight " + swipeHeight + " , listItemHeight " + listItemHeight)
                swipe(startX, startY, endX, endY, random(500, 1500))
                swipeCount++
            } while (swipeCount < randomSwipe)
        }
        randomSleep()
        //年份
        var yearList = id("com.ss.android.ugc.trill:id/dws").findOne(1500)
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
                toastLog(" swipeHeight " + swipeHeight + " , listItemHeight " + listItemHeight)
                swipe(endX, endY, startX, startY, random(200, 400))
                sleep(random(300, 500))
                swipeCount++
            } while (swipeCount < randomSwipe)
        }

        var nextBt = id("com.ss.android.ugc.trill:id/bln").text("Next").findOne(1500)
        if (nextBt != null) {
            randomSleep()
            commonFunc.clickWidget(nextBt)
            randomSleep()
        }
    }
}


// 检查登陆Email元素
function checkSignUpEmail() {
    var signUpEmail = text("Sign up").id("com.ss.android.ugc.trill:id/title").findOne(1500)
    if (signUpEmail != null) {
        var emailTab = text("Email").id("android:id/text1").findOne(1500)
        if (emailTab != null) {
            isBirthDayDone = true
            randomSleep()
            commonFunc.clickWidget(emailTab)
            randomSleep()
            var emailInput = id("com.ss.android.ugc.trill:id/azo").className("EditText").findOne(1500)
            if (emailInput != null) {
                randomSleep()
                if (emailInput.text() != emailAddress) {
                    commonFunc.inputEditText(1, emailAddress)
                    randomSleep()
                }
                back()
                randomSleep()
                var nextBt = id("com.ss.android.ugc.trill:id/bln").text("Next").findOne(1500)
                if (nextBt != null) {
                    commonFunc.clickWidget(nextBt)
                    toastLog("click next")
                    randomSleep()
                }
            }
        }
    }
}

// 验证码滑动块
function checkVerifyPicture() {
    log("启动验证码滑块")
    var titleText = text("Verify to continue:").findOne(FIND_TIMEOUT)
    var titleDesc = desc("Verify to continue:").findOne(FIND_TIMEOUT)
    if (titleText != null || titleDesc != null) {
        do {
            verifyPicture()
            var titleText = text("Verify to continue:").findOne(FIND_TIMEOUT)
            var titleDesc = desc("Verify to continue:").findOne(FIND_TIMEOUT)
            if (titleText == null && titleDesc == null) {
                break
            }
        } while (true)
    }
    var securityVerifyText = text("Security Verify").findOne(FIND_TIMEOUT)
    if (securityVerifyText != null) {
        var closeBt = id("com.ss.android.ugc.trill:id/qy").findOne(FIND_TIMEOUT)
        commonFunc.clickWidget(closeBt)
        randomSleep()
    }
    var canNotLoadDesc = desc("Couldn’t load image. Refresh to try again.").findOne(FIND_TIMEOUT)
    var canNotLoadText = text("Couldn’t load image. Refresh to try again.").findOne(FIND_TIMEOUT)
    var canNotLoadDesc2 = desc("No internet connection. Please try again.").findOne(FIND_TIMEOUT)
    var canNotLoadText2 = desc("No internet connection. Please try again.").findOne(FIND_TIMEOUT)
    if (canNotLoadDesc != null || canNotLoadDesc2 != null || canNotLoadText != null || canNotLoadText2 != null) {
        randomSleep()
        var refresh = desc("Refresh").findOne(FIND_TIMEOUT)
        if (refresh != null) {
            commonFunc.clickWidget(refresh)
        }
        var refreshText = text("Refresh").findOne(FIND_TIMEOUT)
        if (refreshText != null) {
            commonFunc.clickWidget(refreshText)
        }
    }
}

// 验证码截图并自动滑动
function verifyPicture() {
    log("验证码截图并自动滑动")
    var canNotLoadDesc = desc("Couldn’t load image. Refresh to try again.").findOne(FIND_TIMEOUT)
    var canNotLoadText = text("Couldn’t load image. Refresh to try again.").findOne(FIND_TIMEOUT)
    var canNotLoadDesc2 = desc("No internet connection. Please try again.").findOne(FIND_TIMEOUT)
    var canNotLoadText2 = desc("No internet connection. Please try again.").findOne(FIND_TIMEOUT)
    toastLog(" canNotLoadDesc2 " + canNotLoadDesc2)
    if (canNotLoadDesc != null || canNotLoadDesc2 != null || canNotLoadText != null || canNotLoadText2 != null) {
        randomSleep()
        var refresh = desc("Refresh").findOne(FIND_TIMEOUT)
        if (refresh != null) {
            commonFunc.clickWidget(refresh)
        }
        var refreshText = text("Refresh").findOne(FIND_TIMEOUT)
        if (refreshText != null) {
            commonFunc.clickWidget(refreshText)
        }
    }
    randomSleep()
    var scrollVerfiyText = text("verify captcha").findOne(FIND_TIMEOUT)
    var scrollVerfiyDesc = desc("verify captcha").findOne(FIND_TIMEOUT)
    if (scrollVerfiyDesc != null || scrollVerfiyText != null) {
        if (scrollVerfiyText != null) {
            scrollVerfiyDesc = scrollVerfiyText
        }
        var children = scrollVerfiyDesc.children().get(0).children().get(0).children()
        toastLog(" children " + children.size())
        if (children.size() > 1) {
            var imageChildren = children.get(1).children()
            if (imageChildren.size() > 1) {
                var imageRect = imageChildren.get(0)
                var imageBounds = imageRect.bounds()
                var top = imageBounds.top
                var bottom = imageBounds.bottom
                var right = imageBounds.right
                var left = imageBounds.left
                //请求横屏截图
                var thread = threads.start(function () {
                    toastLog(" requestScreenCapture  start ")
                    requestScreenCapture(false)
                });
                thread.waitFor();
                toastLog(" startCapturuingMsg  start ")
                var startCapturuingMsg = text("Auto.js will start capturing everything that's displayed on your screen.").findOne(3500)
                if (startCapturuingMsg != null) {
                    var startBt = text("START NOW").id("android:id/button1").findOne()
                    if (startBt != null) {
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
                    var startCapturuingMsg = text("Auto.js will start capturing everything that's displayed on your screen.").findOne(1500)
                    toastLog(" startCapturuingMsg2 " + startCapturuingMsg)
                    if (startCapturuingMsg != null) {
                        var startBt = text("START NOW").id("android:id/button1").findOne()
                        if (startBt != null) {
                            commonFunc.clickWidget(startBt)
                            randomSleep()
                        }
                    }
                    var img = captureScreen();
                    randomSleep()
                }
                var height = 120
                var startClipX = left + 130
                var width = right - left - 150
                var startY = Math.floor((bottom - top) / 2) + top - 60
                var clipImage = images.clip(img, startClipX, startY, width, height);
                images.save(clipImage, "/sdcard/clipImage.png");
                var grayscaleImage = images.grayscale(clipImage)
                var intervalImage = images.interval(grayscaleImage, colors.rgb(215, 185, 187), 30)
                images.save(intervalImage, "/sdcard/intervalImage.png");
                toastLog(" image save end imageHight " + intervalImage.getHeight() + " width = " + intervalImage.getWidth() + "  " + width + " " + height)
                var yWhiteCount = 0
                var maxCountX = 0
                var maxCountY = 0

                var xCountList = []
                var xList = []
                for (let i = 0; i < width - 1; i++) {
                    var tempCount = 0
                    var tempY = 0
                    for (let j = 0; j < height - 3; j = j + 2) {
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
                    }
                    xCountList.push(tempCount)
                    xList.push(i)
                    if (tempCount > yWhiteCount) {
                        yWhiteCount = tempCount
                        maxCountX = i
                        maxCountY = tempY
                    }
                }
                toastLog(" findColor end yWhiteCount " + yWhiteCount + " x " + maxCountX + " y " + maxCountY)
                for (let i = 0; i < xCountList.length - 1; i++) {
                    for (let j = 0; j < xCountList.length - i - 1; j++) {
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
                toastLog("finalX first " + finalX + " startClipX " + startClipX)
                if (xList[xList.length - 1] > xList[xList.length - 2] && xList[xList.length - 1] - xList[xList.length - 2] < 95 && xList[xList.length - 1] - xList[xList.length - 2] > 70) {
                    finalX = xList[xList.length - 2] + startClipX
                }
                toastLog(" findColor end finalX " + finalX + " finalY " + finalY)
                var dragText = text("Drag the puzzle piece into place").findOne(1500)
                var dragDesc = desc("Drag the puzzle piece into place").findOne(1500)
                // toastLog(" dragText "+dragText + " dragDesc  "+dragDesc)
                if (dragText != null || dragDesc != null) {
                    if (dragDesc != null) {
                        dragText = dragDesc
                    }
                    var dragBounds = dragText.bounds()
                    var randomX = random(30, 60)
                    var startX = dragBounds.left + randomX
                    var startY = random(dragBounds.top + 25, dragBounds.bottom - 25)
                    var endX = random(finalX + randomX - 3, finalX + randomX - 1)
                    var endY = random(dragBounds.top + 25, dragBounds.bottom - 25)
                    swipe(startX, startY, endX, endY, random(2000, 3000))
                    toastLog(" scrollTo end startX " + startX + " endX = " + endX)
                }
            }
        }
    }
}

// 检查创建密码
function checkCreatePassword() {
    log(" 检查创建密码 ")
    var createPsText = text("Create password").id("com.ss.android.ugc.trill:id/m4").findOne(1500)
    if (createPsText != null) {
        randomSleep()
        var tooManyAttempts = text("Too many attempts. Try again later.").id("com.ss.android.ugc.trill:id/cb0").findOne(1500)
        if (tooManyAttempts != null) {
            registerDone = true
            registerSignUp = true
            resgisterStatus = enums.REGISTER_STATUS.TOOMANYATTEMPTS
        } else {
            commonFunc.inputEditText(0, password)
            randomSleep()
            var nextBt = id("com.ss.android.ugc.trill:id/bln").text("Next").findOne(1500)
            if (nextBt != null) {
                commonFunc.clickWidget(nextBt)
                toastLog("click next")
                randomSleep()
                isCheckPassword = true
            }
        }
    }
}

// 检查是否已经登陆
function checkAlreadySignUp() {
    log("检查是否已经登陆")
    var createPsText = text("You’ve already signed up").id("com.ss.android.ugc.trill:id/m4").findOne(1500)
    if (createPsText != null) {
        var accountEmail = id("com.ss.android.ugc.trill:id/azo").className("EditText").findOne(1500)
        if (accountEmail != null) {
            emailAddress = accountEmail.text()
        }
        resgisterStatus = enums.REGISTER_STATUS.REGISTERED
        registerSignUp = true
        registerDone = true
    }
}

// 检查验证码
function checkVerifyCode() {
    log("检查验证码")
    var createPsText = text("Enter 6-digit code").id("com.ss.android.ugc.trill:id/m4").findOne(1500)
    if (createPsText != null) {
        var tooManyAttempts = text("Too many attempts. Try again later.").id("com.ss.android.ugc.trill:id/cb0").findOne(1500)
        if (tooManyAttempts != null) {
            registerDone = true
            registerSignUp = true
            resgisterStatus = enums.REGISTER_STATUS.TOOMANYATTEMPTS
        } else {
            var vCode = getMailVerifyCode()
            if (vCode != "") {
                sleep(10 * 1000)
                toastLog("checkVerifyCode vCode " + vCode)
                var vCodeEdit = id("com.ss.android.ugc.trill:id/azb").className("EditText").findOne(1500)
                if (vCodeEdit != null) {
                    commonFunc.clickWidget(vCodeEdit)
                    randomSleep()
                    for (let i = 0; i < vCode.length; i++) {
                        toastLog(vCode[i])
                        sleep(random(500, 1000))
                        commonFunc.inputDigKeyboard(vCode[i])
                    }
                    randomSleep()
                }
                var errrorCode = text("Email verification code error").findOne(1500)
                if (errrorCode != null) {
                }

                var errrorCode = text("Couldn't create account. Try again.").findOne(1500)
                if (errrorCode != null) {
                    resgisterStatus = enums.REGISTER_STATUS.EMAIL_CODE_ERROR
                    registerDone = true
                    registerSignUp = true
                }
            }
        }
    }
}

// 接码
function getMailVerifyCode() {
    log("正在接码，并返回邮箱验证码")
    var vCode = ""
    var startGetCodeTime = new Date().getTime()
    do {
        sleep(15 * 1000)
        var body = {
            "user": encrypted_email,
            "password": encrypted_email_password,
        }
        toastLog("getMailVerifyCode start")
        var result = httpUtilFunc.httpRequest("mailVerifyCodeGet", body)
        var commonFunc = result.body
        var resultData = commonFunc.json().data;
        var code = resultData.code
        if (code == "000000") {
            vCode = resultData.data.v_code
            break
        } else if (code == "000500") {
            resgisterStatus = enums.REGISTER_STATUS.FAIL
            registerDone = true
            registerSignUp = true
            break
        } else {
            var nowGetCodeTime = new Date().getTime()
            if (nowGetCodeTime - startGetCodeTime > 3.5 * 60 * 1000) {
                resgisterStatus = enums.REGISTER_STATUS.FAIL
                registerDone = true
                registerSignUp = true
                break
            }
            wakeUp()
        }
    } while (true)
    return vCode
}

// 检查用户名
function checkUserName() {
    log("检查用户名")
    var createPsText = text("Create username").id("com.ss.android.ugc.trill:id/m4").findOne(1500)
    if (createPsText != null) {
        randomSleep()
        var nickNameText = id("com.ss.android.ugc.trill:id/azo").findOne(1500)
        if (nickNameText != null) {
            if (nickNameText.text() == "") {
                commonFunc.inputEditText(0, nickName)
            }
            accountName = nickNameText.text()
        }
        var nextBt = id("com.ss.android.ugc.trill:id/bln").text("Sign up").findOne(1500)
        if (nextBt != null) {
            commonFunc.clickWidget(nextBt)
            toastLog("click next")
            randomSleep()
            registerSignUp = true
        }
    }
}

// 选择你的喜好
function chooseYourInterests() {
    log("选择你的喜好")
    var chooseYourInterestsText = id("com.ss.android.ugc.trill:id/title").text("Choose your interests").findOne(1500)
    toastLog("chooseYourInterests chooseYourInterestsText " + chooseYourInterestsText)
    if (chooseYourInterestsText != null) {
        var randomSkip = random(0, 10)
        if (randomSkip > 6) {
            var skipText = id("com.ss.android.ugc.trill:id/coh").text("Skip").findOne(1500)
            if (skipText != null) {
                randomSleep()
                commonFunc.clickWidget(skipText)
                randomSleep()
            } else {
                chooseInterests()
            }
        } else {
            chooseInterests()
        }
    }
}

// 选择喜好
function chooseInterests() {
    var recycleViewList = id("com.ss.android.ugc.trill:id/ces").className("androidx.recyclerview.widget.RecyclerView").findOne(1500)
    if (recycleViewList != null) {
        registerDone = true
        var children = recycleViewList.children()
        toastLog("chooseInterests recycleViewList " + children.size())
        if (children.size() > 0) {
            var num = random(1, children.size() - 2)
            toastLog("chooseInterests num " + num)
            var selectChild = commonFunc.randomNums(num, 0, children.size() - 1)
            for (let i = 0; i < num; i++) {
                randomSleep()
                toastLog(" selectChild[i] " + selectChild[i])
                commonFunc.clickWidget(children[selectChild[i]])
            }
            randomSleep()
            var nextBt = id("com.ss.android.ugc.trill:id/a_b").text("Next").findOne(1500)
            if (nextBt != null) {
                commonFunc.clickWidget(nextBt)
                randomSleep()
            }
        }
    }
}

// 检查上滑
function checkSwipeUp() {
    log("检查上滑")
    var swpieUpText = id("com.ss.android.ugc.trill:id/title").text("Swipe up").findOne(1500)
    var startWatching = id("com.ss.android.ugc.trill:id/cs4").text("Start watching").findOne(1500)
    if (swpieUpText != null && startWatching != null) {
        randomSleep()
        commonFunc.clickWidget(startWatching)
        randomSleep()
    }
}


// 启动Tiktop
function startTiktok() {
    log("启动Tiktop")
    var swipeMore = text("Swipe up for more").findOne(1500)
    toastLog(" startTiktok   swipeMore " + swipeMore)
    if (swipeMore != null) {
        randomSleep()
        var startX = random(400, 500)
        var startY = random(800, 1000)
        var endX = random(400, 500)
        var endY = random(200, 350)
        swipe(startX, startY, endX, endY, random(500, 1500))
    }
    var forYouText = text("For You").id("android:id/text1").findOne(1500)
    var pinglunBt = id("com.ss.android.ugc.trill:id/zy").findOne(1500)
    if (forYouText != null && pinglunBt != null) {
        var count = 0
        var swipeCountTotal = random(5, 8)
        do {
            var favorRanom = random(0, 10)
            var startX = random(400, 500)
            var startY = random(800, 1000)
            var endX = random(400, 500)
            var endY = random(200, 350)
            toastLog("startX " + startX + " startY " + startY)
            swipe(startX, startY, endX, endY, random(500, 1000))
            sleep(random(5000, 10000))
            toastLog("favorRanom " + favorRanom)
            if (favorRanom > 6) {
                click(startX, startY)
                sleep(random(50, 200))
                click(startX + 5, startY - 5)
                sleep(random(1000, 2000))
            }
            count++
        } while (count < swipeCountTotal)
        registerDone = true
        if (registerDone && registerSignUp) {
            resgisterStatus = enums.REGISTER_STATUS.SUCCESS
        }
    }
}

// 随机等待在(1.5s~4.5s之间)
function randomSleep() {
    var randomSleep = random(1500, 4500)
    sleep(randomSleep)
    log("随机等待时间为:" + randomSleep + "毫秒")
}
