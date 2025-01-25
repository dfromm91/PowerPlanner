export const validateFormData = (formData, isSignUp) => {
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

  if (isSignUp) {
    if (formData.first_name.length > 50) {
      errors.first_name = "First name must be under 50 characters.";
    }
    if (formData.last_name.length > 50) {
      errors.last_name = "Last name must be under 50 characters.";
    }
  }

  if (!emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!passwordRegex.test(formData.password)) {
    errors.password =
      "Password must be at least 8 characters long and include a capital letter, a special character, and a number.";
  }

  return errors;
};
