import bcrypt from "bcryptjs"

export async function createHash(rawPassword: string): Promise<string> {
    console.log('[password.createHash] Creating password hash');
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(rawPassword, salt)
}

export async function checkPassword(
    rawPassword: string,
    hash: string
): Promise<boolean> {
    console.log('[password.checkPassword] Checking password');
    return bcrypt.compare(rawPassword, hash)
}
