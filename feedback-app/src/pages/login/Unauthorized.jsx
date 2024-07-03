import React, { useEffect } from 'react';

const Unauthorized = ({handleLogout}) => {

    // useEffect(()=>{
    //   setTimeout(()=>
    //     handleLogout(),5000
    //   )
        
    // },[]);


  return (
    
    <div>
        {/* <h2>{userRole}</h2> */}
      <h1>Unauthorized</h1>
      <p>You do not have access to this page.</p>
      {/* <p>Please login again...</p> */}
      {/* <p>Redirecting You...</p> */}
      <button type='submit' color='secondary' onClick={handleLogout}>Go back to login</button>
    </div>
  );
};

export default Unauthorized;
