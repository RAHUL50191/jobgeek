const job = require("../model/jobModel");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

const hometemp = fs.readFileSync(`${__dirname}/../public/home.html`);

exports.getIndex = async (req, res) => {
  const jobData = await job.aggregate([{ $sample: { size: 3 } }]);
  res.render("homepage", { items: jobData });
};
