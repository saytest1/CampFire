exports.seed = async function (knex) {
  await knex("Employee").del();
  await knex("Employee").insert([
    {
      AccountID: 2, // manager01
      HireDate: "2010-05-10",
      Salary: 1500.0,
    },
    {
      AccountID: 3, // employee01
      HireDate: "2015-01-15",
      Salary: 1200.0,
    },
    {
      AccountID: 4, // employee02
      HireDate: "2018-06-01",
      Salary: 1300.0,
    }
  ]);
};
