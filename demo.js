function chooseYourInterests() {
    log("检查兴趣页")
    var chooseYourInterestsText = id("com.ss.android.ugc.trill:id/title").text("Choose your interests").findOne(FIND_WIDGET_TIMEOUT)
    log("chooseYourInterests chooseYourInterestsText " + chooseYourInterestsText)
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
