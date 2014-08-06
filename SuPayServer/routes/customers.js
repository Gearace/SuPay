/**
 * Created by Lenovo on 2014/4/29.
 */
"use strict";
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var then = require('thenjs');
var moment = require('moment');
var dao = require('../models/modelDao').customersDao;
var mongoose = require('mongoose');

router.get('/info/:cellphone', function (req, res, next) {
    var cellphone = req.params.cellphone;
    var cb = req.query.callback;
    dao.findOne({'PHONE': cellphone}, function (err, row) {
//        console.log(row);
        if (err) return next(err);
        var data = {data: [], err: ''};
        if (!_.isNull(row)) {
            data.data = row;
        } else {
            data.err = '未检索到数据！'
        }
        if (cb != null && cb != "") {
            res.send(cb + "(" + JSON.stringify(data) + ")");
        } else {
            res.json(data);
        }
    });
});

router.get('/pay/:cellphone', function (req, res, next) {
    var cb = req.query.callback;
    var cellphone = req.params.cellphone;
    var payitems = JSON.parse(req.query.payitems);
//    console.log(cellphone, payitems);

    var billsModel = mongoose.model('Bills');
    var Orders = payitems.MXLIST;

    var billsEntity = new billsModel({
        _cas_refs: payitems._cas_refs,
        _cst_refs: payitems._cst_refs,
        _org_refs: payitems._org_refs,
        AMOUNT: payitems.amount,
        FLAG: '0',
        OrdersScheame: Orders
    });


    billsEntity.save(function (err, row) {
        var data = {data: [], err: ''};
        if (err) {
            console.log('订单数据库异常!', err);
            data.err = '订单数据库异常!' + err;
            next(err);
        } else {
//            console.log('订单插入成功!', row);
            dao.findById(payitems._cst_refs, function (err2, row2) {
                if (err2) {
                    console.log('账户数据库异常!', err2);
                    data.err = '账户数据库异常!' + err2;
                    next(err2);
                } else  {
//                    console.log('账户检索成功!', row2);
                    row2.BALANCE = (row2.BALANCE - payitems.amount).toFixed(2);
                    row2.save(function (err3, row3){
                        if (err3) {
                            console.log('账户更新失败!', err3);
                            data.err = '账户更新失败!' + err3;
                            next(err3);
                        }else {
//                            console.log('余额更新成功!', row3);
                            data.data = row3;
//                            console.log(data);
                            if (cb != null && cb != "") {
                                res.send(cb + "(" + JSON.stringify(data) + ")");
                            } else {
                                res.json(data);
                            }
                        }
                    });


                }
            });
        }
    });
});


router.get('/refee/:org_id', function (req, res, next) {
    var cb = req.query.callback;
    var org_id = req.params.org_id;
    var cst_id = req.query.cst_id;
    console.log(org_id);
    console.log(cst_id);
    var billsModel = mongoose.model('Bills');
    var today = moment(new Date()).lang("zh-cn").format('YYYY-MM-DD');
    console.log(today);
    billsModel.find({_cst_refs: cst_id, _org_refs: org_id}, function (err, doc) {
        var data = {data: [], err: ''};
        console.log(doc);
        if (err) {
            console.log('数据库异常!', err);
            data.err = '数据库异常!' + err;
            next(err);
        } else {
            data.data = doc;
            console.log(doc.crt_time);
            if (cb != null && cb != "") {
                res.send(cb + "(" + JSON.stringify(data) + ")");
            } else {
                res.json(data);
            }
        }
    });


});

router.get('/all', function (req, res, next) {
    var cb = req.query.callback;
    dao.findAll(function (err, customers) {
        if (err) return next(err);
        var data = {data: [], err: ''};
        if (!_.isNull(customers)) {
            data.data = customers;
        } else {
            data.err = '未检索到数据！'
        }
        if (cb != null && cb != "") {
            res.send(cb + "(" + JSON.stringify(data) + ")");
        } else {
            res.json(data);
        }
    });
});

module.exports = router;