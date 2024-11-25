import { createContext, useContext, useState } from "react";

// Create a context with a default value
const QuizSetContext = createContext();

// Create a provider component
export const QuizSetProvider = ({ children }) => {
  const [quizSetId, setQuizSetId] = useState(null); // Initialize with null or your default value

  return (
    <QuizSetContext.Provider value={{ quizSetId, setQuizSetId }}>
      {children}
    </QuizSetContext.Provider>
  );
};

// Custom hook to use the context
export const useQuizSet = () => {
  const context = useContext(QuizSetContext);
  if (!context) {
    throw new Error("useQuizSet must be used within a QuizSetProvider");
  }
  return context;
};
