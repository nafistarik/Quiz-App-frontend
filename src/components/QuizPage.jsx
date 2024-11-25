import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../assets/avater.webp";
import Logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";
import { useQuiz } from "../context/QuizContext";
import { useResult } from "../context/ResultContext";

// Fisher-Yates Shuffle Algorithm
const shuffleArray = (array) => {
  console.log("Shuffling array:", array); // Debugging log
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [quiz, setQuiz] = useState({});
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { setResult } = useResult();

  const { quizID } = useQuiz();

  console.log(`Quiz ${quizID}`);

  const handleAnswerChange = (questionId, selectedOption) => {
    console.log("Answer selected:", { questionId, selectedOption }); // Debugging log
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmitQuiz = async () => {
    console.log("Submitting quiz with answers:", userAnswers); // Debugging log
    try {
      const token = localStorage.getItem("accessToken");
      console.log(quiz.id);
      const response = await axios.post(
        `http://localhost:5000/api/quizzes/${quiz.id}/attempt`,
        { answers: userAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response from submit quiz API:", response.data); // Debugging log

      const { correct_answers, submitted_answers, score, total_questions } =
        response.data.data;

      // Include `questions` in the result object
      const result = {
        quizDetails: {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
        },
        questions, // Added questions array to result
        totalQuestions: total_questions,
        attemptedQuestions: Object.keys(userAnswers).length,
        score,
        userAnswers: submitted_answers.reduce((acc, item) => {
          acc[item.question_id] = item.answer;
          return acc;
        }, {}),
        correctAnswers: correct_answers.reduce((acc, item) => {
          acc[item.question_id] = item.answer;
          return acc;
        }, {}),
      };

      console.log("Result object to set in context:", result); // Debugging log
      setResult(result);

      console.log("Navigating to result page"); // Debugging log
      navigate(`/result/${quiz.id}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);

      if (error.response?.status === 409) {
        alert("You have already completed this quiz.");
      }
    }
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      console.log("Fetching quiz with ID:", quizID); // Verify quizID
      if (!quizID) {
        console.error("Quiz ID is not available.");
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${quizID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Quiz data fetched from API:", response.data); // Full API response

        console.log("Quiz data fetched from API:", response.data.data);

        if (response.data.data) {
          const quizData = response.data.data;
          console.log("Extracted quiz data:", quizData); // Extracted quiz data
          setQuiz({
            id: quizData.id,
            title: quizData.title,
            description: quizData.description,
          });

          const processedQuestions = quizData.questions.map((q) => ({
            ...q,
            options: shuffleArray([...q.options]),
          }));

          console.log("Processed and shuffled questions:", processedQuestions); // Shuffled questions
          setQuestions(processedQuestions);
        } else {
          console.warn("No quiz data found for the provided quiz ID.");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
        console.log("Finished fetching quiz data."); // Completion log
      }
    };

    fetchQuiz();
  }, []);

  if (loading) {
    console.log("Loading state is true. Showing loading message."); // Debugging log
    return <div>Loading...</div>;
  }

  if (questions.length === 0) {
    console.log("No questions available."); // Debugging log
    return <div>No questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-[#F5F3FF] min-h-screen">
      <div className="container mx-auto py-3">
        <header className="flex justify-between items-center mb-8">
          <a href="/">
            <img src={Logo} className="h-7" alt="Logo" />
          </a>
          <button
            onClick={logout}
            className="px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors font-jaro"
          >
            Logout
          </button>
        </header>

        <main className="max-w-8xl mx-auto h-[calc(100vh-10rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-full">
            <div className="lg:col-span-1 bg-white rounded-md p-6 h-full flex flex-col">
              <div>
                <h2 className="text-4xl font-bold mb-4">{quiz.title}</h2>
                <p className="text-gray-600 mb-4">{quiz.description}</p>

                <div className="flex flex-col">
                  <div className="w-fit bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Total questions: {questions.length}
                  </div>
                  <div className="w-fit bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Participation: {currentQuestionIndex + 1}
                  </div>
                  <div className="w-fit bg-gray-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Remaining: {questions.length - currentQuestionIndex - 1}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex items-center">
                <img
                  src={Avatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <span className="text-black font-semibold">
                  {localStorage.getItem("full_name")}
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white">
              <div className="bg-white p-6 !pb-2 rounded-md">
                <h3 className="text-2xl font-semibold mb-2">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 py-3 px-4 bg-primary/5 rounded-md text-lg"
                    >
                      <input
                        type="radio"
                        name={`answer-${currentQuestion.id}`}
                        className="form-radio text-buzzr-purple"
                        checked={userAnswers[currentQuestion.id] === option}
                        onChange={() =>
                          handleAnswerChange(currentQuestion.id, option)
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="w-1/2 text-center ml-auto block bg-green-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-green-700 focus:outline-none"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      console.log("Navigating to next question."); // Debugging log
                      setCurrentQuestionIndex((prev) => prev + 1);
                    }}
                    className="w-1/2 text-center ml-auto block bg-primary text-white py-2 px-4  mt-4 rounded-md hover:bg-indigo-800"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="mt-6 mb-3 opacity-40 text-center text-sm">
        Developed with <span className="text-red-600">&hearts;</span>
      </footer>
    </div>
  );
}
