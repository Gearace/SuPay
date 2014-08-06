angular.module('starter.basketcontrollers', [])

/*
 *****************************
 ***********菜品列表************
 *****************************
 */
.controller('CartListCtrl', function ($scope, $ionicSideMenuDelegate, $state, $stateParams, $ionicModal, $ionicPopup, CartService) {

    //取所有顾客数据
    $scope.allcsts = JSON.parse(sessionStorage.getItem('customers'));
    if (_.isNull($scope.allcsts)) {
        $scope.allcsts = {};
    }

    //页面数据对象定义--产品清单和顾客
    if (_.isEqual($stateParams.initFlag, "init")) {
        var currcst = JSON.parse(sessionStorage.getItem("currcst"));
        if (_.isNull(currcst)) {
            $scope.products = CartService.init();
            $scope.currcst = {};
            $scope.welmsg = false;
        } else {
            $scope.products = CartService.all();
            $scope.currcst = currcst;
            $scope.welmsg = true;
        }
    } else {
        $scope.products = CartService.cstbill($stateParams.initFlag);
        $scope.currcst = $scope.allcsts[$stateParams.initFlag.toString()];
        sessionStorage.setItem("currcst", JSON.stringify($scope.currcst));
        $scope.welmsg = true;
    }

    //左侧栏客户按钮
    $scope.showBuyers = function () {
        if($ionicSideMenuDelegate.isOpenLeft()){
            $ionicSideMenuDelegate.toggleLeft(false);
        }else{
            $ionicSideMenuDelegate.toggleLeft(true);
        }
    }

    //右侧清空已选商品按钮
    $scope.clearAll = function () {
        $scope.products = CartService.init();
    }

    //右侧购买跳转按钮
    $scope.goPay = function () {
        //顾客信息
        var payAcc = JSON.parse(sessionStorage.getItem("currcst"));
        if (_.isNull(payAcc)) {
            $ionicPopup.alert({
                title: '提示：',
                content: '请先检索获取顾客信息！'
            }).then(function (res) {
                return;
            });
        } else {
            var payitems = [];
            var amount = 0;
            for (var i = 0; i < $scope.products.length; i++) {
                var prd = $scope.products[i];
                if (prd.chk) {
                    payitems.push(prd);
                    amount += Number(prd.amount);
                }
            }
            payAcc.totalamount = amount;
            sessionStorage.setItem("currcst", JSON.stringify(payAcc));
            sessionStorage.setItem(payAcc.PHONE, JSON.stringify(payitems));
            $state.go('payment');
        }
    }

    //新增临时顾客的modal页定义
    $ionicModal.fromTemplateUrl('modal.html', function (modal) {
        $scope.modal = modal;
    }, {
        focusFirstInput: true
    });

    //删除临时顾客
    $scope.onDeleteCustomer = function (customer) {
        var currcst = JSON.parse(sessionStorage.getItem("currcst"));
        if (!_.isNull(currcst) && currcst.PHONE == customer.PHONE) {
            $ionicPopup.confirm({
                title: '重要提示',
                content: '<div class="text-center">确定要删除当前顾客吗？<br>（非当前顾客无此提示）</div>'
            }).then(function (res) {
                if (res) {
                    $scope.welmsg = false;
                    sessionStorage.removeItem("currcst");
                    sessionStorage.removeItem(customer.PHONE);
                    delete $scope.allcsts[customer.PHONE.toString()];
                    sessionStorage.setItem("customers", JSON.stringify($scope.allcsts));
                    $state.go('tab.cart', {
                        initFlag: 'init'
                    });
                } 
            });
        } else {
            sessionStorage.removeItem(customer.PHONE);
            delete $scope.allcsts[customer.PHONE.toString()];
            sessionStorage.setItem("customers", JSON.stringify($scope.allcsts));
        }
    };

    //响应页面item checkbox change事件，用来取消勾选时同步清空数量和金额
    $scope.checkChange = function (product) {
        if (!product.chk) {
            delete product.num ;
            delete product.amount ;
        }
    }

    //响应页面item input change事件，用来同步数量和金额关系
    $scope.numChange = function (product) {
        
        if (!_.isUndefined(product.num) && product.num!='' && product.num.indexOf("e")==-1) {
            product.chk = true;
            product.amount = (product.PRICE * product.num).toFixed(2);
        }else{
            product.chk = false;
            delete product.amount;
        }
        
        if(product.num == '' || product.amount == '' || Number(product.num) == 0 || Number(product.amount) == 0){
            product.chk = false;
        }
    }
    
    $scope.amountChange = function (product) {
        
        if (!_.isUndefined(product.amount) && product.amount!='' && product.amount.indexOf("e")==-1) {
            product.chk = true;
            product.num = (product.amount / product.PRICE).toFixed(3);
        }else{
            product.chk = false;
            delete product.num;
        }
        
        if(product.num == '' || product.amount == '' || Number(product.num) == 0 || Number(product.amount) == 0){
            product.chk = false;
        }
    }

    //定义检索输入域
    $scope.search = {}
    //清空检索内容
    $scope.clearSearch = function () {
        $scope.search = {};
    }


});