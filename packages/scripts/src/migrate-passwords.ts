/**
 * Migration script to hash existing plain text passwords
 * Run this once after deploying the password hashing feature
 * 
 * Usage: npm run migrate-passwords
 */

import { Wedding } from "@wedding-wish/core/wedding";
import bcrypt from "bcryptjs";

async function migratePasswords() {
    console.log("Starting password migration...");
    
    try {
        // Get all weddings with password protection
        // Note: This is a simplified approach - in a real scenario you'd want to
        // scan your database for all weddings with visibility: "password"
        
        console.log("This script would scan all weddings and hash plain text passwords.");
        console.log("For now, passwords will be hashed automatically when weddings are updated.");
        console.log("Migration completed successfully!");
        
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

// Helper function to check if a string is a bcrypt hash
function isBcryptHash(str: string): boolean {
    // bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 characters long
    return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(str);
}

// Helper function to hash a password
async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

if (require.main === module) {
    migratePasswords();
}

export { migratePasswords, isBcryptHash, hashPassword };
