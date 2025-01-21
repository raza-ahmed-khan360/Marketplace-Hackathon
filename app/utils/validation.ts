interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long'
    };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter'
    };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter'
    };
  }

  // Check for number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number'
    };
  }

  // Check for special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character'
    };
  }

  return {
    isValid: true
  };
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return {
    isValid: true
  };
}

export function validateName(name: string): ValidationResult {
  if (!name) {
    return {
      isValid: false,
      error: 'Name is required'
    };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters long'
    };
  }

  if (!/^[a-zA-Z\s]*$/.test(name)) {
    return {
      isValid: false,
      error: 'Name can only contain letters and spaces'
    };
  }

  return {
    isValid: true
  };
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return {
      isValid: false,
      error: 'Phone number is required'
    };
  }

  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length < 10) {
    return {
      isValid: false,
      error: 'Phone number must be at least 10 digits'
    };
  }

  return {
    isValid: true
  };
}

export function validatePostalCode(postalCode: string): ValidationResult {
  if (!postalCode) {
    return {
      isValid: false,
      error: 'Postal code is required'
    };
  }

  // This is a basic check - you might want to customize based on your country requirements
  if (postalCode.length < 5) {
    return {
      isValid: false,
      error: 'Postal code must be at least 5 characters'
    };
  }

  return {
    isValid: true
  };
}

export function validateAddress(address: string): ValidationResult {
  if (!address) {
    return {
      isValid: false,
      error: 'Address is required'
    };
  }

  if (address.length < 5) {
    return {
      isValid: false,
      error: 'Please enter a complete address'
    };
  }

  return {
    isValid: true
  };
} 