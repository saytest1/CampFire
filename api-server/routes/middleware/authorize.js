let table_policies = {
    "/api/service": {
        "admin": {
            "GET": true,
            "POST": true,
            "PATCH": true,
            "DELETE": true
        },
        "manager": {
            "GET": true,
            "POST": true,
            "PATCH": true,
            "DELETE": true
        },
        "customer": {
            "GET": true,
            "POST": false,
            "PATCH": false,
            "DELETE": false
        }
    },
    "/api/service/:id": {
        "admin": {
            "GET": true,
            "POST": true,
            "PATCH": true,
            "DELETE": true
        },
        "manager": {
            "GET": true,
            "POST": true,
            "PATCH": true,
            "DELETE": true
        },
        "customer": {
            "GET": true,
            "POST": false,
            "PATCH": false,
            "DELETE": false
        }
    }
};


module.exports.authorized = function(req, res, next) {
    const {method, path} = req.getRoute();
    
    // Check if policy exists for this path and role
    if (!table_policies[path] || 
        !table_policies[path][req.user?.role] || 
        !table_policies[path][req.user?.role][method]) {
        
        res.send(401, {
            success: false, 
            message: "Unauthorized access - Insufficient privilege"
        }); 
        return next(false);
    }
    
    return next();
}