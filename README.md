复刻菜店
=====================

Ionic和express4实际项目例子（未完成）

## 环境准备

安装nodejs, express4, Ionic框架，cordova框架，androidSDK等。

```bash
$ sudo npm install -g ionic cordova gulp express
```

## 编译

clone代码后
在SuApp路径执行以下命令进行编译（需配置好环境）

```bash
$ sudo cordova platform add android
$ sudo cordova build android
```

在SuServer路径下执行以下命令运行

```bash
$ sudo npm start
```

