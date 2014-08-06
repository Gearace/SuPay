/**
 * Created by Lenovo on 2014/4/29.
 */
"use strict";
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var dao = require('../models/modelDao').vegatablesDao;

router.get('/all/:gid', function (req, res, next) {
    var gid = req.params.gid;
    var ver = req.query.ver;
    var cb = req.query.callback;
//    console.log(gid + "----" + ver);
    dao.findAll(function (err, vegatables) {
//        console.log(vegatables);
        if (err) return next(err);
        var data = {data: [], err: ''};
        if (!_.isNull(vegatables)) {
            data.data = vegatables;
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