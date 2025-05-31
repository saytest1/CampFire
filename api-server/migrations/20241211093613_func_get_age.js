exports.up = function(knex) {
    return knex.schema.raw(`
      -- Age verification function
      CREATE OR REPLACE FUNCTION get_age(
        birth_date DATE
      ) RETURNS INTEGER AS $$
      BEGIN
        RETURN DATE_PART('year', AGE(CURRENT_DATE, birth_date));
      END;
      $$ LANGUAGE plpgsql;
    `);
  };
  
  exports.down = function(knex) {
    return knex.schema.raw(`
      DROP FUNCTION IF EXISTS get_age;
    `);
  };
  