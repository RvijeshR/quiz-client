import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [role, setRole] = useState(null); // State to store user role
  const navigate = useNavigate(); // Hook to programmatically navigate
  const dispatch = useDispatch();
  const [ userName , setUserName]= useState(null)

  useEffect(() => {
    // Fetch the role from localStorage (or Redux state if applicable)
    const user = JSON.parse(localStorage.getItem('user'));
    setUserName(user.username)
    if (user) {
      setRole(user.role); // Assuming role is stored as 'role'
    }
  }, []);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Navigate to the login page after logout
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className={`bg-[#fbede2] text-gray-800 w-64 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Quiz Case</h1>
        </div>
        <ul className="mt-6">
          {/* Conditionally render based on role */}
          {role === 'Teacher' && (
            <>
              <li>
                <NavLink 
                  to="/teacher-dashboard" 
                  className={({ isActive }) => 
                    isActive ? "block p-4 bg-gray-700 text-white transition duration-200" : "block p-4 hover:bg-gray-700 hover:text-white transition duration-200"
                  }
                >
                  Teacher Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/listing-Question" 
                  className={({ isActive }) => 
                    isActive ? "block p-4 bg-gray-700 text-white transition duration-200" : "block p-4 hover:bg-gray-700 hover:text-white transition duration-200"
                  }
                >
                  Listing Questions
                </NavLink>
              </li>
            </>
          )}

          {role === 'Student' && (
            <li>
              <NavLink 
                to="/student-dashboard" 
                className={({ isActive }) => 
                  isActive ? "block p-4 bg-gray-700 text-white transition duration-200" : "block p-4 hover:bg-gray-700 hover:text-white transition duration-200"
                }
              >
                Student Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow flex justify-between p-4">
          {/* Hamburger Button */}
          <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          <div className="relative flex justify-end items-center w-full">
            {/* User Icon */}
            <button onClick={toggleDropdown} className="focus:outline-none">
              <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <ul className="py-1">
                <li>
                    <button
                      // onClick={handleLogout}
                      className="block w-full text-left text-gray-800ś text-sm px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {userName}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-sm px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children} {/* Render child components here */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
