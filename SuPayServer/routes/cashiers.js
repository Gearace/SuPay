/**
 * Created by Lenovo on 2014/4/29.
 */
"use strict";
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var dao = require('../models/modelDao').cashiersDao;

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/login/:id', function (req, res, next) {
    var user_id = req.params.id;
    var user_pwd = req.query.pwd;
    var cb = req.query.callback;
//    console.log(user_id + "----" + user_pwd);
    dao.findOne({'LOGIN_ID': user_id, 'PWD': user_pwd}, function (err, modal) {
        if (err) return next(err);
        var data = {data: [], err: ''};
        if (!_.isNull(modal)) {
            data.data = modal;
        } else {
            data.err = '未查到数据！';
        }
        if (cb != null && cb != "") {
            res.send(cb + "(" + JSON.stringify(data) + ")");
        } else {
            res.json(data);
        }
    }, {path: '_org_refs', select: 'CODE NAME'});

});

router.get('/all', function (req, res, next) {
    var cb = req.query.callback;
    dao.findAll(function (err, cashiers) {
        if (err) return next(err);
        var data = {data: [], err: ''};
        if (!_.isNull(cashiers)) {
            data.data = cashiers;
        } else {
            data.err = '未检索到数据！'
        }
        if (cb != null && cb != "") {
            res.send(cb + "(" + JSON.stringify(data) + ")");
        } else {
            res.json(data);
        }
    })
});


module.exports = router;
