exports.seed = async function (knex) {
  await knex("RoomTypeImages").del();
  await knex("RoomTypeImages").insert([
    { RoomTypeID: 1, ImagePath: "single_room.png" },
    { RoomTypeID: 1, ImagePath: "single_room_1.png" },
    { RoomTypeID: 1, ImagePath: "single_room_2.png" },
    { RoomTypeID: 2, ImagePath: "double_room.png" },
    { RoomTypeID: 2, ImagePath: "double_room_1.png" },
    { RoomTypeID: 2, ImagePath: "double_room_2.png" },
    { RoomTypeID: 3, ImagePath: "twin_room.png" },
    { RoomTypeID: 3, ImagePath: "twin_room_1.png" },
    { RoomTypeID: 3, ImagePath: "twin_room_2.png" },
    { RoomTypeID: 4, ImagePath: "king_room.png" },
    { RoomTypeID: 4, ImagePath: "king_room_1.png" },
    { RoomTypeID: 4, ImagePath: "king_room_2.png" },
    { RoomTypeID: 5, ImagePath: "family_room.png" },
    { RoomTypeID: 5, ImagePath: "family_room_1.png" },
    { RoomTypeID: 5, ImagePath: "family_room_2.png" },
    { RoomTypeID: 6, ImagePath: "deluxe_room.png" },
    { RoomTypeID: 6, ImagePath: "deluxe_room_1.png" },
    { RoomTypeID: 6, ImagePath: "deluxe_room_2.png" }
  ]);
};
