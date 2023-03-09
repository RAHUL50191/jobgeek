const mongoose = require("mongoose");
//mongoose -> schema ->model->data (post)->save() done database me gaya

const orgSchema = mongoose.Schema({
  org_name: { type: String, require: true, unique: true },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },

  token: { type: String, require: true },
  details: {
    address: {
      type: String,
      require: true,
      default: "Postal address used by locals",
    },
    contactNo: { type: String, require: true, default: "1234567890" },

    location: {
      type: { type: String, require: true },
      coordinates: { type: [Number], default: [-23.4194, 37.7749] },
    },
  },
  appliedCandidates: [
    { type: String, require: true, default: "no offers yet" },
  ],
});

orgSchema.index({ location: "2dsphere" });
const orgModel = mongoose.model("organization", orgSchema);
module.exports = orgModel;
