/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-11-22
 * Time: 上午11:15
 * To change this template use File | Settings | File Templates.
 */
function dbAdapter(Model) {
    if (typeof Model === 'undefined' || Model == null)
        throw new Error('Model can not be null.');
    this.model = Model;
}

/**
 * create
 * 批量添加
 * 本方法是操作Document，支持per,post中间件
 */
dbAdapter.prototype.create = function (doc, callback) {
    this.model.create(doc, function (err, entity) {
        if (err) return callback(err);
        return callback(null, entity)
    });
};

/**
 * count
 * 根据条件统计总数
 */
dbAdapter.prototype.count = function (conditions, callback) {
    this.model.count(conditions, function (err, count) {
        if (err) return callback(err);
        return callback(null, count);
    });
};

/**
 * distinct
 * 查询符合条件的文档并返回根据键分组的结果
 */
dbAdapter.prototype.distinct = function (filed, conditions, callback) {
    this.model.distinct(conditions, function (err, result) {
        if (err) return callback(err);
        return callback(null, result);
    });
};

/**
 * find
 * 根据条件查出所有结果，可以限定结果字段和options
 */
dbAdapter.prototype.find = function (conditions, fileds, options, callback) {
    this.model.find(conditions, fileds, options, function (err, model) {
        if (err) return callback(err, null);
        return callback(null, model);
    });
};

/**
 * findAll
 * 查出所有结果
 */
dbAdapter.prototype.findAll = function (callback) {
    this.model.find({}, {}, {sort: {'_id': -1}}, function (err, model) {
        if (err) return callback(err, null);
        return callback(null, model);
    });
};

/**
 * findById
 * 根据id查出单一结果
 */
dbAdapter.prototype.findById = function (id, callback) {
    this.model.findById(id, function (err, model) {
        if (err) return callback(err);
        return callback(null, model);
    });
};

/**
 * findOne
 * 根据条件查出单一结果
 */
dbAdapter.prototype.findOne = function (conditions, callback, populates) {
    if (populates == null || populates == undefined) {
        this.model.findOne(conditions, function (err, model) {
            if (err) return callback(err);
            return callback(null, model);
        });
    } else {
        this.model.findOne(conditions).populate(populates)
            .exec(function (err, model) {
                if (err) return callback(err);
                return callback(null, model);
            });
    }
};

/**
 * deleteById
 * 根据id查出单一结果并删除，若查出结果不唯一，则按默认倒序删除第一条
 * 直接发送命令给mongodb，故不支持per,post中间件
 */
dbAdapter.prototype.deleteById = function (id, callback) {
    this.model.findByIdAndRemove(id, {sort: {'_id': -1}}, function (err) {
        if (err) return callback(err);
        return callback(null);
    });
};

/**
 * deleteOne
 * 根据条件查出单一结果并删除，若查出结果不唯一，则按默认倒序删除第一条
 * 直接发送命令给mongodb，故不支持per,post中间件
 */
dbAdapter.prototype.deleteOne = function (conditions, callback) {
    this.model.findOneAndRemove(conditions, {sort: {'_id': -1}}, function (err) {
        if (err) return callback(err);
        return callback(null);
    });
};

/**
 * delete
 * 查出所有符合条件的结果并删除
 */
dbAdapter.prototype.delete = function (conditions, callback) {
    this.model.remove(conditions, function (err) {
        if (err) return callback(err);
        return callback(null);
    });
};

/**
 * updateById
 * 根据id查出单一结果并更新，若查出结果不唯一，则按默认倒序更新第一条
 * 直接发送命令给mongodb，故不支持per,post中间件
 */
dbAdapter.prototype.updateById = function (id, update, callback) {
    this.model.findByIdAndUpdate(id, update, {sort: {'_id': -1}}, function (err) {
        if (err) return callback(err);
        return callback(null);
    });
};

/**
 * updateOne
 * 根据条件查出单一结果并更新，若查出结果不唯一，则按默认倒序更新第一条
 * 直接发送命令给mongodb，故不支持per,post中间件
 */
dbAdapter.prototype.updateOne = function (conditions, update, callback) {
    this.model.findOneAndUpdate(conditions, update, {sort: {'_id': -1}}, function (err) {
        if (err) return callback(err);
        return callback(null);
    });
};

/**
 * update
 * 查出所有符合条件的结果并更新
 * 直接发送命令给mongodb，故不支持per,post中间件
 */
dbAdapter.prototype.update = function (conditions, update, options, callback) {
    this.model.update(conditions, update, options, function (err) {
        if (err) return callback(err);
        return callback(null);
    });
};

/**
 * removeById
 * 根据id查出单一结果并删除，若查出结果不唯一，则按默认倒序删除第一条
 * 本方法是操作Document，支持per,post中间件
 */
dbAdapter.prototype.removeById = function (id, callback) {
    this.findById(id, function (err, doc) {
        doc.remove(function (err) {
            if (err) return callback(err);
            return callback(null);
        });
    });
};

/**
 * removeOne
 * 根据条件查出单一结果并删除，若查出结果不唯一，则按默认倒序删除第一条
 * 本方法是操作Document，支持per,post中间件
 */
dbAdapter.prototype.removeOne = function (conditions, callback) {
    this.findOne(conditions, function (err, doc) {
        doc.remove(function (err) {
            if (err) return callback(err);
            return callback(null);
        });
    });
};

module.exports = dbAdapter;