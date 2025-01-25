import { useState } from "react";
import axios from "axios";
import { validateFormData } from "./validationUtils";

const AuthForm = ({ setLoggedIn, setUserId, setIsValidated }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
      console.log(formErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate form data
    setErrorMessage("");

    // Validate form data
    const errors = validateFormData(formData, isSignUp);
    if (isSignUp && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      const endpoint = isSignUp
        ? `${import.meta.env.VITE_BACKEND_API}/users/register`
        : `${import.meta.env.VITE_BACKEND_API}/users/login`;

      const response = await axios.post(endpoint, formData);

      if (!isSignUp) {
        const { token, user } = response.data;
        if (token && user) {
          localStorage.setItem("token", token);
          setUserId(user.id);
          setIsValidated(user.account_registered);
          setLoggedIn(true);
        } else {
          setErrorMessage("Invalid server response. Please try again.");
        }
      } else {
        alert(response.data.message);
        setIsSignUp(false);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "An error occurred. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
    setErrorMessage("");
    setFormErrors({});
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="flex justify-center bg-gray-100 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        {isSignUp && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                  formErrors.first_name
                    ? "border-red-500 ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {formErrors.first_name && (
                <p className="text-red-500 text-sm">{formErrors.first_name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                  formErrors.last_name
                    ? "border-red-500 ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {formErrors.last_name && (
                <p className="text-red-500 text-sm">{formErrors.last_name}</p>
              )}
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
              formErrors.email
                ? "border-red-500 ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm">{formErrors.email}</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
              formErrors.password
                ? "border-red-500 ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm">{formErrors.password}</p>
          )}
        </div>
        {isSignUp && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                formErrors.confirmPassword
                  ? "border-red-500 ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
        >
          {isSignUp ? "Sign Up" : "Log In"}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-blue-500 hover:underline"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
