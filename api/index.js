import express from "express";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser"; //initilaize it in the middleware section

//configure env
dotenv.config();

//database config->
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());

app.use(cookieParser()); //to access cookie data in the project.

//routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

//Middleware for 500 error ->
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.log(err);
  return res.send(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
