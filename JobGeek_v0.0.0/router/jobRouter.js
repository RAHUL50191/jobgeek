const jobCont = require("../controller/jobController");

const express = require("express");
const router = express.Router();

router.use(express.static(`${__dirname}/public`));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// router.route("/create").post(jobCont.postImage).get(jobCont.createJob_Page);
router.get("/search", jobCont.updateJobList);
module.exports = router;
