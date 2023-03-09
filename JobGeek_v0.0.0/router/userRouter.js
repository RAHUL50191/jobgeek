const userCont = require("../controller/userController");

const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
router.use("/public", express.static(`public`));
// router.use(express.static(`${__dirname}/public`));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.route("/signup").post(userCont.register_user).get(userCont.signupPage);
router.route("/login").post(userCont.loginAPI).get(userCont.loginPage);
router
  .route("/forgot_password")
  .post(userCont.forgotPassword)
  .get(userCont.forgotPasswordPage);
router
  .route("/reset_password")
  .post(userCont.resetPassword)
  .get(userCont.resetPasswordPage);
router
  .route("/reset_email")
  .post(auth, userCont.resetEmail)
  .get(userCont.resetEmailPage);
router.post("/update_email", userCont.updateEmail);
router.post("/update_avatar", userCont.updateAvatar);
router.route("/reset_avatar").post(auth, userCont.updateAvatar);
router.route("/set_prefrences").post(auth, userCont.setPrefrences);
router.route("/application").post(auth, userCont.postApplication);
router.route("/apply").post(auth, userCont.userApplication);
router.route("/set_details").post(userCont.setDetails);
router.route("/home").get(auth, userCont.userHome);
module.exports = router;
