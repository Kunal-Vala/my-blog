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
