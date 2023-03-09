const applicationCont = require("../controller/applicationController");

const express = require("express");
const router = express.Router();

router.use(express.static(`${__dirname}/public`));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// router.route("/create").post(applicationCont.postImage).get(applicationCont.createapplication_Page);
router.get("/search", applicationCont.updateapplicationList);
module.exports = router;
