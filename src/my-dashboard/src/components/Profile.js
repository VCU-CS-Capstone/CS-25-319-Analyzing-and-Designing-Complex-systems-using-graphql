// Profile.js
import React, { useEffect } from "react";
import { useQuery, gql } from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect(); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, loginWithRedirect]);
  
        const GET_DATA = gql`
            query GetUsers($username : String!) {
              users (where: {username: {_eq: $username}}){
                user_id
                userGroup
              }
            }
            `;
      
      const { loading, error, data } = useQuery(GET_DATA, {
        variables: {
          "username": user ? user.name : "default"
        },
        fetchPolicy: 'network-only' // Set fetchPolicy to 'network-only' to increase timeout
      });

      if(loading){
        console.log( 'Loading...');
      }
      if(error){
        console.log(error.cause);
      }
      if (data){
        let users = data['users'];
        let userID = users[0].user_id;
        let userGroup = users[0].userGroup;
        console.log(userID);
      

  return (
    isAuthenticated && (
      <div className="profile-container">
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {userID && <p>User ID: {userID}</p>}
        {userGroup && <p>User Role: {userGroup}</p>}
      </div>
    )
  );
};
}

export default Profile;
