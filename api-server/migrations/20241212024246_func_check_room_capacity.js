exports.up = function(knex) {
    return knex.schema.raw(`
      CREATE OR REPLACE FUNCTION check_room_capacity(
        p_room_id INTEGER,
        p_booking_id INTEGER
      ) RETURNS BOOLEAN AS $$
      DECLARE
        guest_count INTEGER;
        max_occupancy INTEGER;
      BEGIN
        -- Get room type max occupancy
        SELECT rt."MaxOccupancy"
        INTO max_occupancy
        FROM "Room" r
        JOIN "RoomType" rt ON r."RoomTypeID" = rt."RoomTypeID"
        WHERE r."RoomID" = p_room_id;
  
        -- Count guests assigned to this room
        SELECT COUNT(*)
        INTO guest_count
        FROM "BookingDetail"
        WHERE "BookingID" = p_booking_id
        AND "RoomID" = p_room_id;
  
        -- Return true if within capacity, false if exceeds
        RETURN guest_count <= max_occupancy;
      END;
      $$ LANGUAGE plpgsql;
  
      -- Add trigger to enforce capacity check
      CREATE OR REPLACE FUNCTION enforce_room_capacity()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NOT check_room_capacity(NEW."RoomID", NEW."BookingID") THEN
          RAISE EXCEPTION 'Room capacity exceeded. Maximum occupancy is %', 
            (SELECT rt."MaxOccupancy" 
             FROM "Room" r 
             JOIN "RoomType" rt ON r."RoomTypeID" = rt."RoomTypeID" 
             WHERE r."RoomID" = NEW."RoomID");
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
  
      CREATE TRIGGER check_room_capacity_trigger
      BEFORE INSERT OR UPDATE ON "BookingDetail"
      FOR EACH ROW
      EXECUTE FUNCTION enforce_room_capacity();
    `);
  };
  
  exports.down = function(knex) {
    return knex.schema.raw(`
      DROP TRIGGER IF EXISTS check_room_capacity_trigger ON "BookingDetail";
      DROP FUNCTION IF EXISTS enforce_room_capacity;
      DROP FUNCTION IF EXISTS check_room_capacity;
    `);
  };
  