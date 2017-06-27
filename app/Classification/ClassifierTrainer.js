/**
 * Created by tkmae5v on 8/15/16.
 */
module.exports=function(Actionclassifier,ObjectClassifier){

    Actionclassifier.addDocument('kohl\'s cash', 'kohls_cash');
    Actionclassifier.addDocument('kohls_cash', 'kohls_cash');
    Actionclassifier.addDocument('cash', 'kohls_cash');
    Actionclassifier.addDocument('cash balance', 'kohls_cash');
    Actionclassifier.addDocument('Kohl\'s cash balance', 'kohls_cash');

    ObjectClassifier.addDocument('kohl\'s cash', 'kohls_cash');
    ObjectClassifier.addDocument('kohls_cash', 'kohls_cash');
    ObjectClassifier.addDocument('cash', 'kohls_cash');
    ObjectClassifier.addDocument('cash balance', 'kohls_cash');
    ObjectClassifier.addDocument('Kohl\'s cash balance', 'kohls_cash');

    Actionclassifier.addDocument('y2y_points', 'y2y_points');
    Actionclassifier.addDocument('reward points', 'y2y_points');
    Actionclassifier.addDocument('points', 'y2y_points');
    Actionclassifier.addDocument('points balance', 'y2y_points');
    Actionclassifier.addDocument('reward points balance', 'y2y_points');
    Actionclassifier.addDocument('reward balance', 'y2y_points');

    ObjectClassifier.addDocument('y2y_points', 'y2y_points');
    ObjectClassifier.addDocument('reward points', 'y2y_points');
    ObjectClassifier.addDocument('points', 'y2y_points');
    ObjectClassifier.addDocument('points balance', 'y2y_points');
    ObjectClassifier.addDocument('reward points balance', 'y2y_points');
    ObjectClassifier.addDocument('reward balance', 'y2y_points');

    Actionclassifier.addDocument('offers', 'offers');
    Actionclassifier.addDocument('discounts', 'offers');
    Actionclassifier.addDocument('on sale', 'offers');
    Actionclassifier.addDocument('deals', 'offers');

    ObjectClassifier.addDocument('offers', 'offers');
    ObjectClassifier.addDocument('discounts', 'offers');
    ObjectClassifier.addDocument('on sale', 'offers');
    ObjectClassifier.addDocument('deals', 'offers');

    ObjectClassifier.addDocument('order', 'order');

    ObjectClassifier.addDocument('wallet', 'wallet');
    ObjectClassifier.addDocument('mobile wallet', 'wallet');

    ObjectClassifier.addDocument('store tools','store_tools');
    ObjectClassifier.addDocument('store operations','store_tools');

    ObjectClassifier.addDocument('store', 'store');
    ObjectClassifier.addDocument('shop', 'store');
    ObjectClassifier.addDocument('kohl\'s store', 'store');
    ObjectClassifier.addDocument('kohl\'s showroom', 'store');


    Actionclassifier.addDocument('instore offers', 'instore_offers');
    Actionclassifier.addDocument(' instore discounts', 'instore_offers');
    Actionclassifier.addDocument('instore deals', 'instore_offers');

    ObjectClassifier.addDocument('instore offers', 'instore_offers');
    ObjectClassifier.addDocument(' instore discounts', 'instore_offers');
    ObjectClassifier.addDocument('instore deals', 'instore_offers');
    
    
    Actionclassifier.addDocument('store', 'store');
    Actionclassifier.addDocument('shop', 'store');
    Actionclassifier.addDocument('kohl\'s store', 'store');
    Actionclassifier.addDocument('kohl\'s showroom', 'store');

    Actionclassifier.addDocument('buy', 'search');
    Actionclassifier.addDocument('find', 'search');
    Actionclassifier.addDocument('get', 'search');
    Actionclassifier.addDocument('look', 'search');
    Actionclassifier.addDocument('are there', 'search');
    Actionclassifier.addDocument('search', 'search');


    Actionclassifier.addDocument('dollars', 'price');
    Actionclassifier.addDocument('bucks', 'price');
    Actionclassifier.addDocument('price', 'price');
    Actionclassifier.addDocument('dollar', 'price');

    Actionclassifier.addDocument('show', 'display');
    Actionclassifier.addDocument('display', 'display');
    Actionclassifier.addDocument('fetch', 'display');

    Actionclassifier.addDocument('open','open');
    Actionclassifier.addDocument('launch','open');

    Actionclassifier.addDocument('status','track');
    Actionclassifier.addDocument('track','track');

    Actionclassifier.addDocument('store tools','store_tools');
    Actionclassifier.addDocument('store operations','store_tools');

    Actionclassifier.addDocument('help','help');
    Actionclassifier.addDocument('use','help');



    Actionclassifier.train();
    ObjectClassifier.train();

    if(process.env.NODE_ENV!="production") // just to test if it is working
        console.log(Actionclassifier.getClassifications('chewbacca'));
}
