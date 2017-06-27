/**
 * Created by tkmae5v on 8/11/16.
 */
"use strict";
var graph = require("graphlib").Graph;
var GraphNode= require('./../Models/GraphNode');
var Modifiers=['PREP','AMOD','NN','POSS','RCMOD','TMOD'];
var BeVerbs=['is','are','was','were','am'];

function Graph(query){
    this._graph=new graph();
    this._root=null;
    this._aliases=[];
    this.query=query;

}
Graph.prototype.setRoot=function(root){
    this._root=root;
}
Graph.prototype.contains=function(type){
    return this._aliases.indexOf(type)!=-1


}

Graph.prototype.getRoot=function(){
    return this._graph.node(this._root);
}
Graph.prototype.hasNode=function(node){
    return this._graph.hasNode(node.Index);
}

Graph.prototype.addNode=function(parent,Newchild){

    if(Newchild==undefined || Newchild==null){
        this._graph.setNode(parent.Index,parent);
        this._aliases[parent.Index]=parent.Type;
    }
    else{
        this._graph.setEdge(parent.Index,Newchild.Index,Newchild);
        this._aliases[Newchild.Index]=Newchild.Type;
    }

}

Graph.prototype.hasChild=function(node,type){
    var graph=this._graph;
    var edges=graph.outEdges(node.Index);
    var aliases=this._aliases;
    var present= false;
    edges.forEach(function(edge){
        if(aliases[edge.w]==type){
             present=true;
        }
    });
    return present;
}

Graph.prototype.deleteNode=function(parent,child){
    var deletenode=child;
    if(child==undefined|| child==null){
        deletenode=parent;
    }
    if(typeof child === 'string' || child instanceof String)
        deletenode=this.getChild(parent,child);
    this._graph.removeNode(deletenode.Index);
    delete this._aliases[deletenode.Index];
}

Graph.prototype.hasModifiers=function(node){
    var graph=this._graph;
    var edges=graph.outEdges(node.Index);
    var aliases=this._aliases;
    var present= false;
    edges.forEach(function(edge){
        if(Modifiers.indexOf(aliases[edge.w]) > -1){
            present=true;
        }
    });
    return present;
}
Graph.prototype.print= function(){
    var edges=this._graph.edges();
    console.log(edges);
}

Graph.prototype.getNode=function(index){
    return this._graph.node(index);
}

Graph.prototype.isBeVerb= function(node){
    if(BeVerbs.indexOf(node.Type)>=-1)
        return true;
    else return false;
}
Graph.prototype.getChild=function(Node,type){
    if(type==undefined){
        var type= Node;
        var Index= this._aliases.indexOf(type);
        if(Index<=-1)
            return null;
        return this._graph.node(Index);
    }
    else{
        var graph=this._graph;
        var edges=graph.outEdges(Node.Index);
        var child=null;
        edges.forEach(function(edge){
            if(graph.node(edge.w).Type==type){
                child=graph.node(edge.w);
            }
        });
        return child;
    }

}
Graph.prototype.buildTree=function (data) {
    var tree=this;
    for(var i in data.tokens){
        var token=data.tokens[i];
        if(!tree.hasNode(i)){
            tree.addNode(new GraphNode(i,token.dependencyEdge.label,token.text.content.toLowerCase()));
            if(i==data.root){
                this.setRoot(i);
            }
            var parent=new GraphNode(i,token.dependencyEdge.label,token.text.content.toLowerCase());
            if(token.children!=undefined && token.children!=null){
                token.children.forEach(function(childIndex){
                    var child=data.tokens[childIndex];
                    tree.addNode(parent,new GraphNode(childIndex,child.dependencyEdge.label,child.text.content.toLowerCase()));
                });
            }

        }
        else if(token.children!=undefined && token.children!=null){ // the graph already has the node on it, so add its children
            var parent=new GraphNode(i,token.dependencyEdge.label,token.text.content.toLowerCase());
            token.children.each(function(childIndex){
                var child=data.tokens[childIndex];
                tree.addNode(parent,new GraphNode(childIndex,child.dependencyEdge.label,child.text.content.toLowerCase()));
            });
        }
    }
}
module.exports=Graph;


