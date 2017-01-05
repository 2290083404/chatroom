<?php
namespace Home\Controller;
use Think\Controller;
use Workerman\Worker;
class WorkermanController extends Controller{
    public function index(){
        if(!IS_CLI){
            die("access illegal");
        }
        require_once APP_PATH.'Workerman/Autoloader.php';
        define('MAX_REQUEST', 1000);// 每个进程最多执行1000个请求
        //Worker::$daemonize = true;//以守护进程运行
        Worker::$pidFile = './data/wwwlogs/Worker/workerman.pid';//方便监控WorkerMan进程状态
        Worker::$stdoutFile = './data/wwwlogs/Worker/stdout.log';//输出日志, 如echo，var_dump等
        Worker::$logFile = './data/wwwlogs/Worker/workerman.log';//workerman自身相关的日志，包括启动、停止等,不包含任何业务日志

        global $worker;
        $worker = new Worker('websocket://192.168.1.104:2346');//此处我使用内网ip
        $worker->name = 'Worker';
        $worker->count = 1;
        //$worker->transport = 'udp';// 使用udp协议，默认TCP
        $worker->onWorkerStart = function($worker){
            global $worker;
            echo "Worker starting...\n";

        };

        $worker->onConnect=function($connection){
            global $worker;
            //找到所有在先的好友
        };

        $worker->onMessage = function($connection, $data){

            global $worker;
            static $request_count = 0;// 已经处理请求数
            $msg_data=json_decode($data);

            if($msg_data->type=="login"){
                $temp['userID']=$msg_data->userID;
                $temp['connectionID']=$connection->id;
                S($msg_data->username,$temp);
                $friendList=getAllOnlineUser($msg_data->userID);
                $userID=array();

                //给在线好友发送我已经登录的消息
                foreach ($friendList as $k=>$v){
                    foreach ($worker->connections as $conn){
                        if($v['connectionID']==$conn->id){
                            $userID[]=$v['userID'];
                            $returnData['userID']=$v['userID'];
                            $returnData['type']="login";
                            $returnData['username']=$msg_data->username;
                            $returnData['time']=date("Y-m-d H:i:s",time());
                            $returnStr=json_encode($returnData);
                            $conn->send($returnStr);
                        }
                    }
                }
                //发送给自己，标记出所有在线好友
                $returnOwnself['type']="loginCheckOnLine";
                $returnOwnself['userList']=$userID;
                $connection->send(json_encode($returnOwnself));
            }else if($msg_data->type=="sayone"){
                $friendConnect=S($msg_data->friendName);
                $connectionID=$friendConnect['connectionID'];
                foreach ($worker->connections as $conn){
                    if($connectionID==$conn->id){
                        $returnData['type']="sayone";
                        $returnData['username']=$msg_data->myName;
                        $returnData['msg']=$msg_data->msg;
                        $returnData['time']=date("Y-m-d H:i:s",time());
                        $returnStr=json_encode($returnData);
                        $conn->send($returnStr);//给好友发送消息
                    }
                }
                $returnData1['type']="saytome";//推送给自己
                $returnData1['username']=$msg_data->myName;
                $returnData1['msg']=$msg_data->msg;
                $time=date("Y-m-d H:i:s",time());
                $returnData1['time']=$time;
                $returnStr1=json_encode($returnData1);
                $connection->send($returnStr1);//给自己发送消息


                $myInfo=S($msg_data->myName);
                $mysqlData['toUserID']=$myInfo['userID'];
                $mysqlData['fromUserID']=$friendConnect['userID'];
                $mysqlData['message']=$msg_data->msg;
                $mysqlData['time']=$time;
                M("message")->add($mysqlData);
            }else if($msg_data->type=="logout"){
                //删除缓存的用户信息
                echo $msg_data->username;
                S($msg_data->username,null);
                //找到所有在线好友
                $friendList=getAllOnlineUser($msg_data->userID);
                //给在线好友发送我已经登出的消息
                foreach ($friendList as $k=>$v){
                    foreach ($worker->connections as $conn){
                        if($v['connectionID']==$conn->id){
                            $returnData['type']="logout";
                            $returnData['username']=$msg_data->username;
                            $returnStr=json_encode($returnData);
                            $conn->send($returnStr);
                            break;
                        }
                    }
                }
            }
            /*
             * 退出当前进程，主进程会立刻重新启动一个全新进程补充上来，从而完成进程重启
             */
            if(++$request_count >= MAX_REQUEST){// 如果请求数达到1000
                Worker::stopAll();
            }
        };
        $worker->onBufferFull = function($connection){
            echo "bufferFull and do not send again\n";
        };
        $worker->onBufferDrain = function($connection){
            echo "buffer drain and continue send\n";
        };
        $worker->onWorkerStop = function($worker){
            global $worker;
            echo "Worker stopping...\n";
        };
        $worker->onError = function($connection, $code, $msg){
            echo "error $code $msg\n";
        };
        // 运行worker
        Worker::runAll();
    }

    /*function saveMessage(){
        $data['toUserID']=getUserID(I('fromUser'));
        $data['fromUserID']=I('myID');
        $data['message']=I('msg');
        $data['time']=I('time');
        $justID=M("message")->add($data);
        $jsonData=array("code"=>'200',"justID"=>$justID);
        echo $justID;
    }*/

    function selectMessage(){
        $myID=$_SESSION['userID'];
        $friendID=I('friendID');
        $where['toUserID']=array("in",array($myID,$friendID));
        $where['fromUserID']=array("in",array($myID,$friendID));
        $messageList=M("message")->where($where)->order("time desc")->page(1,20)->select();
        $messageList=array_reverse($messageList);
        foreach ($messageList as $k=>$v){
            $messageList[$k]['tousername']=getUsername($v['touserid']);
            $messageList[$k]['fromusername']=getUsername($v['fromuserid']);
        }

        $this->ajaxReturn($messageList);
    }
}