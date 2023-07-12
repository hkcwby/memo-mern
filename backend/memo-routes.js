const router = require("express").Router();
let MemoData = require("./memo-model.js");

//Create

router.route("/add").post((req, res) => {
  // const id = req.body.id;
  const title = req.body.title;
  const detail = req.body.detail;
  // const newMemoData = new MemoData({ id, title, detail });
  const newMemoData = new MemoData({ title, detail });

  newMemoData
    .save()
    .then(() => res.json("Data Added!"))
    .then(console.log("successful addition"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Read

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

//Update

router.route("/update/:_id").put((req, res) => {
  MemoData.findOneAndUpdate(
    { _id: req.params._id },
    { title: req.body.title, detail: req.body.detail },
    {
      new: true,
    }
  ).then((MemoData) =>
    MemoData.save()
      .then(() => res.json("updated"))
      .then(console.log("successful update"))
      .catch((err) => res.status(400).json("Error: " + err))
  );
});

//Delete

router.route("/:id").delete((req, res) => {
  console.log(req.params.id);
  MemoData.deleteOne({ _id: req.params.id })
    .then(() => res.json("deleted"))
    .then(console.log("successful delete"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
