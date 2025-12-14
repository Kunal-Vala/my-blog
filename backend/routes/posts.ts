import { Router } from "express";
const router = Router()
import { getPosts,getPostById,createPost } from '../controllers/postController'
import { authenticate } from "../middlewares/auth.middleware";

router.get('/',authenticate, getPosts)
router.post('/', authenticate, createPost)
router.get('/:id', getPostById)

export { router }