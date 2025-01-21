export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(?:\+92|0)?3\d{2}-?\d{7}$/; // Pakistani mobile number format
    return phoneRegex.test(phone);
};

export const validatePostalCode = (postalCode: string): boolean => {
    const postalCodeRegex = /^\d{5}$/; // Pakistani postal code format (5 digits)
    return postalCodeRegex.test(postalCode);
};

export const validateRequiredFields = (fields: Record<string, string>): string[] => {
    const errors: string[] = [];
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            errors.push(`${key} is required.`);
        }
    }
    return errors;
}; 