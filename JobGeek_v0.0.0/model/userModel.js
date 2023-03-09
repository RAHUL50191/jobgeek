const mongoose = require("mongoose");
//mongoose -> schema ->model->data (post)->save() done database me gaya

const userSchema = mongoose.Schema({
  user_name: { type: String, require: true, unique: true },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },

  token: { type: String, require: true },

  preference: {
    jbNav: { type: Boolean, default: true },
    hellotxt: { type: Boolean, default: true },
    uNav: { type: Boolean, default: false },
    prevTab: { type: Boolean, default: true },
  },
  details: {
    fullname: {
      type: String,
      require: true,
      default: "YourName,FatherName,LastName",
    },
    graduation: {
      type: String,
      require: true,
      default: "College:,school:,marks etc",
    },
    skills: {
      type: String,
      require: true,
      default: "EllobrateYourLearnedSkills",
    },
    workExp: {
      type: String,
      require: true,
      default: "ExpirenceInCompany_nameWithJobPositionAndYears",
    },
    achivments: { type: String, require: true, default: "Awards,etc" },
    address: {
      type: String,
      require: true,
      default: "Postal address used by locals",
    },
    DOB: { type: Date, require: true, default: "01:01:2000" },
    contactNo: { type: String, require: true, default: "1234567890" },
    links: [
      { type: String, default: "enter links seperated by ,upto 5" },
      { type: String, default: "none" },
      { type: String, default: "none" },
      { type: String, default: "none" },
      { type: String, default: "none" },
    ],
    certificates: [
      { data: Buffer, contentType: String },
      { data: Buffer, contentType: String },
      { data: Buffer, contentType: String },
      { data: Buffer, contentType: String },
      { data: Buffer, contentType: String },
    ],
    resume: [
      { data: Buffer, contentType: String },
      { data: Buffer, contentType: String },
      { data: Buffer, contentType: String },
      { data: Buffer, contentType: String },
    ],
    location: {
      type: { type: String, require: true },
      coordinates: { type: [Number], default: [-122.4194, 37.7749] },
    },
  },
  //called by job by org(job offers)
  jobOffers: [{ type: String, default: "no offers yet" }],
});

userSchema.index({ location: "2dsphere" });
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
