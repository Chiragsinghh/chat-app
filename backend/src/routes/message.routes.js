import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  getMessages, 
  getUsersForSidebar, 
  sendMessage, 
  createGroup,
  updateGroup,
  manageGroupMembers // Import the controller we wrote earlier
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

// New route for group creation
router.post("/groups", protectRoute, createGroup);
router.put("/groups/:groupId", protectRoute, updateGroup);
router.post("/groups/:groupId/members", protectRoute, manageGroupMembers);
export default router;
