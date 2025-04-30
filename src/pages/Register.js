import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for inline messaging
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setIsLoading(true); // Set loading state

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setIsLoading(false); // Reset loading state

      if (response.ok) {
        // Save userId in localStorage
        localStorage.setItem('token', data.token); // Save token
        localStorage.setItem('userId', data.userId);

        setMessage('Registration successful. Redirecting to login...');
        setMessageType('success');
        setTimeout(() => navigate('/login'), 2000); // Delay before redirecting
      } else {
        setMessage(data.error || 'Registration failed.');
        setMessageType('error');
      }
    } catch (error) {
      setIsLoading(false); // Reset loading state
      setMessage('Error connecting to the server.');
      setMessageType('error');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        {/* Inline message */}
        {message && (
          <p className={`mb-4 ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;