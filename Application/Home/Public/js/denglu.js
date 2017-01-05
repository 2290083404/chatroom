// JavaScript Document
function checkzhanghao(ziji){
	var input=$("input[name='zhanghao']").val();
	if(input==""){
		$("#test").text("账号不能为空");
	}else if(input.length>12 || input.length<6){
		$("#test").text("账号长度6~12位之间");
	}else{
		//$("#test").html="<img src='gougou.png'/>";
		document.getElementById("test").innerHTML="<img src='../image/gougou.png' width='30px' style='margin-left: 290px;margin-top: -35px;'/>";
	}
}

function checkmima(ziji){
	var input=$("input[name='mima']").val();
	if(input==""){
		$("#test1").text("密码不能为空");
	}else if(input.length>16 || input.length<6){
		$("#test1").text("密码长度6~16位之间");
	}else{
		document.getElementById("test1").innerHTML="<img src='../image/gougou.png' width='30px'  style='margin-left: 290px;margin-top: -35px;'/>";
	}
}
function checkInfo(ziji){
	var zhanghao=$("form[name='frms']").find("input[name='zhanghao']").val();
	var mima=$("form[name='frms']").find("input[name='mima']").val();
	if(zhanghao && mima){
		$("form[name='frms']").submit();
	}else{
		alert("请将信息填写完善");
	}
}