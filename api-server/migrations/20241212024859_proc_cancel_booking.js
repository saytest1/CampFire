exports.up = function(knex) {
    return knex.schema.raw(`
      CREATE OR REPLACE PROCEDURE cancel_booking(
        p_booking_id INTEGER
      )
      LANGUAGE plpgsql
      AS $$
      DECLARE
        current_status VARCHAR(15);
        check_in_date DATE;
      BEGIN
        -- Get current booking status and check-in date
        SELECT "Status", "CheckInDate"
        INTO current_status, check_in_date
        FROM "Booking"
        WHERE "BookingID" = p_booking_id;
  
        -- Validate if booking can be cancelled
        IF current_status IS NULL THEN
          RAISE EXCEPTION 'Booking not found';
        END IF;
  
        IF current_status = 'Completed' THEN
          RAISE EXCEPTION 'Cannot cancel completed booking';
        END IF;
  
        IF current_status = 'Cancelled' THEN
          RAISE EXCEPTION 'Booking is already cancelled';
        END IF;
  
        -- Update booking status
        UPDATE "Booking"
        SET 
          "Status" = 'Cancelled'
        WHERE "BookingID" = p_booking_id;
  
      END;
      $$;
    `);
  };
  
exports.down = function(knex) {
return knex.schema.raw(`
    DROP PROCEDURE IF EXISTS cancel_booking;
`);
};
  