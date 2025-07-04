import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;

export const UserSchema = new Schema(
  {
    username: String,
    password: String,
    role: {
        type: String,
        enum: ["admin", "manager", "customer"],
        default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;