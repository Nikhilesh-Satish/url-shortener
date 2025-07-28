const Url = require("../models/url");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const allUrls = await Url.find({});
  return res.render("home", {
    urls: allUrls,
  });
});

module.exports = router;
