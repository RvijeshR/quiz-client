
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DOMPurify from 'dompurify';
import backgroundImage from '../assets/images/background.jpg'; // Import your background image

export default function TeacherRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sanitize inputs
    const sanitizedUsername = DOMPurify.sanitize(username);
    const sanitizedPassword = DOMPurify.sanitize(password);

    try {
      // Send registration request
      const response = await axios.post('http://localhost:5000/register', {
        username: sanitizedUsername,
        password: sanitizedPassword,
        role: 'Teacher', // Ensure role is set to 'Teacher'
      });

      toast.success('Teacher registration successful!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate('/');
    } catch (error) {
      toast.error('Registration failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Set background image
        backgroundSize: 'cover', // Cover the entire div
        backgroundPosition: 'center', // Center the image
        position: 'relative', // Position relative for child elements
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div> {/* Optional overlay for better text visibility */}

      <form
        className="relative bg-white opacity-95 p-8 rounded-lg shadow-lg max-w-md w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Teacher Registration</h2>

        <input
          className="w-full p-3 mb-4 border border-blue-500 rounded-lg focus:outline-none focus:border-blue-700 hover:border-blue-700 transition-colors duration-300"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 border border-blue-500 rounded-lg focus:outline-none focus:border-blue-700 hover:border-blue-700 transition-colors duration-300"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          type="submit"
        >
          Register as Teacher
        </button>

        <p className="mb-4 mt-4 text-wrap text-sm text-center">Already have an account?</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 text-center block">
          Login
        </Link>
        

        <ToastContainer />
      </form>
    </div>
  );
}
