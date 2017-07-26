var http = require('http');
var express = require("express");
var RED = require("node-red");

var app = express();
app.use("/",express.static("public"));
var server = http.createServer(app);
var settings = {
    httpAdminRoot:"/",
    httpNodeRoot: "/api",
    userDir:"./userdata",
//    nodesDir:["./node_modules/node-red-contrib-netpie"],
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

console.log(__dirname+"/img/node-pie.png");

RED.init(server,settings);
app.use(settings.httpAdminRoot,RED.httpAdmin);
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(8888);
RED.start();
