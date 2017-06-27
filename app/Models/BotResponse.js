/**
 * Created by tkmae5v on 7/13/16.
 */
var deeplinks=require("./../deeplinks");

function getTags(APIResponse){
    APIResponse.sort(function (a, b) {
        return b.score-a.score;
    });
    return APIResponse.filter(function (item) {
        return item.score>0;
    }).map(function (resp) {
        return resp.label;
    });

};

module.exports=function (param,deeplink) {
    this.Tags=getTags(param.outputMulti);
    this.Result=param.outputLabel;
    this.Confidence="HIGH";
    this.getConfidence=function () {
        return this.Confidence;
    };
    this.ConfirmationNeeded=false;
    this.isConfirmationNeeded=function () {
        return ConfirmationNeeded;
    };
    this.Deeplink=deeplink;
    var response=this;
    return this;
}