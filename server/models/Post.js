const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["To Do", "Doing", "Done"],
  },
  user: {
    type: Schema.Types.ObjectId,
    refId: "users",
  },
});

module.exports = mongoose.model("posts", PostSchema);
