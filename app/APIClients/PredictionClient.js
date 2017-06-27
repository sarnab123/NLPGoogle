
// [START predict]

  var google = require('googleapis');
  var prediction = google.prediction('v1.6');
  var KohlsBot=function (phrase, callback) {
      google.auth.getApplicationDefault(function(err, authClient) {
          if (err) {
              console.log('Authentication failed because of ', err);
              callback(err);
              return;
          }
          if (authClient.createScopedRequired && authClient.createScopedRequired()) {
              var scopes = ['https://www.googleapis.com/auth/cloud-platform','https://www.googleapis.com/auth/prediction'];
              authClient = authClient.createScoped(scopes);
          }

          var request = {
              // TODO: Change placeholders below to appropriate parameter values for the 'predict' method:

              // The project associated with the model.
              project: "machineKohls",
              // The unique name for the predictive model.
              id: "kohls_assistant",
              resource: {
                  input: {
                      // Predict sentiment of the provided phrase
                      csvInstance: phrase.split(/\s/gi)
                  }
              },
              // Auth client
              auth: authClient
          };

          prediction.trainedmodels.predict(request, function(err, result) {
              if (err) {
                 // console.log(err);
                  callback(err)
              } else {
                 // console.log(result);
                  callback(null,result);
              }
          });
      });

  }
 
  module.exports=KohlsBot;