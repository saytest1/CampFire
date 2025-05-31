exports.seed = async function (knex) {
  await knex("Receptionist").del();
  await knex("Receptionist").insert([
    {
      ReceptionistID: 2, // employee01
      ManagerID: 1 // manager01
    },
    {
      ReceptionistID: 3, // employee02
      ManagerID: 1 // manager01
    }
  ]);
};
