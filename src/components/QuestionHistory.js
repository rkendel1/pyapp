import React, { useState, useEffect } from 'react';

const QuestionHistory = () => {
  const [questions, setQuestions] = useState([]); // Stores the question history
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch user questions
  const fetchUserQuestions = async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      // Get userId and token from localStorage
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }
      if (!token) {
        throw new Error('Authorization token not found. Please log in again.');
      }

      // Fetch questions from the backend
      const response = await fetch(`http://127.0.0.1:5001/api/chatbot/getUserQuestions/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token for secure API access
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching questions: ${response.statusText}`);
      }

      const data = await response.json();
      setQuestions(data.questions || []); // Populate the questions state
    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message); // Set error state
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchUserQuestions();
  }, []);

  return (
    <div className="bg-gray-100 p-4 mt-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Question History</h2>
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && questions.length === 0 && <p className="text-gray-500">No questions found.</p>}
      {!loading && questions.length > 0 && (
        <ul className="list-disc ml-4">
          {questions.map((question, index) => (
            <li key={index} className="mb-2 hover:bg-gray-200 p-2 rounded">
              <p className="text-gray-700">{question.content}</p>
              {question.timestamp && (
                <small className="text-gray-500">
                  {new Date(question.timestamp).toLocaleString()}
                </small>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionHistory;