import { createContext, useContext, useState } from "react";

// Create the context
const QuizContext = createContext();

// Create a provider component
export const QuizProvider = ({ children }) => {
  const [quizID, setQuizID] = useState(null);

  return (
    <QuizContext.Provider value={{ quizID, setQuizID }}>
      {children}
    </QuizContext.Provider>
  );
};

// Create a custom hook to access the context easily
export const useQuiz = () => useContext(QuizContext);
