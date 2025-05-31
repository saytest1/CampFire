let policies = {
    // "customers": {
    //     "admin": {
    //         "getOne": ['CustomerID', 'RewardPoints', 'FirstName', 'MiddleName', 'LastName', 'Username', 'Status', 'DateOfBirth', 'Gender', 'Email', 'Phone', 'Address', 'IDNumber']
    //     },
    //     "manager": {
    //         "getOne": ['CustomerID', 'RewardPoints', 'FirstName', 'MiddleName', 'LastName', 'Username', 'Status', 'DateOfBirth', 'Gender', 'Email', 'Phone', 'Address', 'IDNumber']
    //     },
    //     "customer": {
    //         "getOne": ['CustomerID', 'RewardPoints', 'FirstName', 'MiddleName', 'LastName', 'Username', 'Status', 'DateOfBirth', 'Gender', 'Email', 'Phone', 'Address', 'IDNumber']
    //     }
    // },
};

module.exports.columnFilter = function(table, role, action) {
    return policies[table][role][action];
}