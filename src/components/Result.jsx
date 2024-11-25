import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import LogoWhite from "../assets/logo-white.svg";
import { useResult } from "../context/ResultContext";

export default function ResultPage() {
  const navigate = useNavigate();
  const { result } = useResult();

  console.log("ResultPage: Loaded Component"); // Log component load

  // Check if the result object exists
  if (!result) {
    console.error("ResultPage: No result data found in context."); // Log missing result
    return (
      <div className="bg-gray-100 text-gray-800 min-h-screen flex justify-center items-center">
        <p className="text-lg font-bold">
          No result data available. Please try again.
        </p>
      </div>
    );
  }

  // Log the result data to inspect its structure
  console.log("ResultPage: Result data fetched:", result);

  const { questions, userAnswers } = result;

  // Defensive checks to ensure questions and userAnswers exist
  if (!questions || !Array.isArray(questions)) {
    console.error(
      "ResultPage: Questions array is missing or invalid.",
      questions
    );
    return (
      <div className="bg-gray-100 text-gray-800 min-h-screen flex justify-center items-center">
        <p className="text-lg font-bold">
          Error: Questions data is unavailable. Please try again later.
        </p>
      </div>
    );
  }

  if (!userAnswers || typeof userAnswers !== "object") {
    console.error(
      "ResultPage: User answers data is missing or invalid.",
      userAnswers
    );
    return (
      <div className="bg-gray-100 text-gray-800 min-h-screen flex justify-center items-center">
        <p className="text-lg font-bold">
          Error: User answers data is unavailable. Please try again later.
        </p>
      </div>
    );
  }

  // Log the number of questions and user answers
  console.log("ResultPage: Total Questions:", questions.length);
  console.log("ResultPage: User Answers:", userAnswers);

  // Calculate scores
  const totalQuestions = questions.length;
  const correctCount = questions.filter(
    (q) => userAnswers[q.id] === q.correctAnswer
  ).length;
  const wrongCount = totalQuestions - correctCount;

  // Log the scores
  console.log("ResultPage: Correct Answers Count:", correctCount);
  console.log("ResultPage: Wrong Answers Count:", wrongCount);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="flex min-h-screen overflow-hidden">
        {/* Sidebar */}
        <img
          src={LogoWhite}
          className="max-h-11 fixed left-6 top-6 z-50"
          alt="Logo"
        />

        <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center p-12">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-2">Quiz Results</h2>
            <p>Your performance at a glance.</p>
            <div className="my-6 flex items-center">
              <div className="w-1/2">
                <div className="flex gap-6 my-6">
                  <div>
                    <p className="font-semibold text-2xl my-0 text-center">
                      {totalQuestions}
                    </p>
                    <p className="text-gray-300">Questions</p>
                  </div>
                  <div>
                    <p className="font-semibold text-2xl my-0 text-center">
                      {correctCount}
                    </p>
                    <p className="text-gray-300">Correct</p>
                  </div>
                  <div>
                    <p className="font-semibold text-2xl my-0 text-center">
                      {wrongCount}
                    </p>
                    <p className="text-gray-300">Wrong</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(`/leaderboard/${result.quizDetails.id}`)
                  }
                  className="bg-secondary py-3 rounded-md hover:bg-secondary/90 transition-colors text-lg font-medium underline text-white"
                >
                  View Leaderboard
                </button>
              </div>
              <div className="w-1/2 bg-primary/80 rounded-md border border-white/20 flex items-center p-4">
                <div className="flex-1">
                  <p className="text-2xl font-bold">
                    {correctCount * 5} / {totalQuestions * 5}
                  </p>
                  <p>Your Mark</p>
                </div>
                <div className="w-20 h-20">
                  <CircularProgressbar
                    value={(correctCount / totalQuestions) * 100}
                    text={`${Math.round(
                      (correctCount / totalQuestions) * 100
                    )}%`}
                    styles={buildStyles({
                      textColor: "#ffffff",
                      pathColor: "#05a4c3",
                      trailColor: "#d7d7d7",
                      textSize: "25px",
                      fontWeight: "bold",
                    })}
                    className="font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-1/2 flex items-center justify-center h-full p-8">
          <div className="h-[calc(100vh-50px)] overflow-y-scroll w-full">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              // const isCorrect = userAnswer === question.correctAnswer;

              // Log each question details
              console.log(`Question ${index + 1}:`, {
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                userAnswer,
              });

              return (
                <div
                  key={question.id}
                  className="rounded-lg overflow-hidden shadow-sm  bg-white p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Q{index + 1}: {question.question}
                  </h3>
                  <ul className="space-y-2">
                    {question.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={`px-4 py-2 border rounded ${
                          option === question.correctAnswer
                            ? "bg-green-300 text-green-900"
                            : userAnswer === option
                            ? "bg-red-300 text-red-900"
                            : "bg-gray-50"
                        }`}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                  {/* <div className="mt-4">
                    <p>
                      <strong>Your Answer:</strong>{" "}
                      <span
                        className={`${
                          isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {userAnswer || "Not Answered"}
                      </span>
                    </p>
                    <p>
                      <strong>Correct Answer:</strong>{" "}
                      <span className="text-green-600">
                        {question.correctAnswer}
                      </span>
                    </p>
                  </div> */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
