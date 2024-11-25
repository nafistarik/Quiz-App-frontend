import { useEffect, useState } from "react"; // Import necessary hooks
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Avatar from "../assets/avater.webp"; // Adjust the path accordingly
import Logo from "../assets/logo.svg"; // Adjust the path accordingly
import { useAuth } from "../context/AuthContext.jsx"; // Import AuthContext
import { useQuiz } from "../context/QuizContext.jsx";

export default function Home() {
  const { isAuthenticated, logout } = useAuth(); // Get auth state
  const [quizzes, setQuizzes] = useState([]); // State to store quizzes
  const [loading, setLoading] = useState(true); // Loading state while fetching data
  const navigate = useNavigate(); // Navigate function for routing
  const { setQuizID } = useQuiz();

  const [fullName, setFullName] = useState("User"); // Default to "User"

  // Fetch quiz list when the component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/quizzes");
        console.log("response", response);
        const result = await response.json();
        console.log("result", result);
        if (response.ok) {
          setQuizzes(result.data); // Store quiz data if successful
          console.log("quizzes", quizzes);
        } else {
          console.error("Failed to fetch quizzes:", result.message);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };
    const name = localStorage.getItem("full_name"); // Fetch full name from localStorage
    console.log(localStorage);
    console.log("name", name);
    if (name) {
      setFullName(name); // Update state with the fetched name
    }

    fetchQuizzes();
  }, []); // Empty dependency array to run once when the component mounts

  // Handle logout
  const handleLogout = () => {
    logout(); // Call logout to update the auth state
    navigate("/login"); // Redirect to login page
  };

  const handleQuizAccess = (quiz) => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (quiz.is_attempted) {
      navigate(`/result/${quiz.id}/`);
    } else {
      setQuizID(quiz.id);
      navigate(`/quiz/${quiz.id}`);
      // navigate(`/quiz/`);
    }
  };

  return (
    <div className="bg-[#F5F3FF] min-h-screen">
      <div className="container mx-auto py-3">
        <header className="flex justify-between items-center mb-12">
          <img src={Logo} alt="logo" className="h-7" />
          <div>
            {localStorage.getItem("role") === "admin" && (
              <button
                className="px-4 py-2 rounded hover:bg-primary hover:text-white hover:bg-indigo-950 transition-colors font-jaro"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
            )}
            {!isAuthenticated ? (
              <button
                className="px-4 py-2 rounded hover:bg-primary hover:text-white hover:bg-indigo-950 transition-colors font-jaro"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded hover:bg-primary hover:text-white hover:bg-indigo-950 transition-colors font-jaro"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </header>

        <div className="text-center mb-8">
          {isAuthenticated ? (
            <div className="text-center mb-12">
              <img
                src={Avatar}
                alt="Profile Picture"
                className="w-32 h-32 rounded-full border-4 border-primary mx-auto mb-4 object-cover"
              />
              <p className="text-xl text-gray-600">Welcome</p>
              <h2 className="text-4xl font-bold text-gray-700 font-jaro">
                {fullName}
              </h2>
            </div>
          ) : (
            <h2 className="text-2xl font-bold">
              Please log in to start the quizzes.
            </h2>
          )}
        </div>

        <div>
          {loading ? (
            <p>Loading quizzes...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <img
                    src={quiz.thumbnail}
                    alt={quiz.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">{quiz.description}</p>
                  <div className="mt-4">
                    <p className="text-lg font-bold">
                      {quiz.total_questions} Questions
                    </p>
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md mt-2"
                      onClick={() => handleQuizAccess(quiz)}
                    >
                      {quiz.is_attempted ? "View Result" : "Start Quiz"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
