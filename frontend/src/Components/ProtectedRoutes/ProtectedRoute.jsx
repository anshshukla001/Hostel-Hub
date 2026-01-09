import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import axios from '../../axiosConfig.js';

const ProtectedRoute = ({ component: Component, allowedRoles }) => {
  const { isAuthenticated } = useContext(AppContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/user/getUser');
        setUser(response.data.user);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, []);


  if (!isAuthenticated || (user && !allowedRoles.includes(user?.role))) {
    return <Navigate to="/login" />;
  }

  return <Component/>;
};

export default ProtectedRoute;
