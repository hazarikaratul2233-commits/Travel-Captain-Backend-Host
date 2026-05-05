import dynamoose from "dynamoose";
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = "TravelCaptain_Logs";

const LogsSchema = new dynamoose.Schema(
  {
    _id: { type: String, hashKey: true, default: uuidv4 },
    createdAt: { type: String, rangeKey: true },
    userId: {
      type: String,
      index: {
        name: "userIdCreatedAtIndex",
        global: true,
        rangeKey: "createdAt"
      }
    },
    location: { type: String, required: true },
    type: { type: String, enum: ["Login", "Logout", "Visit"], required: true },
    agencyId: { type: String },
    remarks: { type: String },
    pic: { type: String }
  },
);

const Logs = dynamoose.model(
  TABLE_NAME,
  LogsSchema,
  {
    create: true,
    waitForActive: true
  }
);

export default Logs;