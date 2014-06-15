var irc = require("irc");

var config = require("./config.json");

var wimpbot = new irc.Client(config.server, config.botName, {
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
wimpbot.addListener('error', function(message) {
	console.log('error:', message);
});

// Listens for channel joins
wimpbot.addListener('join', function(channel, nick, message) {
	console.log('joined:', channel, 'as "', nick, '",', message);
});

// Listens for server connection
wimpbot.addListener('registered', function(message) {
	console.log('connected to', message.server);

	// Authenticate to NickServ using the password stored in config.
	// Setting this nick up prior to the bot actually joining the net is
	// left as an exercise.
	wimpbot.say('NickServ', 'identify ' + config.password);	
});

// Listens for private messages to the bot
wimpbot.addListener('pm', function(nick, text, message) {
	
	// TODO: Add reasonable message handling/filtering here.
	console.log('PM from', nick, 'saying "', text, '", ', message);
});

