let Validator = require('validatorjs');
let rules = {
    // "/customer": {
    //     "POST": {
    //         username: "required|string|min:3|max:20",
    //         password: "required|string|min:3|max:50"
    //     }
    // },
};

module.exports.validated = function (req, res, next) {
    let {method, path} = req.getRoute();
    let rule = rules[path][method];
    let validation = new Validator(req.params, rule);

    if (validation.fails()) {
        res.send({
            success: false, code: 400, message: "Bad request", 
            data: validation.errors
        }); return next(false);
    }

    return next();
}