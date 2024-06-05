const { Router } = require("express");
const { requireAuth } = require("../middleware/authmiddleware");
const groupController = require("../controller/groupController");
const multer = require("multer");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "group/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Route to create a new group
router.post(
  "/group/create",
  requireAuth,
  upload.single("image"),
  groupController.createGroup
);

// Route to add a user to a group
router.post(
  "/group/:groupId/addUser/:userId",
  requireAuth,
  groupController.addUserToGroup
);

// Route to list all groups for the logged-in user
router.get("/group/myGroups", requireAuth, groupController.listGroups);

// Route for updating group details
router.put(
  "/group/:groupId",
  requireAuth,
  upload.single("image"),
  groupController.updateGroup
);

// Route to join a group
router.post("/group/:groupId/join", requireAuth, groupController.joinGroup);

// Route to leave a group
router.post("/group/:groupId/leave", requireAuth, groupController.leaveGroup);

// Route to create a group post
router.post(
  "/group/:groupId/post",
  requireAuth,
  upload.single("image"),
  groupController.createGroupPost
);

// Route to like a group post
router.post(
  "/group/post/:postId/like",
  requireAuth,
  groupController.likeGroupPost
);

// Route to dislike a group post
router.post(
  "/group/post/:postId/dislike",
  requireAuth,
  groupController.dislikeGroupPost
);

// Route to unlike a group post
router.delete(
  "/group/post/:postId/unlike",
  requireAuth,
  groupController.unlikeGroupPost
);

// Route to get details of a specific group
router.get("/group/:groupId", requireAuth, groupController.getGroupDetails);

// Route to get posts of a specific group
router.get("/group/:groupId/posts", requireAuth, groupController.getGroupPosts);

module.exports = router;
