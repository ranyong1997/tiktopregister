
// checkSignUpPage()
// function checkSignUpPage() {
//     log("检查登陆页")
//     var signUpText = id("com.zhiliaoapp.musically:id/title").text("Sign up for TikTok").find()
//     if (signUpText != null) {
//         log("点击facebook登陆")
//         var continueFacebook = id("com.zhiliaoapp.musically:id/acf").find()
//         continueFacebook.click();
//     }
// }

// checkAuthorizationPage()

// function checkAuthorizationPage() {
//     log("授权登陆界面")
//     var authorizationText = className("android.widget.Button").text("Cancel").find()
//     if (authorizationText != null) {
//         log("点击允许授权")
//         var click_authorization = text("Agree and Continue").find()
//         click_authorization.click();
//     }
// }

// checkSignupPage()
// function checkSignupPage() {
//     log("检查创建用户名页面")
//     var vpnSettings = text("Sign up").id("com.zhiliaoapp.musically:id/title").findOne(500)
//     if (vpnSettings != null) {
//         log("点击跳过按钮")
//         var vpnSettings1 = text("Skip").id("com.zhiliaoapp.musically:id/egf").findOne(500)
//         vpnSettings1.click()
//     }
//     back()
// }


// checkinterestsPage()
// function checkinterestsPage() {
//     log("选择你的兴趣界面")
//     var choose_interests = text("Choose your interests").id("com.zhiliaoapp.musically:id/bek").findOne(500)
//     if (choose_interests != null) {
//         log("点击跳过按钮")
//         var interests_skip = text("Skip").id("com.zhiliaoapp.musically:id/e1u").findOne(500)
//         interests_skip.click()
//     }
//     back()
// }

// checkSwipe_up_Page()
// function checkSwipe_up_Page() {
//     log("开始看视频")
//     var Start_up = text("Swipe up").id("com.zhiliaoapp.musically:id/title").findOne(500)
//     if (Start_up != null) {
//         log("点击Start watching")
//         var start_watching = text("Start watching").id("com.zhiliaoapp.musically:id/e6z").findOne(500)
//         start_watching.click()
//     }
// }


// checkSynchronizingPage()
// function checkSynchronizingPage() {
//     log("关闭同步联系人")
//     var Synchronizing = id("com.zhiliaoapp.musically:id/adq").findOne(500)
//     if (Synchronizing != null) {
//         log("点击不允许")
//         var click_dont = text("Don't allow").findOne(500)
//         click_dont.click()
//     }
// }    


// checkBirthdayPage()
// function checkBirthdayPage() {
//     log("选择出生月月日页")
//     var choose_birthday = text("When’s your birthday?").id("com.zhiliaoapp.musically:id/qv").findOne(500)
//     if (choose_birthday != null) {
//         log("点击返回")
//         var click_back = id("com.zhiliaoapp.musically:id/pi").findOne(500)
//         click_back.click()
//     }
// }    

// checkphonePage()
// function checkphonePage() {
//     log("手机/邮箱页")
//     var checkphone = text("Send code").id("com.zhiliaoapp.musically:id/cfh").findOne(500)
//     if (checkphone != null) {
//         log("点击返回")
//         var click_back = id("com.zhiliaoapp.musically:id/pi").findOne(500)
//         click_back.click()
//     }
// }    



// function resgisterTiktok() {
//     commonFun.clearData("com.ss.android.ugc.trill")
//     sleep(5 * 1000)
//     var vpnState = SLChanges.getVPNLinkState()
//     toastLog(" vpnState1 "+vpnState)
//     if (!vpnState) {
//         checkVPNConnect()
//     }
//     // launchApp("TikTok");
//     startRegisterTime = new Date().getTime()
//     // randomSleep()
//     toastLog("start1")
//     randomSleep()
//     var launchAppCount =  0
//     do {

//         if( !packageName("com.ss.android.ugc.trill").findOne(1) ){

//             log( "TikTok launching .. launchAppCount "+launchAppCount )
//             launchApp("TikTok")
//             sleep(3000)
//             launchAppCount ++
//             var vpnState = SLChanges.getVPNLinkState()
//             toastLog(" vpnState "+vpnState)
//             if (!vpnState) {
//                 checkVPNConnect()
//             }
//         }

//         try {
//             var nowTime = new Date().getTime()
//             if (nowTime - startRegisterTime > 10*60*1000) {
//                 registerDone = true
//                 registerSignUp = true
//                 if (resgisterStatus == enums.REGISTER_STATUS.DEFAULT) {
//                     resgisterStatus = enums.REGISTER_STATUS.FAIL
//                 }
//                 break
//             }
//             if (!isBirthDayDone) {
//                 checkSignUpPage()
//                 checkBirthDayPage()
//             }
//             checkSignUpEmail()
//             checkVerifyPicture()
//             checkCreatePassword()
//             checkVerifyCode()
//             checkAlreadySignUp()
//             if (isCheckPassword) {
//                 checkUserName()
//                 chooseYourInterests()
//                 checkSwipeUp()
//             }
//             startTiktok()
//             if (registerDone && registerSignUp) {
//                 break
//             }
//         } catch (error) {
//             toastLog(" register error "+error)
//         }

//     } while (true)
// }


// scrollShortUp()
// function scrollShortUp() {
//     log("上滑一小截1次");
//     var time_random = random(50, 200);
//     var x1 = parseInt(device.width / (random(15, 25) / 10));
//     var y1 = parseInt(device.height * (random(70, 82) / 100));
//     var x2 = parseInt(device.width / (random(15, 25) / 10));
//     var y2 = parseInt(device.height * (random(20, 32) / 100));
//     var duration = random(850, 1220);
//     swipe(x1, y1, x2, y2, duration);
//     sleep(time_random);
// }

// checkinterestsPage()

// function checkinterestsPage() {
//     log("选择你的兴趣界面")
//     var choose_interests = text("Choose your interests").id("com.zhiliaoapp.musically:id/bek").find()
//     if (choose_interests != null) {
//         log("点击跳过按钮")
//         var interests_skip = text("Skip").id("com.zhiliaoapp.musically:id/e1u").find()
//         var interests_skip2 = text("Skip").id("com.zhiliaoapp.musically:id/em0").find()
//         if (interests_skip != null || interests_skip2 != null) {
//             interests_skip == interests_skip2
//             // commonFun.clickWidget(collect)
//             interests_skip.click()
//         }
//     }
// }

face_recognition()

function face_recognition() {
    log("检测是否需要人脸识别")
    var face_recognition = text("Your account has been disabled").findOne()
    if (face_recognition != null) {
        log("该账号需要人脸识别")
        // TODO：记录该facebook安卓id
    }
    commonFun.clearData(tiktop_packageName)
}