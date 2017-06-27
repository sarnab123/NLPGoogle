// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
require('@google/cloud-debug');
var express    = require('express');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port
//==================================================================================
// ST UP DB
var TagModel= require('./app/Models/Tag');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
var predictor= require("./app/APIClients/PredictionClient");
var NLP= require("./app/APIClients/NLPClient");
//var Tag=require('./app/Tag');
// test route to make sure everything is working
router.get('/', function(req, res) {
    if(req.query['q'])
    console.log(" Message : "+req.query['q']);
    res.json({ message: 'Hello from Kohl\'s bot!!!!' });
});

var BotResponse= require("./app/Models/BotResponse");

/*For Building the Entitites for the User's query */
router.get('/ask',function(req,res){
    var ask=req.query['q'];
    if(ask){
        predictor(ask,function(err,prediction){
            if(err){
                res.json({Message:"There was an Error",Details:err});
            }
            else
            {
                TagModel.getDeeplink(prediction.outputLabel,function (err, result) {
                    if(err)
                        res.json(err);
                    else
                    {
                        res.json( new BotResponse(prediction,result.Deeplink));

                    }

                });

            }

        });
    }
    else{
        res.json({Message:"There was an Error",Details:req});
    }
    
});
router.post('/ask',function (req, res) {
    var ask=req.body.q;
    if(ask){
        predictor(ask,function(err,prediction){
            if(err){
                res.json({Message:"There was an Error",Details:err});
            }
            else
            {
                TagModel.getDeeplink(prediction.outputLabel,function (err, result) {
                    if(err)
                        res.json(err);
                    else
                    {
                        res.json( new BotResponse(prediction,result.Deeplink));

                    }

                });
            }

        });
    }
    else{
        res.json({Message:"There was an Error",Details:req});
    }
});

var KohlsTransform= require('./app/Graph/kohlstransform');
var Wrapper= require('./app/Wrapper/wrapper');

router.post('/askbot',function(req,res){
    var ask=req.body['q'];
    if(ask){
        
       Wrapper(ask,function (err, response) {
           if(err)
               res.send(err);
           else
               res.send(response);
       })
    }
    else{
        res.json({Message:"There was an Error",Details:req});
    }
});
router.post('/sentiment',function(req,res){
    var ask=req.body['q'];
    if(ask){
        NLP.process('sentiment',ask,function (err, result) {
            if(err){
                res.json(err);
            }
            else{
                res.json(result);
            }
        })
    }
    else{
        res.json({Message:"There was an Error",Details:req});
    }
});

router.post('/seek',function(req,res){
    var ask=req.body['q'];
    if(ask){
        NLP.process('syntax',ask,function (err, result) {
            if(err){
                res.json(err);
            }
            else{
                var data=KohlsTransform(result);
                res.json(data);

            }
        })
    }
    else{
        res.json({Message:"There was an Error",Details:req});
    }
});


app.use(router);

// START THE SERVER
// =============================================================================
app.listen(port,process.env.IP || "0.0.0.0",function(){
 // var addr = app.address();
  console.log("Magic happens on port ", process.env.IP || "0.0.0.0" + ":" + port);
});
