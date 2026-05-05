import dynamoose from "dynamoose";
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = "TravelCaptain_Agency";

const AgencySchema = new dynamoose.Schema(
  {
    _id: { type: String, hashKey: true, default: uuidv4 },
    agencyName: { type: String, required: true },
    agentName: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    location: { type: String },
    status: { type: String, enum: ["Pending", "Requested", "Confirmed"], required: true, default: "Pending" },
    panUrl: { type: String },
    adharFrontUrl: { type: String },
    adharBackUrl: { type: String }
  },
  { timestamps: true }
);

const Agency = dynamoose.model(
  TABLE_NAME,
  AgencySchema,
  {
    create: true,
    waitForActive: true
  }
);

export default Agency;