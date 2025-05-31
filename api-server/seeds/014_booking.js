exports.seed = async function (knex) {
  await knex("Booking").del();
  await knex("Booking").insert([
    {
      CustomerID: 1,
      EmployeeID: 2, // employee01
      BookingDate: "2024-12-01",
      CheckInDate: "2024-12-10",
      CheckOutDate: "2024-12-15",
      TotalAmount: 500.0,
      Status: "Confirmed",
      PaymentStatus: "Paid"
    },
    {
      CustomerID: 2,
      EmployeeID: 3, // employee02
      BookingDate: "2024-12-05",
      CheckInDate: "2024-12-12",
      CheckOutDate: "2024-12-18",
      TotalAmount: 600.0,
      Status: "Confirmed",
      PaymentStatus: "Unpaid"
    },
    {
      CustomerID: 3,
      EmployeeID: 2, // employee01
      BookingDate: "2024-12-07",
      CheckInDate: "2024-12-14",
      CheckOutDate: "2024-12-20",
      TotalAmount: 750.0,
      Status: "Confirmed",
      PaymentStatus: "Paid"
    }
  ]);
};
