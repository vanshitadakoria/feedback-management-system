import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getCurrentUser } from '../../services/authentication';


const ProtectedRoute = ({ role }) => {
  const { authState, isLoading } = useAuth();
  const token = getCurrentUser();

  if (isLoading) {
    console.log("Loading")
    return <div>Loading...</div>; // or some loading spinner component
  }

  if (!token) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (role && authState.role !== role) {
    // Role not authorized
    return <Navigate to="/unauthorized" />;
  }
  // Authorized
  return <Outlet />;
};


export default ProtectedRoute;




// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, userRole, requiredRole }) => {
//   if (userRole !== requiredRole) {
//     return <Navigate to="/unauthorized" replace/>;
//   }
//   return children;
// };

// export default ProtectedRoute;