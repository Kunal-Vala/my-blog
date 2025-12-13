import { Router } from "express";
const router = Router()
import { getPosts,getPostById,createPost } from '../controllers/postController'

router.get('/', getPosts)
router.post('/', createPost)
router.get('/:id', getPostById)

export { router }