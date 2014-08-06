angular.module('starter.services', [])

.factory('CartService', function () {
    var products = [];
    return {
        init: function () {
            products = JSON.parse(localStorage.getItem("vegetables"));
            return products;
        },
        all : function(){
            return products;
        },
        cstbill: function (cellphone) {
            products = JSON.parse(localStorage.getItem("vegetables"));
            var chooseitems = sessionStorage.getItem(cellphone);
            if (!_.isNull(chooseitems)) {
                var bills = JSON.parse(chooseitems);
                for (var pi = 0; pi < products.length; pi++) {
                    for (var bi = 0; bi < bills.length; bi++) {
                        if (_.isEqual(products[pi].CODE, bills[bi].CODE)) {
                            products[pi].num = bills[bi].num;
                            products[pi].amount = bills[bi].amount;
                            products[pi].chk = bills[bi].chk;
                        }
                    }
                }
            }
            return products;
        }
    }
})

.factory('AjaxService', ['$http', '$ionicPopup',
    function ($http, $ionicPopup) {
        return {
            doRequest: function (path, args) {
                return $http({
                    method: 'JSONP',
//                    url: 'http://42.96.189.184:4000/' + path + '?callback=JSON_CALLBACK' + args
                    url: 'http://192.168.10.131:4000/' + path + '?callback=JSON_CALLBACK' + args
//                    url: 'http://127.0.0.1:8000/app/' + path + '?callback=JSON_CALLBACK' + args
                }).error(function (data, status, headers, config) {
                    var errmsg='';
                    console.log(status);
                    switch (status) {
                        case 403:
                            errmsg='没有请求权限';
                            break;
                        case 404:
                            errmsg='没有发现请求资源';
                            break;    
                        case 500:
                            errmsg='服务器产生内部错误';
                            break;
                        default:
                            errmsg='网络连接失败';
                            break;
                    }
                    $ionicPopup.alert({
                        title: '服务器异常！',
                        content: errmsg
                    });
                });
            }
        };
}])


;