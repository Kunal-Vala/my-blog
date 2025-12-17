import { z } from "zod"

/**
 * CreateComment input:
 * - postId: required string
 * - content: required, non-empty string
 * - published: optional boolean
 * - name/email: optional for guest comments
 */
export const CreateCommentSchema = z.object({
    postId: z.string().min(1, "Post ID is required"),
    content: z.string().min(1, "Content is required"),
    published: z.boolean().optional(),
})
/**
 * UpdateComment input:
 * - content: optional non-empty string
 * - published: optional boolean
 */
export const UpdateCommentSchema = z.object({
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
}).refine((data) => typeof data.content === "string" || typeof data.published === "boolean", {
  message: "At least one of content or published must be provided",
})

/**
 * CommentId param validation
 */
export const CommentIdSchema = z.object({
  id: z.string().min(1, "Comment ID is required"),
})

/**
 * PostId param for comments route
 */
export const CommentPostParamSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
})
