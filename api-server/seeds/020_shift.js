exports.seed = async function (knex) {
  await knex("Shift").del();
  await knex("Shift").insert([
    {
      EmployeeID: 2, // employee01
      StartTime: "2024-12-10 08:00:00",
      EndTime: "2024-12-10 16:00:00"
    },
    {
      EmployeeID: 3, // employee02
      StartTime: "2024-12-11 08:00:00",
      EndTime: "2024-12-11 16:00:00"
    }
  ]);
};
