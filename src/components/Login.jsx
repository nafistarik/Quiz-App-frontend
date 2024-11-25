import { useState } from "react"; // Import useState to manage error message state
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Logo from "../assets/logo.svg";

import { useAuth } from "../context/AuthContext.jsx"; // Import AuthContext

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Import setValue to reset form fields if needed
  } = useForm();

  const navigate = useNavigate();
  const { login } = useAuth(); // Use AuthContext for login state
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      console.log("login data:", data);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Response Status:", response.status);
      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        const refreshToken = result.data.tokens.refreshToken;
        const accessToken = result.data.tokens.accessToken;
        const { full_name, role } = result.data.user; // Assume 'role' indicates whether the user is an Admin

        // Check if the user is trying to log in as Admin
        if (data.admin && role !== "admin") {
          setErrorMessage("This email is not registered as an Admin.");
          return; // Prevent login if the user is not an Admin
        }

        if (!data.admin && role === "admin") {
          setErrorMessage("Admins cannot log in without the Admin checkbox.");
          return; // Prevent login if an Admin tries to log in without checking the Admin box
        }

        // Use AuthContext login to update state and store the token
        login(refreshToken, accessToken, full_name, role);

        navigate("/"); // Redirect to the home page
      } else {
        setErrorMessage(
          result.message || "Invalid login credentials. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white text-gray-800 overflow-hidden">
      <div className="flex min-h-screen">
        {/* Left Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative">
          <div className="text-white">
            <img src={Logo} alt="Illustration" className="mx-auto" />
            <h2 className="text-3xl font-bold mb-4">Sign in Now</h2>
            <p className="text-xl mb-4">Boost Your Learning Capabilities</p>
            <p className="mb-8">
              Logging in unlocks your personal progress tracker, letting you
              evaluate your performance and see how you stack up against others.
              Whether you're preparing for exams, improving your knowledge, or
              simply having fun, there's no better way to sharpen your mind.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-8 flex gap-2 items-center">
              <span>Welcome to</span>
              <img src={"/Saly-1.png"} className="h-7" alt="Logo" />
            </h2>
            <h1 className="text-5xl font-bold mb-8">Sign in</h1>

            {/* Display error message if there is one */}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
                <span className="mr-2">⚠️</span>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                  Enter your email address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label htmlFor="password" className="block mb-2">
                  Enter your Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Admin Checkbox */}
              <div className="mb-6 flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="admin"
                  {...register("admin")}
                  className="px-4 py-3 rounded-lg border border-gray-300"
                />
                <label htmlFor="admin" className="block">
                  Login as Admin
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg mb-4"
              >
                Sign in
              </button>
            </form>

            <div className="text-center">
              <a href="#" className="text-primary">
                Forgot Password
              </a>
            </div>

            <div className="mt-8">
              <p className="text-center">
                No Account?{" "}
                <a
                  onClick={() => navigate("/register")}
                  href="#"
                  className="text-primary"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
