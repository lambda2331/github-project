import express from "express";
import cors from "cors";
import RedisServer from "redis-server";

import AppoloService from "./apollo-service.js";

const PORT = process.env.API_PORT || 5050;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const app = express();
const apolloService = new AppoloService();

const redis = new RedisServer(REDIS_PORT);

app.use(express.json());

// Init app
apolloService.init();

app.use("/graphql", cors(), express.json(), async (req, res) => {
  try {
    const result = await apolloService.executeQeury(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

redis.open((error) => {
  if (!error) {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
    return;
  }

  console.log("ERROR during run Redis Server!");
});

process.on("SIGINT", function () {
  redis.close();
  process.exit();
});
