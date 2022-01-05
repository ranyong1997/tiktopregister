var targetPackageName = "com.zhiliaoapp.musically"
var androidId = "554e36b945531bc8"
console.time('迁移耗时');
var trans = JSON.parse(SLChanges.transferApp(targetPackageName, androidId))
log(trans)
if (trans.code != 200) { throw "restore fail" }
console.timeEnd('迁移耗时');