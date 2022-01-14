//  修改头像
try {
    if (taskPluginData.updatePhoto) {
        feedback_data = {
            "app_id": app_id,
            "app_secret": app_secret,
            "mid": null,
            "task_type": 2,                    //  "任务类型 0-未知; 1-发布视频",
            "task_result": 0,                    //  "任务结果 1/0",
            "account_id": account_unique_id,    //  "账号唯一标识",
            "account_tags": profileTag,  //  "账号标签",
            "ip": global_ip,            //  "当前代理IP" 
            // "box_no"        : "",
            "comment": ""
        }

        for (let index = 0; index < 5; index++) {
            try {
                material = null
                // material = httpUtilFunc.materialGet(app_id,app_secret,1,2,0,profileTag)
                material = httpUtilFunc.materialGet({
                    "app_id": app_id,
                    "app_secret": app_secret,
                    "type": 1,
                    "classify": 2,
                    "used_times": 0,
                    "lable": profileTag,
                    "used_times_model": "lte",
                })
                if (material.media_size < 22) {
                    log("弃用素材:" + material.id, "a")
                    throw "图片尺寸太小:" + commonFunc.objectToString(material)
                }
                feedback_data.mid = material.id
                break
            } catch (error) {
                if (index > 1) { throw error }
            }
            randomSleep(1000)
        }
        let new_account = targetApp.editProfile(account, { "name": null, "username": null, "bio": null, "photo": material.media_path })
        account = httpUtilFunc.accountUpdate(account.id, { "photo": new_account.photo })
        commonFunc.taskResultSet("成功修改头像:" + new_account.photo, "a")
        try { feedback_data.task_result = 1; httpUtilFunc.materialFeedback(feedback_data) } catch (error) { }
    }
} catch (error) {
    try { feedback_data.mid && httpUtilFunc.materialFeedback(feedback_data) } catch (error) { }
    reportLog("更新资料异常: " + commonFunc.objectToString(error))
}