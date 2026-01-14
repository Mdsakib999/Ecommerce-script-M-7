/**
 * Validates an email address.
 * @param {string} email
 * @returns {string|null} Error message or null if valid.
 */
export const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    return null;
};

/**
 * Validates a password.
 * @param {string} password
 * @param {number} minLength
 * @returns {string|null} Error message or null if valid.
 */
export const validatePassword = (password, minLength = 6) => {
    if (!password) return "Password is required";
    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters`;
    }
    return null;
};

/**
 * Validates a required field.
 * @param {string} value
 * @param {string} fieldName
 * @returns {string|null} Error message or null if valid.
 */
export const validateRequired = (value, fieldName = "Field") => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
        return `${fieldName} is required`;
    }
    return null;
};

/**
 * Validates that two values match (e.g., password and confirm password).
 * @param {string} value
 * @param {string} matchValue
 * @param {string} fieldName
 * @returns {string|null} Error message or null if valid.
 */
export const validateMatch = (value, matchValue, fieldName = "Passwords") => {
    if (value !== matchValue) {
        return `${fieldName} do not match`;
    }
    return null;
};

/**
 * Validates a number is positive.
 * @param {number|string} value
 * @param {string} fieldName
 * @returns {string|null} Error message or null if valid.
 */
export const validatePositiveNumber = (value, fieldName = "Value") => {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
        return `${fieldName} must be a positive number`;
    }
    return null;
};
