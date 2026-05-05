import dynamoose from "dynamoose";
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = "TravelCaptain_Users";

const UserSchema = new dynamoose.Schema(
  {
    _id: { type: String, hashKey: true, default: uuidv4 },
    staffId: { type: String, required: true },
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    doj: { type: Date,required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },

    designation: { type: String, required: true },
    online: { type: Boolean, require: true },

    role: { type: String, required: true },

    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = dynamoose.model(
  TABLE_NAME,
  UserSchema,
  {
    create: true,
    waitForActive: true
  }
);

export default User;