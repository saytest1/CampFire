exports.seed = async function (knex) {
  await knex.raw(`
    SELECT public.create_account('admin', '1234', 'admin');
    SELECT public.create_account('manager01', '1234', 'manager');
    SELECT public.create_account('employee01', '1234', 'employee');
    SELECT public.create_account('employee02', '1234', 'employee');
    SELECT public.create_account('customer01', '1234', 'customer');
    SELECT public.create_account('customer02', '1234', 'customer');
    SELECT public.create_account('customer03', '1234', 'customer');
  `);
};
