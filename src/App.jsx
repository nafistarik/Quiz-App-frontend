import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Leaderboard from "./components/Leaderboard";
import Login from "./components/Login";
import QuizEntry from "./components/QuizEntry";
import QuizPage from "./components/QuizPage";
import QuizSet from "./components/QuizSet";
import Registration from "./components/Registration";
import Result from "./components/Result";
import { AuthProvider } from "./context/AuthContext";
import { QuizProvider } from "./context/QuizContext";
import { QuizSetProvider } from "./context/QuizIdContext";
import { ResultProvider } from "./context/ResultContext";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <ResultProvider>
        <QuizProvider>
          <QuizSetProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicRoute component={Home} />} />
                <Route
                  path="/login"
                  element={<PublicRoute component={Login} restricted={true} />}
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute component={Registration} restricted={true} />
                  }
                />
                <Route
                  path="/leaderboard/:id"
                  element={<PublicRoute component={Leaderboard} />}
                />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/quiz/:id" element={<QuizPage />} />
                  <Route path="/result/:id" element={<Result />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/quiz-entry" element={<QuizEntry />} />
                  <Route path="/quiz-set" element={<QuizSet />} />
                </Route>
              </Routes>
            </Router>
          </QuizSetProvider>
        </QuizProvider>
      </ResultProvider>
    </AuthProvider>
  );
}

export default App;
