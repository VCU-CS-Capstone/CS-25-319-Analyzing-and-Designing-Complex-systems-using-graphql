import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const history = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!isAuthenticated && !isLoading) {
        await loginWithRedirect();
      } else {
        history.push('/'); // Redirect to the home page after successful authentication
      }
    };

    handleRedirect();
  }, [isAuthenticated, isLoading, loginWithRedirect, history]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default Callback;
