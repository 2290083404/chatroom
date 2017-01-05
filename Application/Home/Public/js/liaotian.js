// JavaScript Document
$(document).ready(function(){
	$("h5").bind("click",function(){
		var index=$(this).siblings("ul.xl");
		if(index.is(":visible")){
			index.hide();
			var t="〉";
			$(this).find("b.i").text(t);
		}else{
			index.show();
			var t="﹀";
			$(this).find("b.i").text(t);
		}
	});
	$("li.li1").bind("mouseover",function(){
		$(this).addClass("bg");
	}).bind("mouseout",function(){
		$(this).removeClass("bg");
	});

	/*弹出聊天对话框*/
	$("li.li1").bind("click",function(){
		var friendID=$(this).find("input[name='frdID']").val();
		var friendName=$(this).find("span.span1").text();
		$("#CurrentFriendID").val(friendID);
        $("#CurrentFriendName").val(friendName);
        //查询最近的20条记录
		$.ajax({
			url:selectMessageUrl,
			data:{friendID:friendID},
			async:false,
			success:function (data) {
                var html="";
				$.each(data,function(i,n){

					if(n.touserid==friendID){
						html=html+"<li class='li3'><div class='div13'><img src='/thinkphp/Application/Home/Public/image/sample_c.jpg' class='img2'>"+
                            "<cite class='cite1'>"+n.tousername+"<i class='i1' style='padding-left:15px;'>"+n.time+"</i> </cite>"+
                            "</div><div class='div15'><span>"+n.message+"</span><b class='b1'></b></div></li>";
					}else{
						html=html+"<li class='li2'><div class='div12'><img src='/thinkphp/Application/Home/Public/image/sample_c.jpg' class='img2'/>"+
                            "<cite class='cite'><i class='i1'>"+n.time+"</i>"+n.tousername+"</cite></div>"+
                            "<div class='div14'><span>"+n.message+"</span><b class='b'></b></div></li>";
					}
				});
                $("div.div8").find("div.div11").find("ul").html(html);

            }
		});
		//删除新消息提示
		$(this).find("span.messAge").html("");
		$("div.div8").show();
        var height=150*(parseInt($("div.div8").find("div.div11").find("li").length)+1);
        $("div.div8").find("div.div11").scrollTop(height);
	});


	$("a.an2").bind("click",function(){
		$(this).siblings("span.span6").hide();
		$(this).siblings("a.as").show();
		$(this).hide();
	});
	$("a.as1").bind("click",function(){
		$(this).hide();
		$(this).siblings("div.fenzu").show();
	});
	$("a.an3").bind("click",function(){
		$(this).closest("div.fenzu").hide();
		$(this).closest("div.fenzu").siblings("a.as1").show();
	});
	$("a.as").bind("click",function(){
		$(this).hide();
		$(this).siblings("span.span6").show();
		$(this).siblings("a.an2").show();
	});
	$("a.as2").bind("click",function(){
		$(this).hide();
		$(this).siblings("div.haoyou").show();
	});
	$("a.an5").bind("click",function(){
		$(this).closest("div.haoyou").hide();
		$(this).closest("div.haoyou").siblings("a.as2").show();
	});
	
	$('h5.h5').bind('contextmenu',function(e){
		$(this).closest("li").addClass("cc");
		$(this).closest("li.cc").siblings("li").removeClass("cc");
		var gropID=$("li.cc").find("h5").find("input[name='friendTypeID']").val();
		$("input[name='grop']").val(gropID);
		var typename=$("li.cc").find("h5").find("span").text();
		$("input[name='groupname']").val(typename);						
		$('#liebiao').css({ left: e.pageX, top: e.pageY, zIndex: ' 19891016' }).show();

		return false;
	});
	 $('#body').bind('click',function() {
		$('#liebiao').hide();
	});
	 $("li.li6").bind("mouseover",function(){
		$(this).addClass("bg");
		$(this).siblings("li").removeClass("bg");
	});
	 $('li.li1').bind('contextmenu',function(e){
		$(this).addClass("ss");
		$(this).siblings("li1").removeClass("ss");
		var name=$("li.ss").find("span").text();
		$("#beizhu").find("input[name='bz']").val(name);
		$('#liebiao1').css({ left: e.pageX, top: e.pageY, zIndex: ' 19891016' }).show();

		return false;
	});
	 $('#body').bind('click',function() {
		$('#liebiao1').hide();
	});
	 $("a.ab").bind("mouseover",function(){
		$(this).addClass("bk1");
	}).bind("mouseout",function(){
		$(this).removeClass("bk1");
	});
	//处理宽度
});
//更改好友备注
function updateBeizhu(ziji){
	var ID=$("li.ss").find("input[name='frdID']").val();
	var beizhuName=$("#beizhu").find("input[name='bz']").val();
	$.ajax({
		url:updateUrl,
		type:'post',
		data:{ID:ID,beizhuName:beizhuName},
		async:false,
		success:function(data){
			alert("修改成功");
			location=location;
		}
	});

}
function chooseThis(ziji,index){
	if(index==1){
		$("a.as1").hide();
		$("div.fenzu").show();
	}else if(index==2){//删除分组
		var gropID=$("li.cc").find("h5").find("input[name='friendTypeID']").val();
		$.ajax({
			url:delGroup,
			type:'post',
			data:{gropID:gropID},
			async:false,
			success:function(data){
				alert("分组删除成功");
				location=location;
			}
		});
	}else{
		$("a.as1").hide();
		$("div.fenzu").show();
	}
}
function chooseThis1(ziji,index){
	if(index==1){
		$("a.as2").hide();
		$("div.haoyou").show();
	}else if(index==2){//删除好友
		var friendID=$("li.ss").find("input[name='frdID']").val();
		$.ajax({
			url:delFriend,
			type:'post',
			data:{friendID:friendID},
			async:false,
			success:function(data){
				alert("好友删除成功");
				location=location;
			}
		});
		
	}else if(index==3){
		$("#beizhu").show();
	}else{
		$("#haoyoufenzu").show();
		var ID=$("li.ss").find("input[name='frdID']").val();
		$("input[name='friend']").val(ID);
		var ts="move";
		$("input[name='yidong']").val(ts);
	}
}
function changeThis(ziji,index){
	if(index==1){
		$(ziji).addClass("bk");
		$(ziji).siblings("li").removeClass("bk");
		$(ziji).closest("ul.ul").siblings("#lianxiren").show();
		$(ziji).closest("ul.ul").siblings("#qunzhu").hide();
		$(ziji).closest("ul.ul").siblings("#xiaoxi").hide();
	}else if(index==2){
		$(ziji).addClass("bk");
		$(ziji).siblings("li").removeClass("bk");
		$(ziji).closest("ul.ul").siblings("#lianxiren").hide();
		$(ziji).closest("ul.ul").siblings("#qunzhu").show();
		$(ziji).closest("ul.ul").siblings("#xiaoxi").hide();
	}else{
		$(ziji).addClass("bk");
		$(ziji).siblings("li").removeClass("bk");
		$(ziji).closest("ul.ul").siblings("#lianxiren").hide();
		$(ziji).closest("ul.ul").siblings("#qunzhu").hide();
		$(ziji).closest("ul.ul").siblings("#xiaoxi").show();
	}
}
function shangChan(ziji){
	$('#tupian').click();	
}

//聊天的消息连接成功  关闭   发送消息  连接错误
/*function onOpen(obj,flag){
 dowriteMsg("open","1");
 websocket.send(flag+".,.,.open");
 }

 function onClose(obj) {
 dowriteMsg("close","2");
 }

 function onMessage(obj) {

 dowriteMsg("msg",obj.data);
 }

 function onError(obj) {
 dowriteMsg("error",'4');
 }*/

//接收别人发来的消息
function dowriteMsg(flag,data){
	if(flag=="open"){

	}else if(flag=="close"){

	}else if(flag=="msg"){
		var html="<li class='li3'><div class='div13'>"+
            　	 "<img src='../thinkphp/Application/Home/Public/image/sample_c.jpg' class='img2'/>"+
				 "<cite class='cite1'>龙傲天<i class='i1' style='padding-left:15px;'>2016-12-07&nbsp;&nbsp;13:57:57</i></cite>"+
            　	 "</div><div class='div15'><span>"+data+"</span><b class='b1'></b></div></li>";
		$("div.div8").find("div.div11").find("ul").append(html);
        var height=150*(parseInt($("div.div8").find("div.div11").find("li").length)+1);
        $("div.div8").find("div.div11").scrollTop(height);
	}else if(flag=="error"){

	}
}

//自己发送的消息
function sendOwnerMsg(ziji){
	var value=$(ziji).closest("div.div16").find("textarea").val();

	//var friendID=$("#CurrentFriendID").val();
	var friendName=$("#CurrentFriendName").val();

    //var msgdata='{"type":"login","username":"'+username+'","userID":"'+userID+'"}';
	var sendJson='{"type":"sayone","msg":"'+value+'","myName":"'+username+'","friendName":"'+friendName+'"}';

    ws.send(sendJson);
    $(ziji).closest("div.div16").find("textarea").val("");
}
//添加分组/修改分组
function addGrouping(ziji){
	var typename=$(ziji).closest("div.fenzu").find("input[name='groupname']").val();
	var gropID=$("input[name='grop']").val();
	if(typename){
		$.ajax({
			url:groupUrl,
			type:'post',
			data:{typename:typename,gropID:gropID},
			async:false,
			success:function(data){
				if(data=="001"){
					alert("该分组已经存在,请重新添加分组");
				}else if(data=="008"){
					alert("修改成功");
					location=location;
				}else{
					alert("添加成功");
					location=location;
				}
			}
		});
	}else{
		alert("请输入分组名称");
	}
}
//添加好友
function addfriend(ziji){
	var friendNickname=$(ziji).closest("div.haoyou").find("input").val();
	if(friendNickname){
		$.ajax({
			url:addUrl,
			type:'post',
			data:{friendNickname:friendNickname},
			async:false,
			success:function(data){
				if(data=="001"){
					alert("您已经拥有该好友");
				}else if(data=="002"){
					alert("该好友不存在");
				}else{
					$("#haoyoufenzu").show();
					$("input[name='friend']").val(data);
				}
			}
		});
	}else{
		alert("请输入好友昵称");
	}
}
//分组,好友移动
function changeGroup(ziji){
	  var typeID =$("#sect").find("option:selected").val();
	  var friend=$("input[name='friend']").val();
	  var yd=$("input[name='yidong']").val();
	  $.ajax({
			url:saveUrl,
			type:'post',
			data:{friend:friend,typeID:typeID,yd:yd},
			async:false,
			success:function(data){
				alert("操作成功");
				location=location;
			}
		});
}
function showMore(ziji){
	$("#biaoqing").toggle();
}
function changeThis1(ziji,index){
	if(index==1){
		$(ziji).addClass("bk2");
		$(ziji).siblings("a").removeClass("bk2");
	}else{
		$(ziji).addClass("bk2");
		$(ziji).siblings("a").removeClass("bk2");
	}
	$("input[name='sex']").val(index);
}
//保存个人信息修改
function saveInfo(ziji){
	var sex=$("#bianji").find("input[name='sex']").val();
	var username=$("#bianji").find("input[name='username']").val();
	var email=$("#bianji").find("input[name='email']").val();
	var telephone=$("#bianji").find("input[name='telephone']").val();
	if(sex && username && email && telephone){
		$.ajax({
			url:updateinfoUrl,
			type:'post',
			data:{sex:sex,username:username,email:email,telephone:telephone},
			async:false,
			success:function(data){
				if(data=="11"){
					alert("用户名和邮箱已被占用");
				}else if(data=="12"){
					alert("邮箱被占用");
				}else if(data=="13"){
					alert("用户名被占用");
				}else{
					alert("修改成功");
					location=location;
				}
			}
		});
	}else{
		alert("请完善信息后再提交");
	}
	 
}
function bianJi(ziji){
	$(ziji).hide();
	$(ziji).siblings("button").show();
	$("#bianji").show();
	$("#neirong").hide();
	var username=$("span[name='username']").text();
	var sex=$("span[name='sex']").text();
	var email=$("span[name='email']").text();
	var telephone=$("span[name='telephone']").text();
	$("#bianji").find("input[name='username']").val(username);
	if(sex=="男"){
		$("li.sex").find("a").eq(0).addClass("bk2");
		$("li.sex").find("a").eq(1).removeClass("bk2");
		$("input[name='sex']").val(1);
	}else{
		$("li.sex").find("a").eq(1).addClass("bk2");
		$("li.sex").find("a").eq(0).removeClass("bk2");
		$("input[name='sex']").val(2);
	}
	$("#bianji").find("input[name='email']").val(email);
	$("#bianji").find("input[name='telephone']").val(telephone);
}
function hideBj(ziji){
	$(ziji).hide();
	$(ziji).siblings("button").hide();
	$(ziji).siblings("a").show();
	$("#bianji").hide();
	$("#neirong").show();
}
function souSuo(ziji){
	var input=$("input[name='sousuo']").val();
	if(input=="123"){
		$("#xiaoxi").hide();
		$("#lianxiren").hide();
		$("#qunzhu").hide();
		$("#haoyousousuo").show();
	}else if(input==""){
		$("#lianxiren").show();
		$("#haoyousousuo").hide();
	}
}
function touXiang(ziji){
	$("#xinxi").hide();
	$("#touxiang").show();
}
function quXiao(ziji){
	$("#touxiang").hide();
	$("#xinxi").show();
}
//读取本地图片
function cardImage(file,id){
	var ie6=(!!window.ActiveXObject&&!window.XMLHttpRequest)?true:false;
	var div=document.getElementById(id);
	var wh='width:225px;display:block;vertical-align:middle;float:left;margin: 4px 1px 0px 2px;';
	if(file.files.length<=4){
		if (file.files && file.files[0]) { 
			var data="";
			$.each(file.files,function(i,n){
				var reader = new FileReader(); 
				reader.readAsDataURL(n); 
				console.log(reader);
				reader.onload = function(evt){
					data=data+'<img src="'+reader.result+'" width="100px" height="100px" style="margin-top:10px">';
					$(div).html(data);
					
				}
			});
		$(div).prev("img").hide();//将加号隐藏
		} 
		else { 
			if(ie6){
				div.innerHTML = '<img src="'+file.value+'" style="'+wh+'"/>'; 
			}else{
				var filter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=image);';
				var id="__iefilterimg"+new Date().getTime()+"__";
				var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="'; 
				file.select(); 
				var src = document.selection.createRange().text; 
				div.innerHTML = '<img id="'+id+'" style="'+filter+'">'; 
				var img = document.getElementById(id); 
				img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
				var divh="<div style='" +wh+sFilter+src;
				divh+='"';
				divh+="'></div>";
				div.innerHTML = divh;
			}
		} 
	}else{
			$("#btn5").hilight({
				check:"no",
				type:5,//状态值：1  2  3  4  5  6
				value:'对不起，图片最多为4张'//弹出框内容
			});	
	}
}

/*关闭聊天的弹出框*/
function closeLiaotian(ziji){
	$("#CurrentFriendID").val("");
    $("#CurrentFriendName").val("");
    $('div.div8').hide();
}