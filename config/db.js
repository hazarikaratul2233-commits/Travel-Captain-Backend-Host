import dynamoose from "dynamoose";

// IMPORTANT: do NOT call dynamoose.aws.ddb.local() unless using DynamoDB Local

const connectDB = async () => {
  try {
    console.log("Connecting to DynamoDB...");

    if (!process.env.AWS_REGION) throw new Error("Missing AWS_REGION in .env");
    if (!process.env.AWS_ACCESS_KEY_ID) throw new Error("Missing AWS_ACCESS_KEY_ID in .env");
    if (!process.env.AWS_SECRET_ACCESS_KEY) throw new Error("Missing AWS_SECRET_ACCESS_KEY in .env");

    // ✅ Correct Dynamoose v4+ way:
    // create DynamoDB instance using dynamoose.aws.ddb.DynamoDB
    const ddb = new dynamoose.aws.ddb.DynamoDB({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    // ✅ Set it for Dynamoose
    dynamoose.aws.ddb.set(ddb);

    console.log(`DynamoDB Connected ✅ (region: ${process.env.AWS_REGION})`);
  } catch (error) {
    console.error("DynamoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
