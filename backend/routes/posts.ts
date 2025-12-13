import { Router } from "express";
const router = Router()
import { getPosts } from '../controllers/postController'

router.get('/', getPosts)

export { router }