const router = require("express").Router();
const passport = require("passport");

/* router.get("/", (req, res) => {
  // #swagger.tags=['Hello World']
  res.send("Hello, World!");
});
 */
router.use("/users", require("./users"));
router.use("/contacts", require("./contacts"));
router.use("/", require("./swagger"));

router.get("/login", passport.authenticate("github"), (req, res) => {});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
