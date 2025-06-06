// Import thư viện cần thiết
const restify = require('restify');
const Router = require('restify-router').Router;
const path = require('path');
const corsMiddleware = require('restify-cors-middleware2');

// Khởi tạo server Restify
const server = restify.createServer();

// Cấu hình CORS
const cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders: ['X-App-Version'],
    exposeHeaders: []
});

// Áp dụng middleware
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.queryParser());

// Phục vụ file tĩnh (uploads)
server.get('/api/uploads/*', restify.plugins.serveStatic({
    directory: path.join(__dirname, 'uploads'),
    appendRequestPath: false,
}));

// Import các route mới cho hệ thống bán dụng cụ cắm trại
const root = require('./routes/root');
const categories = require('./routes/categories');
const products = require('./routes/products');

// Áp dụng các route vào server
root.applyRoutes(server);
categories.applyRoutes(server);
products.applyRoutes(server);

// Khởi động server
const PORT = 8080;
server.listen(PORT, function () {
    console.log('%s listening at %s', server.name, server.url);
});
