import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUnitManagers,
  getAllClients,
} from '../controllers/userController.js';
import { protect, admin,authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

 router.get(
  "/managers",
  protect,
  authorizeRoles("admin", "client"),
  getUnitManagers
);


router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/auth', authUser);
router.post('/logout', logoutUser);

router.get("/clients", getAllClients);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

 
export default router;
