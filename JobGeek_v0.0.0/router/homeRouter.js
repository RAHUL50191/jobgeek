const homeCont = require(`${__dirname}/../controller/homeController`);
const express = require("express");
const router = express.Router();

router.use(express.static(`${__dirname}/public`));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.route("/home").get(homeCont.getIndex);
router.route("/home/interview").get(homeCont.getInterview);
module.exports = router;
