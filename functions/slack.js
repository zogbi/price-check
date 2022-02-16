//FUTURE
//Slack notify
//https://blog.nodeswat.com/simple-node-js-and-slack-webhook-integration-d87c95aa9600

const https = require('https');

const userAccountNotification = {
    'channel': '@fabricio.zogbi',
    'username': 'Error notifier', // This will appear as user name who posts the message
    'text': 'User failed to login 3 times. Account locked for 15 minutes.', // text
    'icon_emoji': ':bangbang:', // User icon, you can also use custom icons here
    'attachments': [{ // this defines the attachment block, allows for better layout usage
        'color': '#eed140', // color of the attachments sidebar.
        'fields': [ // actual fields
            {
                'title': 'Environment', // Custom field
                'value': 'Production', // Custom value
                'short': true // long fields will be full width
            },
            {
                'title': 'User ID',
                'value': '331',
                'short': true
            }
        ]
    }]
};


const messageBody = {
    'channel': '@fabricio.zogbi',
    "username": "Order notifier",
    "text": "New order <!everyone> <!here> <@hpeinar>", // <> are used for linking
    "icon_emoji": ":moneybag:",
    "attachments": [ // attachments, here we also use long attachment to use more space
        {
            "color": "#2eb886",
            "fields": [{
                    "title": "Environment",
                    "value": "Production",
                    "short": true
                },
                {
                    "title": "Value",
                    "value": "4€",
                    "short": true
                },
                {
                    "title": "User ID",
                    "value": "6",
                    "short": true
                },
                {
                    "title": "Product",
                    "value": "Awesome Product",
                    "short": true
                },
                {
                    "title": "Additional notes from user",
                    "value": "Extra long notes from the user about important things.",
                    "short": false // marks this to be wide attachment
                }
            ],
            "actions": [ // Slack supports many kind of different types, we'll use buttons here
                {
                    "type": "button",
                    "text": "Show order", // text on the button 
                    "url": "http://example.com" // url the button will take the user if clicked
                },
                {
                    "type": "button",
                    "text": "Handle delivery",
                    "style": "primary", // you can have buttons styled either primary or danger
                    "url": "http://example.com"
                },
                {
                    "type": "button",
                    "text": "Cancel order",
                    "style": "danger",
                    "url": "http://example.com/order/1/cancel"
                }
            ]
        }
    ]
};

module.exports = {
    sendNotify: async function (slackWebHookURL) {
        if (!slackWebHookURL) {
            console.error('Please fill in your Webhook URL');
        }

        console.log('Sending slack message');
        console.log(slackWebHookURL);
        try {
            const slackResponse = await module.exports.sendSlackMessage(slackWebHookURL, messageBody);
            console.log('Message response', slackResponse);
        } catch (e) {
            console.error('There was a error with the request', e);
        }
    },
    sendSlackMessage: function (webhookURL, messageBody) {
        // make sure the incoming message body can be parsed into valid JSON
        try {
            messageBody = JSON.stringify(messageBody);
        } catch (e) {
            throw new Error('Failed to stringify messageBody', e);
        }

        // Promisify the https.request
        return new Promise((resolve, reject) => {
            // general request options, we defined that it's a POST request and content is JSON
            const requestOptions = {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                }
            };

            // actual request
            const req = https.request(webhookURL, requestOptions, (res) => {
                let response = '';


                res.on('data', (d) => {
                    response += d;
                });

                // response finished, resolve the promise with data
                res.on('end', () => {
                    resolve(response);
                })
            });

            // there was an error, reject the promise
            req.on('error', (e) => {
                reject(e);
            });

            // send our message body (was parsed to JSON beforehand)
            req.write(messageBody);
            req.end();
        });
    }
}