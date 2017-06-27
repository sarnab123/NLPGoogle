/**
 * Created by tkmaov1 on 8/10/16.
 */
"use strict";
var Response= require('./../Models/Response');
var Classifier= require('./../Classification/Classifier');


var getAttributes= function (tree,cb){
    var response= new Response(tree.query);
    var root= tree.getRoot();

    if(root==undefined || root==null)
        throw new Error("Root is not defined for the Syntax graph");
    
    if(tree.hasChild(root,"DOBJ")){
        var obj=tree.getChild(root,"DOBJ");
        response.Action=Classifier.applyKohlsContext(root,tree);
        processDObjects(obj,tree,response,cb);
    }
    else if(tree.hasChild(root,"XCOMP")){
        var comp=tree.getChild(root,"XCOMP");
        var hasModifiers=tree.hasModifiers(comp);
        var hasDobj=tree.hasChild(comp,"DOBJ");
        if(!hasModifiers && hasDobj){
            response.Action=Classifier.applyKohlsContext(comp,tree);
            var dobj=tree.getChild(comp,"DOBJ");
            processDObjects(dobj,tree,response,function(err,resp){
                processModifiers(comp,tree,resp,cb);
            });

        }
        else if(hasModifiers && hasDobj){
            response.Action=Classifier.applyKohlsContext(comp,tree);
            var dobj=tree.getChild(comp,"DOBJ");
            processDObjects(dobj,tree,response,function(err,resp){
                processModifiers(comp,tree,resp,cb);
            });

        }
        else{
            response.Action=Classifier.applyKohlsContext(root,tree);
            processObject(comp, tree, response,cb);
        }


    }
    else if(tree.hasChild(root,"CCOMP")){
        var comp=tree.getChild(root,"CCOMP");
        if(tree.hasChild(comp,"DOBJ")){
            response.Action=Classifier.applyKohlsContext(comp,tree);
            var dobj=tree.getChild(comp,"DOBJ");
            processDObjects(dobj,tree,response,cb);

        }
        else{
            response.Action=Classifier.applyKohlsContext(root,tree);
            processObject(comp, tree, response,cb);
        }


    }
    else if(tree.hasChild(root,"NSUBJ")){
        var subj=tree.getChild(root,"NSUBJ");
        if(tree.isBeVerb(root)){
            processBeVerbs(root,subj,tree,response,cb);
        }
        else{
            response.Action=Classifier.applyKohlsContext(root,tree);
            processObject(subj, tree, response,cb);
        }

    }
    else if(tree.hasChild(root,"NN")){
        var NN=tree.getChild(root,"NN");
        response.Action=Classifier.classifyAction(root.Text);
        response.Object =appendNouns(root,tree,root.Text);
        tree.deleteNode(root,NN);
        if(tree.hasModifiers(root)){
            processModifiers(root,tree,response,cb);
        }
        else
        {
            handleUnknown(root,tree,response,cb)
        }
    }
    else if(tree.hasChild(root,"PREP")){
        var PREP=tree.getChild(root,"PREP");
        response.Action=Classifier.applyKohlsContext(root,tree);
        processPreposition(PREP, tree, response,cb);
    }
    else if(tree.hasModifiers(root)){
        response.Object=root.Text;
        processModifiers(root,tree,response,cb);
    }
    else
    {
        handleUnknown(root,tree,response,cb)
    }

}
function appendFilter(filter, node) {
        if(node.Type=="TMOD"){
        var newFilter={};
        newFilter["Date"]=Classifier.applyKohlsContext(node,null);

        if(filter==null)
            return newFilter
        else if(Array.isArray(filter))
            filter.push(newFilter);
        else{
            filter["Date"]=newFilter["Date"];
        }
        }
    return filter;
}
/**
 * This method processes the be-verbs - temperory workaround, have to fix this decision structure
 * Fix to be done for informative questions
 * @param root
 * @param obj
 * @param tree
 * @param response
 * @param cb
 */
function processBeVerbs(root, obj, tree, response, cb) {
    if(obj.Text=="balance"){
        response.Action="display";
        processObject(obj, tree, response,cb);
    }
    else if((root.Text=="is" ||root.Text=="'s" ) && tree.hasChild(root,"ATTR")){response.Action=Classifier.applyKohlsContext(obj,tree);
        processModifiers(obj,tree,response,function (err, resp) {
            if(resp.Object=='' && resp.filter!=null)
                resp.Object= resp.filter.join(' ');
            resp.filter=null;
            if(tree.contains("TMOD"))
                resp.filter=appendFilter(resp.filter,tree.getChild("TMOD"))

            cb(null,resp);
        });}
    else{
        response.Action=Classifier.applyKohlsContext(root,tree);
        processObject(obj, tree, response,cb);
    }
}
function applyFilters(object, tree, response, cb) {
    if(tree.hasChild(object,"POBJ")){
        var POBJ=tree.getChild(object,"POBJ")
        var filter= {};
        if(tree.hasChild(POBJ,"NUM")){
            var filterKeyWord=Classifier.applyKohlsContext(POBJ,tree);
            filter[filterKeyWord]=tree.getChild(POBJ,"NUM").Text;
        }
        else if(tree.hasChild(POBJ,"NN")){
           // var filterText=appendNouns(POBJ,tree,POBJ.Text,cb);
            filter[tree.getChild(POBJ,"NN").Text]=POBJ.Text;
        }
        else
        {filter=[];filter.push(POBJ.Text);}

        response.filter=filter;
        cb(null,response);

    }
    else if(tree.hasChild(object,"AMOD")){
        var AMOD=tree.getChild(object,"AMOD")
        var filter= [];
        filter.push(AMOD.Text)

        response.filter=filter;
        cb(null,response);
    }
    else
        cb(null,response);

};
function processPreposition(PREP, tree, response, cb) { //root doesn't have a subject or comp, hence this prep is important
    if(tree.hasChild(PREP,"POBJ")){
        var POBJ=tree.getChild(PREP,"POBJ");
        response.Object=POBJ.Text;
        if(tree.hasChild(POBJ,"NN"))
            response.Object=appendNouns(POBJ,tree,response.Object);
        if(tree.hasModifiers(POBJ)){

            if(tree.hasChild(POBJ,"PREP")){
                applyFilters(tree.getChild(POBJ,"PREP"), tree, response, cb)
            }
            else
                applyFilters(POBJ, tree, response, cb);
        }


        else{
            response.Object=Classifier.applyKohlsContext(POBJ,tree);
            cb(null,response);
        }


    }
    else
        cb(null,response);
}
function processModifiers(object, tree, response, cb) {
    if(tree.hasChild(object,"AMOD")){
        var AMOD=tree.getChild(object,"AMOD")
        response.Object=AMOD.Text+' '+response.Object;
        tree.deleteNode(object,AMOD);
        if(tree.hasModifiers(object))
            processModifiers(object, tree, response, cb);
        else
            cb(null,response);
    }
   else if(tree.hasChild(object,"PREP")){
        applyFilters(tree.getChild(object,"PREP"), tree, response, cb);
    }
    else if(tree.hasChild(object,"NN")){
        var NN=tree.getChild(object,"NN")
        response.Object =appendNouns(object,tree,object.Text);
        tree.deleteNode(object,NN);
        if(tree.hasModifiers(object))
            processModifiers(object, tree, response, cb);
        else
            cb(null,response);
    }

    else if(tree.hasChild(object,"RCMOD")){
        var RCMOD=tree.getChild(object,"RCMOD");
        if(tree.hasModifiers(object))
            processModifiers(object, tree, response, cb);
        else
            cb(null,response);
    }
    else if(tree.hasChild(object,"TMOD")){
        applyFilters(object,tree,response,cb);
    }
    else
        cb(null,response); // NO useful modifiers found so far, sending the response back.

}
/**
 * This method appends all the Nouns in a chain
 * @param obj
 * @param tree
 * @param callback
 */
function appendNouns(obj,tree,dest,callback){

        /*var NN=tree.getChild(obj,"NN");
        response.Object=NN.Text +' '+ response.Object;
        if(tree.hasChild(NN,"NN"))
            appendNouns(NN,tree,response,callback)
         else
            callback(response);*/

        var node=tree.getChild(obj,"NN");
        while(node!=null && node!=undefined){
            dest=node.Text +' '+ dest;
            node=tree.getChild(node,"NN");
        }
        return dest;

}
function processDObjects(obj, tree, response, cb) {
    response.Object=obj.Text;
    if(tree.hasChild(obj,"NN")){
        response.Object=appendNouns(obj,tree,response.Object);
        tree.deleteNode(obj,"NN");
        if(tree.hasModifiers(obj)){
            processModifiers(obj,tree,response,cb);
        }
        else
            cb(null,response);

       /* else{
            tree.deleteNode(obj,NN);
            if(tree.hasModifiers(obj))
                processModifiers(obj,tree,response,cb);
            else
                cb(null,response);
        }*/
    }
    else if(tree.hasModifiers(obj)){
        response.Object=Classifier.applyKohlsContext(obj,tree);
        processModifiers(obj,tree,response,cb);
    }
    else{
        response.Object=Classifier.applyKohlsContext(obj,tree);
        cb(null,response);
    }

}
function processObject(object, tree, response,cb) {
    response.Object= Classifier.applyKohlsContext(object,tree);

    if(tree.hasModifiers(object)){
        processModifiers(object,tree,response,cb);
    }
    else{
        cb(null,response);
    }
}
var _getAttributes= function(data){
    
    if(data==null || data.root==undefined || data.root== null){
        return null;
    }
    var Root=data.tokens[root];
    var response={};
    if(Root["DOBJ"]!=undefined && Root["DOBJ"]!=null ){
        return null;
    }
    else if(Root["XCOMP"]!=undefined && Root["XCOMP"]!=null){
        return null;
    }
    else if(Root["NSUBJ"]!=undefined && Root["NSUBJ"]!=null){

        response["Action"]=Classifier.applyKohlsContext(Root.text.content);
        var NSUBJ= data.tokens[Root["NSUBJ"]];
        if(hasModifiers(NSUBJ)){

        }
        else{
            response["For"]=Classifier.applyKohlsContext(NSUBJ.text.content);
            return response;
        }
        
    }
    
}

/**
 * this method handles the unknown queries
 * @param root
 * @param tree
 * @param resp
 * @param cb
 */
function handleUnknown(root, tree, resp, cb) {

}



module.exports={
    getAttributes:getAttributes
}