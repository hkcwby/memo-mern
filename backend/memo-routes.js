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

router.route("/:id").delete((req, res) => {
  MemoData.findOneAndDelete({ id: req.params.id })
    .then(console.log("successful delete"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").put((req, res) => {
  MemoData.findOneAndUpdate({ id: req.params.id }, { title: req.body.title })
    .then((res) => console.log("status", res))
    .catch((err) => res.status(400).json("Error: " + err));
});
// MemoData.find(req.params.id)
//   .then((memo) => {
//     memo.title = req.body.title;
//     memo.detail = req.body.detail;
//     memo.save();
//   })
//   .then(console.log("successful update"))
//   .catch((err) => res.status(400).json("Error: " + err));
// });

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
