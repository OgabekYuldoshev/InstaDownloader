
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const axios = require("axios");
const cheerio = require("cheerio");
app.use(express.static('public'))

const getVideo = async url => {
  const html = await axios.get(url);
  const $ = cheerio.load(html.data);
  const videoString = $("meta[property='og:video']").attr("content");
  return videoString;
};

app.post("/api/download", async (req, res) => {

  try {
    const videoLink = await getVideo(req.body.url);
    if (videoLink !== undefined) {
      res.json({ downloadLink: videoLink });
    } else {
      res.json({ error: "The link you have entered is invalid. " });
    }
  } catch (err) {
    res.json({
      error: "There is a problem with the link you have provided."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
