// JavaScript Document
	//发送邮件
	function sendEmail1(ziji){
		var email=$(ziji).prev("input").val();
		$.ajax({
			url:sendEmail,
			data:{url:email},
			async:false,
			success:function(data){
				alert("发送成功,请取出邮箱验证码进行密码的修改");
				/*$("#btn3").hilight({
					type:3,//状态值：1  2  3  4  5  6
					//load:"yes",
					value:'邮件发送成功'//弹出框内容
				});*/
				//settime(ziji);
			}
		});
		
	}
//60秒倒计时
var countdown=60; 
function settime(obj) { 
    if (countdown == 0) { 
        obj.removeAttribute("disabled");    
        obj.value="发送邮件"; 
        countdown = 60; 
        return;
    } else { 
        obj.setAttribute("disabled", true); 
        obj.value="重新发送(" + countdown + ")"; 
        countdown--; 
    } 
setTimeout(function() { 
    settime(obj) }
    ,1000) 
}
//提交
function forget(ziji){
	var email=$("form[name='frm']").find("input[name='youxiang']").val();
	var xinmima=$("form[name='frm']").find("input[name='xinmima']").val();
	var qrmima=$("form[name='frm']").find("input[name='qrmima']").val();
	var yanzhengma=$("form[name='frm']").find("input[name='yanzhengma']").val();
	if(email && xinmima && qrmima && yanzhengma){
		if(xinmima !=qrmima){
			alert("两次密码错误,请重新核对后再提交")
		}else{
			$("form[name='frm']").submit();
		}
	}else{
		alert("请完善信息");
	}
		
}
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

function checkyouxiang(ziji){
	var input=$("input[name='youxiang']").val();
	if(input==""){
		$("#test").text("不能为空");
	}else if(!isEmail(input)){
		$("#test").text("邮箱不合法");
	}else{
		document.getElementById("test").innerHTML="";
	}
}
function checkyanzhengma(ziji){
	var input=$("input[name='yanzhengma']").val();
	if(input==""){
		$("#test1").text("不能为空");
	}else{
		document.getElementById("test1").innerHTML="<img src='__ROOT__/Application/Home/Public/image/gougou.png' width='30px'style='margin-top: -30px;margin-left: 205px;'/>";
	}
}
function checkxinmima(ziji){
	var input=$("input[name='xinmima']").val();
	if(input==""){
		$("#test2").text("不能为空");
	}else if(input.length>16 || input.length<6){
		$("#test2").text("密码长度6~16位之间");
	}else{
		document.getElementById("test2").innerHTML="<img src='__ROOT__/Application/Home/Public/image/gougou.png' width='30px' style='margin-top: -30px;margin-left: 205px;'/>";
	}
}

function checkqrmima(ziji){
	var input=$("input[name='qrmima']").val();
	var input1=$("input[name='xinmima']").val();	
	if(input==""){
		$("#test3").text("不能为空");
	}else if(input!=input){
		$("#test3").text("两次输入密码错误");
	}else if(input.length>16 || input.length<6){
		$("#test3").text("密码长度6~16位之间");
	}else{
		document.getElementById("test3").innerHTML="<img src='__ROOT__/Application/Home/Public/image/gougou.png' width='30px' style='margin-top: -30px;margin-left: 205px;'/>";
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
	
	
	
	
	
		