// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'starter.logincontrollers', 'starter.basketcontrollers', 'starter.paymentcontrollers', 'starter.filters'])

//全局变量
.run(function ($rootScope, $ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('signin',{
        url: "/sign-in",
        templateUrl: "templates/sign-in.html",
        controller: 'SignInCtrl'
    })
    
    .state('forgotpassword',{
        url:"/forgot-password",
        templateUrl:"templates/forgot-password.html"
    })
    
    
    .state('payment',{
        url: "/payment",
        templateUrl: "templates/payment.html",
        controller: 'PaymentCtrl'
        
    })

    // 页面底部的tab分页，非真实页面切换
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })
    
    // 购物车，真实页面切换，有ctrl来调用service
    .state('tab.cart', { 
        url: "/cart/{initFlag:init|[0-9]{1,11}}",
        views: {
            'cart-tab': {
                templateUrl: "templates/cart.html",
                controller: 'CartListCtrl'
            }
        }
    })

    // 账单页面
    .state('tab.bills',{
        url: "/bills",
        views: {
            'bills-tab': {
                templateUrl: "templates/bills.html",
                controller: 'BillsCtrl'
            }
        }
    })
    
    // 退费页面
    .state('tab.retfee',{
        url: "/retfee",
        views: {
            'retfee-tab': {
                templateUrl: "templates/retfee.html",
                controller: 'RetfeeCtrl'
            }
        }
    })

    // 关于页面，纯html页面无数据无跳转
    .state('tab.about', {
        url: "/about",
        views: {
            'about-tab': {
                templateUrl: "templates/about.html",
                controller: 'SignInCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/sign-in");

});