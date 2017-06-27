
// [START predict]

var google = require('googleapis');
var languageScopes = ['https://www.googleapis.com/auth/cloud-platform'];


function getLanguageService (callback) {
    google.auth.getApplicationDefault(function (err, authClient) {
        if (err) {
            console.log('Authentication failed because of ', err);
            return callback(err);
        }

        // Depending on the environment that provides the default credentials
        // (e.g. Compute Engine, App Engine), the credentials retrieved may
        // require you to specify the scopes you need explicitly.
        if (authClient.createScopedRequired && authClient.createScopedRequired()) {
            authClient = authClient.createScoped(languageScopes);
        }

        // Load the discovery document for the natural language api service, using
        google.discoverAPI({
            url: 'https://language.googleapis.com/$discovery/rest',
            version: 'v1beta1',
            auth: authClient
        }, function (err, languageService) {
            if (err) {
                return callback(err);
            }
            callback(null, languageService, authClient);
        });
    });
}
//analyzeSentiment
function analyzeSentiment (inputText, languageService, authClient, callback) {
    languageService.documents.analyzeSentiment(
        {
            auth: authClient,
            resource: { // Resource is used as the body for the API call.
                document: {
                    content: inputText,
                    type: 'PLAIN_TEXT'
                }
            }
        },
        function (err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
}
function analyzeSyntax (inputText, languageService, authClient, callback) {
    languageService.documents.annotateText(
        {
            auth: authClient,
            resource: { // Resource is used as the body for the API call.
                document: {
                    content: inputText,
                    type: 'PLAIN_TEXT'
                },
                features: {
                    extract_syntax: 'TRUE'
                },
                encoding_type: 'UTF16'
            }
        },
        function (err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
}


module.exports.process=function (command, inputText, callback) {
    getLanguageService(function (err, languageService, authClient) {
        if (err) {
            return callback(err);
        }

        var resultCallback = function (err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        };
        if (command === 'sentiment') {
            analyzeSentiment(inputText, languageService, authClient, resultCallback);
        } else if (command === 'entities') {
            analyzeEntities(inputText, languageService, authClient, resultCallback);
        } else if (command === 'syntax') {
            analyzeSyntax(inputText, languageService, authClient, resultCallback);
        } else {
            return callback(err);
        }
    });
};

