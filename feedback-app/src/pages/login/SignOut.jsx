import React from 'react';

export default SignOut = () => {
    localStorage.removeItem('token');
    // Redirect to login or perform other actions
  };