const router = require("express").Router();
let MemoData = require("./memo-model.js");

router.route("/").get((req, res) => {
  MemoData.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/fetchdata").get((req, res) => {
  MemoData.find({ title: req.query.title })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const title = req.body.title;
  const info = req.body.info;
  const newMemoData = new MemoData({ title, info });

  newMemoData
    .save()
    .then(() => res.json("Data Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
