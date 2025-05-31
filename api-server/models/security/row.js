let policies = {
    // "customers": {
    //     "admin": {
    //         "getOne": (knex) => knex,
    //     },
    //     "manager": {
    //         "getOne": (knex) => knex,
    //     },
    //     "customer": {
    //         "getOne": (knex, user) => 
    //             knex.where({ username: user.username }),
    //     }
    // },
};

module.exports = {
    rowFilter: function(query, action, table, context) {
        if (!policies[table] || !policies[table][context.role] || !policies[table][context.role][action]) {
            console.warn(`No policy found for table: ${table}, role: ${context.role}, action: ${action}`);
            return query;  // Return unmodified query if no policy is found
        }
        return policies[table][context.role][action](query, context);
    }
};