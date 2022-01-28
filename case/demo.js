/*
 * @Descripttion: 
 * @version: 
 * @Author: 冉勇
 * @Date: 2022-01-27 11:00:02
 * @LastEditTime: 2022-01-28 14:52:50
 */

const { longSleep, shortSleep } = require("../lib/common");
const commonFunc = require("../lib/common");
checkUsersInfoPage()
function checkUsersInfoPage() {
    log("检查抖主主页")
    var SersInfoText = text("Followers").id("com.zhiliaoapp.musically:id/b77").findOne(750)
    if (SersInfoText != null) {
        log("点击粉丝列表")
        shortSleep()
        commonFunc.clickWidget(SersInfoText)
        longSleep()
        log("循环滑动")
        while (true) {
            check_last_use()
            commonFunc.scrollShortUp()

        }
    }
}
// function check_first_use() {
//     let tag = [];
//     let list = selector().find();
//     for (var i = 0; i < list.length; i++) {
//         var object = list.get(i);
//         if (object.text() != "") {
//             text_ = object.text()
//             tag.push(text_)
//         }
//     }
//     first_name = tag[5]
//     log("单页第一个粉丝名为：", first_name)
// }

function check_last_use() {
    let tag = []
    let list = selector().find();
    for (var i = 0; i < list.length; i++) {
        var object = list.get(i);
        if (object.text() != "") {
            text_ = object.text()
            tag.push(text_)
        }
    }
    last_name = tag[tag.length - 3]
    log("单页最后一个粉丝名为：", last_name)
    if(last_name >3){
        log("到底")
        return true
    }
}

