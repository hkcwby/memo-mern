const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const memoSchema = new Schema(
  {
    title: { type: String, required: true },
    info: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const MemoData = mongoose.model("Memos", memoSchema);

module.exports = MemoData;
