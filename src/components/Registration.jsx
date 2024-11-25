import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LogoWhite from "../assets/logo-white.svg";
import Logo from "../assets/logo.svg";
import Saly1 from "../assets/Saly-1.png";

export default function Registration() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Watch the form fields dynamically
  } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate(); // Initialize navigate for redirection

  const onSubmit = async (data) => {
    console.log("Registration data:", data); // Log the form data for debugging

    // Set the role based on the checkbox value
    const role = data.isAdmin ? "admin" : "user"; // If isAdmin is checked, set role to "admin"

    const formData = { ...data, role }; // Add role to form data

    try {
      // Make API call to register the user
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send updated form data with role
      });

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok) {
        console.log("User registered successfully", result);
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        setErrorMessage(
          result.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="bg-white text-gray-800">
      <div className="flex min-h-screen max-h-screen">
        {/* Left side content */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 h-full fixed left-0 top-0">
          <div className="text-white">
            <img src={Saly1} className="h-8" />
            <img
              src={LogoWhite}
              alt="Illustration"
              className="mx-auto 2xl:ml-0 max-h-64 max-w-lg"
            />
            <h2 className="text-3xl font-bold mb-1">Sign Up Now</h2>
            <p className="text-xl mb-4 font-medium">
              Boost Your Learning Capabilities
            </p>
            <p className="mb-8 max-w-lg">
              Logging in unlocks your personal progress tracker, letting you
              evaluate your performance and see how you stack up against others.
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div className="fixed right-0 top-0 w-full h-full lg:w-1/2 flex items-start xl:items-center justify-center p-6 lg:p-8 xl:p-12 overflow-y-auto xl:overflow-hidden">
          <div className="w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-3 flex gap-2 items-center">
              <span>Welcome to</span>
              <img src={Logo} className="h-7" />
            </h2>
            <h1 className="text-4xl font-bold mb-6">Sign Up</h1>

            {/* Error Message Display */}
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="John Doe"
                  {...register("full_name", {
                    required: "Full Name is required",
                  })}
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="Email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="flex gap-4">
                {/* Password */}
                <div className="mb-6">
                  <label htmlFor="password" className="block mb-2">
                    Enter your Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Admin Checkbox */}
              <div className="mb-6 flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="admin"
                  className="px-4 py-3 rounded-lg border border-gray-300"
                  {...register("isAdmin")} // Register checkbox field with React Hook Form
                />
                <label htmlFor="admin" className="block">
                  Register as Admin
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg mb-2"
              >
                Create Account
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-2 text-gray-400">
              <p className="text-center">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-primary"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
