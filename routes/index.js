const router = require("express").Router();

router.get("/", (req, res) => {
  // #swagger.tags=['Hello World']
  res.send("Hello, World!");
});

router.use("/users", require("./users"));
router.use("/", require("./swagger"));

module.exports = router;
