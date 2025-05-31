exports.up = function(knex) {
    return knex.schema.raw(`
      CREATE OR REPLACE PROCEDURE process_service_request(
        p_booking_detail_id INTEGER,
        p_service_id INTEGER,
        p_amount INTEGER
      )
      LANGUAGE plpgsql
      AS $$
      DECLARE
        v_booking_id INTEGER;
        v_service_exists BOOLEAN;
        v_booking_active BOOLEAN;
      BEGIN
        -- Get booking ID and verify booking is active
        SELECT b."BookingID", b."Status" = 'Confirmed'
        INTO v_booking_id, v_booking_active
        FROM "BookingDetail" bd
        JOIN "Booking" b ON bd."BookingID" = b."BookingID"
        WHERE bd."BookingDetailID" = p_booking_detail_id;
  
        IF NOT FOUND THEN
          RAISE EXCEPTION 'Invalid booking detail ID';
        END IF;
  
        IF NOT v_booking_active THEN
          RAISE EXCEPTION 'Cannot process service for non-active booking';
        END IF;
  
        -- Verify service exists
        SELECT EXISTS (
          SELECT 1 FROM "Service"
          WHERE "ServiceID" = p_service_id
        ) INTO v_service_exists;
  
        IF NOT v_service_exists THEN
          RAISE EXCEPTION 'Invalid service ID';
        END IF;
  
        -- Record service usage
        INSERT INTO "ServiceUsage" (
          "BookingDetailID",
          "ServiceID",
          "Amount",
          "UsageDate"
        ) VALUES (
          p_booking_detail_id,
          p_service_id,
          p_amount,
          CURRENT_DATE
        );
  
        -- Update booking total amount
        PERFORM calculate_booking_total_cost(v_booking_id);
  
      END;
      $$;
    `);
  };
  
  exports.down = function(knex) {
    return knex.schema.raw(`
      DROP PROCEDURE IF EXISTS process_service_request;
    `);
  };
  