const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const wheelDataSchema = new Schema(
  {
    term: { type: String, required: true },
    data: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const WheelData = mongoose.model("Neuromancer", wheelDataSchema);

module.exports = WheelData;
