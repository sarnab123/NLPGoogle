/**
 * Created by tkmae5v on 8/15/16.
 */
var natural = require('natural');
var  Actionclassifier = new natural.LogisticRegressionClassifier();
var  ObjectClassifier = new natural.LogisticRegressionClassifier();
var ClassifierTrainer= require('./ClassifierTrainer');
var dateFormat = require('dateformat');
/*Actionclassifier.addDocument('kohl\'s cash', 'kohls_cash');
Actionclassifier.addDocument('cash', 'kohls_cash');
Actionclassifier.addDocument('cash balance', 'kohls_cash');
Actionclassifier.addDocument('Kohl\'s cash balance', 'kohls_cash');

Actionclassifier.addDocument('reward points', 'y2y_points');
Actionclassifier.addDocument('points', 'y2y_points');
Actionclassifier.addDocument('points balance', 'y2y_points');
Actionclassifier.addDocument('reward points balance', 'y2y_points');
Actionclassifier.addDocument('reward balance', 'y2y_points');


Actionclassifier.addDocument('offers', 'offers');
Actionclassifier.addDocument('instore offers', 'offers');
Actionclassifier.addDocument('discounts', 'offers');
Actionclassifier.addDocument('on sale', 'offers');
Actionclassifier.addDocument('deals', 'offers');

Actionclassifier.addDocument('store', 'store');
Actionclassifier.addDocument('shop', 'store');
Actionclassifier.addDocument('kohl\'s store', 'store');
Actionclassifier.addDocument('kohl\'s showroom', 'store');*/

ClassifierTrainer(Actionclassifier,ObjectClassifier);

//Actionclassifier.train();
var async= require('async');

var classifyAction=function(text){
    var result= Actionclassifier.getClassifications(text);
    //find the difference between top 2 results, if it is more than 0.6, we go for it
    if((result[0].value-result[1].value) >0 &&result[0].value>0.5){
        return result[0].label;
    }
    else {
        return "search";
    }
}
var classifyResponse= function (response, callback) {
    if(response.Action=="search"){
        var result= Actionclassifier.getClassifications(response.Object);
        //find the difference between top 2 results, if it is more than 0.6, we go for it
        if((result[0].value-result[1].value) >0 &&result[0].value>0.5){
            response.Action=result[0].label;
            response.Object=response.filter;
            callback(null,response);
        }
        else {
            callback(null, response);
        }
    }
    else if( response.Action=="display" || response.Action=="open"){
        var result= ObjectClassifier.getClassifications(response.Object);
        //find the difference between top 2 results, if it is more than 0.6, we go for it
        if((result[0].value-result[1].value) >=0.2){
            response.Object=result[0].label;
            callback(null,response);
        }
        else {
            callback(null, response);
        }
    }
    else if( response.Action=="help"){
        var result= ObjectClassifier.getClassifications(response.query);
        //find the difference between top 2 results, if it is more than 0.6, we go for it
        if((result[0].value-result[1].value) >=0.2){
            response.Object=result[0].label;
            callback(null,response);
        }
        else {
            callback(null, response);
        }
    }
    else{

            response.Action=applyKohlsContextforAction(response.query,null);
            response.Object=applyKohlsContextforObject(response.query,null)
            callback(null,response);

    }


};

/**
 * method to return yesterday's date
 * @returns {Date}
 */
function getYesterday() {

    var yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);

    return dateFormat(yesterday, "mm/dd/yyyy");
};
function applyKohlsContextforAction(text){

    var tag= text;

    switch (tag){
        case 'yesterday':
            return getYesterday();
        default:
            var result= Actionclassifier.getClassifications(tag);
            //find the difference between top 2 results, if it is more than 0, we go for it
            if((result[0].value-result[1].value) >0){
                return result[0].label;
            }
            else {
                return 'search';
            }
    }
}
function applyKohlsContextforObject(text,tree){

    var tag= text;

    switch (tag){
        case 'yesterday':
            return getYesterday();
        default:
            var result= ObjectClassifier.getClassifications(tag);
            //find the difference between top 2 results, if it is more than 0, we go for it
            if((result[0].value-result[1].value) >0){
                return result[0].label;
            }
            else {
                return tag;
            }
    }
}
var applyKohlsContext= function(node,tree){

    var tag= node.Text;
    
    switch (tag){
        case 'are':
            if(tree.hasChild(node,"EXPL") && tree.getChild(node,"EXPL").Text=="there"){  // check for case , might be uppercase sometimes
                return 'search';
            }
        case 'yesterday':
            return getYesterday();
        default:
            var result= Actionclassifier.getClassifications(tag);
            //find the difference between top 2 results, if it is more than 0, we go for it
            if((result[0].value-result[1].value) >0){
                 return result[0].label;
            }
            else {
                return tag;
            }
    }
}
module.exports={
    classify:classifyResponse,
    applyKohlsContext:applyKohlsContext,
    classifyAction:classifyAction
};