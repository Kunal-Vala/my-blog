import { Router } from "express";
const router = Router()
import { getAllPosts, getPostById, createPost, updatePost, deletePost ,getPostsByUser } from '../controllers/postController.js'
import { authenticate, authorizeRoles, checkPostOwnership } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { CreatePostSchema, UpdatePostSchema, PostIdSchema } from "../schemas/post.schema.js";

router.get(
    '/all',
    // Public endpoint: fetch all posts without auth
    getAllPosts
)

router.get(
    '/',
    authenticate,
    authorizeRoles(["USER", "AUTHOR", "ADMIN"]),
    getPostsByUser
)

router.post(
    '/',
    authenticate,
    authorizeRoles(["AUTHOR", "ADMIN"]),
    validate(CreatePostSchema, 'body'),
    createPost
)

router.put(
    '/:id',
    authenticate,
    authorizeRoles(["AUTHOR", "ADMIN"]),
    checkPostOwnership,
    validate(PostIdSchema, 'params'),
    validate(UpdatePostSchema, 'body'),
    updatePost
)

router.get(
    '/:id',
    validate(PostIdSchema, 'params'),
    getPostById
)

router.delete(
    '/:id',
    authenticate,
    authorizeRoles(['AUTHOR']),
    checkPostOwnership,
    validate(PostIdSchema, 'params'),
    deletePost
)

export { router }