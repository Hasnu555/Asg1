const { Router } = require("express");
const { requireAuth, requireAdmin } = require("../middleware/authmiddleware");
const groupController = require("../controller/groupController");
const multer = require("multer");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save to uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Append the date and the original file extension
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Increase to 10MB or adjust as needed
});

// Route to create a new group
router.post(
  "/create",
  requireAuth,
  upload.single("image"),
  groupController.createGroup
);

// Route to add a user to a group
router.post(
  "/:groupId/addUser/:userId",
  requireAuth,
  groupController.addUserToGroup
);

// Route to list all groups for the logged-in user
router.get("/myGroups", requireAuth, groupController.listGroups);

// Route for updating group details
router.put("/:groupId", requireAuth, groupController.updateGroup);

// Route to join a group
router.post("/:groupId/join", requireAuth, groupController.joinGroup);

// Route to leave a group
router.post("/:groupId/leave", requireAuth, groupController.leaveGroup);

// Route to create a group post
router.post(
  "/:groupId/post",
  requireAuth,
  upload.single("image"),
  groupController.createGroupPost
);

// Route to like a group post
router.post("/post/:postId/like", requireAuth, groupController.likeGroupPost);

// Route to dislike a group post
router.post(
  "/post/:postId/dislike",
  requireAuth,
  groupController.dislikeGroupPost
);

// Route to unlike a group post
router.delete(
  "/post/:postId/unlike",
  requireAuth,
  groupController.unlikeGroupPost
);

module.exports = router;
