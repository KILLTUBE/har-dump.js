fs = require("fs");
path = require("path");
url = require("url");

dumpText = function(filename, text) {
	var tmp = new Buffer(text, "ascii");
	fs.writeFileSync(filename, tmp, "binary");
}

dumpBase64 = function(filename, text) {
	var tmp = new Buffer(text, "base64");
	fs.writeFileSync(filename, tmp, "binary");	
}

clearText = function(file) {
	// for REPL debugging, so the file content doesn't spam the console
	for (var entry of file.log.entries)
		entry.response.content.text = "";
}

mkdir_force = function(filePath) {
	var dirname = path.dirname(filePath);
	if (fs.existsSync(dirname))
		return;
	mkdir_force(dirname);
	fs.mkdirSync(dirname);
}

dump_har = function(content) {
	file = JSON.parse(content).log;
	for (var entry of file.entries) {
		filename = url.parse( entry.request.url ).pathname.substr(1);
		filename = unescape(filename);
		mkdir_force(filename);
		//console.log("encoding: ", entry.response.content.encoding);
		if (entry.response.content.encoding == undefined)
			dumpText(filename, entry.response.content.text);
		else
			dumpBase64(filename, entry.response.content.text);
	}
}

content = fs.readFileSync("./dump.har");
dump_har(content);