require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const urlparser = require("url");
const { MongoClient } = require("mongodb");
//add middleware to parse the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = client.db("urlshortner");
const urls = db.collection("urls");

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


app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  const dnslook = dns.lookup(
    urlparser.parse(url).hostname,
    async (err, address) => {
      if (!address) {
        res.json({ error: "invalid url" });
      } else {
        const urlCount = await urls.countDocuments();
        urlDoc = {
          url: url,
          short_url: urlCount,
        };
        const result = await urls.insertOne(urlDoc);
        console.log(result);
        res.json({ original_url: urlDoc.url, short_url: urlCount });
      }
    }
  );
  
});


app.get("/api/short_url/:short_url", async function (req, res) {
  const shorturl=req.params.short_url;
  const urlDoc =  await urls.findOne({short_url: +shorturl});
  res.redirect(urlDoc.url);
  console.log("you have been redirected to the original url");
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});


