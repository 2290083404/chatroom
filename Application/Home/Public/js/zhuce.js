// JavaScript Document
function changeThis(ziji,index){
	if(index==1){
		$(ziji).addClass("bk");
		$(ziji).siblings("a").removeClass("bk");
	}else{
		$(ziji).addClass("bk");
		$(ziji).siblings("a").removeClass("bk");
	}
	$("input[name='sex']").val(index);
}
function checkmima(ziji){
	var input=$("input[name='mima']").val();
	if(input==""){
		$("#test1").text("不能为空");
	}else if(input.length>16 || input.length<6){
		$("#test1").text("密码长度6~16位之间");
	}else{
		document.getElementById("test1").innerHTML="<img src='__ROOT__/Application/Home/Public/image/gougou.png' width='30px' style='margin-top: -30px;margin-left: 205px;'/>";
	}
}
function checknicheng(ziji){
	var input=$("input[name='nicheng']").val();
	if(input==""){
		$("#test").text("不能为空");
	}else if(input.length>12 || input.length<6){
		$("#test").text("昵称长度6~12位之间");
	}else{
		document.getElementById("test").innerHTML="<img src='__ROOT__/Application/Home/Public/image/gougou.png' width='30px'style='margin-top: -30px;margin-left: 205px;'/>";
	}
}
function checkyouxiang(ziji){
	var input=$("input[name='youxiang']").val();
	if(input==""){
		$("#test2").text("不能为空");
	}else if(!isEmail(input)){
		$("#test2").text("邮箱不合法");
	}else{
		document.getElementById("test2").innerHTML="<img src='__ROOT__/Application/Home/Public/image/gougou.png' width='30px'style='margin-top: -30px;margin-left: 205px;'/>";
	}
}
function checkdianhua(ziji){
	var input=$("input[name='dianhua']").val();
	if(input==""){
		$("#test3").text("不能为空");
	}else if(!isNumber(input) || input.length !=11){
		$("#test3").text("电话号码不合法");
	}else{
		document.getElementById("test3").innerHTML="<img src='__ROOT__/Application/Home/Public/image/gougou.png' width='30px'style='margin-top: -30px;margin-left: 205px;'/>";
	}
}
	//检测电话号码的合法性（数字检测）
	function   isNumber(name)   
	{
		if(name.length   ==   0)
			return   false;
		for(i   =   0;   i   <   name.length;   i++)   {
			if(name.charAt(i)   <   "0"   ||   name.charAt(i)   >   "9")
				return   false;
	}
		return   true;
	}
	//邮箱合法性检测
	function isEmail(strEmail) {
		if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1){
			return true;
		}else{
			return false;
		}
	}
	
	function checkInfo(ziji){
		var nickname=$("form[name='frm']").find("input[name='nicheng']").val();
		var mima=$("form[name='frm']").find("input[name='mima']").val();
		var youxiang=$("form[name='frm']").find("input[name='youxiang']").val();
		var dianhua=$("form[name='frm']").find("input[name='dianhua']").val();
		var sex=$("form[name='frm']").find("input[name='sex']").val();
		if(nickname && mima && youxiang && dianhua && sex){
			$("form[name='frm']").submit();
		}else{
			alert("请将信息填完整再提交");
		}
	}
	
	
	
	
	
		