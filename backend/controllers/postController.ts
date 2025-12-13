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