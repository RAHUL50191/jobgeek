const orgCont = require("../controller/orgController");

const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
router.use("/public", express.static(`public`));
// router.use(express.static(`${__dirname}/public`));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.route("/signup").post(orgCont.register_org).get(orgCont.signupPage);
router.route("/login").post(orgCont.loginAPI).get(orgCont.loginPage);
router.route("/forgot_password").post(orgCont.forgotPassword).get(orgCont.forgotPasswordPage);
router.route("/reset_password").post(orgCont.resetPassword).get(orgCont.resetPasswordPage);
router.route("/reset_email").post(auth, orgCont.resetEmail).get(orgCont.resetEmailPage);
router.post("/update_email", orgCont.updateEmail);
router.post("/update_avatar", orgCont.updateAvatar);
router.route("/reset_avatar").post(auth, orgCont.updateAvatar);
router.route("/set_details").post(orgCont.setDetails);
router.route("/joboffer").post(orgCont.offerJob);

router.route("/create").post(orgCont.postImage);
router.route("/home").get(auth, orgCont.orgHome);
module.exports = router;
