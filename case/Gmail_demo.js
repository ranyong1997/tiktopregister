//  切换分区

//第一步：打开Gmail
launch("com.google.android.gm")

// 点击 GOT IT
while(!click("GOT IT"));

// 点击 +Add an email address
while(!click("Add an email address"));
// 第二步：点击谷歌登陆
while(!click("Google"));
// 第三步：检查登陆界面(需要写循环等待)

// 第四步：输入邮箱
while(!click("Learn more"));
sleep(500)
while(!click("Close"));
var thread = threads.start(function(){
    text("Learn more about Google Accounts")
});
thread.waitFor();
thread.setTimeout(function(){
    input("princehgeorgannr@gmail.com")
}, 1000);

// 第五步：点击next
sleep(2000)
while(!click("Next"));
sleep(5000)
// 第六步： 输入邮箱密码
input("eqo4v1hQ1")
sleep(2000)
back()
// 第七步：点击next
while(!click("Next"));
// 第八步： 上滑到底部
var time_random = random(50, 200);
var x1 = parseInt(device.width / (random(15, 25) / 10));
var y1 = parseInt(device.height * (random(70, 82) / 100));
var x2 = parseInt(device.width / (random(15, 25) / 10));
var y2 = parseInt(device.height * (random(20, 32) / 100));
var duration = random(3000, 5000);
swipe(x1, y1, x2, y2, duration);

// 第九步： 点击 Yes.I`m in
while(!click("Yes, I’m in"));

// 第十步： 点击 I agree
while(!click("I agree"));

// 第十一步： 打开youtube
launch("com.google.android.youtube")
// 第十二步：点击youtube头像
