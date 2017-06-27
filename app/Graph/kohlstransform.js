
function isArray(obj) {
    return (typeof obj !== 'undefined' &&
    obj && obj.constructor === Array);
}

module.exports=function(data){
    var root;
    if(data==null){
        return null
    }
    if (data.tokens=="undefined"|| data.tokens==null || !isArray(data.tokens)){
        return null;
    }
    var tokens= data.tokens;
    for(var i in tokens){
        var token= tokens[i];
        if(token.dependencyEdge.headTokenIndex!=i)
        {
            if(tokens[token.dependencyEdge.headTokenIndex]["children"]==undefined ||tokens[token.dependencyEdge.headTokenIndex]["children"]==null){
                tokens[token.dependencyEdge.headTokenIndex]["children"]=[i];
            }
            else{
                tokens[token.dependencyEdge.headTokenIndex]["children"].push(i);
            }
        }
        else{
            root=i;
        }
    }
    return {root:root,tokens:tokens,query:data.sentences[0].text.content};
}