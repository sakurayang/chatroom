var bilibule = "#66ccff";
var bilipink = "#ffafc9";
var urlRE = "^((https|http|ftp|rtsp|mms)?://)"
			+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
			+ "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
			+ "|" // 允许IP和DOMAIN（域名）
			+ "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
			+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
			+ "[a-z]{2,6})" // first level domain- .com or .museum
			+ "(:[0-9]{1,4})?" // 端口- :80
			+ "((/?)|" // a slash isn't required if there is no file name
			+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
var checkUrl = new RegExp(urlRE,"ig");
var help_msg_all = "help('command')                              |查看详细命令帮助\n"
				  +"login('username','password')                 |登录\n"
				  +"reg('username','password')                   |注册\n"
				  +"bgimg('imgurl')                              |更换背景图（只有你看得见）\n"
				  +"color('bgcolor','textcolor')                 |更换默认字体颜色与背景色（只有你看得见）\n"
				  +"msg('message','color','introtext','type')    |发送消息\n"
				  +"-----------------------------------------------------------------------------------------\n"
				  +"其他一些小玩意儿：\n"
				  +"getTime()                                    |获取时间\n"
				  +"tip('text','color')                          |自己试试看~~"

function getTime() {
	var t = new Date();
	var time_h = t.getHours();
	var time_m = t.getMinutes();
	var time_s = t.getSeconds();
	(time_h.toString().length == 1) ? time_hh = "0" + time_h.toString() : time_hh = time_h.toString();/*如果不足2位，补0*/
	(time_m.toString().length == 1) ? time_mm = "0" + time_m.toString() : time_mm = time_m.toString();
	(time_s.toString().length == 1) ? time_ss = "0" + time_s.toString() : time_ss = time_s.toString();
	var time = time_hh + ":" + time_mm + ":" + time_ss;
	return time;
}

function tip(text,color) {
	var tipBox = document.getElementById("tipBox");
	var tipit=$("#tipBox");
	tipBox.innerHTML =text ;
	$("#tipBox").css({
		backgroundColor:color,
		fontSize:"30px",
		top:$(window).scrollTop()+10,
		textAlign:"center",
		opacity:"0",
		width:"100%",
		position:"absolute",
		zIndex:"999999",
		color:"black",
	});
	tipit.animate({
		opacity:"0.8",
	},400);
	tipit.animate({
		opacity:"0.8",
	},1000);
	tipit.animate({
		opacity:"0",
		display:"none",
		zIndex:"-1",
	},700);
}

function color(bgcolor,textcolor) {
	var userRoot = wilddog.sync().ref("/users/");
	if (username == null || !username) {
		console.error("未登录，请用login('用户名')来登录");
		tip("未登录","red");
	} else if (!bgcolor){
		var bgcolor = "#2a211c";
	} else if (!textcolor) {
		var textcolor = "#bdae9d";
	} else {
		var bgcolor = bgcolor;
		var textcolor = textcolor;
		var pf = userRoot.child(username);
		userRoot.once("value")
			.then(function(profile) {
				var folder = userRoot.child(username+"/profile");
				folder.update({"/color":{"bgColor":bgcolor,"textColor":textcolor}});
			});

		$("body").css({backgroundImage:"url('')",backgroundRepeat:"no-repeat",backgroundSize:"100%",});
		$("body").animate({backgroundColor:"white",color:"white",},250);
		$(".button").animate({backgroundColor:"white",color:"white",},250);
		$("body").animate({backgroundColor:bgcolor,color:textcolor,},300);
		$(".button").animate({backgroundColor:bgcolor,color:textcolor,},300);
	}

}

function bgimg(url){
	var userRoot = wilddog.sync().ref("/users/");
	if (username == null || !username) {
		console.error("未登录，请用login('用户名')来登录");
		tip("未登录","red");
	} else if (!url || url == ""){
		console.error("请输入地址");
	} else if (!url.match(checkUrl)){
		console.error("你的链接：'"+ulr+"'不对喵~ 请输入正确的链接喵~~");
		tip("请输入正确的链接喵~~","red");
	} else {
		userRoot.once("value")
			.then(function(profile) {
				var folder = userRoot.child(username+"/profile");
				folder.update({"/bgimg":url});
			});

		$("body").animate({backgroundColor:"white",opacity:"0.1"},250);
		$("body").css({
			backgroundImage:"url(https://res.cloudinary.com/duquoda8z/image/fetch/o_50,b_black/"+url+")",
			backgroundRepeat:"no-repeat",
			backgroundSize:"100%",
			backgroundAttachment:"fixed",
			});
		$("body").animate({backgroundColor:"black"},250);
		$("body").animate({opacity:"1"},250);
	}
}
function helpme(name) {
	switch (name) {
		case login:
			console.info("使用login(\'username\',\'password\')来登录。为了安全起见，登录的时候会进行如下的操作：\n"+
						"+-----------+         +-----------+         +-------------+\n"+
						"|  用户输入  |-------->| Crypto-js |-------->|后端数据库比对|\n"+
						"|           |         | 本地加密   |         |sha-256字符串|\n"+
						"+-----------+         +-----------+         +-------------+\n");
			return null;
			break;
		case reg:
			console.info("使用reg('username','password')来注册。为了安全起见，你的密码会以sha-256的加密方式储存");
			return null;
			break;
		case bgimg:
			console.info("会随着你登录而改变，后端数据库只储存图片url。前端展示默认使用Cloudinary的CDN");
			return null;
			break;
		case color:
			console.info("会随着你登录而改变");
			return null;
			break;
		case getTime:
			console.info("获取时间");
			return null;
			break;
		case tip:
			console.info("自己试试就知道了");
			return null;
			break;
		case msg:
			console.info("发送消息\n");
			console.group("参数解析");
			console.group("类型(type)：");
			console.info("| text |  默认，发送普通文本\n"+
						 "| img  |  发送图片，输入图片url，可输入introtext\n"+
						 "| url  |  发送可点击的超链接，可输入introtext");
			console.groupEnd();
			console.group("简介文本(introtext):");
			console.info("当 type=text 的时候 introtext=text \n"+
						 "当 type=img 的时候 introtext 会展示在图片上一行以描述图片\n"+
						 "当 type=url 的时候 introtext 将充当超链接文字\n"+
					 	 "当introtext缺省的时候 默认为text的内容");
			console.groupEnd();
			console.group("颜色(color):");
			console.info("没什么好说的，除了red yellow #000000 rgba hsl之类的 %cbilibule %c和 %cbilipink %c也被允许使用","color:#66ccff","","color:#ffafc9","");
			console.groupEnd();
			return null;
			break;
		default:
			console.info(help_msg_all);
			return null;
			break;
		}
}
