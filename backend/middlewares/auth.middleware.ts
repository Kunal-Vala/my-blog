import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authorizationHeader = req.headers.authorization

        // 1️⃣ Header existence check
        if (!authorizationHeader) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        // 2️⃣ Bearer format check
        const parts = authorizationHeader.split(" ")

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const token = parts[1]

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        // 3️⃣ Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload

        // 4️⃣ Attach user info to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        }

        // 5️⃣ Allow request to continue
        next()
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}

export const authorizeRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // 1️⃣ User must already be authenticated
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            })
        }

        // 2️⃣ Check role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden",
            })
        }

        // 3️⃣ Role allowed → continue
        next()
    }
}

export const checkPostOwnership = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const { userId, role } = req.user

        if (role === 'ADMIN') {
            return next()
        }

        const { id: postId } = req.params


        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" })
        }

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })

        if (!post) {
            return res.status(404).json({
                message: 'Post Not Found'
            })
        }

        if (post.authorId !== userId) {
            return res.status(403).json({
                message: 'Forbidden'
            })
        }

        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Ownership Check Failed" })
    }
}