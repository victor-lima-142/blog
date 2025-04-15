import * as CryptoLib from "crypto";

export class Crypto {
    private static readonly algorithm: string = "aes-256-cbc";
    private static key: Buffer = CryptoLib.createHash("sha256").update(process.env.CRYPTO_PWD_SECRET ?? "").digest();

    public static encrypt(text: string): string {
        const iv = CryptoLib.randomBytes(16);
        const cipher = CryptoLib.createCipheriv(this.algorithm, this.key, iv);
        let encrypted = cipher.update(text, "utf8", "base64");
        encrypted += cipher.final("base64");
        return `${iv.toString("base64")}:${encrypted}`;
    }

    public static decrypt(encryptedText: string): string {
        const parts = encryptedText.split(":");
        if (parts.length !== 2) {
            throw new Error("Invalid encrypted text format.");
        }
        const iv = Buffer.from(parts[0], "base64");
        const encrypted = parts[1];
        const decipher = CryptoLib.createDecipheriv(this.algorithm, this.key, iv);
        let decrypted = decipher.update(encrypted, "base64", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
}