
var Log = require('log'), util = require('util');

function ConsoleLogger(opts) {
	Log.Logger.call(this);
	opts = opts || { };
	this.colorful = typeof opts.colorful !== "undefined" ? opts.colorful : true;
}
util.inherits(ConsoleLogger, Log.Logger);

ConsoleLogger.codes = {
	bold: 1,
	italic: 3,
	underline: 4,
	blink: 5,
	inverse: 7,
	hidden: 8,
	black: 30,
	red: 31,
	green: 32,
	yellow: 33,
	blue: 34,
	magenta: 35,
	cyan: 36,
	gray: 37,
	white: "1;37"
}

ConsoleLogger.style = function(attrs, text) {

	var styleText;
	if (Array.isArray(attrs))
		styleText = attrs.reduce(function(prev, curr){ return prev + "\033[" + ConsoleLogger.codes[curr] + "m"; }, "")
	else
		styleText = "\033[" + ConsoleLogger.codes[attrs] + "m";
	return styleText+text+"\033[0m";
} 



ConsoleLogger.colorForLevel = function(status) {
	switch(status) {
	case Log.Debug:
		return "gray";
	case Log.Informative:
		return "green";
	case Log.Warning:
		return "yellow";
	case Log.Error:
		return "red";
	default:
		return "white";
	}
}

ConsoleLogger.contextString = function(context) {	
	if (typeof context === "object") {
		return context.title || context.name || context.constructor.name || "Unknown";
	}
	else {
		return context;
	}
}

ConsoleLogger.prototype.format = function(msg) {
	var contextName = ConsoleLogger.contextString(msg.context);
	if (this.colorful) {
		var 
			bracketColor = ConsoleLogger.colorForLevel(msg.level),
			//FIXME: Returning this directly results in undefined? Why?
			output = 
				ConsoleLogger.style(bracketColor, "[") +
				ConsoleLogger.style(["white", "bold"], contextName) +
				ConsoleLogger.style(bracketColor, "]") +
				" "+ msg.message;
		return output;
	}
	else {
		return "[" + contextName + "]" + " " + msg.message;
	}
}

ConsoleLogger.prototype.write = function(msg) {
	
	var output = this.format(msg);
	switch(msg.level) {
	case Log.Debug:
		console.log(output);
		break;
	case Log.Informative:
		console.info(output);
		break;
	case Log.Warning:
		console.warn(output);
		break;
	case Log.Error:
		console.error(output);
		break;
	default:
		console.log(output);
		break;
	}
}

module.exports = ConsoleLogger;