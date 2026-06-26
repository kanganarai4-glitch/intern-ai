/**
 * Validate email format
 */
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

/**
 * Validate password strength (min 8 chars, at least 1 letter + 1 number)
 */
const isStrongPassword = (password) =>
    password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);

/**
 * Sanitize a string – strip leading/trailing whitespace and limit length
 */
const sanitize = (str, maxLen = 500) =>
    typeof str === 'string' ? str.trim().substring(0, maxLen) : '';

/**
 * Parse a comma-separated skills string into an array
 */
const parseSkills = (raw) =>
    (raw || '')
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

/**
 * Simple Levenshtein distance for fuzzy skill matching
 */
const levenshtein = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] =
                a[i - 1] === b[j - 1]
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[a.length][b.length];
};

/**
 * Format file size in human-readable units
 */
const formatFileSize = (bytes) => {
    if (bytes < 1024)          return `${bytes} B`;
    if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

module.exports = { isValidEmail, isStrongPassword, sanitize, parseSkills, levenshtein, formatFileSize };
