const mongoose = require("mongoose");
//mongoose -> schema ->model->data (post)->save() done database me gaya
const jobSchema = mongoose.Schema({
  job_title: { type: String, require: true },
  email: { type: String, require: true },
  imageUrl: {
    data: Buffer,
    contentType: String,
  },
  desc: { type: String, require: true },
  salary: { type: Number, require: true },
  location: {
    type: { type: String, require: true },
    coordinates: { type: [Number], default: [-122.4194, 37.7749] },
  },
});

jobSchema.index({ location: "2dsphere" });
const job = mongoose.model("job_list", jobSchema);
module.exports = job;
