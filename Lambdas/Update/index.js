const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({region: 'us-west-1', apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    const params = {
        ExpressionAttributeNames: {
            "#TD": "item",
            "#DD": "dueDate",
            "#SS": "status"
        },
        ExpressionAttributeValues: {
            ":i": {
                S: event.item
            },
            ":d": {
                S: event.dueDate
            },
            ":s" : {
                S: event.status_value
            }
        },
        Key: {
            "shard_id": {
                S: event.shard_id
            }
        },
        ReturnValues: "ALL_NEW",
        TableName: "todo_table",
        UpdateExpression: "SET #TD = :i, #DD = :d, #SS = :s"
    };
    dynamodb.updateItem(params, function(err, data) {
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