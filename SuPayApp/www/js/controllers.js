angular.module('starter.controllers', [])

/*
 *****************************
 *******新增临时用户modal页面****
 *****************************
 */
.controller('ModalCtrl', function ($scope, $state, $ionicPopup, AjaxService) {
    $scope.newone = {};
    $scope.createCustomer = function () {
        var phoneno = $scope.newone.cellphone;
        var sesscsts = JSON.parse(sessionStorage.getItem("customers"));
        // 页面定义input为number型不输入是undefine，输入非数字会自动转为null，isUndefine与isNaN为false，只能用isNull为true判断
        if (!_.isNull(phoneno) && !_.isUndefined(phoneno)) {
            if (_.isNull(sesscsts)) {
                sesscsts = {};
            }
            if (!_.isNull(sesscsts) && !_.isUndefined(sesscsts[phoneno.toString()])) {
                //如果rootscope中已经存在该客户，就直接选取
                sessionStorage.setItem("currcst", JSON.stringify(sesscsts[phoneno.toString()]));
                $scope.modal.hide();
                $state.go('tab.cart', {
                    initFlag: phoneno
                });
            } else {
                var path = 'buyer/info/' + phoneno;
                var args = '';
                AjaxService.doRequest(path, args)
                    .success(function (data, status, headers, config) {
                        //                        console.log(data.data);
                        if (data.err == "") {
                            var currcst = data.data;
                            sesscsts[phoneno.toString()] = currcst;
                            sessionStorage.setItem("currcst", JSON.stringify(currcst));
                            sessionStorage.setItem("customers", JSON.stringify(sesscsts));
                            $scope.modal.hide();
                            $state.go('tab.cart', {
                                initFlag: phoneno
                            });
                        } else {
                            $ionicPopup.alert({
                                title: '数据内容异常！',
                                content: data.err
                            }).then(function (res) {
                                $scope.modal.hide();
                            });
                        }
                    })
            }
        } else {
            $scope.modal.hide();
        }
        $scope.newone = {};
    };
})

/*
 *****************************
 *************账单*************
 *****************************
 */
.controller("BillsCtrl", function ($scope, $ionicPopup, AjaxService) {
    var concatArr = []
    $scope.user = JSON.parse(sessionStorage.getItem("user"));
    $scope.tapcount = 0;
    var path = 'transaction/querybussinfo';
    var args = '&AKB020=' + $scope.user.ORG_CODE + '&AAE011=' + $scope.user.USER_ID;
    getBillsDetails(path, args, 1, 10);

    $scope.loadmore = function () {
        $scope.tapcount++;
        var currpage = $scope.tapcount * 10 + 1;
        var nextpage = ($scope.tapcount + 1) * 10;
        getBillsDetails(path, args, currpage, nextpage);
    };

    function getBillsDetails(path, args, currpage, nextpage) {
        $scope.detail = [];
        AjaxService.doRequest(path, args + '&MINCNT=' + currpage + '&MAXCNT=' + nextpage)
            .success(function (data, status, headers, config) {
                if (data.err == "") {
                    concatArr = concatArr.concat(data.data);
                    $scope.detail = _.chain(concatArr).groupBy('AKE010').pairs().value();
                } else {
                    $ionicPopup.alert({
                        title: '数据内容异常！',
                        content: data.err
                    });
                }
            });
    }

    $scope.search = {}
    $scope.clearSearch = function () {
        $scope.search = {};
    }
})

/*
 *****************************
 *************退费*************
 *****************************
 */
.controller('RetfeeCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, AjaxService) {
    $scope.user = JSON.parse(sessionStorage.getItem("user"));
    $scope.currcst = JSON.parse(sessionStorage.getItem("currcst"));
    if (_.isNull($scope.currcst)) {
        $ionicPopup.alert({
            title: '提示：',
            content: '请先检索获取顾客信息!'
        }).then(function (res) {
            $state.go('tab.cart', {
                initFlag: "init"
            });
        });
    } else {
        $scope.refees = [];
//        console.log($scope.user._org_refs._id)
//        console.log($scope.currcst._id)
        var path = 'buyer/refee/' + $scope.user._org_refs._id;
        var args = '&cst_id=' + $scope.currcst._id;
        AjaxService.doRequest(path, args)
            .success(function (data, status, headers, config) {
                console.log(data.data);
                if (data.err == "") {
                    $scope.refees = data.data;
                } else {
                    $ionicPopup.alert({
                        title: '数据内容异常！',
                        content: data.err
                    });
                }
            });
    }

    $scope.ConfirmRefee = function (orderid) {
        if (_.isUndefined(orderid)) {
            $ionicPopup.alert({
                title: '提示：',
                content: '请选择退费交易！'
            }).then(function (res) {
                return;
            });
        } else {
            $scope.loading = $ionicLoading.show({
                content: '<i class="icon ion-loading-a"></i><span class="title">正在完成退费<span>',
            });

            var path = 'transaction/returnbusspay';
            var args = '&AKB020=' + $scope.user.ORG_CODE + '&AAE011=' + $scope.user.USER_ID + '&AKC190=' + orderid;
            AjaxService.doRequest(path, args)
                .success(function (data, status, headers, config) {
                    if (data.err == "") {
                        for (var i = 0; i < $scope.refees.length; i++) {
                            if ($scope.refees[i].AKC190 == orderid) {
                                $scope.refees.splice($scope.refees.indexOf($scope.refees[i]), 1);
                                break;
                            }
                        }
                        $scope.currcst.amount = data.data;
                        delete $scope.currcst.feeid;
                        sessionStorage.setItem("currcst", JSON.stringify($scope.currcst));
                        var sesscsts = JSON.parse(sessionStorage.getItem("customers"));
                        sesscsts[$scope.currcst.cellphone.toString()].amount = $scope.currcst.amount;
                        sessionStorage.setItem("customers", JSON.stringify(sesscsts));
                        $ionicPopup.alert({
                            title: '<b>退费成功！</b>',
                            content: '<div class="text-center">流水' + orderid + '已退回<br>' + $scope.currcst.name + '目前余额：' + $scope.currcst.amount + '元</div>'
                        }).then(function (res) {
                            $scope.loading.hide();
                        });
                    } else {
                        $ionicPopup.alert({
                            title: '数据内容异常！',
                            content: data.err
                        }).then(function (res) {
                            $scope.loading.hide();
                        });
                    }
                });
        }
    }
})


;