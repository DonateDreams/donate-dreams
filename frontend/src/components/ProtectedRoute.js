import React from 'react';
import {
  Navigate,
  useLocation,
} from 'react-router-dom';

import {
  isLoggedIn,
} from '../services/authService';

const ProtectedRoute = ({
  children,
}) => {
  const location = useLocation();

  if (!isLoggedIn()) {
    return (
      <Navigate
        to="/signuplogin"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;