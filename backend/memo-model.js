const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const memoSchema = new Schema(
  {
    // id: { type: Number, required: true },
    title: { type: String, required: true },
    detail: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const MemoData = mongoose.model("Memo", memoSchema);

module.exports = MemoData;
