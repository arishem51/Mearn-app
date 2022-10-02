const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./Routes/auth");
const postRouter = require("./Routes/post");

require("dotenv").config();

const app = express();

const connectDB = async () => {
  try {
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-app.llzcqrj.mongodb.net/?retryWrites=true&w=majority`
      //   {
      //     useCreateIndex: true,
      //     useNewUrlParser: true,
      //     useUnifiedTopologu: true,
      //     useFindAndModify: true,
      //   }
    );
    console.log("Connect DB successful");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();

const PORT = 5000;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

app.listen(PORT, () => console.log("Server is running on port" + PORT));
