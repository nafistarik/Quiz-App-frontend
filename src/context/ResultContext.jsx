import { createContext, useContext, useState } from "react";

const ResultContext = createContext();

export const useResult = () => useContext(ResultContext);

export function ResultProvider({ children }) {
  const [result, setResult] = useState(null);

  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {children}
    </ResultContext.Provider>
  );
}
