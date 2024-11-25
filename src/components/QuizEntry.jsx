import axios from "axios";
import React, { useState } from "react";
import Avater from "../assets/avater.webp";
import LogoWhite from "../assets/logo-white.svg";
import { useAuth } from "../context/AuthContext";
import { useQuizSet } from "../context/QuizIdContext";

export default function QuizEntry() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const [isEditing, setIsEditing] = useState(false); // Tracks editing mode
  const [editingQuestionId, setEditingQuestionId] = useState(null); // ID of question being edited

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectAnswerChange = (index, isChecked) => {
    const updatedOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index ? isChecked : false, // Ensure only one option is correct
    }));
    setOptions(updatedOptions);
  };

  const { quizSetId } = useQuizSet();
  const { logout } = useAuth();

  console.log("Quiz Set ID:", quizSetId);

  const addQuestion = async () => {
    try {
      console.log("Initial options:", options);
      console.log("Initial quiz title:", quizTitle);

      const correctOption = options.find((opt) => opt.isCorrect);
      if (!correctOption) {
        alert("Mark one option as the correct answer.");
        return;
      }

      const cleanedOptions = options.map((opt) => opt.text.trim());
      const correctAnswer = correctOption.text.trim();

      const newQuestion = {
        question: quizTitle,
        options: cleanedOptions,
        correctAnswer,
      };

      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Authentication required. Please login.");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/admin/quizzes/${quizSetId.id}/questions`,
        newQuestion,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions, response.data];
        console.log(
          "Updated questions array inside setState:",
          updatedQuestions
        );
        return updatedQuestions;
      });

      // Clear input fields
      setQuizTitle("");
      setOptions([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      alert("Question added successfully!");
    } catch (error) {
      console.error("Failed to add question:", error);
    }
  };

  React.useEffect(() => {
    console.log("Questions state updated:", questions);
  }, [questions]);

  const deleteQuestion = async (questionId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `http://localhost:5000/api/admin/questions/${questionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Adjust to filter based on `data.id`
      setQuestions(questions.filter((q) => q.data.id !== questionId));
      alert("Question deleted successfully!");
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const updateQuestion = async (updatedData) => {
    try {
      if (!updatedData?.id) {
        console.error("Invalid question data. Cannot update.");
        return;
      }

      console.log("Attempting to update question with ID:", updatedData.id);
      console.log("Payload:", updatedData);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found. User may not be authenticated.");
        return;
      }
      console.log("Token:", token);

      // Make API call to update the question
      const response = await axios.patch(
        `http://localhost:5000/api/admin/questions/${updatedData.id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Update response:", response.data);

      // Update the questions array in state
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.data.id === updatedData.id ? { ...q, data: updatedData } : q
        )
      );

      alert("Question updated successfully!");
    } catch (error) {
      if (error.response?.status === 404) {
        console.error("Question not found. Check the ID or database.");
      } else {
        console.error("Failed to update question:", error);
      }
    }
  };

  const startEditing = (question) => {
    setQuizTitle(question.question); // Populate question title
    setOptions(
      question.options.map((opt, index) => ({
        text: opt,
        isCorrect: question.correctAnswer === opt,
      }))
    ); // Populate options
    setIsEditing(true);
    setEditingQuestionId(question.id); // Track the ID of the question being edited
  };

  const saveQuestion = async () => {
    if (isEditing) {
      // Update existing question
      const correctOption = options.find((opt) => opt.isCorrect);
      if (!correctOption) {
        alert("Mark one option as the correct answer.");
        return;
      }

      const updatedData = {
        id: editingQuestionId,
        question: quizTitle,
        options: options.map((opt) => opt.text.trim()),
        correctAnswer: correctOption.text.trim(),
      };

      await updateQuestion(updatedData); // Call the update function
      setIsEditing(false); // Exit editing mode
      setEditingQuestionId(null);
    } else {
      // Add a new question
      await addQuestion();
    }

    // Clear input fields
    setQuizTitle("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
  };

  return (
    <div className="bg-[#F5F3FF] min-h-screen flex">
      <aside className="hidden md:w-64 bg-primary p-6 md:flex flex-col">
        <div className="mb-10">
          <a href="/">
            <img src={LogoWhite} className="h-7" alt="Logo" />
          </a>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="block py-2 px-4 rounded-lg bg-buzzr-purple bg-white text-primary font-bold"
              >
                Quizzes
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary"
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary"
              >
                Manage Users
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary"
              >
                Manage Roles
              </a>
            </li>
            <li>
              <a
                onClick={logout}
                href="#"
                className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary"
              >
                Logout
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-auto flex items-center">
          <img
            src={Avater}
            alt="Admin"
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <span className="text-white font-semibold">
            {localStorage.getItem("full_name")}
          </span>
        </div>
      </aside>

      <main className="md:flex-grow px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-8 lg:gap-12">
            {/* Create Quiz Form */}
            <div>
              <h2 className="text-3xl font-bold mb-4">
                {quizSetId && quizSetId.title}
              </h2>
              <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-4">
                Total number of questions: {questions.length}
              </div>
              <p className="text-gray-600 mb-4">
                {quizSetId && quizSetId.description}
              </p>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">
                  {isEditing ? "Edit Quiz Question" : "Create Quiz Question"}
                </h2>
                <div>
                  <label
                    htmlFor="quizTitle"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Question Title
                  </label>
                  <input
                    type="text"
                    id="quizTitle"
                    name="quizTitle"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full mt-2 p-2 border border-input rounded-md bg-background text-foreground"
                    placeholder="Enter question"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4">Add Options</p>

                <div id="optionsContainer" className="space-y-2 mt-4">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 px-4 py-1 rounded-md group focus-within:ring focus-within:ring-primary/80 bg-white"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox text-primary"
                        checked={option.isCorrect}
                        onChange={(e) =>
                          handleCorrectAnswerChange(index, e.target.checked)
                        }
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        className="w-full p-2 bg-transparent rounded-md text-foreground outline-none focus:ring-0"
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={saveQuestion}
                  className="w-full bg-primary text-white text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  {isEditing ? "Update Question" : "Save Question"}
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div>
              {questions.map(({ data }, index) => (
                <div
                  key={data.id}
                  className="rounded-lg overflow-hidden shadow-sm mb-4"
                >
                  <div className="bg-white p-6 !pb-2">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {index + 1}. {data.question}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {data.options.map((opt, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="radio"
                            name={`answer${index}`}
                            className="form-radio text-buzzr-purple"
                            checked={opt === data.correctAnswer}
                            readOnly
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4 bg-primary/10 px-6 py-2">
                    <button
                      onClick={() => deleteQuestion(data.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => startEditing(data)}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Edit Question
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
