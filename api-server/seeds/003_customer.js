exports.seed = async function (knex) {
  await knex("Customer").del();
  await knex("Customer").insert([
    { AccountID: 5, RewardPoints: 150 },
    { AccountID: 6, RewardPoints: 100 },
    { AccountID: 7, RewardPoints: 200 }
  ]);
};
