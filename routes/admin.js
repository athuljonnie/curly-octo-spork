var express = require("express");
const { render } = require("../app");
//const productHelpers = require("../helpers/product-helpers");
var router = express.Router();
//var productHelper = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
var userHelper = require("../helpers/user-helpers");

router.get("/", function (req, res, next) {
  let admin = req.session.admin;
  if (admin) {
    userHelper.getAllUsers().then((users) => {
      res.render("admin/view-user", { admin: true, users });
    });
  } else {
    res.redirect("/admin/login");
  }
});


router.get("/login", (req, res) => {
  let admin = req.session.admin;
  if (admin) {
    res.redirect("/admin");
  } else {
    res.render("admin/adminlogin");
  }
});


router.post("/login", (req, res) => {
  if (req.body.name === "admin@gmail.com" && req.body.pass === "123") {
    req.session.admin = true;
    res.redirect("/admin");
  } else {
    res.render("admin/adminlogin", { loginErr: true });
  }
});


router.get("/logout", (req, res) => {
  req.session.admin = false;

  // req.session.destroy();
  res.redirect("/admin/login");
});


router.get("/delete-user/:id", (req, res) => {
  let userid = req.params.id;
  console.log(userid);
  userHelpers.deleteUser(userid).then((response) => {
    res.redirect("/admin");
  });
});


router.get("/edit-user/:id", async (req, res) => {
  let user = await userHelpers.getAllUsers(req.params.id);
  console.log(user);
  res.render("admin/edit-user", { user: user[0] });
});


router.post("/edit-user", (req, res) => {
  userHelpers.updateUser(req.body.userId, req.body).then(() => {
    res.redirect("/admin");
  });
});


router.post("/search", (req, res) => {
  let data = req.body.search;
  userHelpers.searchUser(data).then((users) => {
    res.render("admin/view-user", { admin: true, users });
  });
});


router.get("/search", (req, res) => {
  let admin = req.session.admin;
  if (admin) {
    res.redirect("/admin");
  } else {
    res.render("admin/adminlogin");
  }
});

router.post("/add-user", (req, res) => {
  console.log(req.body);
  userHelper.doSignup(req.body).then(() => {});
  res.redirect("/admin");
});

router.get("/add-user", (req, res) => {

  res.render("admin/add-user");
});

module.exports = router;
