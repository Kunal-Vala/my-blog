import { Request, Response, NextFunction } from "express"
import { ZodSchema, ZodError } from "zod"

type RequestSource = "body" | "params" | "query"

export const validate =
    (schema: ZodSchema, source: RequestSource) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const parsedData = schema.parse(req[source])

                // overwrite with validated data
                req[source] = parsedData

                next()
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        message: "Invalid request data",
                        errors: error.issues.map(err => ({
                            field: err.path.join("."),
                            message: err.message,
                        })),
                    })
                }

                // Log the unexpected error for debugging
                console.error("Unexpected validation error:", error)

                return res.status(500).json({
                    message: "Validation failed",
                })
            }
        }
