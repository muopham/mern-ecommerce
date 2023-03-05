const router = require("express").Router();
const userCtrl = require("../controllers/user");
const { checkAdmin, verifyToken } = require("../middleware/verifyToken");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/", checkAdmin, userCtrl.getAllUsers);
router.get("/logout", userCtrl.logout);
router.get("/currentUser", verifyToken, userCtrl.getCurrentUser);
router.delete("/", checkAdmin, userCtrl.deleteUser);
router.put("/currentUser", verifyToken, userCtrl.updateUser);
router.put("/:id", checkAdmin, userCtrl.updateUserByAdmin);

module.exports = router;
