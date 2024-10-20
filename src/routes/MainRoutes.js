import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from "../components/TeacherDashboard";
import ListQuestions from '../components/ListQuestions';
import StudentDashboard from '../components/StudentDashboard';

function MainRoutes() {
  // Get the user data from localStorage (assuming it's saved as 'user')
  const user = JSON.parse(localStorage.getItem('user'));

  // If no user is found, you can redirect to the login page or another route
  if (!user) {
    return <Navigate to="/" />;
  }

  // Check the role of the user
  const role = user.role;

  return (
    <Routes>
      {/* Conditionally render routes based on the user's role */}
      {role === 'Teacher' && (
        <>
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/listing-Question" element={<ListQuestions />} />
        </>
      )}
      {role === 'Student' && (
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      )}

      {/* Default route to handle unknown paths */}
      <Route
        path="*"
        element={
          role === 'Teacher' ? (
            <Navigate to="/teacher-dashboard" />
          ) : (
            <Navigate to="/student-dashboard" />
          )
        }
      />
    </Routes>
  );
}

export default MainRoutes;

