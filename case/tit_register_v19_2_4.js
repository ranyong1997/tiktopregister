var commonFun = require("../lib/common.js")
var proxySettings = require("../vpn/proxySettings.js")

var FIND_WIDGET_TIMEOUT = 750


var vpnInfos = [
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$jhckPSKqFX*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$jhckPSKqFX*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$jhckPSKqFX*GB", "pass": "88tr", "ptype": "sock5" },
    { "ip": "185.145.128.72", "port": 4113, "user": "u768$jhckPSKqFX*GB", "pass": "88tr", "ptype": "sock5" },
]


commonFun.systemTimezoneSet("Europe/London")
if (connectVPN()) {
    sleep(5000)
}

//点击VPN连接按钮
function connectVPN() {
    if (!proxySettings.kitsunebiInstall("http://192.168.91.3:8012/upload/e3acddc3-4ce1-4286-8ad6-f2c0e8bac093.apk")) { throw "未安装 " + "fun.kitsunebi.kitsunebi4android" }
    var is_proxy_on = false
    var startVpnConnnectTime = new Date().getTime()
    do {
        var nowTime = new Date().getTime()
        if (nowTime - startVpnConnnectTime > 3 * 60 * 1000) {
            return false
        }
        try {
            let vpnData = vpnInfos[random(0, 3)]
            is_proxy_on = proxySettings.kitsunebiSetup2(vpnData)
        } catch (error) {
            closeVPNSettings()
        }
        if (!is_proxy_on) {
            sleep(2000)
        }
    } while (!is_proxy_on)
    return true
}

function closeVPNSettings() {
    randomSleep()
    do {
        if (!packageName("com.android.settings").findOne(1)) {
            log("kitsunebi launching .. ")
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
        var KitsunebiSetting = text("Kitsunebi").id("android:id/title").findOne(500)
        if (KitsunebiSetting != null) {
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
    } while (true)
}


function randomSleep() {
    var randomSleep = random(500, 1500)
    sleep(randomSleep)
}