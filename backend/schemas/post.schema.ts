import { z } from 'zod'

/**
 * 
 * CreatePost input:
 * 
 * - title: required, non-empty string
 * 
 * - content: required, non-empty string
 * - published: optional boolean
 * 
 */


export const CreatePostSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .min(3, "Title must be at least 3 characters"),

    content: z
        .string()
        .min(1, "Content is required"),

    published: z.boolean().optional(),
})


/**
 * UpdatePost input:
 * 
 * - title: required, non-empty string, min 3 characters
 * - content: required, non-empty string
 * - published: optional boolean
 */
export const UpdatePostSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .min(3, "Title must be at least 3 characters"),

    content: z
        .string()
        .min(1, "Content is required"),

    published: z.boolean().optional(),
})


/**
 * PostId param validation:
 * 
 * - id: required, non-empty string
 */
export const PostIdSchema = z.object({
    id: z.string().min(1, "Post ID is required"),
})