const express = require('express');
const http = require('http');
const path = require('path');
const app = express()
const port = process.env.PORT || 8105;
app.use(express.static(__dirname + '/dist/app'));
app.get('/*', (req,res)=>res.sendFile(path.join(__dirname)));
const server = http.createServer(app)
server.listen(port,'0.0.0.0',()=>console.log(port));
