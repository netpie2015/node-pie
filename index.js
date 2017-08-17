#!/usr/bin/env node

var fs = require('fs');
var url  = require('url');
var http = require('http');
var https = require('https');
var express = require("express");
var RED = require("node-red");
var userdir = require('os').homedir()+'/.node-pie';

var app = express();
app.use("/",express.static("public"));
var https_server, http_server;

var n = {};
try {
    n = JSON.parse(fs.readFileSync(userdir+'/nodepie.json'));
} catch(err) {
    RED.log.info('nodepie.json not found');
}
var settings = {
        nodepie : {
            port : n.port || 1888,
            secure_port : n.secure_port || null,
        },
        red : {
            httpAdminRoot:"/",
            httpNodeRoot: "/api",
            userDir: userdir,
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
                },
                login: {
                   image: __dirname+"/img/netpie-256.png"
                }
            }
        }
};

if (n && n.users) {
    settings.red.adminAuth = {
                                type: "credentials",
                                users : n.users
                             };
}

if (settings.nodepie.secure_port) {
    var opt = {};
    try {
        opt = {
            key : fs.readFileSync(userdir+'/cert/key.pem'),
            cert : fs.readFileSync(userdir+'/cert/cert.pem'),
            ca : fs.readFileSync(userdir+'/cert/ca.pem')
        }
    } catch(err){ }

    https_server = https.createServer(opt, app);
    RED.init(https_server, settings.red);
    https_server.listen(settings.nodepie.secure_port);

    http_server = express();
    http_server.get('*',function(req,res){
        var d = url.parse(req.protocol+'://'+req.get('host'));
        res.redirect('https://'+d.hostname+(settings.nodepie.secure_port==443?'':':'+settings.nodepie.secure_port)+req.originalUrl);
    })
    http_server.listen(settings.nodepie.port);

}
else {
    http_server = http.createServer(app);
    RED.init(http_server, settings.red);
    http_server.listen(settings.nodepie.port);
}

app.use(settings.red.httpAdminRoot, RED.httpAdmin);
app.use(settings.red.httpNodeRoot, RED.httpNode);
RED.start();

var timer = setInterval(function() {
    if (RED.nodes.getFlows()) {
        RED.log.info('Node-PIE is now starting.');
        if (settings.nodepie.secure_port) {
            RED.log.info('The web ui is available at https://localhost:'+settings.nodepie.secure_port+'.');
        }
        else {
            RED.log.info('The web ui is available at http://localhost:'+settings.nodepie.port+'.');
        }
        clearInterval(timer);
    }
},1000);
