import dotenv from "dotenv";
dotenv.config();
import express, { ErrorRequestHandler } from "express";
import path from "path";
import { sequelize } from "./config/db";
import cors from "cors";
import bodyparser from "body-parser";
import http from "http";
import initCronJobs from "./helpers/cron"
// user

import userRouter from "./routes/user";
// admin
import adminRouter from "./routes/admin";
// provider
import providerRouter from "./routes/provider";

import { router as chatRouter } from "./routes/chat/chat.route";
import { initializeSocket } from "./helpers/socket.io";
import { initEvents } from "./events";

const PORT = process.env.SERVERPORT || 8080;

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);
// initialize socket events
initEvents(io);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use("/images", express.static(path.join(__dirname, "public/upload")));

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/provider", providerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chats", chatRouter);



server.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  sequelize.databaseVersion().then((databaseVersion) => {
    console.log(databaseVersion);
  });
  sequelize
    .authenticate()
    .then(async () => {
      console.log("Connection has been established successfully.");
      try {
        await sequelize
          .sync({ alter: true })
          .then(() => {
            initCronJobs();
            console.log("Re-sync successfully!");
          })
          .catch((error) => {
            console.error("Unable to Re-sync : ", error);
          });
      } catch (error) { }
    })
    .catch((error: any) => {
      console.error("Unable to connect to the database: ", error);
    });
})
