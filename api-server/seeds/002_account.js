exports.seed = async function (knex) {
  await knex("Account").del();
  await knex("Account").insert([
    {
      FirstName: "Thạch",
      MiddleName: "Ngọc",
      LastName: "Nguyễn",
      Username: "admin",
      Status: "Active",
      DateOfBirth: "1980-01-01",
      Gender: "M",
      Email: "admin@example.com",
      Phone: "0901234567",
      Address: "Hà Nội",
      IDNumber: "ID001",
      Role: "admin"
    },
    {
      FirstName: "Quốc",
      MiddleName: "Lê",
      LastName: "Trần",
      Username: "manager01",
      Status: "Active",
      DateOfBirth: "1985-05-10",
      Gender: "M",
      Email: "manager01@example.com",
      Phone: "0912345678",
      Address: "Hồ Chí Minh",
      IDNumber: "ID002",
      Role: "manager"
    },
    {
      FirstName: "Nhung",
      MiddleName: "Thị",
      LastName: "Phạm",
      Username: "employee01",
      Status: "Active",
      DateOfBirth: "1990-03-15",
      Gender: "F",
      Email: "employee01@example.com",
      Phone: "0923456789",
      Address: "Đà Nẵng",
      IDNumber: "ID003",
      Role: "employee"
    },
    {
      FirstName: "Khải",
      MiddleName: "Quang",
      LastName: "Trần",
      Username: "employee02",
      Status: "Active",
      DateOfBirth: "1992-09-21",
      Gender: "M",
      Email: "employee02@example.com",
      Phone: "0934567890",
      Address: "Cần Thơ",
      IDNumber: "ID004",
      Role: "employee"
    },
    {
      FirstName: "Hoa",
      MiddleName: "Thị",
      LastName: "Nguyễn",
      Username: "customer01",
      Status: "Active",
      DateOfBirth: "1995-08-12",
      Gender: "F",
      Email: "customer01@example.com",
      Phone: "0945678901",
      Address: "Hải Phòng",
      IDNumber: "ID005",
      Role: "customer"
    },
    {
      FirstName: "Hùng",
      MiddleName: "Văn",
      LastName: "Đặng",
      Username: "customer02",
      Status: "Active",
      DateOfBirth: "1996-12-05",
      Gender: "M",
      Email: "customer02@example.com",
      Phone: "0956789012",
      Address: "Đà Nẵng",
      IDNumber: "ID006",
      Role: "customer"
    },
    {
      FirstName: "Hà",
      MiddleName: "Thanh",
      LastName: "Lý",
      Username: "customer03",
      Status: "Active",
      DateOfBirth: "1997-07-18",
      Gender: "F",
      Email: "customer03@example.com",
      Phone: "0967890123",
      Address: "Hồ Chí Minh",
      IDNumber: "ID007",
      Role: "customer"
    }
  ]);
};
