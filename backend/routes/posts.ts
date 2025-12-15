import { Router } from "express";
const router = Router()
import { getPosts, getPostById, createPost, updatePost } from '../controllers/postController'
import { authenticate, authorizeRoles, checkPostOwnership } from "../middlewares/auth.middleware";

router.get('/', authenticate, authorizeRoles(["USER", "AUTHOR", "ADMIN" ]), getPosts)
router.post('/', authenticate, authorizeRoles(["AUTHOR", "ADMIN"]), createPost)
router.put('/:id', authenticate, authorizeRoles(["AUTHOR", "ADMIN"]), checkPostOwnership, updatePost)
router.get('/:id', getPostById)

export { router }