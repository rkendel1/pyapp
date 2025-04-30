import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the App</h1>
      <p className="mb-4">Your gateway to a better experience. Please register or log in to continue.</p>
      <div className="flex space-x-4">
        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded">
          Register
        </Link>
        <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;