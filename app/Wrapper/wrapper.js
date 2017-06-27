/**
 * Created by tkmae5v on 8/15/16.
 */



var KohlsTransform= require('../Graph/kohlstransform');
var DecisionTree= require('../Graph/DecisionTree');
var Graph=require('../Graph/Graph');
var GraphNode= require('../Models/GraphNode');
var async= require('async');
var Classifier= require('../Classification/Classifier');

if(process.env.NODE_ENV=="production")
    var NLP= require("../APIClients/NLPClient");
    else var NLP= require("../APIClients/LocalNLPClient");
module.exports=function(query,callback){
    async.waterfall([
        async.apply(NLP.process, 'syntax',query),
        function(resp,callback){
            var data=KohlsTransform(resp);
            var tree= new Graph(data.query);
            tree.buildTree(data);
            callback(null,tree);
        },
        DecisionTree.getAttributes,
        Classifier.classify
    ],function (err, result) {
        if(err)
            callback(err);
        else
            callback(null,result)
    });
   /* NLP.process('syntax',query,function (err, result) {
        if(err){
            callback(err);
        }
        else{
            var data=KohlsTransform(result);
            var tree= new Graph(data.query);
            tree.buildTree(data);
            DecisionTree.getAttributes(tree,function(err,response){
                if(!err)
                    callback(null,response);
                else
                    callback(err);
            });

        }
    });*/
}