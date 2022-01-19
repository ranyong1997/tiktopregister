var commonFun = require("../lib/common.js")

function doSomething() {
    while (true) {
        if (true) {
            log("这是一个测试")
        }
        else {
            toastLog("unknow page")
        }
    }
}
let myThreadResult = commonFun.newThread(doSomething, false, 1000 * 2 * 1, () => { log("doSomething 超时退出") })