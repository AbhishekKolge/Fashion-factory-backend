//environment variables
require("dotenv").config();
//catch all async errors
require("express-async-errors");

//third party packages
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

//upload file configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//custom middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const returnReasonRouter = require("./routes/returnResultRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const sizeRouter = require("./routes/sizeRoutes");
const couponRouter = require("./routes/couponRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");

//initialize express app
const app = express();

//security middleware
//helps with ips behind proxies
app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );
app.use(cors());
app.use(helmet());
app.use(xss());

app.use(express.json());
//logging
app.use(morgan("tiny"));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/return-reason", returnReasonRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/size", sizeRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/review", reviewRouter);

//custom middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = () => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
};

//initialize server
start();
