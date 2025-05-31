exports.up = function(knex) {
    return knex.schema.raw(`
      CREATE OR REPLACE FUNCTION calculate_booking_total_cost(
        booking_id INTEGER
      ) RETURNS NUMERIC(10,2) AS $$
      DECLARE
        total_cost NUMERIC(10,2);
        room_cost NUMERIC(10,2);
        service_cost NUMERIC(10,2);
      BEGIN
        -- Calculate room costs
        SELECT COALESCE(SUM(rt."BasePrice" * 
          (DATE_PART('day', b."CheckOutDate"::timestamp - b."CheckInDate"::timestamp))), 0)
        INTO room_cost
        FROM "Booking" b
        JOIN "BookingDetail" bd ON b."BookingID" = bd."BookingID"
        JOIN "Room" r ON bd."RoomID" = r."RoomID"
        JOIN "RoomType" rt ON r."RoomTypeID" = rt."RoomTypeID"
        WHERE b."BookingID" = booking_id;
  
        -- Calculate service costs
        SELECT COALESCE(SUM(s."UnitPrice" * su."Amount"), 0)
        INTO service_cost
        FROM "ServiceUsage" su
        JOIN "Service" s ON su."ServiceID" = s."ServiceID"
        JOIN "BookingDetail" bd ON su."BookingDetailID" = bd."BookingDetailID"
        WHERE bd."BookingID" = booking_id;
  
        -- Calculate total
        total_cost := room_cost + service_cost;
  
        -- Update booking total amount
        UPDATE "Booking"
        SET "TotalAmount" = total_cost
        WHERE "BookingID" = booking_id;
  
        RETURN total_cost;
      END;
      $$ LANGUAGE plpgsql;
    `);
  };
  
  exports.down = function(knex) {
    return knex.schema.raw(`
      DROP FUNCTION IF EXISTS calculate_booking_total_cost;
    `);
  };
  