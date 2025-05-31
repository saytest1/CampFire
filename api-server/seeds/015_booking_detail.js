exports.seed = async function (knex) {
  await knex("BookingDetail").del();
  await knex("BookingDetail").insert([
    {
      BookingID: 1,
      RoomID: 1, // Room 101
      GuestID: 1 // Guest 1 for Customer 1
    },
    {
      BookingID: 1,
      RoomID: 2, // Room 102
      GuestID: 2 // Guest 2 for Customer 1
    },
    {
      BookingID: 2,
      RoomID: 3, // Room 201
      GuestID: 3 // Guest 3 for Customer 2
    },
    {
      BookingID: 2,
      RoomID: 4, // Room 202
      GuestID: 4 // Guest 4 for Customer 2
    },
    {
      BookingID: 3,
      RoomID: 5, // Room 301
      GuestID: 5 // Guest 5 for Customer 3
    },
    {
      BookingID: 3,
      RoomID: 6, // Room 302
      GuestID: 6 // Guest 6 for Customer 3
    }
  ]);
};
