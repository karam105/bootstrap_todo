const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-west-1', apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
        const params = {
            TableName: "todo_table",
            IndexName: "user_email-index",
            KeyConditionExpression: "#email = :ue",
            ExpressionAttributeNames: {
                "#email":"user_email"
            },
            ExpressionAttributeValues: {
                ":ue": event.user_email
            }
        };
        
        dynamodb.query(params, function(err, data) {
            if(err) {
                console.log(err);
                console.log("Unable to query. Error: ", JSON.stringify(err, null, 2));
                callback(err);
            }
            else {
                console.log(data);
                console.log("email being sent: " + event.user_email);
                callback(null, data);
            }
        });
};
