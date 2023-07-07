const router = require("express").Router();
let MemoData = require("./memo-model.js");

router.route("/").get((req, res) => {
  MemoData.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

//presently unrequired fetch request route based on _id
// router.route("/fetchdata").get((req, res) => {
//   MemoData.find({ _id: req.query._id })
//     .then((data) => res.json(data))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

router.route("/:id").delete((req, res) => {
  console.log(req.params.id);
  MemoData.deleteOne({ _id: req.params.id })
    .then(() => res.json("deleted"))
    .then(console.log("successful delete"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").put((req, res) => {
  console.log(req.params.id, req.body);
  MemoData.findOneAndUpdate(
    { _id: req.params.id },
    { title: req.body.title, detail: req.body.detail },
    {
      new: false,
    }
  )
    .then((res) => console.log("status", res))
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
