// Profile.js
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserRole } from '../UserContext'; // Import the context
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const { setUserRole } = useUserRole(); // Access setUserRole from context
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRoleFromState] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (isAuthenticated) {
          const idTokenClaims = await getIdTokenClaims();
          const userId = idTokenClaims["http://localhost:3000/user_id"];
          const userRole = idTokenClaims["http://localhost:3000/roles"];
          if (userId && userRole) {
            setUserId(userId);
            setUserRole(userRole);
            setUserRoleFromState(userRole); // Set userRole in the context
          } else {
            throw new Error('User ID or role not found in token claims');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [getIdTokenClaims, isAuthenticated, setUserRole]);

  return (
    isAuthenticated && (
      <div className="profile-container">
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {userId && <p>User ID: {userId}</p>}
        {userRole && <p>User Role: {userRole}</p>}
      </div>
    )
  );
};

export default Profile;
