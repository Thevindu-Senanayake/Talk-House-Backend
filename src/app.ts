import express from "express";

// import all routes
import auth from "./routes/auth";

// middleware imports
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errors";

const app = express();

var corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(catchAsyncErrors);

app.use("/api/v1/auth", auth);

// Middleware to handle errors
app.use(errorMiddleware);

export default app;