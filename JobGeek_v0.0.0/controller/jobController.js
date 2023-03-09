//image//job
const job = require("../model/jobModel");

//other

//EXPORT FUNCTIONS:
//1)UPDATEJOBLIST(query_search{get})
//2)CREATEJOBPAGE(page_for_making_job{get}),POSTIMAGE(make_job{post}),
exports.updateJobList = async (req, res) => {
  try {
    const qryName = req.query.name;
    const qryDesc = req.query.desc;
    const qrySalary = req.query.salary * 1;

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 4;
    let skip = (page - 1) * limit;
    console.log(page, limit, skip);
    const total_pages = Number();

    const data = await job
      .find({
        job_title: { $regex: new RegExp("^" + qryName + ".*", "i") },
        desc: { $regex: new RegExp("^" + qryDesc + ".*", "i") },
        salary: qrySalary || { $gte: 0 },
      })
      .skip(skip)
      .limit(limit);
    res.render("jobList", { items: data, currpage: page + 1 });
  } catch (err) {
    console.log(err);
    res.end(err);
  }
};
exports.createJob_Page = async (req, res) => {
  try {
    res.render("createJob_Page");
  } catch (err) {
    console.log(err);
    res.end(err);
  }
};
// exports.postImage = async (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(req.body);
//       const newImage = new job({
//         job_title: req.body.job_title,
//         desc: req.body.desc,
//         salary: req.body.salary,
//         //this name will be  single("name:image");
//         imageUrl: {
//           data: fs.readFileSync(
//             path.join(__dirname + "/../uploads/" + req.file.filename)
//           ),
//           contentType: "image/png",
//         },
//         location: {
//           type: "Point",
//           coordinates: [req.body.latitude, req.body.longitude],
//         },
//       });

//       newImage.save().then(() => res.send("success"));
//       res.redirect("/search-job/search");
//     }
//   });
// };
