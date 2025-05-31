var restify = require('restify');
var jwt = require('jsonwebtoken');
var format = require('pg-format');
var Router = require('restify-router').Router;
var router = new Router();
var server = restify.createServer();
const path = require('path');

const { Client } = require('pg');
var corsMiddleware = require('restify-cors-middleware2');

var cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders:['X-App-Version'],
    exposeHeaders:[]
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({ mapParams: true })); // POST params
server.use(restify.plugins.queryParser()); // GET query

server.get('/api/uploads/*', restify.plugins.serveStatic({
    directory: path.join(__dirname, 'uploads'),
    appendRequestPath: false, // Prevents duplicating paths
}));

const root = require('./routes/root');
const room = require('./routes/room');
const customer = require('./routes/customer');
const booking = require('./routes/booking');
const account = require('./routes/account');
const service = require('./routes/service');
const payment_card = require('./routes/payment_card');
const guest = require('./routes/guest');
const payment = require('./routes/payment');

root.applyRoutes(server);
room.applyRoutes(server);
customer.applyRoutes(server);
booking.applyRoutes(server);
account.applyRoutes(server);
service.applyRoutes(server);
payment_card.applyRoutes(server);
guest.applyRoutes(server);
payment.applyRoutes(server);

var PORT = 8080;
server.listen(PORT, function() {
    console.log('%s listening at %s', server.name, server.url);
});