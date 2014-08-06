/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-11-22
 * Time: 上午11:38
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var dbAdapter = require('./dbAdapter.js');

//声明cashiers的dao
var organizationsModel = mongoose.model('Organizations'),
    organizationsDao = new dbAdapter(organizationsModel);

//声明cashiers的dao
var cashiersModel = mongoose.model('Cashiers'),
    cashiersDao = new dbAdapter(cashiersModel);

//声明Customers的dao
var customersModel = mongoose.model('Customers'),
    customersDao = new dbAdapter(customersModel);

//声明Vegatables的dao
var vegatablesModel = mongoose.model('Vegatables'),
    vegatablesDao = new dbAdapter(vegatablesModel);

//声明BillsScheame的dao
var billsModel = mongoose.model('Bills'),
    billsDao = new dbAdapter(billsModel);

module.exports = {
    organizeDao: organizationsDao,
    cashiersDao: cashiersDao,
    customersDao: customersDao,
    vegatablesDao: vegatablesDao,
    billsDao: billsDao
};

