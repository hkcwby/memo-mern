const router = require("express").Router();
let WheelData = require("./data-wheel-model.js");

router.route("/").get((req, res) => {
  WheelData.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/fetchdata").get((req, res) => {
  WheelData.find({ term: req.query.term })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const term = req.body.term;
  const data = req.body.data;
  const newWheelData = new WheelData({ term, data });

  newWheelData
    .save()
    .then(() => res.json("Data Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
