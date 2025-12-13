import { Router } from "express";
const router = Router()
import { getPosts,getPostById } from '../controllers/postController'

router.get('/', getPosts)
router.get('/:id', getPostById)

export { router }