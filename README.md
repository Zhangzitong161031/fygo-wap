# fygou-wap 
福易购 wap 端

### 技术栈
vue-cli3 + vue2 + vuex + vue-router + fetch + cubi-ui + better-scroll + SCSS + rem + svg + mixin

### v1.0 版本
微信公众号入口, OAuth2 认证

```
# fygo-wap qa环境 & product环境配置区别:
1. router.js -> base: 'wap'
2. vue.config -> publicPath: '/wap/'
3. qa -> .htaccess

# 开发者
AppID: wx0fe4350fd1a7f5bf
AppSecret: 50986c800139e5879e8ef599e91a4da0

# 测试号
AppID: wx723d3188316dff62
AppSecret: d6550fef4787b8597d7a0d37433ef286

```

### qa 环境
40.73.116.209
sovell 服务器私钥

web服务器: Apache

```
# ppk -> pem
$ sudo puttygen privateKey.ppk -O private-openssh -o privatekey.pem

# pem -> ppk
$ sudo puttygen privatekey.pem -o privateKey.ppk -O private
```

### production 环境

```
服务器架构：多台服务器 + 负载均衡 + 云数据库

web服务器: Nginx

ECS: 业务服务器 -> i-bp1ijcs0cia5e3s7co36  fygo    192.168.0.103(私有)  ssh: root admin%123456

EIP: 跳板机 -> i-bp144yr9lrm7iwc972cg fygoadmin  121.40.143.67(弹性) 192.168.0.104(私有)

SLB:     LB-bp1g6y6oi7wqa9m9jef32 fygo 112.124.194.225 （公网IPv4 ） 默认服务器组[192.168.0.103]

RDS: 数据库 -> rm-bp1qhjqbv4kec9622  fuyigou-Database

```

### 其他信息

```
# qa 环境测试站点

# 服务商管理后台:
http://fygo.chinaeast2.cloudapp.chinacloudapi.cn/admin/index.php
admin admin888

# 商家管理后台:
http://fygo.chinaeast2.cloudapp.chinacloudapi.cn/seller/index.php
三只松鼠 123456

# 福易购商城
http://fygo.chinaeast2.cloudapp.chinacloudapi.cn/user.php
徐春秀  123456


# 大商创 docker 运行
lamp = mac + docker + php5.6 + mysql5.7.25 + apache

docker images 		查看已经下载的镜像
docker ps -a 		查看全部容器
docker ps 			查看正在运行的容器

docker start fuyigou 				运行容器
docker exec -it fuyigou /bin/bash 	进入容器环境
systemctl start httpd 				启动容器中的 http 服务
systemctl start mysqld.service 		启动容器中的 mysqld 服务
```