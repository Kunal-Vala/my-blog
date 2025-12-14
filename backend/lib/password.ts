import bcrypt from "bcryptjs"

export async function createHash(rawPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(rawPassword, salt)
}

export async function checkPassword(
    rawPassword: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(rawPassword, hash)
}
