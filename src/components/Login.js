import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { loginSuccess } from '../redux/authSlice'; // Import action
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../assets/images/background.jpg';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Sanitize inputs
        const sanitizedUsername = DOMPurify.sanitize(username);
        const sanitizedPassword = DOMPurify.sanitize(password);
    
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: sanitizedUsername,
                password: sanitizedPassword,
            });
    
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
    
            // Dispatch the login action
            dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
    
            // Show success toast and navigate to dashboard
            toast.success('Login successful!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
    
            navigate('/');
        } catch (error) {
            let errorMessage = 'Login failed. Please try again.'; // Default error message
    
            // Check if error response exists
            if (error.response) {
                // Server responded with a status other than 200
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                // Something happened in setting up the request
                errorMessage = error.message || errorMessage;
            }
    
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };
    

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <form className="relative bg-white p-8 rounded-lg shadow-lg max-w-md w-full" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">HELLO !!</h2>
                <input
                    className="w-full p-3 mb-4 border rounded-lg"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="w-full p-3 mb-4 border rounded-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full p-3 bg-blue-600 text-white rounded-lg">Login</button>
                <p className="mb-4 mt-4 text-wrap text-sm text-gray-500">Don't have an account?</p>
                <div className="mt-4 text-sm text-wrap text-gray-600 flex justify-between">
                    <Link to="/register/teacher" className="text-blue-600 hover:text-blue-800">
                        Register as Teacher
                    </Link>
                    <br />
                    <Link to="/register/student" className="text-blue-600 hover:text-blue-800">
                        Register as Student
                    </Link>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
