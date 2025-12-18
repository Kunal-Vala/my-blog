import { Router } from "express"
const router = Router()
import {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  getCommentsByUser,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js"
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js"
import { validate } from "../middlewares/validate.js"
import { CreateCommentSchema, UpdateCommentSchema, CommentIdSchema, CommentPostParamSchema } from "../schemas/comment.schema.js"
import { PostIdSchema } from "../schemas/post.schema.js"

router.get(
  "/all",
  authenticate,
  authorizeRoles(["USER", "AUTHOR", "ADMIN"]),
  getAllComments
)

router.get(
  "/",
  authenticate,
  authorizeRoles(["USER", "AUTHOR", "ADMIN"]),
  getCommentsByUser
)

router.get(
  "/post/:postId",
//   validate(PostIdSchema, "params"),
  getCommentsByPost
)

router.post(
  "/",
  authenticate,
  authorizeRoles(["USER", "AUTHOR", "ADMIN"]),
  validate(CreateCommentSchema, "body"),
  createComment
)

router.put(
  "/:id",
  authenticate,
  authorizeRoles(["USER", "AUTHOR", "ADMIN"]),
  validate(CommentIdSchema, "params"),
  validate(UpdateCommentSchema, "body"),
  updateComment
)

router.get(
  "/:id",
  validate(CommentIdSchema, "params"),
  getCommentById
)

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(["USER", "AUTHOR", "ADMIN"]),
  validate(CommentIdSchema, "params"),
  deleteComment
)

export { router }
