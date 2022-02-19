var slack = require('../services/slack.js');
var keys = require('../config/keys.local.js');


myMessage = slack.makeMyMessage("@fabricio.zogbi", "produto que esta em promo", "123123", "https://www.youtube.com/", );

slack.sendNotify(keys.slack, myMessage);