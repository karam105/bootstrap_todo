const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({region: 'us-west-1', apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    const params = {
        Key: {
            "shard_id": {
                S: event.shard_id
            }
        },
        TableName: 'todo_table'
    };
    dynamodb.deleteItem(params, function(err, data) {
        if(err) {
            console.log(err);
            callback(err);
        }
        else {
            console.log(data);
            callback(null, data);
        }
    });
};
