var httpUtilFunc = require("../http/httpUtils.js")
var utilsFunc = require("../util/utils.js")

var firstName = "" // 首字
var lastName = ""   // 尾字
var birthdayMonth = ""  // 生日(月)
var brithdayDay = ""    // 生日(日)
var brithdayYear = ""   // 生日(年)
var emailAddress = ""   // 邮箱账号
var password = ""   // 邮箱密码
var registerEmailAddress = ""
var hasCheckInfoed = false
var registerGmailDone = false
var registerStatus = "1"


function getRegisterInfo() {
    var body = {
        "register_app_id": 2,
        "limit": 1,
        "status": 0
    }
    var result = httpUtilFunc.httpRequest("registerAccountGet", body)
    var resultData = result.body.json().data;
    log("解析得到的result为:" + commonFunc.string())
    var code = resultData.code
    if (code == "000000") {
        var accounts = resultData.data.accounts
        firstName = accounts[0].first_name
        log("首字为:" + firstName)
        lastName = accounts[0].last_name
        log("尾字为:" + lastName)
        birthday = accounts[0].birthday
        log("生日为:" + birthday)
        birthdaySplitList = birthday.split("-")
        log("生日分割为:" + birthdaySplitList)
        birthdayMonth = utilsFunc.transMonth(birthdaySplitList[1])
        log("生日(月)为:" + birthdayMonth)
        brithdayDay = birthdaySplitList[2]
        log("生日(日)为:" + brithdayDay)
        brithdayYear = birthdaySplitList[0]
        log("生日(年)为:" + brithdayYear)
        emailAddress = accounts[0].email.split("@")[0]
        log("邮箱为:" + emailAddress)
        password = accounts[0].password
        log("密码为:" + password)
        toastLog(" 首字: " + firstName + " 尾字: = " + lastName + " 生日(月) = " + birthdayMonth)
        registerGmail()
        updateRegisterResult(accounts[0])
    }
}

// 邮箱注册
function registerGmail() {
    launchApp("Google Play Store");
    log("正在启动app:", launchApp)
    randomSleep()
    toastLog("开始邮箱注册~")
    var count = 0
    do {
        try {
            checkSignGoogle()
            checkingInfoPage()
            createGoogleAccount()
            createGoogleAccountName()
            checkWrongPage()
            inputBasicInfo()
            chooseGmailAddress()
            createGmailAddress()
            checkRobot()
            checkAddPhoneNum()
            reviewAccountInfo()
            checkGooglePrivacyPage()
            checkGoogleServicePage()
            checkRegisterDone()
            count++
            if (registerGmailDone) {
                break
            }
        } catch (error) {
        }
    } while (true)
    toastLog("register gmail success")
    log("注册邮箱成功")
}

function updateRegisterResult(account) {
    var resultBody = {
        "id": account.id,
        "password": account.password,
        "email": registerEmailAddress,
        "register_ip": httpUtilFunc.getIpByIpify(),
        "status": registerStatus,
        "account": registerEmailAddress
    }
    var result = httpUtilFunc.httpRequest("registerAccountUpdate", resultBody)
    toastLog("result result" + result.body.string())
}

// 检查谷歌邮箱界面
function checkSignGoogle() {
    var signInBt = text("Sign in").id("com.android.vending:id/0_resource_name_obfuscated").findOne(3000)
    if (signInBt != null) {
        randomSleep()
        clickWidget(signInBt)
        log("点击Sign in")
        randomSleep()
    }

    var canNotSign = text("Couldn't sign in").id("com.google.android.gms:id/suw_layout_title").findOne(3000)
    if (canNotSign != null) {
        log("show try again")
        toastLog("show try again")
        randomSleep()
        back()
        toastLog("try again")
        randomSleep()
        log("正在打开Google Play Store")
        launchApp("Google Play Store");
    }
}

// 检查信息页
function checkingInfoPage() {
    var checkInfoText = desc("Checking info…").id("com.google.android.gms:id/suc_layout_title").findOne(1500)
    if (checkInfoText != null) {
        do {
            sleep(2000)
            var checkInfoTitle = desc("Checking info…").id("com.google.android.gms:id/suc_layout_title").findOne(1500)
            if (checkInfoTitle == null) {
                break
            }
        } while (true)
    }
}

// 创建谷歌账户
function createGoogleAccount() {
    var signInGoogleDesc = text("Sign in").findOne(1500)
    var signInDesc = text("with your Google Account. ").findOne(1500)
    log(" signInGoogleDesc " + signInGoogleDesc)
    log(" signInDesc " + signInDesc)
    if (signInGoogleDesc != null && signInDesc != null) {
        hasCheckInfoed = true
        log("登陆...sign in")
        var createAccountDesc = text("Create account").findOne(1500)
        if (createAccountDesc != null) {
            randomSleep()
            clickWidget(createAccountDesc)
            toastLog("click create account")
            sleep(random(500, 1000))
            var forMySelfDesc = text("For myself").findOne(1500)
            if (forMySelfDesc != null) {
                sleep(random(500, 1000))
                clickWidget(forMySelfDesc)
                toastLog("click for MySelf")
                randomSleep()
            }
        }
    }
}

// 创建谷歌帐户
function createGoogleAccountName() {
    log("createGoogleAccountName")
    var createAccountDesc = text("Create a Google Account").findOne(3000)
    var enterNameDesc = text("Enter your name").findOne(3000)
    if (createAccountDesc != null && enterNameDesc != null) {
        log("创建谷歌帐户")
        var firstNameEdit = text("First name").className("EditText").findOne(1500)
        if (firstNameEdit != null) {
            randomSleep()
            clickWidget(firstNameEdit)
            randomSleep()
            inputEditText(0, firstName)
            back()
            randomSleep()
            var lastNameWidget = text("Last name").className("EditText").findOne(1500)
            if (lastNameWidget != null) {
                clickWidget(lastNameWidget)
                log("点击尾字")
                sleep(random(800, 1500))
                inputEditText(1, lastName)
                back()
            }
            log("input name end")
        } else {
            var firstEdit = className("EditText").findOnce(0)
            if (firstEdit != null) {
                randomSleep()
                clickWidget(firstEdit)
                randomSleep()
                inputEditText(0, firstName)
                back()
                randomSleep()
            }

            var secondEdit = className("EditText").findOnce(1)
            if (secondEdit != null) {
                randomSleep()
                clickWidget(secondEdit)
                randomSleep()
                log("click lastName")
                inputEditText(1, lastName)
                back()
            }
        }
        sleep(random(800, 1000))
        var nextBt = text("Next").className("Button").findOne(1500)
        if (nextBt != null) {
            randomSleep()
            clickWidget(nextBt)
            log("点击下一步")
            randomSleep()
        }
    }
}

// 检查错误的页面
function checkWrongPage() {
    log("检查错误的页面")
    var wrongDesc = text("Something went wrong").findOne(1500)
    if (wrongDesc != null) {
        var nextBt = text("Next").className("Button").findOne(1500)
        if (nextBt != null) {
            clickWidget(nextBt)
            log("点击再次尝试")
        }
    }
}

// 输入简要信息比如（生日）
function inputBasicInfo() {
    log("输入简要信息比如")
    var basicInfoDesc = text("Basic information").findOne(1500)
    var birthdayAndGender = text("Enter your birthday and gender").findOne(1500)
    if (basicInfoDesc != null && birthdayAndGender != null) {
        var monthDesc = text("Month").className("Spinner").findOne(1500)
        if (monthDesc != null) {
            randomSleep()
            clickWidget(monthDesc)
            log("点击月份信息")
            randomSleep()
            var selectMounth = text(birthdayMonth).findOne(1500)
            do {
                if (selectMounth == null) {
                    var startX = random(400, 500)
                    var startY = random(700, 900)
                    var endX = random(400, 500)
                    var endY = random(200, 350)
                    swipe(startX, startY, endX, endY, random(500, 1500))
                }
                selectMounth = text(birthdayMonth).findOne(1500)
                if (selectMounth != null) {
                    break
                }
            } while (true)

            if (selectMounth != null) {
                clickWidget(selectMounth)
                log("选择月份")
                randomSleep()
            }
        }
        var dayEdit = text("Day").className("EditText").findOne(1500)
        if (dayEdit != null) {
            clickWidget(dayEdit)
            log("点击日期编辑")
            sleep(random(800, 1200))
            inputEditText(0, brithdayDay)
        } else {
            var firstEdit = className("EditText").findOnce(0)
            if (firstEdit != null) {
                randomSleep()
                clickWidget(firstEdit)
                randomSleep()
                inputEditText(0, brithdayDay)
            }
        }
        randomSleep()
        var yearEdit = text("Year").className("EditText").findOne(1500)
        if (yearEdit != null) {
            clickWidget(yearEdit)
            log("点击月份编辑")
            sleep(random(500, 1000))
            inputEditText(1, brithdayYear)
            back()
        } else {
            var secondEdit = className("EditText").findOnce(1)
            if (secondEdit != null) {
                randomSleep()
                log("点击尾字")
                inputEditText(1, brithdayYear)
                back()
            }
        }
        randomSleep()
        var genderSelect = text("Gender").className("Spinner").findOne(1500)
        if (genderSelect != null) {
            clickWidget(genderSelect)
            log("点击性别")
            randomSleep()
            var selectgener = text("Female").findOne(1500)
            clickWidget(selectgener)
            randomSleep()
        }
        var nextBt = text("Next").className("Button").findOne(1500)
        if (nextBt != null) {
            clickWidget(nextBt)
            randomSleep()
            log("点击下一步")
        }
    }
}

// 选择Gmail邮箱地址
function chooseGmailAddress() {
    log("选择Gmail邮箱地址")
    var chooseAddress = text("Choose your Gmail address").findOne(1500)
    if (chooseAddress != null) {
        var randomIntValue = random(0, 10)
        var selectIndex = 0
        if (randomIntValue > 5) {
            selectIndex = 1
        }
        log("选择的是: " + selectIndex)
        var radioButtons = className("RadioButton").findOnce(selectIndex)
        if (radioButtons != null) {
            clickWidget(radioButtons)
            randomSleep()
            var nextBt = text("Next").className("Button").findOne(1500)
            if (nextBt != null) {
                clickWidget(nextBt)
                randomSleep()
            }
        }
    }
}

function createGmailAddress() {
    var createMailAccount = text("Create a Gmail address for signing in to your Google Account").findOne(3000)
    if (createMailAccount != null) {
        log("输入Gmial邮箱")
        inputEditText(0, emailAddress)
        randomSleep()
        back()
        var nextBt = text("Next").className("Button").findOne(1500)
        if (nextBt != null) {
            clickWidget(nextBt)
            log("点击创建Gmail邮箱下一步")
        }
    }
    var createMailPsw = text("Create a strong password with a mix of letters, numbers and symbols").findOne(3000)
    if (createMailPsw != null) {
        randomSleep()
        inputEditText(0, password)
        back()
        randomSleep()
        var nextBt = text("Next").className("Button").findOne(1500)
        if (nextBt != null) {
            randomSleep()
            clickWidget(nextBt)
            log("点击邮箱密码下一步")
        }
    }
}

// 检查机器人
function checkRobot() {
    log("检查机器人...")
    var robotText = text("Confirm you’re not a robot").findOne(1500)
    if (robotText != null) {
        registerGmailDone = true
        registerStatus = "3"
    }
}

// 检测添加手机号
function checkAddPhoneNum() {
    log("检测添加手机号")
    var addPhoneNum = text("Add phone number?").findOne(1500)
    if (addPhoneNum != null) {
        var count = 0
        do {
            var startX = random(600, 800)
            var startY = random(600, 800)
            var endX = random(600, 800)
            var endY = random(300, 400)
            swipe(startX, startY, endX, endY, 300)
            count++
        } while (count < 10)
        var skipDesc = text("Skip").className("Button").findOne(1500)
        if (skipDesc != null && skipDesc.clickable) {
            clickWidget(skipDesc)
            randomSleep()
        }
    }
}

// 视察账户信息
function reviewAccountInfo() {
    log("视察账户信息")
    var reviewAccount = text("Review your account info").findOne(1500)
    log("当前账户信息为 = " + reviewAccount)
    if (reviewAccount != null) {
        var accountInfo = textContains("@gmail.com").findOne(1500)
        if (accountInfo != null) {
            log("账户 info " + accountInfo.text())
            registerEmailAddress = accountInfo.text()
        }
        randomSleep()
        var nextBt = text("Next").className("Button").findOne(1500)
        if (nextBt != null) {
            clickWidget(nextBt)
            randomSleep()
        }
    }
}

// 检查谷歌服务页
function checkGoogleServicePage() {
    var googleServicesPage = className("TextView").text("Google Services").findOne(1500)
    log("谷歌服务页 googleServicesPage =" + googleServicesPage)
    if (googleServicesPage != null) {
        var moreBt = className("Button").text("MORE").findOne(1500)
        if (moreBt != null) {
            clickWidget(moreBt)
            randomSleep()
            var agreeBt = className("Button").text("ACCEPT").findOne(1500)
            if (agreeBt != null) {
                clickWidget(agreeBt)
                randomSleep()
            }
        } else {
            var moreBt2 = className("Button").text("More").findOne(1500)
            if (moreBt2 != null) {
                clickWidget(moreBt2)
                randomSleep()
                var agreeBt = className("Button").text("Accept").findOne(1500)
                if (agreeBt != null) {
                    clickWidget(agreeBt)
                    randomSleep()
                }
            }
        }
    }
}

// 检查谷歌隐私页
function checkGooglePrivacyPage() {
    log("检查谷歌隐私页")
    var googleServicesPage = text("Privacy and Terms").findOne(1500)
    if (googleServicesPage != null) {
        var count = 0
        do {
            var startX = random(600, 800)
            var startY = random(600, 800)
            var endX = random(600, 800)
            var endY = random(300, 400)
            swipe(startX, startY, endX, endY, 300)
            count++
        } while (count < 18)
        var skipDesc = text("I agree").className("Button").findOne(1500)
        if (skipDesc != null) {
            clickWidget(skipDesc)
            randomSleep()
        }
    }
}

// 检查注册完成
function checkRegisterDone() {
    log("检查注册完成")
    var googleRegisterDoneText = text("Want to stay in the loop?").findOne(1500)
    if (googleRegisterDoneText != null) {
        registerGmailDone = true
        var randomIntValue = random(0, 10)
        var selectIndex = 0
        if (randomIntValue > 5) {
            selectIndex = 1
        }
        if (selectIndex == 1) {
            var noBt = text("No").className("Button").findOne(1500)
            if (noBt != null) {
                clickWidget(noBt)
            }
        } else {
            var yesBt = text("Yes, I'm in").className("Button").findOne(1500)
            if (yesBt != null) {
                clickWidget(yesBt)
            }
        }
    }
}


// 随机等待在(1.5s~4.5s之间)
function randomSleep() {
    var randomSleep = random(1500, 4500)
    sleep(randomSleep)
    log("随机等待时间为:" + randomSleep + "毫秒")
}

// 输入编辑文本
function inputEditText(index, textValue) {
    if (textValue != null) {
        var textLength = textValue.length
        var i = 0
        do {
            var inputText = textValue.slice(0, i + 1)
            setText(index, inputText)
            sleep(random(200, 1000))
            i++
        } while (i < textLength)
        log("当前输入的长度为:" + textLength)
    }
}



// 点击控件
function clickWidget(widget) {
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

// 连接VPN
function connectVPN () {
    launchApp("Kitsunebi");
    log("正在打开Kitsunebi")
    randomSleep()
    var startBt = id("fun.kitsunebi.kitsunebi4android:id/fab").findOne(1500)
    if (startBt != null) {
        startBt.click()
        sleep(5000)
    }
}


function registerGmail () {
    log("正在打开谷歌商店")
    launchApp("Google Play Store");
    randomSleep()
    log("开始邮箱注册!")
    var count = 0
    do {
        try {
            checkSignGoogle()
            checkingInfoPage()
            createGoogleAccount()
            createGoogleAccountName()
            checkWrongPage()
            inputBasicInfo()
            chooseGmailAddress()
            createGmailAddress()
            checkRobot()
            checkAddPhoneNum()
            reviewAccountInfo()
            checkGooglePrivacyPage()
            checkGoogleServicePage()
            checkRegisterDone()
            count ++
            if (registerGmailDone) {
                break
            }
        } catch (error) {

        }
    } while (true)
    toastLog("register gmail success")
}


// checkGoogleServicePage()
getRegisterInfo()