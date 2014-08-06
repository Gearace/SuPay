/**
 * Created with JetBrains WebStorm.
 * User: Ginnjea.Lu
 * Date: 13-7-4
 * Time: 下午8:21
 * To change this template use File | Settings | File Templates.
 */
var util = require('util');
var moment = require('moment');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var settings = require('../settings');

//数据库地址
var dburl = 'mongodb://' + settings.host + ':' + settings.port + '/' + settings.db;

exports.connect = function () {
    mongoose.connect(dburl);
};

exports.disconnect = function (callback) {
    mongoose.disconnect(callback);
};

exports.setup = function (callback) {
    callback(null);
};

var updTimePlugin = function(schema, options) {
    schema.add({ upd_time: Date })

    schema.pre('save', function (next) {
        this.upd_time = new Date
        next()
    })

    if (options && options.index) {
        schema.path('upd_time').index(options.index)
    }
};

//机构模型
var OrganizationsSchema = new Schema({
    CODE: {type: String, required: true},
    NAME: {type: String, required: true},
    _cas_refs: [
        { type: Schema.Types.ObjectId, ref: 'Cashiers' }
    ],
    _vgt_refs: [
        {type: Schema.Types.ObjectId, ref: 'Vegatables'}
    ]
});
OrganizationsSchema.plugin(updTimePlugin, { index: true });
mongoose.model('Organizations', OrganizationsSchema);

//售货员模型及校验，校验器要放在Schema前
var CashiersSchema = new Schema({
//    登陆帐户，邮箱或手机
    LOGIN_ID: {type: String},
//    名字
    NAME: {type: String, required: true},
//    密码
    PWD: {type: String, required: true},
//    类型
    TYPE: {type: String, required: true},
//    状态
    STATUS: {type: String, required: true},
//    所属机构
    _org_refs: { type: Schema.Types.ObjectId, ref: 'Organizations' }
});
CashiersSchema.plugin(updTimePlugin, { index: true });
mongoose.model('Cashiers', CashiersSchema);

//顾客模型
var CustomersScheama = new Schema({
//    名字
    NAME: {type: String, required: true},
//    余额
    BALANCE: {type: String, required: true},
//    手机
    PHONE: {type: String, required: true},
//    证件号
    CODE: {type: String, required: true}
});
CustomersScheama.plugin(updTimePlugin, { index: true });
mongoose.model('Customers', CustomersScheama);

//菜目模型
var VegatablesScheama = new Schema({
//    机构编号
    _org_refs: [
        { type: Schema.Types.ObjectId, ref: 'Organizations' }
    ],
//    菜品代码
    CODE: {type: String, required: true},
//    名称
    NAME: {type: String, required: true},
//    单价
    PRICE: {type: Number, required: true},
//    计量单位
    UNIT: {type: String, required: true},
//    版本
    VERSION: {type: Number, required: true}
});
VegatablesScheama.plugin(updTimePlugin, { index: true });
mongoose.model('Vegatables', VegatablesScheama);

//订单模型
var OrdersScheame = new Schema({
    _vgt_refs: { type: Schema.Types.ObjectId, ref: 'Vegatables' },
    quantity: {type: String, required: true},
    totprice: {type: String, required: true},
    perprice: {type: String, required: true}
});

//账目模型
var BillsScheame = new Schema({
    //售货员编号
    _cas_refs: { type: Schema.Types.ObjectId, ref: 'Cashiers' },
    //顾客编号
    _cst_refs: { type: Schema.Types.ObjectId, ref: 'Customers' },
    //机构编号
    _org_refs: { type: Schema.Types.ObjectId, ref: 'Organizations' },
    //账单金额
    AMOUNT: {type: String, required: true},
    //退费标志
    FLAG: {type: String, required: true},
    //订单嵌套Document
    OrdersScheame: [OrdersScheame]
});

//定义虚拟属性需跟在Schema定义后，创建时间
BillsScheame.virtual('crt_time').get(function () {
    return moment(this._id.getTimestamp()).lang("zh-cn").format('YYYY-MM-DD');
});
BillsScheame.plugin(updTimePlugin, { index: true });

mongoose.model('Bills', BillsScheame);
