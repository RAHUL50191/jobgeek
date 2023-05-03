const user = require("../model/userModel");
const org = require("../model/orgModel");
const job = require("../model/jobModel");
const application = require("../model/applicationModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const randStr = require("randomstring");

const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { request } = require("http");

//MULTER MIDDLEWARE =>define storage,filter then apply multer
//multer for single avatar

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
      auth: { user: config.emailUser, pass: config.emailPasswrd },
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "You have applied for reset email in job geek website",
      html:
        "<p>Hi " +
        name +
        ",Please copy this link for reset email:<a href='https://jobgeek.onrender.com/user/reset_email?token=" +
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
      auth: { user: config.emailUser, pass: config.emailPasswrd },
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "You have applied for reset password in job geek website",
      html:
        "<p>Hi " +
        name +
        ",Please copy this link for reset password:<a href='https://jobgeek.onrender.com/user/reset_password?token=" +
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
exports.userHome = async (req, res) => {
  try {
    const token = req.query.token;
    const userdata = await user.findOne({ token: token });
    const latitude = userdata.details.location.coordinates[1];
    const longitude = userdata.details.location.coordinates[0];

    const nearby = await job
      .find({
        location: {
          $geoWithin: { $centerSphere: [[longitude, latitude], 15 / 3963.2] },
        },
      })
      .catch((err) => console.log(err));
    Promise.all(
      userdata.jobOffers.map(async (el) => {
        return await job.find({ email: el }).exec();
      })
    )
      .then((jobs) => {
        // Do something with the array of job objects
        console.log(jobs);
        if (userdata) {
          res.render("userHome", {
            user: userdata,
            nearby: nearby,
            joboffers: jobs,
          });
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
    const userdata = await user.findOne({
      $or: [{ user_name: req.body.user_name }, { email: req.body.user_name }],
    });
    if (userdata) {
      const passwordValid = await bcryptjs.compare(password, userdata.password);
      if (passwordValid) {
        const tokenData = await create_token(userdata._id);
        const userData = await user.findOneAndUpdate({ _id: userdata._id }, { $set: { token: tokenData } }, { new: true });

        // const userData = {
        //   _id: userdata._id,
        //   name: userdata.user_name,
        //   email: userdata.email,
        //   address: userdata.address,

        //   // avatar: userdata.avatar,
        //   // resume: userdata.resume,
        //   token: tokenData,
        // };
        res.status(200).redirect(`/home?token=${userData.token}`);
        // return res.status(200).send(userData);

        // res.status(200).render("userDashboard", { items: userdata });
      } else {
        return res.status(401).send({ msg: "Invalid credencial" });
      }
    } else {
      res.status(401).send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
};
exports.forgotPasswordPage = async (req, res) => {
  try {
    res.render("userForgotPasswordPage");
  } catch (err) {
    console.log(err);
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const userdata = await user.findOne({
      email: email,
    });

    if (userdata) {
      // const newPassword = await bcryptjs.hash(req.body.password, 10);
      const Rstr = randStr.generate();
      await user.findOneAndUpdate({ _id: userdata._id }, { $set: { token: Rstr } });
      sendResetPasswordEmail(userdata.user_name, userdata.email, Rstr);
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
    const userdata = await user.findOne({
      token: token,
    });
    if (userdata) {
      // const newPassword = await bcryptjs.hash(req.body.password, 10);
      const Rstr = randStr.generate();
      await user.findOneAndUpdate({ _id: userdata._id }, { $set: { token: Rstr } });
      sendResetEmail(userdata.user_name, userdata.email, Rstr);
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
    res.render("userResetEmailPage", { token: req.query.token });
  } catch (err) {
    console.log(err);
  }
};
exports.updateEmail = async (req, res) => {
  try {
    const token = req.query.token;

    const userdata = await user.findOne({
      token: token,
    });
    if (userdata) {
      await user.findOneAndUpdate({ _id: userdata._id }, { $set: { email: req.body.email } });

      res.status(200).redirect("/user/login");
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
      console.log(req.file, req.body);
      const userdata = await user.findOne({
        token: token,
      });
      if (userdata) {
        await user.findOneAndUpdate(
          { _id: userdata._id },
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
    res.render("userResetPasswordPage", { token: req.query.token });
  } catch (err) {
    console.log(err);
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    console.log("inside post" + token);
    const tokendata = await user.findOne({
      token: token,
    });
    if (tokendata) {
      const newPassword = await bcryptjs.hash(req.body.password, 10);

      await user.findOneAndUpdate({ _id: tokendata._id }, { $set: { password: newPassword, token: "" } }, { new: true });
      res.status(200).redirect("https://jobgeek.onrender.com/user/login");
      // res.status(200).send("Password has been changed" +"id:" +tokendata._id +"token:" +tokendata.token);
    } else {
      res.status(401).send("invalid token");
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: err.message });
  }
};
//preferences
exports.setPrefrences = async (req, res) => {
  try {
    console.log(req.body);
    const userdata = await user.findOneAndUpdate(
      { token: req.query.token },
      {
        $set: {
          preference: {
            jbNav: Boolean(req.body.jbNav),
            hellotxt: Boolean(req.body.hellotxt),
            uNav: Boolean(req.body.uNav),
            prevTab: Boolean(req.body.prevTab),
          },
        },
      },
      { new: true }
    );

    res.status(200).redirect("/user/home?token=" + req.query.token + "");
  } catch (err) {
    console.log(err.message);
  }
};
//details
exports.setDetails = async (req, res) => {
  resumeCertiUpload(req, res, async (err) => {
    try {
      const token = req.query.token;
      let [resume1, resume2, resume3, resume4] = [
        req.files["resume"][0] ? req.files["resume"][0].buffer : null,
        req.files["resume"][1] ? req.files["resume"][1].buffer : null,
        req.files["resume"][2] ? req.files["resume"][2].buffer : null,
        req.files["resume"][3] ? req.files["resume"][3].buffer : null,
      ];

      let [link1, link2, link3, link4, link5] = req.body.links.split(",");
      let [cert1, cert2, cert3, cert4, cert5] = [
        req.files["certificates"][0] ? req.files["certificates"][0].buffer : null,
        req.files["certificates"][1] ? req.files["certificates"][1].buffer : null,
        req.files["certificates"][2] ? req.files["certificates"][2].buffer : null,
        req.files["certificates"][3] ? req.files["certificates"][3].buffer : null,
        req.files["certificates"][4] ? req.files["certificates"][4].buffer : null,
      ];
      const userdata = await user.findOne({
        token: token,
      });
      if (userdata) {
        const userData = await user.findOneAndUpdate(
          { _id: userdata._id },
          {
            $set: {
              details: {
                fullname: req.body.fullname,
                graduation: req.body.graduation,
                skills: req.body.skills,

                workExp: req.body.workExp,

                achivments: req.body.achivments,
                address: req.body.address,
                DOB: new Date(req.body.DOB),
                contactNo: req.body.contactNo,

                links: [link1, link2, link3, link4, link5],
                certificates: [
                  {
                    data: cert1,
                    contentType: "image/png",
                  },
                  {
                    data: cert2,
                    contentType: "image/png",
                  },
                  {
                    data: cert3,
                    contentType: "image/png",
                  },
                  {
                    data: cert4,
                    contentType: "image/png",
                  },
                  {
                    data: cert5,
                    contentType: "image/png",
                  },
                ],
                resume: [
                  {
                    data: resume1,
                    contentType: "application/pdf",
                  },
                  {
                    data: resume2,
                    contentType: "application/pdf",
                  },
                  {
                    data: resume3,
                    contentType: "application/pdf",
                  },
                  {
                    data: resume4,
                    contentType: "application/pdf",
                  },
                ],
                // resume: { data: Buffer, contentType: String },
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
exports.postApplication = async (req, res) => {
  try {
    const token = req.query.token;
    const userdata = await user.findOne({ token: token });
    const applied = await application.findOne({ email: userdata.email });
    const latitude = userdata.details.location.coordinates[0];
    const longitude = userdata.details.location.coordinates[1];
    console.log(req.body);
    if (userdata) {
      if (!applied) {
        const applicationForm = new application({
          application_title: req.body.application_title,
          imageUrl: {
            data: userdata.avatar.data,
            contentType: userdata.avatar.contentType,
          },
          salary: req.body.salary,
          desc: req.body.desc,
          email: req.body.uemail,
          location: {
            type: "Point",
            coordinates: [latitude, longitude],
          },
          // details: userdata.details,
        });
        applicationForm.save();
        res.status(200).send("success");
      } else {
        const applicationForm = await application.findOneAndUpdate({
          application_title: req.body.application_title,
          imageUrl: {
            data: userdata.avatar.data,
            contentType: userdata.avatar.contentType,
          },
          salary: req.body.salary,
          desc: req.body.desc,
          email: req.body.uemail,
          location: {
            type: "Point",
            coordinates: [latitude, longitude],
          },
        });

        res.status(200).send("update success");
      }
    } else {
      res.status(404).send("invalid token");
    }
  } catch (err) {
    console.log(err.message);
  }
};
//apply application
exports.userApplication = async (req, res) => {
  try {
    const token = req.query.token;
    console.log(req.body);
    const userdata = await user.findOne({ email: req.body.uemail });
    const orgdata = await org.findOneAndUpdate(
      { email: req.body.oemail },
      {
        $push: {
          appliedCandidates: req.body.uemail,
        },
      }
    );
    res.status(200).send("applied");
    //  title,desc,salary
  } catch (err) {
    console.log(err.message);
  }
};
// signup page
exports.signupPage = async (req, res) => {
  try {
    res.render("userSignup");
  } catch (err) {
    console.log(err);
  }
};
exports.register_user = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      const validate = await user.findOne({
        $or: [{ email: req.body.email }, { user_name: req.body.user_name }],
      });
      if (validate) {
        res.status(500).send("email or userName already exist");
      } else {
        const spassword = await bcryptjs.hash(req.body.password, 10);
        let av, re;
        req.files ? ((av = req.files["avatar"] ? true : false), (re = req.files["resume"] ? true : false)) : {};
        const newuser = new user({
          user_name: req.body.user_name,
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

        newuser.save();
        res.status(200).redirect("login");
      }
    } catch (err) {
      console.log(err);
    }
  });
};
