const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({region: 'us-west-1', apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    const now = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).toString();
    
    console.log(now);
    
    const params = {
        Item: {
            "timestamp": {
                S: `${now}`
            },
            "item": {
                S: event.item
            },
            "status": {
                S: event.status
            },
            "dueDate" : {
                S: event.dueDate
            },
            "shard_id" : {
                S: `${generateRowId(4)}`
            },
            "user_email" : {
                S: event.user_email
            }
        },
        TableName: "todo_table"
    };
    dynamodb.putItem(params, function(err, data) {
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

var CUSTOMEPOCH = 1300000000000;
function generateRowId(shardId) {
    var ts = new Date().getTime() - CUSTOMEPOCH;
    var randid = Math.floor(Math.random() * 512);
    ts = (ts * 64);
    ts = ts + shardId;
    return (ts * 512) + randid;
};