<?php
/**
 * Created by PhpStorm.
 * User: wangbo
 * Date: 16-12-14
 * Time: 下午1:37
 */
/**
 *  功能：定义ajax返回的json数据类型及其状态码
 * @param array() 数组
 * @param string 状态码
 * return json
 */

function getReturnAjax($arr,$code){
    $json=array();
    $json['data']=$arr;
    $json['code']=$code;
    return json_encode($json);
}

/** 功能：验证用户名是否注册
 * @param $username
 * return 布尔类型
 */
function checkUsername($username){
	$where["username"]=$username;
	$res=M("user")->where($where)->select();
	if($res){
		$flag="1001";
	}else{
		$flag="1002";
	}
	return $flag;
}
/** 功能：验证用户名除了自己以外是否注册
 * @param $username
 * return 布尔类型
 */
function checkUsername1($username,$userID){
	$where["ID"]=array("neq",$userID);
	$where["username"]=$username;
	$res=M("user")->where($where)->select();
	if($res){
		$flag="1001";
	}else{
		$flag="1002";
	}
	return $flag;
}
/** 功能：验证邮箱除了自己以外是否注册
 *  ＠param $email
 *  return 布尔类型
 */
function checkEmail1($email,$userID){
	$where["ID"]=array("neq",$userID);
	$where["email"]=$email;
	$res=M("user")->where($where)->select();
	if($res){
		$flag="2001";
	}else{
		$flag="2002";
	}
	return $flag;
}
/** 功能：验证邮箱是否注册
 *  ＠param $email
 *  return 布尔类型
 */
function checkEmail($email){
	$where["email"]=$email;
	$res=M("user")->where($where)->select();
	if($res){
		$flag="2001";
	}else{
		$flag="2002";
	}
	return $flag;
}

/** 功能：注册用户
 * @param $username
 * @param $password
 * @param $email
 * @param $telephone
 * @param $sex
 * return 布尔类型
 */
function addUser($username,$password,$email,$telephone,$sex){
	$res=checkUsername($username);
	$res1=checkEmail($email);
	if($res=="1002" && $res1=="2002"){
		$data["username"]=$username;
		$data["password"]=md5($password);
		$data["email"]=$email;
		$data["telephone"]=$telephone;
		$data["sex"]=$sex;
		$data["time"]=date('Y-m-d H:i:s',time());

		$flag=M("user")->add($data);
        $data1["typename"]="未分组好友";
        $data1["userID"]=$flag;
        $data1["flag"]=0;
        M("friendtype")->add($data1);
	}else if($res=="1001" && $res1=="2001"){
		$flag="001";//邮箱和用户名均被占用
	}else if($res=="1002" && $res1=="2001"){
		$flag="002";//邮箱被占用
	}else{
		$flag="003";//用户名被占用
	}
	return $flag;
}

/**　功能　登录验证
 * 　@param $username
 *   @param $password
 *  return 布尔类型
 */
function checkLogin($username,$password){
	$where["username"]=$username;
	$where["password"]=md5($password);
	$res=M("user")->where($where)->select();
	if(count($res)>0){
		$flag="1";
	}else{
		$flag="2";
	}
	return $flag;
}

/** 功能　查询用户的基本信息
 * @param $userID
 * return array();
 */
function selectUserInfo($userID){
	$where["ID"]=$userID;
	$userInfo=M("user")->where($where)->select();
	return $userInfo;
}

/** 功能　查询用户的好友类型及其类型中的好友
 * 　@param $userID
 *  return array()
 */
function selectUserFriendType($userID){
	$res=selectFriendType($userID);
	foreach($res as $key=>$v){
		$where3["typeID"]=$v["id"];
		$res[$key]["arr"]=M("friend")->where($where3)->select();
		$res[$key]["count"]=M("friend")->where($where3)->count();
		foreach($res[$key]["arr"] as $key1=>$v1){
			$where1["ID"]=$v1["friendid"];
			$res[$key]["arr"][$key1]["friendname"]=M("user")->where($where1)->getField("username");
			$res[$key]["arr"][$key1]["sex"]=M("user")->where($where1)->getField("sex");
			$res[$key]["arr"][$key1]["remarkname"]=M("user")->where($where1)->getField("remarkname");
			$res[$key]["arr"][$key1]["img"]=M("user")->where($where1)->getField("img");
		}
	}
	return $res;
}

/* 功能：获取用户的所有在线好友
 * @param $userID
 * */
function getAllOnlineUser($userID){
    $where['userID']=$userID;
    $friendList=M("friend")->where($where)->select();
    $finalFriendList=array();
    foreach ($friendList as $k=>$v){
        $friendName=getUsername($v['friendid']);
        if(S($friendName)){
            $finalFriendList[]=S($friendName);
        }
    }
    return $finalFriendList;
}

/** 功能　查询用户的好友分组
 * 　@param $userID
 *  return array()
 */
function selectFriendType($userID){
	$where["userID"]=$userID;
	$res=M("friendtype")->where($where)->select();	
	return $res;
}
/** 功能　通过用户名获取用户的ID
 * @param $username
 * return int
 */
function getUserID($username){
	$where["username"]=$username;
	$userID=M("user")->where($where)->getField("ID");
	return $userID;
}

/** 功能　通过用户的ID获取用户名
 * @param $userID
 * return string
 */
function getUsername($userID){
    $where["ID"]=$userID;
    $username=M("user")->where($where)->getField("username");
    return $username;
}


/** 功能　查询当前用户是否拥有某个好友
 * @param $userID
 * @param $friendID 好友ID
 * return array()
 */
function selectMyOwnFriend($userID,$friendID){
	$where["userID"]=$userID;
	$where["friendID"]=$friendID;
	$res=M("friend")->where($where)->select();
	return $res;
}

/** 功能 检查好友类型是否存在
 * @param $userID
 * @param $typeName
 * return 布尔类型
 */
function checkFriendType($userID,$typeName){
	$where["userID"]=$userID;
	$where["typename"]=$typeName;
	$res=M("friendtype")->where($where)->select();
	return $res;
}

/** 功能　添加好友分组
 * @param $userID
 * @param $typeName
 * return 布尔类型
 */
function addFriendType($userID,$typeName){
	$res=checkFriendType($userID,$typeName);
	if(count($res)>0){
		$flag="001";//该分组您已经存在
	}else{
		$data["userID"]=$userID;
		$data["typename"]=$typeName;
		$data["flag"]=0;
		$flag=M("friendtype")->add($data);
	}
	return $flag;
}
/** 功能　添加好友
 *  @param $userID
 *  @param $friendID
 *  @param $typeID
 *  return 布尔类型
 */
function addFriend($userID,$friendID,$typeID){
	$res=selectMyOwnFriend($userID,$friendID);
	if(count($res)>0){
		$flag="001";//你已经拥有该好友
	}else{
		$data["userID"]=$userID;
		$data["friendID"]=$friendID;
		$data["typeID"]=$typeID;
		$data["time"]=date('Y-m-d H:i:s',time());
		$flag=M("friend")->add($data);

        $where["typename"]="未分组好友";
        $where["userID"]=$friendID;
        $ID=M("friendtype")->where($where)->getField("ID");
        $data1["userID"]=$friendID;
        $data1["friendID"]=$userID;
        $data1["typeID"]=$ID;
        $data1["time"]=date('Y-m-d H:i:s',time());
        M("friend")->add($data1);
	}
	return $flag;
}
/**发送邮件
 * @param $url:邮件地址(收件人地址)
 * @param $title:邮件标题
 * @param $content:邮件内容
 */
function sendEmail($to, $subject = 'Your register infomation', $body){
    $loc_host = "SAE";
    $smtp_acc = "wrlinker@sina.com";
    $smtp_pass="wangbo123";
    $smtp_host="smtp.sina.com";
    $from="wrlinker@sina.com";
    $headers = "Content-Type: text/plain; charset=\"utf-8\"\r\nContent-Transfer-Encoding: base64";
    $lb="\r\n";             //linebreak

    $hdr = explode($lb,$headers);
    if($body) {$bdy = preg_replace("/^\./","..",explode($lb,$body));}//??????Body

    $smtp = array(
        array("EHLO ".$loc_host.$lb,"220,250","HELO error: "),
        array("AUTH LOGIN".$lb,"334","AUTH error:"),
        array(base64_encode($smtp_acc).$lb,"334","AUTHENTIFICATION error : "),
        array(base64_encode($smtp_pass).$lb,"235","AUTHENTIFICATION error : "));
    $smtp[] = array("MAIL FROM: <".$from.">".$lb,"250","MAIL FROM error: ");
    $smtp[] = array("RCPT TO: <".$to.">".$lb,"250","RCPT TO error: ");
    $smtp[] = array("DATA".$lb,"354","DATA error: ");
    $smtp[] = array("From: ".$from.$lb,"","");
    $smtp[] = array("To: ".$to.$lb,"","");
    $smtp[] = array("Subject: ".$subject.$lb,"","");
    foreach($hdr as $h) {$smtp[] = array($h.$lb,"","");}
    $smtp[] = array($lb,"","");
    if($bdy) {foreach($bdy as $b) {$smtp[] = array(base64_encode($b.$lb).$lb,"","");}}
    $smtp[] = array(".".$lb,"250","DATA(end)error: ");
    $smtp[] = array("QUIT".$lb,"221","QUIT error: ");
    $fp = @fsockopen($smtp_host, 25);
    if (!$fp) echo "Error: Cannot conect to ".$smtp_host."
";
    while($result = @fgets($fp, 1024)){if(substr($result,3,1) == " ") { break; }}

    $result_str="";
    foreach($smtp as $req){
        @fputs($fp, $req[0]);
        if($req[1]){
            while($result = @fgets($fp, 1024)){
                if(substr($result,3,1) == " ") { break; }
            };
            if (!strstr($req[1],substr($result,0,3))){
                $result_str.=$req[2].$result."
";
            }
        }
    }
    @fclose($fp);
    return $result_str;


}
/** 功能：上传图片
	 *  @param:$_FILES
	 */
	function addphoto($data){    
		$upload = new \Think\Upload();// 实例化上传类    
		$upload->maxSize   =     3145728 ;// 设置附件上传大小    
		$upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型    
		$upload->savePath  =      './Uploads/'; // 设置附件上传目录    // 上传文件     
		$info   =   $upload->upload(); 
		if(!$info) {// 上传错误提示错误信息       
			$this->error($upload->getError());
		}else{// 上传成功        
			//$this->success('上传成功！');   
			foreach ($info as $k=>$v){
				$savepath= substr($v['savepath'],1);
				$where["ID"]=$_SESSION["userID"];
				$data1['photoname']=$savePath.$v['savename'];
				$data1['img']="http://192.168.1.104/yingxiang/thinkphp/Uploads".$savepath.$v['savename'];
				M('user')->where($where)->save($data1);
			}
			return $msg="ok";
		}
	}
?>