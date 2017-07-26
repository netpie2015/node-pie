#!/usr/bin/env node

var http = require('http');
var express = require("express");
var RED = require("node-red");
const port = 8888;

var app = express();
app.use("/",express.static("public"));
var server = http.createServer(app);
var settings = {
    httpAdminRoot:"/",
    httpNodeRoot: "/api",
    userDir:"./userdata",
    paletteCategories: ['netpie','subflows', 'input', 'output', 'function', 'social', 'mobile', 'storage', 'analysis', 'advanced'],
    functionGlobalContext: {},
    editorTheme : {
        page : {
            title : "Node-PIE",
            favicon: __dirname+"/img/node-pie.ico"
        },
        header : {
            title : "Node-PIE powered by Node-RED",
            image: __dirname+"/img/node-pie.png",
        }
    }
};

RED.init(server,settings);
app.use(settings.httpAdminRoot,RED.httpAdmin);
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(port);
RED.start();

var timer = setInterval(function() {
    if (RED.nodes.getFlows()) {
        RED.log.info('Node-PIE is now starting.');
        RED.log.info('The web ui is available at http://localhost:'+port+'.');
        clearInterval(timer);
    }
},1000);
