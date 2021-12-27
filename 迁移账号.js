targetPackageName = "com.facebook.katana"
androidId = "01da046a377ea0a7"

var trans = JSON.parse(SLChanges.transferApp(targetPackageName,androidId))
log(trans)
if (trans.code != 200) { throw "restore fail" }