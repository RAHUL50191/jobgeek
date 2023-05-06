const org = require("../model/orgModel");
const application = require("../model/applicationModel");
const user = require("../model/userModel");
const job = require("../model/jobModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const randStr = require("randomstring");

const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { request } = require("http");

const postjobImg = multer({}).single("image");

const avatarUpload = multer({}).single("avatar");
//resume and certificates multiple files without storing it

const RCfileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    // if uploading resume
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else {
    // else uploading image
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword"
    ) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};
const resumeCertiUpload = multer({
  fileFilter: RCfileFilter,
}).fields([
  { name: "certificates", maxCount: 5 },
  { name: "resume", maxCount: 4 },
]);
//resume and avatar with storage

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    // if uploading resume
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else {
    // else uploading image
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};
const upload = multer({
  limits: {
    fileSize: "2mb",
  },
  fileFilter: fileFilter,
}).fields([
  {
    name: "resume",
    maxCount: 1,
  },
  {
    name: "avatar",
    maxCount: 1,
  },
]);

//2)FUNCTIONS
const sendResetEmail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { org: config.emailorg, pass: config.emailPasswrd },
    });
    const mailOptions = {
      from: config.emailorg,
      to: email,
      subject: "You have applied for reset email in job geek website",
      html:
        "<p>Hi " +
        name +
        ",Please copy this link for reset email:<a href='https://jobgeek.onrender.com/org/reset_email?token=" +
        token +
        "'>reset link</a></p>",
    };
    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("Info: " + info);
      }
    });
  } catch (err) {
    res.status(404).send(err.message);
  }
};
const sendResetPasswordEmail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { org: config.emailorg, pass: config.emailPasswrd },
    });
    const mailOptions = {
      from: config.emailorg,
      to: email,
      subject: "You have applied for reset password in job geek website",
      html:
        "<p>Hi " +
        name +
        ",Please copy this link for reset password:<a href='https://jobgeek.onrender.com/org/reset_password?token=" +
        token +
        "'>reset link</a></p>",
    };
    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("Info: " + info);
      }
    });
  } catch (err) {
    res.status(404).send(err.message);
  }
};
const create_token = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.secret_jwt);
    return token;
  } catch (err) {
    console.log(err.message);
  }
};

//home
exports.orgHome = async (req, res) => {
  try {
    const token = req.query.token;
    const orgdata = await org.findOne({ token: token });
    const latitude = orgdata.details.location.coordinates[0];
    const longitude = orgdata.details.location.coordinates[1];
    const nearby = await application
      .find({
        location: {
          $geoWithin: { $centerSphere: [[longitude, latitude], 3963.2] },
        },
      })
      .catch((err) => console.log(err));
    Promise.all(
      orgdata.appliedCandidates.map(async (el) => {
        return await application.find({ email: el }).exec();
      })
    )
      .then((apc) => {
        // Do something with the array of job objects
        //console.log(apc);
        if (orgdata) {
          res.render("orgHome", {
            org: orgdata,
            nearby: nearby,
            applications: apc,
          });
          // res.status(200).send(
          //   nearby.forEach(function (el) {
          //     //console.log(el.application_title);
          //   })
          //);
        } else {
          res.send("invalid link");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err.message);
  }
};

// login page
exports.loginPage = async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
};
exports.loginAPI = async (req, res) => {
  try {
    const password = req.body.password;
    const orgdata = await org.findOne({
      $or: [{ org_name: req.body.org_name }, { email: req.body.org_name }],
    });
    if (orgdata) {
      const passwordValid = await bcryptjs.compare(password, orgdata.password);
      if (passwordValid) {
        const tokenData = await create_token(orgdata._id);
        const orgData = await org.findOneAndUpdate({ _id: orgdata._id }, { $set: { token: tokenData } }, { new: true });

        // const orgData = {
        //   _id: orgdata._id,
        //   name: orgdata.org_name,
        //   email: orgdata.email,
        //   address: orgdata.address,

        //   // avatar: orgdata.avatar,
        //   // resume: orgdata.resume,
        //   token: tokenData,
        // };
        res.status(200).redirect(`https://jobgeek.onrender.com/org/home?token=${orgData.token}`);
        // return res.status(200).send(orgData);

        // res.status(200).render("orgDashboard", { items: orgdata });
      } else {
        return res.status(401).send({ msg: "Invalid credencial" });
      }
    } else {
      res.status(401).send("org not found");
    }
  } catch (err) {
    console.log(err);
  }
};
exports.forgotPasswordPage = async (req, res) => {
  try {
    res.render("orgForgotPasswordPage");
  } catch (err) {
    console.log(err);
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const orgdata = await org.findOne({
      email: email,
    });

    if (orgdata) {
      // const newPassword = await bcryptjs.hash(req.body.password, 10);
      const Rstr = randStr.generate();
      await org.findOneAndUpdate({ _id: orgdata._id }, { $set: { token: Rstr } });
      sendResetPasswordEmail(orgdata.org_name, orgdata.email, Rstr);
      res.status(200).send("check your email");
    } else {
      res.status(401).send("email not found");
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: err });
  }
};
//reset email
exports.resetEmail = async (req, res) => {
  try {
    const token = req.query.token;
    // const avatar=req.file
    const orgdata = await org.findOne({
      token: token,
    });
    if (orgdata) {
      // const newPassword = await bcryptjs.hash(req.body.password, 10);
      const Rstr = randStr.generate();
      await org.findOneAndUpdate({ _id: orgdata._id }, { $set: { token: Rstr } });
      sendResetEmail(orgdata.org_name, orgdata.email, Rstr);
      res.status(200).send("check your email");
    } else {
      res.status(401).send("email not found");
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: err });
  }
};
exports.resetEmailPage = async (req, res) => {
  try {
    res.render("orgResetEmailPage", { token: req.query.token });
  } catch (err) {
    console.log(err);
  }
};
exports.updateEmail = async (req, res) => {
  try {
    const token = req.query.token;

    const orgdata = await org.findOne({
      token: token,
    });
    if (orgdata) {
      await org.findOneAndUpdate({ _id: orgdata._id }, { $set: { email: req.body.email } });

      res.status(200).redirect("/org/login");
    } else {
      res.send("invalid token");
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: err });
  }
};
exports.updateAvatar = async (req, res) => {
  avatarUpload(req, res, async (err) => {
    try {
      const token = req.query.token;
      //console.log(req.file, req.body);
      const orgdata = await org.findOne({
        token: token,
      });
      if (orgdata) {
        await org.findOneAndUpdate(
          { _id: orgdata._id },
          {
            $set: {
              avatar: {
                data: req.file.buffer,
                contentType: "image/jpeg",
              },
            },
          }
        );

        res.status(200).redirect("back");
      } else {
        res.send("invalid token");
      }
    } catch (err) {
      console.log(err);
      res.status(404).send({ msg: err });
    }
  });
};
//resetpassword
exports.resetPasswordPage = async (req, res) => {
  try {
    res.render("orgResetPasswordPage", { token: req.query.token });
  } catch (err) {
    console.log(err);
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    //console.log("inside post" + token);
    const tokendata = await org.findOne({
      token: token,
    });
    if (tokendata) {
      const newPassword = await bcryptjs.hash(req.body.password, 10);

      await org.findOneAndUpdate({ _id: tokendata._id }, { $set: { password: newPassword, token: "" } }, { new: true });
      res.status(200).redirect("https://jobgeek.onrender.com/org/login");
      // res.status(200).send("Password has been changed" +"id:" +tokendata._id +"token:" +tokendata.token);
    } else {
      res.status(401).send("invalid token");
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: err.message });
  }
};
//details
exports.setDetails = async (req, res) => {
  resumeCertiUpload(req, res, async (err) => {
    try {
      const token = req.query.token;

      const orgdata = await org.findOne({
        token: token,
      });
      if (orgdata) {
        const orgData = await org.findOneAndUpdate(
          { _id: orgdata._id },
          {
            $set: {
              details: {
                address: req.body.address,

                contactNo: req.body.contactNo,

                location: {
                  type: "Point",
                  coordinates: [req.body.latitude, req.body.longitude],
                },
              },
            },
          }
        );

        res.status(200).redirect("back");
      } else {
        res.status(200).send("invalid token");
      }
    } catch (err) {
      res.status(404).send(err.message);
    }
  });
};
//postjob
exports.postImage = async (req, res) => {
  postjobImg(req, res, (err) => {
    try {
      //console.log(req.body);
      const newImage = new job({
        job_title: req.body.job_title,
        desc: req.body.desc,
        salary: req.body.salary,
        email: req.body.joemail,
        //this name will be  single("name:image");
        imageUrl: {
          data: req.file.buffer,
        },
        location: {
          type: "Point",
          coordinates: [req.body.latitude, req.body.longitude],
        },
      });

      newImage.save().then(() => res.redirect("/search-job/search"));
    } catch (err) {
      console.log(err.message);
    }
  });
};
//offerjob, org offers user
exports.offerJob = async (req, res) => {
  try {
    const token = req.query.token;
    const orgdata = await org.findOne({ email: req.body.oemail });
    const userdata = await user.findOneAndUpdate(
      { email: req.body.uemail },
      {
        $push: {
          jobOffers: req.body.oemail,
        },
      }
    );
    //  title,desc,salary
  } catch (err) {
    console.log(err.message);
  }
};
// signup page
exports.signupPage = async (req, res) => {
  try {
    res.render("orgSignup");
  } catch (err) {
    console.log(err);
  }
};
exports.register_org = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      const validate = await org.findOne({
        $or: [{ email: req.body.email }, { org_name: req.body.org_name }],
      });
      if (validate) {
        res.status(500).send("email or orgName already exist");
      } else {
        const spassword = await bcryptjs.hash(req.body.password, 10);
        let av, re;
        req.files ? ((av = req.files["avatar"] ? true : false), (re = req.files["resume"] ? true : false)) : {};
        const neworg = new org({
          org_name: req.body.org_name,
          avatar: {
            data: av ? req.files["avatar"][0].buffer : null,
            contentType: "image/jpeg",
          },
          email: req.body.email,
          password: spassword,
          address: req.body.address,
          details: {
            resume: [
              {
                data: re ? req.files["resume"][0].buffer : null,
                contentType: "application/pdf",
              },
            ],
          },
        });

        neworg.save();
        res.status(200).redirect("login");
      }
    } catch (err) {
      console.log(err);
    }
  });
};
