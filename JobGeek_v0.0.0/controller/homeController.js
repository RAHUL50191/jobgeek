const job = require("../model/jobModel");
const Org = require("../model/orgModel");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

const hometemp = fs.readFileSync(`${__dirname}/../public/home.html`);

exports.getIndex = async (req, res) => {
  const jobData = await job.aggregate([{ $sample: { size: 3 } }]);
  res.render("homepage", { items: jobData });
};

exports.getInterview = async (req, res) => {
  try {
    const data = req.query;
    const mentor = req.query.mentor;
    const email = req.query.email;
    ////console.log(data);
    const orgdata = await Org.findOne({ email: email });
    if (orgdata) {
      res.render("interviewpage", { mentor: mentor });
    } else {
      res.status(401).send("Org not found");
    }
  } catch (err) {
    console.log(err);
  }
};
