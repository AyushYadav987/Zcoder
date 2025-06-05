import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Profile from './components/Profile/Profile';
import AddProblem from './components/Problems/AddProblem';
import ProblemList from './components/Problems/ProblemList';
import Dashboard from './components/Dashboard/Dashboard';
import Contest from './components/ContestCalendar/Contest';
import CodeEditor from './components/CodeEditor/CodeEditor';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-problem"
        element={
          <ProtectedRoute>
            <AddProblem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/problem-list"
        element={
          <ProtectedRoute>
            <ProblemList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Contest-Calendar"
        element={
          <ProtectedRoute>
            <Contest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/code-editor"
        element={
          <ProtectedRoute>
            <CodeEditor />
          </ProtectedRoute>
        }
      />

      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes; 