import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Register from './components/Register';
import TeacherRegister from './components/TeacherRegister';
import StudentRegister from './components/StudentRegister';
import MainLayout from './Layouts/MainLayout';
import MainRoutes from './routes/MainRoutes';

function App() {
    const token = useSelector((state) => state.auth.token); // Get the token from Redux

    return (
        <Router>
            <div>
                {token ? (
                    <MainLayout>
                        <MainRoutes />
                    </MainLayout>
                ) : (
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/register/teacher" element={<TeacherRegister />} />
                        <Route path="/register/student" element={<StudentRegister />} />
                        <Route path="/*" element={<Navigate to="/" />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;

