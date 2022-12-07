var Log = require('../models/Log')
var mongoose = require("mongoose")

module.exports.get = _ => {
    return Log
        .find()
        .sort({ created: 1 })
        .exec()
}

module.exports.add = log => {
    return new Log(log).save()
}

module.exports.remove = _id => {
    return Log
        .deleteOne({_id: mongoose.Types.ObjectId(_id)})
        .exec()
}

module.exports.deleteAll = _ => {
    return Log
        .deleteMany({})
        .exec()
}