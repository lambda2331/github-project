import express from "express";
import cors from "cors";

import AppoloService from "./apollo-service.js";

const PORT = process.env.API_PORT || 5050;
const app = express();
const apolloService = new AppoloService();

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

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
