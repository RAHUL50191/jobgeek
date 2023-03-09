const mongoose = require("mongoose");
//mongoose -> schema ->model->data (post)->save() done database me gaya
const applicationSchema = mongoose.Schema({
  application_title: { type: String, require: true },
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
  // details: {
  //   fullname: {
  //     type: String,
  //     require: true,
  //     default: "YourName,FatherName,LastName",
  //   },
  //   graduation: {
  //     type: String,
  //     require: true,
  //     default: "College:,school:,marks etc",
  //   },
  //   skills: {
  //     type: String,
  //     require: true,
  //     default: "EllobrateYourLearnedSkills",
  //   },
  //   workExp: {
  //     type: String,
  //     require: true,
  //     default: "ExpirenceInCompany_nameWithJobPositionAndYears",
  //   },
  //   achivments: { type: String, require: true, default: "Awards,etc" },
  //   address: {
  //     type: String,
  //     require: true,
  //     default: "Postal address used by locals",
  //   },
  //   DOB: { type: Date, require: true, default: "01:01:2000" },
  //   contactNo: { type: String, require: true, default: "1234567890" },
  //   links: [
  //     { type: String, default: "enter links seperated by ,upto 5" },
  //     { type: String, default: "none" },
  //     { type: String, default: "none" },
  //     { type: String, default: "none" },
  //     { type: String, default: "none" },
  //   ],
  //   certificates: [
  //     { data: Buffer, contentType: String },
  //     { data: Buffer, contentType: String },
  //     { data: Buffer, contentType: String },
  //     { data: Buffer, contentType: String },
  //     { data: Buffer, contentType: String },
  //   ],
  //   resume: [
  //     { data: Buffer, contentType: String },
  //     { data: Buffer, contentType: String },
  //     { data: Buffer, contentType: String },
  //     { data: Buffer, contentType: String },
  //   ],
  //   location: {
  //     type: { type: String, require: true },
  //     coordinates: { type: [Number], default: [-122.4194, 37.7749] },
  //   },
  // },
});

applicationSchema.index({ location: "2dsphere" });
const application = mongoose.model("application_list", applicationSchema);
module.exports = application;
