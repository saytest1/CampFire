exports.seed = async function (knex) {
  await knex("ReceptionistLanguages").del();
  await knex("ReceptionistLanguages").insert([
    { ReceptionistID: 2, Language: "Vietnamese" },
    { ReceptionistID: 2, Language: "English" },
    { ReceptionistID: 3, Language: "Vietnamese" }
  ]);
};
