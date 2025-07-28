const express = require("express");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const connectToMongoDB = require("./connect");
const staticRoute = require("./routes/staticRouter");
const path = require("path");
const cookieParser = require("cookie-parser");
const { restrictToLoggedInUserOnly, checkAuth } = require("./middleware/auth");
const app = express();
const PORT = 8001;

const userRoute = require("./routes/user");

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Connected to MongoDB")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);

app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timeStamp: Date.now(),
        },
      },
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
