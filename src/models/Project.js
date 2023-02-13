const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
  isCompleted: {
    type: Boolean,
    default: false,
  },
  project_employee: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

mongoose.models = {};
export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
