const router = require("express").Router();
let MemoData = require("./memo-model.js");

router.route("/").get((req, res) => {
  MemoData.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/fetchdata").get((req, res) => {
  MemoData.find({ id: req.query.id })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const detail = req.body.detail;
  const newMemoData = new MemoData({ id, title, detail });

  newMemoData
    .save()
    .then(() => res.json("Data Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
