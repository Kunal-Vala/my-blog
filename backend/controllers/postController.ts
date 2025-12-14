import { Request, Response } from "express"
import { prisma } from "../lib/prisma"

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany()
        res.json(posts)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to fetch posts" })
    }
}

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const post = await prisma.post.findUnique({
            where: {
                id,
            },
        })
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        res.json(post)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to fetch posts" })
    }
}

export const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const { title, content, published } = req.body
        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required",
            })
        }

        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")


        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                published: Boolean(published),
                publishedAt: published ? new Date() : null,
                authorId : user?.userId
            },
        })

        res.status(201).json(post)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to create post" })
    }
}