/**
 * Created by tkmae5v on 8/15/16.
 */
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');
describe('search', function() {
    if(process.env.NODE_ENV!="production")
    var url = 'http://localhost:8080';
    else
        var url = 'https://predictionpoc.appspot.com';
    before(function(done) {
        done();
    });
    describe('Search', function() {
        it('Query : search for levis jeans', function(done) {
            var payload = {
                q: 'search for levis jeans'
            };
            var testResponse={
                "query": "search for levis jeans",
                "Action": "search",
                "Object": "levis jeans",
                "filter": null
            }
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    assert.equal(res.body.Action,'search');
                    assert.equal(res.body.Object,"levis jeans");
                    done();
                });
        });
        it('Query : are there any deals on mixers', function(done) {
            var payload = {
                q: 'are there any deals on mixers'
            };
            var testResponse={
                "query": "are there any deals on mixers",
                "Action": "offers",
                "Object": [
                    "mixers"
                ],
                "filter": [
                    "mixers"
                ]
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : find me a blue dress under 30 dollars', function(done) {
            var payload = {
                q: 'find me a blue dress under 30 dollars'
            };
            var testResponse={
                "query": "find me a blue dress under 30 dollars",
                "Action": "search",
                "Object": "blue dress",
                "filter": {
                    "price": "30"
                }
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : show me my reward point balance', function(done) {
            var payload = {
                q: 'show me my reward point balance'
            };
            var testResponse={
                "query": "show me my reward point balance",
                "Action": "display",
                "Object": "y2y_points",
                "filter": null
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : show me instore discounts', function(done) {
            var payload = {
                q: 'show me instore discounts'
            };
            var testResponse={
                "query": "show me instore discounts",
                "Action": "display",
                "Object": "instore_offers",
                "filter": null
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : please launch store tools', function(done) {
            var payload = {
                q: 'please launch store tools'
            };
            var testResponse={
                "query": "please launch store tools",
                "Action": "open",
                "Object": "store_tools",
                "filter": null
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : search for nearest store', function(done) {
            var payload = {
                q: 'search for nearest store'
            };
            var testResponse={
                "query": "search for nearest store",
                "Action": "store",
                "Object": [
                    "nearest"
                ],
                "filter": [
                    "nearest"
                ]
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : I want to buy a levis jeans of size 32 ', function(done) {
            var payload = {
                q: 'I want to buy a levis jeans of size 32'
            };
            var testResponse={
                "query": "I want to buy a levis jeans of size 32",
                "Action": "search",
                "Object": "levis jeans",
                "filter": {
                    "size": "32"
                }
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : Help me find my Kohls Cash', function(done) {
            var payload = {
                q: 'Help me find my Kohls Cash'
            };
            var testResponse={
                "query": "Help me find my Kohls Cash",
                "Action": "kohls_cash",
                "Object": null,
                "filter": null
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : I want to buy a Lauren Conrad blue dress under 30 dollars', function(done) {
            var payload = {
                q: 'I want to buy a Lauren Conrad blue dress under 30 dollars'
            };
            var testResponse={
                "query": "I want to buy a Lauren Conrad blue dress under 30 dollars",
                "Action": "search",
                "Object": "blue lauren conrad dress",
                "filter": {
                    "price": "30"
                }
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : Are there any instore offers available', function(done) {
            var payload = {
                q: 'Are there any instore offers available'
            };
            var testResponse={
                "query": "Are there any instore offers available",
                "Action": "instore_offers",
                "Object": null,
                "filter": null
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        var dateFormat = require('dateformat');
        function getYesterday() {

            var yesterday = new Date();
            yesterday.setDate(new Date().getDate() - 1);

            return dateFormat(yesterday, "mm/dd/yyyy");
        };
        it('Query : What is the status of the order I placed yesterday', function(done) {
            var payload = {
                q: 'What is the status of the order I placed yesterday'
            };
            var testResponse={
                "query": "What is the status of the order I placed yesterday",
                "Action": "track",
                "Object": "order",
                "filter": {
                    "Date": getYesterday()
                }
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
      /* this test case doesn't make any sense
        it('Query : Place an instore order for a chewbacca mask', function(done) {
            var payload = {
                q: 'Place an instore order for a chewbacca mask'
            };
            var testResponse={
                "query": "Place an instore order for a chewbacca mask",
                "Action": "place",
                "Object": "instore order",
                "filter": [
                    "chewbacca mask"
                ]
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });*/

        //"help me using my loyalty points"
        it('Query : help me using my loyalty points', function(done) {
            var payload = {
                q: 'help me using my loyalty points'
            };
            var testResponse={
                "query": "help me using my loyalty points",
                "Action": "help",
                "Object": "y2y_points",
                "filter": null
            }
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : help me with my kohls cash ', function(done) {
            var payload = {
                q: 'help me with my kohls cash'
            };
            var testResponse={
                "query": "help me with my kohls cash",
                "Action": "help",
                "Object": "kohls_cash",
                "filter": null
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : help me with my reward points ', function(done) {
            var payload = {
                q: 'help me with my reward points'
            };
            var testResponse={
                "query": "help me with my reward points",
                "Action": "help",
                "Object": "y2y_points",
                "filter": null
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : open store tools ', function(done) {
            var payload = {
                q: 'open store tools'
            };
            var testResponse={
                "query": "open store tools",
                "Action": "store_tools",
                "Object": "store_tools",
                "filter": null
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : open nearest store ', function(done) {
            var payload = {
                q: 'open nearest store'
            };
            var testResponse={
                "query": "open nearest store",
                "Action": "open",
                "Object": "store",
                "filter": null
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : search for levis jeans of size 32 ', function(done) {
            var payload = {
                q: 'search for levis jeans of size 32'
            };
            var testResponse={
                "query": "search for levis jeans of size 32",
                "Action": "search",
                "Object": "levis jeans",
                "filter": {
                    "size": "32"
                }
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : levis jeans of size 32 ', function(done) {
            var payload = {
                q: 'levis jeans of size 32'
            };
            var testResponse={
                "query": "levis jeans of size 32",
                "Action": "search",
                "Object": "levis jeans",
                "filter": {
                    "size": "32"
                }
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });
        it('Query : search for levis shirt of size L ', function(done) {
            var payload = {
                q: 'search for levis shirt of size L'
            };
            var testResponse={
                "query": "search for levis shirt of size L",
                "Action": "search",
                "Object": "levis shirt",
                "filter": {
                    "size": "l"
                }
            };
            request(url)
                .post('/askbot')
                .send(payload)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.eql(testResponse);
                    done();
                });
        });



    });
});

/*
* This template is to write test case
*
*
it('Query : ___ ', function(done) {
 var payload = {
 q: '_________'
 };
 var testResponse=___________;
 request(url)
 .post('/askbot')
 .send(payload)
 .end(function(err, res) {
 if (err) {
 throw err;
 }
 res.body.should.eql(testResponse);
 done();
 });
 });


 */
