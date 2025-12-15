import { Router } from "express";
const router = Router()
import { getPosts, getPostById, createPost, updatePost } from '../controllers/postController'
import { authenticate, authorizeRoles, checkPostOwnership } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { CreatePostSchema } from "../schemas/post.schema";

router.get(
    '/',
    authenticate,
    authorizeRoles(["USER", "AUTHOR", "ADMIN"]),
    getPosts
)

router.post(
    '/',
    authenticate,
    authorizeRoles(["AUTHOR", "ADMIN"]),
    validate(CreatePostSchema,'body'),
    createPost
)

router.put(
    '/:id',
    authenticate,
    authorizeRoles(["AUTHOR", "ADMIN"]),
    checkPostOwnership,
    updatePost
)

router.get(
    '/:id',
    getPostById
)

export { router }