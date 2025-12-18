import { Request, Response } from "express"
import { prisma } from "../lib/prisma.js"
import { createHash, checkPassword } from '../lib/password.js'
import jwt from 'jsonwebtoken'

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


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        // 1️⃣ Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            })
        }

        // 2️⃣ Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        // 3️⃣ Generic auth error (do NOT leak info)
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            })
        }

        // 4️⃣ Verify password
        const isPasswordValid = await checkPassword(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            })
        }

        // 5️⃣ Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d",
            }
        )

        // 6️⃣ Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                role: user.role,
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Login failed",
        })
    }
}