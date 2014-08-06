/**
 * Created by Lenovo on 2014/4/30.
 */
"use strict";
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var dao = require('../models/modelDao').organizeDao;

router.get('/all', function (req, res, next) {
    var cb = req.query.callback;
    dao.findAll(function (err, orgs) {
        if (err) return next(err);
        var data = {data: [], err: ''};
        if (!_.isNull(orgs)) {
            data.data = orgs;
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
