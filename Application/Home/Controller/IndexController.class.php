<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        session_start();
        if($_SESSION['userID']){
            //获取用户信息
            $userInfo=selectUserInfo($_SESSION['userID']);

            //dump($userInfo);
            $this->assign("userInfo",$userInfo);
            //获取好友及分组列表
            $friendType=selectUserFriendType($_SESSION['userID']);

            $this->assign("friendType",$friendType);
            //获取分组信息
            $haoyouType=selectFriendType($_SESSION['userID']);
            $this->assign("haoyou",$haoyouType);
            //dump($haoyouType);
            $this->display("Index/index");
        }else{
            $username=getUsername($_SESSION['userID']);
            S($username,null);
            $this->display("Index/login");
        }

    }
    function login(){
        $this->display("Index/login");
    }
    function zhuce(){
        $this->display("Index/zhuce");
    }
    function saveUserimge(){
        addphoto($_FILES['touxiang']);
        $this->success('上传成功！');
        //dump($_FILES['touxiang']);
    }


    //注册
    function checkRegister(){
        $username=I("nicheng");
        $password=I("mima");
        $email=I("youxiang");
        $telephone=I("dianhua");
        $sex=I("sex");
        $res=addUser($username,$password,$email,$telephone,$sex);
        if($res=="001"){
            $this->error("邮箱和用户名均被占用,请更换对应信息");
        }else if($res=="002"){
            $this->error("邮箱被占用,请更换对应信息");
        }else if($res=="003"){
            $this->error("用户名被占用,请更换对应信息");
        }else{
            $this->success("注册成功,请用用户名和密码登录","login");
        }
    }
    //登录
    function checkLogin(){
        $username=I("zhanghao");
        $password=I("mima");
        $userID=getUserID($username);
        //$where["username"]=$username;
        //$userID=M("user")->where($where)->getField("ID");
        $res=checkLogin($username,$password);
        if($res=="1"){
            $this->success("登录成功","index");
            $_SESSION['userID']=$userID;
        }else{
            $this->error("用户名或密码错误,请重新登录");
        }
    }
    //修改个人信息
    function updateInfo(){
        $sex=I("sex");
        $username=I("username");
        $email=I("email");
        $telephone=I("telephone");
        $flag=checkUsername1($username,$_SESSION["userID"]);
        $flage=checkEmail1($email,$_SESSION["userID"]);
        if($flag=="1001" && $flage=="2001"){
            $res="11";//用户名和邮箱已被占用
        }else if($flag=="1002" && $flage=="2001"){
            $res="12";//邮箱被占用
        }else if($flag=="1001" && $flage=="2002"){
            $res="13";//用户名被占用
        }else{
            $where["ID"]=$_SESSION["userID"];
            $data["username"]=$username;
            $data["sex"]=$sex;
            $data["email"]=$email;
            $data["telephone"]=$telephone;
            $res=M("user")->where($where)->save($data);
        }
        $this->ajaxReturn($res);
    }
    //添加分组
    function addGroups(){
        $gropID=I("gropID");
        $typename=I("typename");
        if($gropID){
            $where["ID"]=$gropID;
            $data["typename"]=$typename;
            M("friendtype")->where($where)->save($data);
            $res="008";
        }else{
            $res=addFriendType($_SESSION["userID"],$typename);
        }
        $this->ajaxReturn($res);
    }
    //删除分组
    function deleGroup(){
        $where["ID"]=I("gropID");
        $res=M("friendtype")->where($where)->delete();
        $this->ajaxReturn($res);
    }
    //添加好友
    function addFriend(){
        $friendID=getUserID(I("friendNickname"));
        if($friendID){
            $res=addFriend($_SESSION["userID"],$friendID,0);
        }else{
            $res="002";
        }
        $this->ajaxReturn($res);
    }
    //删除好友
    function deleFriend(){
        $where["friendID"]=I("friendID");
        $where["userID"]=$_SESSION["userID"];
        $res=M("friend")->where($where)->delete();
        $this->ajaxReturn($res);
    }
    //修改好友
    function updateBeizhu(){
        $where["ID"]=I("ID");
        $data["remarkname"]=I("beizhuName");
        $res=M("user")->where($where)->save($data);
        $this->ajaxReturn($res);
    }
    function updateType(){
        $yd=I("yd");
        if($yd=="add"){
            $where["ID"]=I("friend");
            $data["typeID"]=I("typeID");
            $res=M("friend")->where($where)->save($data);
        }else{
            $where["userID"]=$_SESSION["userID"];
            $where["friendID"]=I("friend");
            $data["typeID"]=I("typeID");
            $res=M("friend")->where($where)->save($data);
        }

        $this->ajaxReturn($res);
    }
    //忘记密码
    function forgetPassword(){
        //echo sendEmail("924159049@qq.com","12","asfasfasfasfasfas");
        $this->display("Index/forgetPassword");
    }
    //发送邮件
    function sendEmail(){
        $mem = memcache_init();
        $url=I('url');
        $title="沃仁网络科技有限公司";
        $code=md5(time());
        $mem->set($url, $code, 0, 60);//有效期为10分钟
        $mem->close();
        $content="<p>尊敬的用户你好，请复制下面的验证码填写到页面中的验证码输入框中".$code;

        $msg=sendEmail($url,$title,$content);
    }
    //验证邮箱验证码
    function dealforget(){
        dump($_POST);
        $email=I('youxiang');
        $where["email"]=$email;
        $res=M("user")->where($where)->select();
        if(count($res)>0){
            $data["password"]=md5(I("xinmima"));
            M("user")->where($where)->save($data);
            $this->success("修改成功","login");
        }else{
            $this->error("邮箱错误");
        }

        //$mem = memcache_init();
        //$url=I('youxiang');
        ///	$val = $mem->get($url);
        //if($val==I('yanzhengma')){
        //查询该邮箱是否绑定了用户
        //	$where['email']=I('youxiang');
        //	$user=M('user')->where($where)->select();
        ///	if(count($user)>0){//修改密码
        ////	$data['password']=md5(I('xinmima'));
        //	M('user')->where($where)->save($data);
        //$msg="success";
        //$this->success("密码修改成功，请妥善保管并重新登录",'login');
        //}else{//没有绑定用户
        //$msg="nouser";
        //	$this->error("用户未绑定邮箱，找不回来");
        //}
        //}else{//验证码错误
        //$msg="errorverifly";
        //$this->error("密码修改失败,验证码错误,请核对再输入");
        //}
        //$mem->close();
    }
}