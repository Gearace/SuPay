var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var _ = require('lodash');
var then = require('thenjs');
var mongoose = require('mongoose');
var dao = require('../models/modelDao').customersDao;

/* GET home page. */
router.get('/', function (req, res) {

    res.render('index', { title: 'Express' });

});

router.get('/init', function (req, res, next) {
    var Organizations = mongoose.model('Organizations');
    var Cashiers = mongoose.model('Cashiers');
    var Vegatables = mongoose.model('Vegatables');

    var orgmodel = new Organizations({
        "CODE": "00000001",
        "NAME": "双宝菜篮子[西夏店]"
    });

    orgmodel.save(function (err) {
        if (err) return next(err);
        var casmodel = new Cashiers({
            "LOGIN_ID": "0001",
            "NAME": "张三",
            "PWD": crypto.createHash('md5').update('00011').digest('hex'),
            "TYPE": "2",
            "STATUS": "1",
            "_org_refs": orgmodel._id
        });
        casmodel.save(function (err) {
            if (err) return next(err);
            orgmodel.update({$set: {_cas_refs: [casmodel._id]}}, function (err) {
                if (err) return next(err);
            });
        });

        var vgtlist = [
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000001",
                "NAME": "黄瓜",
                "PRICE": 0.55,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000002",
                "NAME": "羊角椒",
                "PRICE": 0.68,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000003",
                "NAME": "蒜苔",
                "PRICE": 0.13,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000004",
                "NAME": "韭菜",
                "PRICE": 0.14,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000005",
                "NAME": "香芹",
                "PRICE": 0.15,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000006",
                "NAME": "豆角",
                "PRICE": 0.16,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000007",
                "NAME": "西红柿",
                "PRICE": 0.17,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000008",
                "NAME": "西兰花",
                "PRICE": 0.18,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000009",
                "NAME": "高山娃娃菜",
                "PRICE": 0.19,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000010",
                "NAME": "大葱",
                "PRICE": 0.2,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000011",
                "NAME": "土豆",
                "PRICE": 0.21,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000012",
                "NAME": "大白菜",
                "PRICE": 0.22,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000013",
                "NAME": "萝卜",
                "PRICE": 0.23,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000014",
                "NAME": "葱头",
                "PRICE": 0.24,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000015",
                "NAME": "莲花菜",
                "PRICE": 0.25,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000016",
                "NAME": "胡萝卜",
                "PRICE": 0.26,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000017",
                "NAME": "清真牛羊肉",
                "PRICE": 0.27,
                "UNIT": "斤",
                "VERSION": 1
            },
            {
                "_org_refs": [orgmodel._id],
                "CODE": "10000018",
                "NAME": "猪肉",
                "PRICE": 0.28,
                "UNIT": "斤",
                "VERSION": 1
            }
        ];

        then.eachSeries(vgtlist, function(defer, vgtmodel){
            var mod= new Vegatables(vgtmodel)
            mod.save(function(err){
                if (err) return next(err);
            });
            defer(null, mod._id);
        }).then(function (defer, value) {
            orgmodel.update({$set: {_vgt_refs: value}}, function (err) {
                if (err) return next(err);
            });
            defer(null,value);
        });
    });
    res.json([]);

});

router.get('/initcst', function (req, res, next) {
    var customers = [
        {
            "CODE": "1112",
            "NAME": "鲁璟洁",
            "BALANCE": 300,
            "PHONE": 111
        },
        {
            "CODE": "1111",
            "NAME": "邓亮",
            "BALANCE": 300,
            "PHONE": 123
        },
        {
            "CODE": "1113",
            "NAME": "张强",
            "BALANCE": 300,
            "PHONE": 112
        }
    ];

    var instResult = [];
    for (var i = 0; i < customers.length; i++) {
        var aCST = customers[i];
        dao.create(aCST, function (err, rtCustomer) {
            if (err) {
                console.log('save err!');
            }else{
                console.log('save succ!');
                instResult.shift(rtCustomer);
            }
        });
    }
    res.json(instResult);
});

//promis then测试
router.get('/:input', function (req, res) {
    var input = Number(req.params.input);
    then(function(defer){
        console.log(111);
        for(var i =0; i<10;i++){
//            console.log(i);
            input+=i;
        }
        if(input>500){
            defer(null,input );
        }else{
            defer('异常');
        }
    }).then(function(defer,value){
        console.log(222);
        console.log(value);
    },function(defer,err){
        console.log(333);
        console.log(err);
    }).fail(function(defer, err){
        console.log(444);
        console.log(err);
    });
    res.render('index', { title: 'input' });

});

module.exports = router;

