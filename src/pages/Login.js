import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState(''); // Inline status message
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(''); // Clear previous messages
    setIsLoading(true); // Set loading state

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response Data:', data); // Debug log for response

      setIsLoading(false); // Reset loading state

      if (response.ok && data.userId && data.token) {
        // Save the token and userId in localStorage
        localStorage.setItem('token', data.token); // Save token
        localStorage.setItem('userId', data.userId); // Save userId

        setStatusMessage('Login successful. Redirecting to chat...');
        setStatusType('success');
        setTimeout(() => navigate('/chat'), 2000); // Delay before redirecting
      } else {
        setStatusMessage(data.error || 'Login failed. Please check your credentials.');
        setStatusType('error');
      }
    } catch (error) {
      setIsLoading(false); // Reset loading state
      setStatusMessage('Error connecting to the server.');
      setStatusType('error');
      console.error('Fetch error:', error); // Log error to console
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            required
          />
        </div>
        {statusMessage && (
          <p className={`mb-4 ${statusType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {statusMessage}
          </p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 w-full"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {/* Link to Register Page */}
      <div className="mt-4 text-center">
        <p>Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>.</p>
      </div>
    </div>
  );
}

export default Login;