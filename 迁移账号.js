targetPackageName = "com.facebook.katana"
androidId = "e7b3f127ba5d5b28"

var trans = JSON.parse(SLChanges.transferApp(targetPackageName,androidId))
log(trans)
if (trans.code != 200) { throw "restore fail" }