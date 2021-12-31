var targetPackageName = "com.facebook.katana"
var androidId = "26f1bbe13cd35055"
console.time('迁移耗时');
var trans = JSON.parse(SLChanges.transferApp(targetPackageName, androidId))
log(trans)
if (trans.code != 200) { throw "restore fail" }
console.timeEnd('迁移耗时');