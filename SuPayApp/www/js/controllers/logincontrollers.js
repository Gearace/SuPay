angular.module('starter.logincontrollers', [])

/*
 *****************************
 ************登录**************
 *****************************
 */
.controller('SignInCtrl', function ($scope, $state, $ionicPopup, AjaxService) {

    $scope.Logout = function () {
        sessionStorage.clear();
        $state.go('signin');
    }
    
    $scope.Login = function (loginUser) {
        if (_.isUndefined(loginUser) || _.isEmpty(loginUser.name) || _.isUndefined(loginUser.pwd)) {
            $ionicPopup.alert({
                title: '提示！',
                content: '用户名或密码不能为空！'
            });
        } else {
            // encodeURIComponent将‘+’转义%2B，解决karaken对‘+’的空格化处理。
            var encryptPWD = encodeURIComponent(hex_md5(loginUser.name + loginUser.pwd));
            //mongodb
            var path = 'seller/login/'+loginUser.name;
            var args = '&pwd=' + encryptPWD;
            AjaxService.doRequest(path, args)
                .success(function (data, status, headers, config) {
//                    console.log(data.data);
                    //约定data.err为String型，无异常时为空字符串，以此作为判断，减少消耗
                    if (data.err == "") {
                        var user = angular.copy(data.data);
                        sessionStorage.setItem("user", JSON.stringify(user));
                        
                        //使用localstorage存储菜品目录
                        var lastvegetables = JSON.parse(localStorage.getItem('vegetables'));
                        var vgtversion = 0;
                        if(!_.isNull(lastvegetables)){
                            vgtversion = lastvegetables[0].VERSION;
                        }
                        path = 'menu/all/'+user._org_refs.CODE;
                        args = '&ver=' + vgtversion;
//                        console.log(path,args);
                        AjaxService.doRequest(path, args)
                            .success(function (data2, status, headers, config) {
//                                console.log(data2.data);
                                if (data2.err == "") {
                                    var vegetables = angular.copy(data2.data);
                                    // 根据服务器返回的数据长度来确定是否更新数据
                                    if (vegetables.length > 0) {
                                        // 删除session的菜品目录
                                        localStorage.removeItem('vegetables');
                                        // 为每个菜品加入拼音
                                        var pyhelp = new pinyin();
                                        for (var i = 0; i < vegetables.length; i++) {
                                            var name = vegetables[i].NAME;
                                            var shortPY = pyhelp.getCamelChars(name).toLowerCase();
                                            var fullPY = pyhelp.getFullChars(name).toLowerCase();
                                            vegetables[i].py = shortPY + "|" + fullPY;
                                        }
                                        // 减少与服务器交互和代码处理复杂度，直接将原数据表删除，再新建插入。
                                        localStorage.setItem('vegetables', JSON.stringify(vegetables));
                                    }
                                    // 成功跳转菜品目录页面
                                    $state.go('tab.cart', {
                                        initFlag: "init"
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: '数据内容异常！',
                                        content: data.err
                                    });
                                }
                            });
                    } else {
                        $ionicPopup.alert({
                            title: '数据内容异常！',
                            content: data.err
                        });
                    }
                });
        }
    }
    
    
});