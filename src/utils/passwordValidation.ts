/**
 * Password validation utilities based on Supabase recommendations
 * - Minimum length: 12 characters
 * - Strength estimate based on length + character class variety
 * - Common password rejection (small local set for instant feedback)
 * - Server-side HIBP check should be implemented separately
 */

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export interface ValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  hint: string;
  hintColor: string;
}

// Small local set of common passwords for instant client-side rejection
// Keep this small to avoid bundle bloat - authoritative HIBP check should be server-side
const COMMON_PASSWORDS = new Set([
  '123456',
  'password',
  '123456789',
  'qwerty',
  '12345678',
  '111111',
  'password123',
  '12345',
  '1234567',
  'letmein',
  'abc123',
  'monkey',
  'master',
  'dragon',
  'sunshine',
  'iloveyou',
  'trustno1',
  'princess',
  'adobe123',
  'admin',
  'hello',
  'welcome',
  'login',
  'starwars',
  'passw0rd',
]);

const STRENGTH_LABELS = [
  { label: 'Very weak', color: '#e74c3c' },
  { label: 'Weak', color: '#f39c12' },
  { label: 'Okay', color: '#f1c40f' },
  { label: 'Strong', color: '#2ecc71' },
  { label: 'Very strong', color: '#27ae60' },
];

/**
 * Count the number of character classes used in the password
 */
function charClasses(password: string): number {
  const lower = /[a-z]/.test(password);
  const upper = /[A-Z]/.test(password);
  const digit = /[0-9]/.test(password);
  const symbol = /[^A-Za-z0-9]/.test(password);

  return [lower, upper, digit, symbol].filter(Boolean).length;
}

/**
 * Estimate password strength based on length and character variety
 * Returns a score (0-6), label, and color for UI display
 */
function estimateStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: '', color: '#ddd' };
  }

  let score = 0;

  // Length scoring
  if (password.length >= 12) score += 2;
  if (password.length >= 16) score += 1;
  score += Math.min(charClasses(password), 3); // up to +3 for variety
  if (password.length >= 24) score += 1; // reward long passphrases

  // Normalize to 0-6 scale
  const maxScore = 6;
  const idx = Math.min(
    Math.floor((score / maxScore) * (STRENGTH_LABELS.length - 1)),
    STRENGTH_LABELS.length - 1
  );

  return {
    score,
    label: STRENGTH_LABELS[idx].label,
    color: STRENGTH_LABELS[idx].color,
  };
}

/**
 * Validate a password and provide UI feedback
 * @param password - The password to validate
 * @returns Validation result with strength info and hints
 */
export function validatePassword(password: string): ValidationResult {
  const trimmedPassword = password.trim();

  // Check for common passwords
  if (COMMON_PASSWORDS.has(trimmedPassword)) {
    return {
      isValid: false,
      strength: { score: 0, label: '', color: '#ddd' },
      hint: 'This password is too common. Choose a different one.',
      hintColor: '#e74c3c',
    };
  }

  const { label, color } = estimateStrength(trimmedPassword);

  // Provide hints based on password characteristics
  let hint = '';
  let hintColor = '';
  const isValid = trimmedPassword.length >= 12;

  if (trimmedPassword.length > 0 && trimmedPassword.length < 12) {
    hint = 'Password should be at least 12 characters.';
    hintColor = '#f39c12';
  } else if (trimmedPassword.length >= 12 && charClasses(trimmedPassword) < 2) {
    hint = 'Try adding numbers, uppercase letters, or symbols (or use a long passphrase).';
    hintColor = '#f1c40f';
  } else {
    hint = 'Good! Long passphrases are recommended. Consider using a password manager.';
    hintColor = '#2ecc71';
  }

  return {
    isValid,
    strength: { score: 0, label, color },
    hint,
    hintColor,
  };
}

/**
 * Check if a password meets minimum requirements
 * @param password - The password to check
 * @returns true if password meets minimum requirements (12+ chars, not common)
 */
export function isPasswordValid(password: string): boolean {
  const trimmedPassword = password.trim();
  return (
    trimmedPassword.length >= 12 &&
    !COMMON_PASSWORDS.has(trimmedPassword)
  );
}

/**
 * Get common password check result (for pre-submit validation)
 * @param password - The password to check
 * @returns true if password is in common passwords list
 */
export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.trim());
}
