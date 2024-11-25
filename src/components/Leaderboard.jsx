import React, { useEffect, useState } from "react";
import Avater from "../assets/avater.webp";
import Logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";
import { useResult } from "../context/ResultContext";

export default function Leaderboard() {
  const { logout } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [topFive, setTopFive] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(logout);

  const { result } = useResult();

  const quizSetId = result.quizDetails.id; // Replace with dynamic quiz set ID

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      console.log("Fetching data from API...");

      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(
          `http://localhost:5000/api/quizzes/${quizSetId}/attempts`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data1 = await response.json();
        const data = data1.data.attempts;

        // Process leaderboard data
        const leaderboard = data
          .map((participant) => {
            const { correct_answers, submitted_answers, user, id } =
              participant;
            console.log(participant);

            if (!correct_answers || !submitted_answers) return null;

            // Calculate correct answers
            const correctAnswers = submitted_answers.filter((submitted) =>
              correct_answers.some(
                (correct) =>
                  correct.question_id === submitted.question_id &&
                  correct.answer === submitted.answer
              )
            ).length;

            console.log(correctAnswers);

            // Calculate wrong answers
            const wrongAnswers = submitted_answers.length - correctAnswers;

            console.log(wrongAnswers);

            return {
              id,
              name: user.full_name || "Unknown",
              correct: correctAnswers,
              wrong: wrongAnswers,
              score: correctAnswers * 5, // Custom scoring
            };
          })
          .filter(Boolean);
        console.log("leaderboard", leaderboard);

        const userBoard = leaderboard[0];

        console.log("userBoard", userBoard);

        // Sort by score
        leaderboard.sort((a, b) => b.score - a.score);

        console.log("leaderboard", leaderboard);
        // Update state
        setLeaderboardData(leaderboard);
        setTopFive(leaderboard.slice(0, 5)); // Top 5 participants

        // Set current user
        const loggedInUserId = userBoard.id; // Adjust based on actual user data
        console.log(loggedInUserId);
        const currentUserData = leaderboard.find(
          (participant) => participant.id === loggedInUserId
        );
        console.log("currentUserData", currentUserData);

        setCurrentUser({
          ...currentUserData,
          rank: leaderboard.indexOf(currentUserData) + 1,
        });
        console.log("currentUser", currentUser);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz attempts:", error.message);
        setLoading(false);
      }
    };

    fetchQuizAttempts();
  }, [quizSetId]);

  return (
    <body className="bg-[#F5F3FF]  p-4">
      <header className="flex justify-between items-center">
        <a href="/">
          <img src={Logo} className="h-7" />
        </a>
        <div onClick={logout}>
          <button className="px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors font-jaro">
            Logout
          </button>
        </div>
      </header>

      <main className="min-h-[calc(100vh-50px)] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
          {loading ? (
            <p className="text-center p-8">Loading leaderboard...</p>
          ) : (
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Current User Section */}
              <div className="bg-primary rounded-lg p-6 text-white">
                {currentUser ? (
                  <div>
                    {/* User Information */}
                    <div className="flex flex-col items-center mb-6">
                      <img
                        src={Avater} // Replace with dynamic user avatar if available
                        alt="Profile Pic"
                        className="w-20 h-20 rounded-full border-4 border-white mb-4 object-cover"
                      />
                      <h2 className="text-2xl font-bold">
                        {currentUser.name || "Unknown"}
                      </h2>
                      <p className="text-xl">
                        {currentUser.rank
                          ? `${currentUser.rank} Position`
                          : "No rank"}
                      </p>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-sm opacity-75">Mark</p>
                        <p className="text-2xl font-bold">
                          {currentUser.score !== undefined
                            ? currentUser.score
                            : 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm opacity-75">Correct</p>
                        <p className="text-2xl font-bold">
                          {currentUser.correct !== undefined
                            ? currentUser.correct
                            : 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm opacity-75">Wrong</p>
                        <p className="text-2xl font-bold">
                          {currentUser.wrong !== undefined
                            ? currentUser.wrong
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center">No user data available</p>
                )}
              </div>

              {/* Leaderboard Section */}
              <div>
                <h1 className="text-2xl font-bold">Leaderboard</h1>
                <p className="mb-6">React Hooks Quiz</p>
                <ul className="space-y-4">
                  {leaderboardData.map((participant, index) => (
                    <li
                      key={participant.id}
                      className={`flex items-center justify-between ${
                        topFive.includes(participant) ? "bg-gray-200" : ""
                      } ${
                        participant.id === currentUser?.id
                          ? "bg-yellow-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <img
                          src={Avater}
                          alt={participant.name}
                          className="object-cover w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="font-semibold">{participant.name}</h3>
                          <p className="text-sm text-gray-500">
                            {index + 1} Position
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">{participant.score}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </body>
  );
}
