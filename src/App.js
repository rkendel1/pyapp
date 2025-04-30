import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // Path to Login component
import Register from './pages/Register'; // Path to Register component
import Chat from './pages//Chat'; // Path to Chat component
import Home from './pages/Home'; // Path to Home component;

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for "/" */}
        <Route path="/" element={<Home />} />

        {/* Other Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />

        {/* Fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;