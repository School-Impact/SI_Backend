const { PubSub } = require("@google-cloud/pubsub");
const pubsub = new PubSub();

const loggingTopic = pubsub.topic(process.env.TOPIC_NAME);

// Fungsi untuk mempublikasikan log
const publishLog = async (message) => {
  try {
    const dataBuffer = Buffer.from(JSON.stringify(message));
    await loggingTopic.publishMessage({ data: dataBuffer });
    console.log("Log published to Pub/Sub:", message);
  } catch (error) {
    console.error("Failed to publish log to Pub/Sub:", error.message);
  }
};

// Middleware untuk log request dan response
const logRequests = (req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${
    req.originalUrl
  }`;

  // Mempublikasikan log request awal
  publishLog({ logMessage, status: "received" });

  // Mempublikasikan log setelah response selesai
  res.on("finish", () => {
    publishLog({
      logMessage,
      status: "finished",
      statusCode: res.statusCode,
    });
  });

  next();
};

module.exports = logRequests;
