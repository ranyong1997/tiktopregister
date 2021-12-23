// 连接VPN
function connectVPN () {
    launchApp("Kitsunebi");
    log("正在打开Kitsunebi")
    // randomSleep()
    var startBt = id("fun.kitsunebi.kitsunebi4android:id/fab").findOne(1500)
    if (startBt != null) {
        startBt.click()
        sleep(5000)
    }
}


connectVPN()