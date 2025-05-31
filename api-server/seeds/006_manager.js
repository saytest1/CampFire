exports.seed = async function (knex) {
  await knex("Manager").del();
  await knex("Manager").insert([
    {
      ManagerID: 1, // manager01
      YearsOfExperience: 5
    }
  ]);
};
