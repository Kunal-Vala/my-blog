import { Request, Response } from "express"
import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"
import { createHash, checkPassword } from '../lib/password'

export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, name, password } = req.body

        // 1️⃣ Basic validation
        if (!email || !username || !password) {
            return res.status(400).json({
                message: "Email, username and password are required",
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            })
        }

        // 2️⃣ Check email uniqueness
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        })

        if (existingEmail) {
            return res.status(409).json({
                message: "Email already exists",
            })
        }

        // 3️⃣ Check username uniqueness
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        })

        if (existingUsername) {
            return res.status(409).json({
                message: "Username already exists",
            })
        }

        // 4️⃣ Hash password
        const hashedPassword = await createHash(password)

        // 5️⃣ Create user
        const user = await prisma.user.create({
            data: {
                email,
                username,
                name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                role: true,
                createdAt: true,
            },
        })

        // 6️⃣ Send response
        res.status(201).json({
            message: "User registered successfully",
            user,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Failed to register user",
        })
    }
}
