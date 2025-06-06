var Router = require('restify-router').Router;
var router = new Router();

router.get('/', function(req, res, next) {
    res.send({ message: 'API Server is running' });
    return next();
});

module.exports = router;