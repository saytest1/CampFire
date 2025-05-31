const { getKnex } = require('./db.js');
const { rowFilter } = require('./security/row.js');
const { columnFilter } = require('./security/column.js');
const {getPgClient} = require('./db.js');
const format = require('pg-format');
var jwt = require('jsonwebtoken');
const secret = `${process.env.secret}`;

const register = async (FirstName, LastName, Username, Phone, Password) => {
    const knex = getKnex();
    
    try {
        // Start transaction
        const result = await knex.transaction(async (trx) => {
            // Create authentication record using stored procedure
            const accountResult = await trx.raw(
                'SELECT * FROM create_account(?, ?, ?)',
                [Username, Password, 'customer']
            );

            const { success, message, data } = accountResult.rows[0];
            
            if (!success) {
                throw new Error(message);
            }

            // Create Account record
            const [accountId] = await trx('Account')
                .insert({
                    Username,
                    FirstName,
                    LastName,
                    Phone,
                    Status: 'Active',
                    Role: 'customer'
                })
                .returning('AccountID');

            // Create Customer record
            await trx('Customer').insert({
                AccountID: accountId.AccountID,
                RewardPoints: 0
            });

            return { success: true, data: { username: Username } };
        });

        return result;

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const login = async (username, password) => {
    const client = getPgClient();
    const sql = format(
        "select json_agg(public.login(%L, %L))",
        username, password
    );
    
    await client.connect();
    const result = await client.query(sql);  
    await client.end();

    const loginResult = result.rows[0].json_agg[0];
    
    if (loginResult.success) {
        const token = jwt.sign(
            {
                username: username,
                role: loginResult.data.role,
                customerID: loginResult.data.customerID
            }, 
            secret, 
            { expiresIn: '1h' }
        );
        
        return {
            success: true,
            code: 200,
            message: loginResult.message,
            token: token,
            customerID: loginResult.data.customerID,
            role: loginResult.data.role
        };
    }
    
    return loginResult;
}


const getCustomerAccount = async (customerId) => {
    const knex = getKnex();
    const account = await knex('Account')
        .join('Customer', 'Account.AccountID', '=', 'Customer.AccountID')
        .select(
            'Account.AccountID',
            'Customer.CustomerID',
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
            'Account.IDNumber',
            'Customer.RewardPoints'
        )
        .where('Customer.CustomerID', customerId)
        .first();
    
    return { success: true, data: account };
};

const updateCustomerAccount = async (customerId, accountData) => {
    const knex = getKnex();
    
    // Create update object with only non-null values
    const updateFields = {};
    const allowedFields = [
        'FirstName', 
        'MiddleName', 
        'LastName', 
        'Gender', 
        'Email', 
        'Phone', 
        'Address',
        'IDNumber'
    ];

    allowedFields.forEach(field => {
        if (accountData[field] !== null && accountData[field] !== undefined && accountData[field] !== '') {
            updateFields[field] = accountData[field];
        }
    });

    // Handle DateOfBirth separately
    if (accountData.DateOfBirth && accountData.DateOfBirth !== '') {
        updateFields.DateOfBirth = accountData.DateOfBirth;
    }

    // Check if there are any fields to update
    if (Object.keys(updateFields).length === 0) {
        return { success: false, data: "No valid fields provided for update" };
    }

    const result = await knex.transaction(async (trx) => {
        const customer = await trx('Customer')
            .where('CustomerID', customerId)
            .first();

        const [updatedAccount] = await trx('Account')
            .where('AccountID', customer.AccountID)
            .update(updateFields)
            .returning('*');

        return updatedAccount;
    });

    return { success: true, data: result };
};

const deleteCustomerAccount = async (customerId) => {
    const knex = getKnex();
    await knex.transaction(async (trx) => {
        const customer = await trx('Customer')
            .where('CustomerID', customerId)
            .first();

        await trx('Customer')
            .where('CustomerID', customerId)
            .del();

        await trx('Account')
            .where('AccountID', customer.AccountID)
            .update({ Status: 'Locked' });
    });

    return { success: true };
};

module.exports = {
    register,
    login,
    getCustomerAccount,
    updateCustomerAccount,
    deleteCustomerAccount
};