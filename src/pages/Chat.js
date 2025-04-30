import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import Navbar
import QuestionHistory from '../components/QuestionHistory'; // Import QuestionHistory component

function Chat() {
  const [messages, setMessages] = useState([]); // Stores the chat messages
  const [input, setInput] = useState(''); // Stores the user's input
  const [statusMessage, setStatusMessage] = useState(''); // Inline message for status
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setStatusMessage('You must be logged in to access the chat.');
      setStatusType('error');
      setTimeout(() => {
        navigate('/login'); // Redirect to login page
      }, 2000);
    } else {
      fetchHistory(); // Fetch question history on component mount
    }
  }, [navigate]);

  // Fetch the user's question history
  const fetchHistory = async () => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    if (!userId) {
      setStatusMessage('User not logged in. Please log in first.');
      setStatusType('error');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5001/api/chatbot/getUserQuestions/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach token for authentication
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.questions || []); // Set the fetched history in the messages state
        setStatusMessage('Chat history loaded.');
        setStatusType('success');
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.error || 'Error fetching chat history.');
        setStatusType('error');
      }
    } catch (error) {
      setStatusMessage('Error connecting to the server.');
      setStatusType('error');
    }
  };

  // Fetch messages when the user sends a new message
  const fetchMessages = async () => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    if (!userId) {
      setStatusMessage('User not logged in. Please log in first.');
      setStatusType('error');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach token for authentication
        },
        body: JSON.stringify({
          userId, // Pass the userId
          message: input, // Send the user's input as "message"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'user', content: input }, // Add the user's message
          { role: 'bot', content: data.reply }, // Add the bot's reply
        ]);
        setStatusMessage('Message sent successfully.');
        setStatusType('success');
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.error || 'Error fetching chatbot response.');
        setStatusType('error');
      }
    } catch (error) {
      setStatusMessage('Error connecting to the server.');
      setStatusType('error');
    } finally {
      setInput(''); // Clear the input field
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      fetchMessages(); // Fetch messages on form submit
    } else {
      setStatusMessage('Please enter a message.');
      setStatusType('error');
    }
  };

  return (
    <div>
      <Navbar /> {/* Add the Navbar */}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>
        <div className="mb-4 border p-4 h-64 overflow-y-scroll">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`block ${msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          {statusMessage && (
            <p className={`mb-2 ${statusType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {statusMessage}
            </p>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-2 w-full mb-2"
            placeholder="Type your message..."
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2">
            Send
          </button>
        </form>
        <QuestionHistory /> {/* Add the QuestionHistory component */}
      </div>
    </div>
  );
}

export default Chat;