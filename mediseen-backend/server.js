require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const userRoutes = require("./Routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await db.sync(); // Syncs database
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database sync failed:", error);
  }
});
