angular.module('starter.paymentcontrollers', [])

/*
 *****************************
 ***********支付页面************
 *****************************
 */
.controller('PaymentCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, AjaxService) {
    var payAccount = JSON.parse(sessionStorage.getItem("currcst"));
    var user = JSON.parse(sessionStorage.getItem("user"));
    $scope.cellphone = payAccount.PHONE;
    $scope.totalamount = payAccount.totalamount;
    $scope.payitems = JSON.parse(sessionStorage.getItem(payAccount.PHONE));
    $scope.returnCart = function (e) {
        $state.go('tab.cart', {
            initFlag: payAccount.PHONE
        });
    }

    $scope.Payit = function () {
        $ionicLoading.show({
            content: '<i class="icon ion-loading-a"></i><span class="title">正在处理支付<span>',
        });

        var billitems = [];
        for (var i = 0; i < $scope.payitems.length; i++) {
            var item = {
                _vgt_refs: String($scope.payitems[i]._id),
                perprice: String($scope.payitems[i].PRICE),
                quantity: String($scope.payitems[i].num),
                totprice: String($scope.payitems[i].amount),
            };
            billitems.push(item);
            item = {};
        }
        var paylist = {
            _cas_refs: String(user._id),
            _cst_refs: String(payAccount._id),
            _org_refs: String(user._org_refs._id),
            amount: payAccount.totalamount,
            MXLIST: billitems
        };

        var path = 'buyer/pay/' + payAccount.PHONE;
        var args = '&payitems=' + JSON.stringify(paylist);
        AjaxService.doRequest(path, args)
            .success(function (data, status, headers, config) {
//                console.log(data.data)
//                console.log(data.err)
                if (data.err == "") {
                    var sesscsts = JSON.parse(sessionStorage.getItem('customers'));
                    console.log(sesscsts[payAccount.PHONE]);
                    console.log(data.data.BALANCE);
                    sesscsts[payAccount.PHONE].BALANCE = data.data.BALANCE;
                    sessionStorage.setItem('customers', JSON.stringify(sesscsts));
                    sessionStorage.removeItem(payAccount.PHONE);
                    $ionicPopup.alert({
                        title: '支付成功！',
                        content: '<div class="text-center">' + payAccount.NAME + '共支付' + payAccount.totalamount + '元<br>余额：' + data.data.BALANCE + '元</div>'
                    }).then(function (res) {
                        $state.go('tab.cart', {
                            initFlag: payAccount.PHONE
                        })
                        $ionicLoading.hide();
                    });
                } else {
                    $ionicPopup.alert({
                        title: '数据内容异常！',
                        content: data.err
                    }).then(function (res) {
                        $ionicLoading.hide();
                    });
                }
            }).error(function (data, status, headers, config) {
                $ionicLoading.hide();
            });
    };
})