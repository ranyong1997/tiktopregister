targetPackageName = "com.facebook.katana"
androidId = "670151eab71ca94e"

var trans = JSON.parse(SLChanges.transferApp(targetPackageName,androidId))
log(trans)
if (trans.code != 200) { throw "restore fail" }