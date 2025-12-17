#!/usr/bin/env node

/**
 * API Key Security Verification Script
 * Checks files for exposed API keys before committing to GitHub
 * 
 * Usage: node .scripts/check-api-keys.cjs [file1] [file2] ...
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patterns to detect API keys and sensitive data
const SENSITIVE_PATTERNS = [
    // API Keys
    /AIza[0-9A-Za-z-_]{35}/gi, // Google API Keys
    /sk_live_[0-9a-zA-Z]{24,}/gi, // Stripe Live Keys
    /pk_live_[0-9a-zA-Z]{24,}/gi, // Stripe Publishable Keys
    /rk_live_[0-9a-zA-Z]{24,}/gi, // Stripe Restricted Keys
    /sk_test_[0-9a-zA-Z]{24,}/gi, // Stripe Test Keys
    /hf_[a-zA-Z0-9]{20,}/gi, // HuggingFace API Keys
    /ghp_[a-zA-Z0-9]{36,}/gi, // GitHub Personal Access Tokens
    /gho_[a-zA-Z0-9]{36,}/gi, // GitHub OAuth Tokens

    // Firebase
    /firebase[a-zA-Z]*["\s:=]+["\s]*[a-zA-Z0-9-_]{20,}/gi,
    /apiKey["\s:=]+["\s]*[a-zA-Z0-9-_]{20,}/gi,
    /authDomain["\s:=]+["\s]*[a-zA-Z0-9-_.]+\.firebaseapp\.com/gi,

    // Generic patterns
    /api[_-]?key["\s:=]+["\s]*[a-zA-Z0-9-_]{20,}/gi,
    /secret[_-]?key["\s:=]+["\s]*[a-zA-Z0-9-_]{20,}/gi,
    /access[_-]?token["\s:=]+["\s]*[a-zA-Z0-9-_]{20,}/gi,
    /auth[_-]?token["\s:=]+["\s]*[a-zA-Z0-9-_]{20,}/gi,

    // Environment variable assignments
    /VITE_[A-Z_]+=[a-zA-Z0-9-_]{20,}/gi,
    /REACT_APP_[A-Z_]+=[a-zA-Z0-9-_]{20,}/gi,
    /NEXT_PUBLIC_[A-Z_]+=[a-zA-Z0-9-_]{20,}/gi,
];

// Files and directories to always skip
const SKIP_PATTERNS = [
    '.env.example',
    '.env.template',
    'node_modules',
    '.git',
    'dist',
    'build',
    '.scripts/check-api-keys.mjs', // Skip this file itself
];

// Safe patterns that look like keys but aren't
const SAFE_PATTERNS = [
    /YOUR_API_KEY_HERE/gi,
    /REPLACE_WITH_YOUR_KEY/gi,
    /example\.com/gi,
    /placeholder/gi,
    /\*{10,}/gi, // Masked keys like ********
];

/**
 * Check if file should be skipped
 */
function shouldSkipFile(filePath) {
    return SKIP_PATTERNS.some(pattern => filePath.includes(pattern));
}

/**
 * Check if match is a safe placeholder
 */
function isSafePlaceholder(match) {
    return SAFE_PATTERNS.some(pattern => pattern.test(match));
}

/**
 * Scan file for sensitive data
 */
function scanFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${filePath}`);
        return { found: false, matches: [] };
    }

    if (shouldSkipFile(filePath)) {
        return { found: false, matches: [], skipped: true };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const matches = [];

    SENSITIVE_PATTERNS.forEach(pattern => {
        const found = content.match(pattern);
        if (found) {
            found.forEach(match => {
                if (!isSafePlaceholder(match)) {
                    // Find line number
                    const lines = content.split('\n');
                    let lineNumber = 0;
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].includes(match)) {
                            lineNumber = i + 1;
                            break;
                        }
                    }

                    matches.push({
                        match: match.substring(0, 20) + '...', // Truncate for safety
                        line: lineNumber,
                        pattern: pattern.toString(),
                    });
                }
            });
        }
    });

    return {
        found: matches.length > 0,
        matches,
    };
}

/**
 * Main execution
 */
function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node check-api-keys.mjs [file1] [file2] ...');
        console.log('Or use: git diff --name-only | node check-api-keys.mjs');
        process.exit(0);
    }

    let hasIssues = false;
    const results = [];

    args.forEach(filePath => {
        const result = scanFile(filePath);

        if (result.skipped) {
            console.log(`⏭️  Skipped: ${filePath}`);
            return;
        }

        if (result.found) {
            hasIssues = true;
            console.log(`\n🚨 SECURITY ALERT: ${filePath}`);
            result.matches.forEach(m => {
                console.log(`   Line ${m.line}: Found potential API key: ${m.match}`);
            });
            results.push({ file: filePath, ...result });
        } else {
            console.log(`✅ Clean: ${filePath}`);
        }
    });

    if (hasIssues) {
        console.log('\n❌ COMMIT BLOCKED: Sensitive data detected!');
        console.log('\n📋 Action Required:');
        console.log('1. Remove API keys from the files listed above');
        console.log('2. Use environment variables (.env.local) instead');
        console.log('3. Ensure .env.local is in .gitignore');
        console.log('4. Run this check again before committing\n');
        process.exit(1);
    } else {
        console.log('\n✅ All files are clean! Safe to commit.\n');
        process.exit(0);
    }
}

// Run main
main();
