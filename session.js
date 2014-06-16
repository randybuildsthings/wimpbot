var irc = require("irc");
var cronJob = require('cron').CronJob;

var config = require("./config.json");

var session = new irc.Client(config.server, config.botName, {
	channels: config.channels,
	autoRejoin: true,
	autoConnect: true,
	floodProtection: true,
	floodProtectionDelay: 2000,
	sasl: false,
	messageSplit: 512
});

// Required listener. Otherwise the bot will crash the first time an
// error is received from the server.
session.addListener('error', function(message) {
	console.log('error:', message);
});

// Listens for channel joins
session.addListener('join', function(channel, nick, message) {
	console.log('joined: %s as %s', channel, nick);
	
	// Cycle through channels we're logged into, and attempt to get ops
	// for each channel the bot joins
	for (var i = 0; i < config.channels.length; i++) {
		if ((config.channels[i] == channel) && (config.botName==nick)) {
			console.log('requesting ops for', channel);
			session.say('ChanServ','op ' + channel);
			session.action(channel,'waves at everyone. Hi!');
		}
	}
});

// Listens for server connection
session.addListener('registered', function(message) {
	console.log('connected to "%s"', message.server);

	// Authenticate to NickServ using the password stored in config.
	// Setting this nick up prior to the bot actually joining the net is
	// left as an exercise.
	session.say('NickServ', 'identify ' + config.password);
	session.say('/mode +d')
});

// Listens for private messages to the bot
session.addListener('pm', function(nick, text, message) {
	
	// TODO: Add reasonable message handling/filtering here.
	console.log('PM from %s: %s', nick, text);
});

