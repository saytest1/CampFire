exports.up = function(knex) {
    return knex.schema.raw(`
      CREATE OR REPLACE PROCEDURE reserve_room(
        p_customer_id INTEGER,
        p_employee_id INTEGER,
        p_check_in_date DATE,
        p_check_out_date DATE,
        p_room_id INTEGER,
        p_guest_id INTEGER,
        INOUT booking_id INTEGER DEFAULT NULL
      )
      LANGUAGE plpgsql
      AS $$
      DECLARE
        is_room_available BOOLEAN;
      BEGIN
        -- Check if room is available for the given dates
        SELECT NOT EXISTS (
          SELECT 1 
          FROM "Booking" b
          JOIN "BookingDetail" bd ON b."BookingID" = bd."BookingID"
          WHERE bd."RoomID" = p_room_id
          AND b."Status" = 'Confirmed'
          AND (
            (p_check_in_date BETWEEN b."CheckInDate" AND b."CheckOutDate")
            OR (p_check_out_date BETWEEN b."CheckInDate" AND b."CheckOutDate")
          )
        ) INTO is_room_available;
  
        IF NOT is_room_available THEN
          RAISE EXCEPTION 'Room is not available for the selected dates';
        END IF;
  
        -- Create new booking if booking_id is null
        IF booking_id IS NULL THEN
          INSERT INTO "Booking" (
            "CustomerID", 
            "EmployeeID", 
            "BookingDate", 
            "CheckInDate", 
            "CheckOutDate", 
            "Status", 
            "PaymentStatus"
          )
          VALUES (
            p_customer_id,
            p_employee_id,
            CURRENT_DATE,
            p_check_in_date,
            p_check_out_date,
            'Confirmed',
            'Unpaid'
          )
          RETURNING "BookingID" INTO booking_id;
        END IF;
  
        -- Create booking detail
        INSERT INTO "BookingDetail" (
          "BookingID",
          "RoomID",
          "GuestID"
        )
        VALUES (
          booking_id,
          p_room_id,
          p_guest_id
        );
  
        -- Calculate initial total amount
        PERFORM calculate_booking_total_cost(booking_id);
  
      END;
      $$;
    `);
  };
  
  exports.down = function(knex) {
    return knex.schema.raw(`
      DROP PROCEDURE IF EXISTS reserve_room;
    `);
  };
  