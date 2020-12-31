exports.handler = async (event) => {
    // TODO implement
    
    var AWS = require('aws-sdk');
      
        try {
          /* code */
          
       var cloudfront = new AWS.CloudFront({apiVersion: '2020-05-31'});
          console.log(cloudfront);   
 
          var params = {
          DistributionId: '<TO REPLACE>', /* required */
          InvalidationBatch: { /* required */
            CallerReference: Math.random().toString(36).slice(2).toUpperCase(), /* required */
            Paths: { /* required */
              Quantity: 1, /* required */
              Items: [
                '/',
                /* more items */
              ]
            }
          }
        };
        
        console.log(params);
        
            cloudfront.createInvalidation(params); 
            
            
                      // successful response
                 console.log('invalidating cache for oilers-locker-room...');
                 const response = {
                      statusCode: 200,
                      body: 'Cache successfully invalidated!'
                  };
                  return response;
           
            
        } catch (err) {
                console.log(err, err.stack); // an error occurred
                const response = {
                    statusCode: 500,
                    body: err.stack
                };

        }
          
        
     
  
};
