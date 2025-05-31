const { getKnex } = require('./db.js');
const { rowFilter } = require('./security/row.js');
const { columnFilter } = require('./security/column.js');
const _ = require('lodash');

const getOne = async (req) => {
    let knex = getKnex();
    
    // Join Customer and Account tables to get full information
    let query = knex('Customer')
        .join('Account', 'Customer.AccountID', '=', 'Account.AccountID')
        .select(
            'Customer.CustomerID',
            'Customer.RewardPoints',
            'Account.FirstName',
            'Account.MiddleName',
            'Account.LastName',
            'Account.Username',
            'Account.Status',
            'Account.DateOfBirth',
            'Account.Gender',
            'Account.Email',
            'Account.Phone',
            'Account.Address',
            'Account.IDNumber'
        );

    const result = await query;
    return result;
};

module.exports = {
    getOne,
};
