/**
 * Created by tkmae5v on 7/15/16.
 */


'use strict';

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('../../config');

var collection;

// [START translate]
function fromMongo (item) {
    if (Array.isArray(item) && item.length) {
        item = item[0];
    }
    item.id = item._id;
    delete item._id;
    return item;
}

function toMongo (item) {
    delete item.id;
    return item;
}
// [END translate]

function getCollection (cb) {
    if (collection) {
        setImmediate(function () {
            cb(null, collection);
        });
        return;
    }
    MongoClient.connect(config.get('MONGO_URL'), function (err, db) {
        if (err) {
            return cb(err);
        }
        collection = db.collection(config.get('MONGO_COLLECTION'));
        cb(null, collection);
    });
}



function read (id, cb) {
    getCollection(function (err, collection) {
        if (err) {
            return cb(err);
        }
        collection.findOne({
            _id: new ObjectID(id)
        }, function (err, result) {
            if (err) {
                return cb(err);
            }
            if (!result) {
                return cb({
                    code: 404,
                    message: 'Not found'
                });
            }
            cb(null, fromMongo(result));
        });
    });
};
function getDeeplink(tag, cb) {
    getCollection(function (err, collection) {
        if (err) {
            return cb(err);
        }
        collection.findOne({
        TagName:tag
        }, function (err, result) {
            if (err) {
                return cb(err);
            }
            if (!result) {
                return cb({
                    code: 404,
                    message: 'Not found'
                });
            }
            cb(null, fromMongo(result));
        });
    });
}


module.exports = {
    read: read,
    getDeeplink:getDeeplink
};
