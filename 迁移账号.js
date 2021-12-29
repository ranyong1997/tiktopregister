var targetPackageName = "com.facebook.katana"
var androidId = "9e2efdcc1fb1f2bf"
console.time('迁移耗时');
var trans = JSON.parse(SLChanges.transferApp(targetPackageName, androidId))
log(trans)
if (trans.code != 200) { throw "restore fail" }
console.timeEnd('迁移耗时');

 