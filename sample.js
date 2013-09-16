"use strict";

var TurtleIO = require("./lib/turtle.io"),
    server   = new TurtleIO(),
    config;

config = {
	auth : {
		basic : {
			test2 : {
				authRealm : "Private",
				authList  : ["admin:admin"]
			}
		},
		kerberos : {
			test3 : {
				kdc: "localhost"
			}
		}
	},
	default : "test",
	root    : "./sites",
	vhosts  : {
		"test"  : "test",
		"test2" : "test2",
		"test3" : "test"
	}
}

server.get("/status", function (res, req) {
	server.respond(res, req, server.status(), 200, {Allow: "GET"}, true);
}, "test");

server.start(config);
