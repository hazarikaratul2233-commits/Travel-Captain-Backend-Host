import express from "express";
import { 
    createUser, 
    getUsers,
    getUserById, 
    setOnlineStatusById,
    // updateUser, 
    // deleteUser, 
     changePassword, 
    // changePasswordAdmin, 
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.post("/online/:id", setOnlineStatusById);
router.get("/:id", getUserById);
router.post("/change-password", changePassword);




// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);
// router.patch("/change-password/:id", changePassword);
// router.patch("/changePasswordByAdmin/:id", changePasswordAdmin);

export default router;  