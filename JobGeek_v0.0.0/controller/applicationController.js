//image//application
const application = require("../model/applicationModel");

//other

//EXPORT FUNCTIONS:
//1)UPDATEapplicationLIST(query_search{get})
//2)CREATEapplicationPAGE(page_for_making_application{get}),POSTIMAGE(make_application{post}),
exports.updateapplicationList = async (req, res) => {
  try {
    const qryName = req.query.name;
    const qryDesc = req.query.desc;
    const qrySalary = req.query.salary * 1;

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 4;
    let skip = (page - 1) * limit;
    console.log(page, limit, skip);
    const total_pages = Number();

    const data = await application
      .find({
        application_title: { $regex: new RegExp("^" + qryName + ".*", "i") },
        desc: { $regex: new RegExp("^" + qryDesc + ".*", "i") },
        salary: qrySalary || { $gte: 0 },
      })
      .skip(skip)
      .limit(limit);
    res.render("applicationList", { items: data, currpage: page + 1 });
  } catch (err) {
    console.log(err);
    res.end(err);
  }
};
// exports.createapplication_Page = async (req, res) => {
//   try {
//     res.render("createapplication_Page");
//   } catch (err) {
//     console.log(err);
//     res.end(err);
//   }
// };
// exports.postImage = async (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(req.body);
//       const newImage = new application({
//         application_title: req.body.application_title,
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
//       res.redirect("/search-application/search");
//     }
//   });
// };
