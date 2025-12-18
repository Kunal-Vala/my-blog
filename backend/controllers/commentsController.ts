import { Request, Response } from "express"
import { prisma } from "../lib/prisma.js"

export const getAllComments = async (req: Request, res: Response) => {
    try {
        const comments = await prisma.comment.findMany()
        res.json(comments)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to fetch comments" })
    }
}

export const getCommentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: "Comment ID is required" })
        }
        const comment = await prisma.comment.findUnique({
            where: { id },
        })
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }
        res.json(comment)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to fetch comment" })
    }
}

export const getCommentsByPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params
        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" })
        }
        const comments = await prisma.comment.findMany({
            where: { postId },
        })
        res.json(comments)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to fetch comments" })
    }
}

export const getCommentsByUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const comments = await prisma.comment.findMany({
            where: { authorId: req.user.userId },
        })
        res.json(comments)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to fetch comments" })
    }
}

export const createComment = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const { postId, content, published } = req.body

        if (!postId || !content) {
            return res.status(400).json({ message: "postId and content are required" })
        }

        const comment = await prisma.comment.create({
            data: {
                postId,
                content,
                published: typeof published === "boolean" ? published : true,
                authorId: req.user.userId, // always set to the authenticated user
            },
        })

        res.status(201).json(comment)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to create comment" })
    }
}

export const updateComment = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const { id: commentId } = req.params
        const { content, published } = req.body

        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" })
        }
        if (!content && typeof published === "undefined") {
            return res.status(400).json({ message: "Nothing to update" })
        }

        const existing = await prisma.comment.findUnique({ where: { id: commentId } })
        if (!existing) {
            return res.status(404).json({ message: "Comment not found" })
        }
        const isOwner = existing.authorId && existing.authorId === req.user.userId
        const isAdmin = req.user.role === "ADMIN"
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Forbidden" })
        }

        const updated = await prisma.comment.update({
            where: { id: commentId },
            data: {
                content: typeof content === "string" ? content : existing.content,
                published: typeof published === "boolean" ? published : existing.published,
            },
        })

        res.status(200).json(updated)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to update comment" })
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const { id: commentId } = req.params
        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" })
        }

        const existing = await prisma.comment.findUnique({ where: { id: commentId } })
        if (!existing) {
            return res.status(404).json({ message: "Comment not found" })
        }
        const isOwner = existing.authorId && existing.authorId === req.user.userId
        const isAdmin = req.user.role === "ADMIN"
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Forbidden" })
        }

        await prisma.comment.delete({ where: { id: commentId } })
        res.status(200).json({ message: "Comment deleted successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to delete comment" })
    }
}
