require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const { MongoClient } = require("mongodb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//test mongodb connection
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    // You can now perform operations on the database
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});


app.post("/api/shorturl", function (req, res) {

  
  res.json({ greeting: "hello API" });
});
